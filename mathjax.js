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
          MeteorMathJax.ready();
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
  this.options = options;
}

MathJaxHelper.prototype.getTemplate = function getTemplate () {

  var cache = this.cache;
  var wait = this.options.wait !== undefined ? this.options.wait : false;

  var update = function (firstNode, lastNode) {
    var alreadyThere = false;
    $(firstNode).parent().contents().each(function (index, node) {
      // TODO add support for text nodes
      var cacheKey;
      if (node === firstNode) {
        alreadyThere = true;
      }
      if (alreadyThere && this.nodeType === 1) {
        cacheKey = node.innerHTML;
        if (cache[cacheKey]) {
          node.innerHTML = cache[cacheKey];
        } else {
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, this], function () {
            cache[cacheKey] = node.innerHTML;
          });
        }
      }
      return this !== lastNode;
    });
  };
  
  var mathjax = new Template('mathjax', function () {
    var view = this, content = '';
    if (view.templateContentBlock) {
      content = HTML.toText(Blaze._expandView(Blaze._TemplateWith(Template.parentData(),
        view.templateContentBlock.renderFunction)), HTML.TEXTMODE.STRING);
    }
    return HTML.Raw(content);
  });

  mathjax.onRendered(function () {
    var self = this;
    //----------------------------------------
    MeteorMathJax.onReady(function (MathJax) {
      if (!wait) {
        Meteor.defer(function () { update(self.firstNode, self.lastNode); });
      } else {
        update(self.firstNode, self.lastNode);
      }
    }); // ready
  });

  return mathjax;
};

