
//TODO: let the user change the source
//TODO: give the user access to the handler,
//      so that they can alter its behavior
var MathJaxHandler = {
  // required by module loader
  source : 'http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
  verify : function () {
    return window.MathJax;
  },
  loaded : function (MathJax) {
    MathJax.Hub.Config({
      showProcessingMessages: false,
      tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] }
    });
  },
  ready: function (action) {
    return ModuleLoader.ready('mathjax', action);
  },
};

ModuleLoader.define('mathjax', MathJaxHandler);

Handlebars.registerHelper('mathjax', function (options) {
  
  var dependency = new Deps.Dependency();

  var component = UI.block(function () {
    var self = this;
    return function () {
      UI.toRawText(self.__content, self); // this triggers reactivity
      dependency.changed();
      //return HTML.Raw(text);
      return self.__content;
    };
  });

  component.rendered = function () {
    var self = this;
    MathJaxHandler.ready(function (MathJax) {
      Deps.autorun(function () {
        var nodes = [];
        try {
          nodes = self.findAll('*');
        } catch (err) { // node not in DOM? ignore
          return err;
        }
        dependency.depend();
        // we don't want to wait untill
        // everything is rendered
        Meteor.defer(function () {
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, nodes]);
        });
      });
    });
  }

  return component;
});
