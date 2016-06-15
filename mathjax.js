'use strict';

var listeners = [];

MeteorMathJax = {
  Helper    : MathJaxHelper,
  sourceUrl : 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  /**
   * Notify all listeners that the MathJax script has been loaded.
   */
  ready : function () {
    var MathJax = window.MathJax;
    function triggerListeners () {
      while (listeners.length > 0) {
        listeners.pop().call(null, MathJax);
      }
    }
    if (MathJax && MathJax.Hub && MathJax.Hub.queue) {
      truggerListeners();
    } else if (MathJax && MathJax.Hub && MathJax.Hub.Register && typeof MathJax.Hub.Register.StartupHook === 'function') {
      // NOTE: Make sure further tasks are scheduled after MathJax is fully configured and operational.
      MathJax.Hub.Register.StartupHook("Begin", function () {
        triggerListeners();
      });
    } else {
      throw new Error('Cannot call MeteorMathJax.ready() before MathJax is really loaded.');
    }
  },
  /**
   * Call the given callback as soon as MathJax is loaded.
   * @param {Function} callback
   */
  onReady : function (callback) {
    var self = this;
    if (!window.MathJax) {
      listeners.push(callback);
      window.MathJax = {
        AuthorInit: function () {
          MathJax.Hub.Config(self.defaultConfig);
          MeteorMathJax.ready();
        }
      };
      // load the MathJax script
      $.getScript(this.sourceUrl);
    } else if (window.MathJax.Hub && typeof window.MathJax.Hub.queue) { // it's already loaded
      callback(window.MathJax);
    } else {
      listeners.push(callback);
    }
  },
  /**
   * Default configuration which will be used as soon as MathJax is loaded.
   * It can be overwritten by the user.
   */
  defaultConfig: {
    skipStartupTypeset: true,
    showProcessingMessages: false,
    tex2jax: {
      inlineMath: [['$','$'],['\\(','\\)']]
    }
  }
};

/**
 * Creates an instance of MathJaxHelper, which is essentially a template generator.
 * @param {Object} options
 * @param {Boolean} options.useCache
 */
function MathJaxHelper (options) {
  this.cache = {};
  this.options = {
    useCache: options && options.useCache !== undefined ? options.useCache : true,
  };
}

/**
 * Create a template that can be used as helper to Render
 * MathJax content. A typical use would be:
 *
 * Template.registerHelper('mathjax', MathJaxHelper.getTemplate());
 */
MathJaxHelper.prototype.getTemplate = function getTemplate () {

  var options = this.options;
  var cache = this.cache;

  var update = function (MathJax, firstNode, lastNode) {
    var firstNodeReached = false;
    $(firstNode).parent().contents().each(function (index, node) {
      // TODO add support for text nodes
      var cacheKey;
      if (node === firstNode) {
        firstNodeReached = true;
      }
      if (firstNodeReached && this.nodeType === 1) {
        cacheKey = options.useCache && node.innerHTML;
        if (options.useCache && cache[cacheKey]) {
          node.innerHTML = cache[cacheKey];
        } else {
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
    return HTML.Raw(content);
    
    // NOTE: This should work too, but I am afraid of some side effects
    //       related to the fact that Blaze would be managing these nodes
    //       in it's own manners.
    //
    // return view.templateContentBlock;
  });

  template.onRendered(function () {
    var self = this;
    //----------------------------------------
    MeteorMathJax.onReady(function (MathJax) {
      update(MathJax, self.firstNode, self.lastNode);
    });
  });

  return template;
};

/**
 * Register the mathjax helper in the default form.
 */
Template.registerHelper('mathjax', new MathJaxHelper().getTemplate());

