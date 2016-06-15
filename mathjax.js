'use strict';

var listeners = [];

MeteorMathJax = {
  Helper    : MathJaxHelper,
  sourceUrl : 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  /**
   * Notify all listeners that the MathJax script has been loaded.
   */
  ready : function () {
    if (!window.MathJax || !window.MathJax.Hub || typeof window.MathJax.Hub.Configured !== 'function') {
      throw new Error('Cannot call MeteorMathJax.ready() before MathJax is really loaded.');
    }
    // trigger all listeners
    while (listeners.length > 0) {
      listeners.pop().call(null, window.MathJax);
    }
  },
  /**
   * Call the given callback as soon as MathJax is loaded.
   * @param {Function} callback
   */
  onReady : function (callback) {
    if (!window.MathJax) {
      listeners.push(callback);
      window.MathJax = {
        AuthorInit: function () {
          // NOTE: Make sure any further tasks are scheduled after MathJax
          //       is fully configured and operational.
          MathJax.Hub.Register.StartupHook("Begin", function () {
            MeteorMathJax.ready();
          });
        }
      };
      // load the MathJax script
      $.getScript(this.sourceUrl);
    } else if (window.MathJax.Hub && typeof window.MathJax.Hub.Configured === 'function') {
      // it's already loaded ...
      callback(window.MathJax);
    } else {
      listeners.push(callback);
    }
  }
};

MeteorMathJax.onReady(function (MathJax) {
  MathJax.Hub.Config({
    skipStartupTypeset: true,
    showProcessingMessages: false,
    tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] }
  });
});

function MathJaxHelper (options) {
  this.cache = {};
  this.options = {
    useCache: options.useCache !== undefined ? options.useCache : true,
    deferred: options.deferred !== undefined ? options.deferred : true,
  };
}

MathJaxHelper.prototype.getTemplate = function getTemplate () {

  var options = this.options;
  var cache = this.cache;

  var update = function (firstNode, lastNode) {
    var alreadyThere = false;
    $(firstNode).parent().contents().each(function (index, node) {
      // TODO add support for text nodes
      var cacheKey;
      if (node === firstNode) {
        alreadyThere = true;
      }
      if (alreadyThere && this.nodeType === 1) {
        cacheKey = options.useCache && node.innerHTML;
        if (options.useCache && cache[cacheKey]) {
          node.innerHTML = cache[cacheKey];
        } else {
          console.log('Typeset', this);
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, this], function () {
            if (options.useCache)
              cache[cacheKey] = node.innerHTML;
          });
        }
      }
      return this !== lastNode;
    });
  };
  
  var template = new Template('mathjax', function () {
    var view = this, content = '';
    if (view.templateContentBlock) {
      content = Blaze._toText(view.templateContentBlock, HTML.TEXTMODE.STRING);
    }
    // NOTE: We can either return:
    //
    //       view.templateContentBlock
    //       or HTML.Raw(content);
    //
    return HTML.Raw(content);
  });

  template.onRendered(function () {
    var self = this;
    //----------------------------------------
    MeteorMathJax.onReady(function (MathJax) {
      if (options.deferred) {
        Meteor.defer(function () {
          update(self.firstNode, self.lastNode);
        });
      } else {
        update(self.firstNode, self.lastNode);
      }
    }); // ready
  });

  return template;
};

