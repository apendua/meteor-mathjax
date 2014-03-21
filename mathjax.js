
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

Handlebars.registerHelper('mathjax', function (options) {
  var dependency = new Deps.Dependency(),
      content    = '';

  return UI.Component.extend({
    parented: function () {
      var self = this;
      self.mathjax = Deps.autorun(function () {
        dependency.depend();
        MathJaxHandler.ready(function (MathJax) {
          $(self.firstNode).nextAll().each(function () {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, this]);
          });
        });
      });
    },
    render: function () {
      var self = this;
      return function () {
        var rendered = UI.toRawText(self.__content, self); // this triggers reactivity
        if (rendered !== content) {
          content = rendered;
          dependency.changed();
        }
        return self.__content;
      };
    },
    destroyed: function () {
      this.mathjax.stop();
    },
  });
});
