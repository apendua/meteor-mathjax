
//TODO: let the user change the source
//TODO: give the user access to the handler,
//      so that they can alter its behavior
var MathJaxHandler = {
  // required by module loader
  // source : 'http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_SVG',
  source : 'http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  verify : function () {
    return window.MathJax;
  },
  loaded : function (MathJax) {
    MathJax.Hub.Config({
      skipStartupTypeset: true,
      showProcessingMessages: false,
      tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] }
    });
  },
  ready: function (action) {
    return ModuleLoader.ready('mathjax', action);
  },
};

ModuleLoader.define('mathjax', MathJaxHandler);

UI.registerHelper('mathjax', function () {
  var dependency = new Deps.Dependency(),
      handle     = null,
      options    = this,
      wait       = options.wait !== undefined ? options.wait : false;

  var update = function (firstNode, lastNode) {
    $(firstNode).nextAll().andSelf().each(function () {
      // XXX we are not supporting text nodes for now
      if (this.nodeType === 1) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this]);
      }
      //return this !== lastNode;
    });
  }

  return UI.Component.extend({
    rendered: function () {
      var self = this;
      handle = Deps.autorun(function () {
        dependency.depend();
        MathJaxHandler.ready(function (MathJax) {
          if (!wait) {
            Meteor.defer(function () { update(self.firstNode, self.lastNode) });
          } else {
            update(self.firstNode, self.lastNode);
          }
        });
      });
    },
    render: function () {
      var self = this;
      return function () {
        UI.toRawText(self.__content, self); // this triggers reactivity
        dependency.changed();
        return self.__content;
      };
    },
    destroyed: function () {
      handle && handle.stop();
    },
  });
});
