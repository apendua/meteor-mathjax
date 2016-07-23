'use strict';

var listeners = [];

MeteorMathJax = {
  Helper    : Helper,
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
      triggerListeners();
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
  require : function (callback) {
    var self = this;
    if (!window.MathJax && this.sourceUrl) {
      listeners.push(callback);
      window.MathJax = {
        AuthorInit: function () {
          window.MathJax.Hub.Config(self.defaultConfig);
          MeteorMathJax.ready();
        }
      };
      // load the MathJax script
      $.getScript(this.sourceUrl);
    } else if (window.MathJax && window.MathJax.Hub && typeof window.MathJax.Hub.queue) { // it's already loaded
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
