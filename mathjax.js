
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

Template.mathjax.renderContent = function () {
  var options = this.options;
  if (options && _.isFunction(options.fn))
    return new Handlebars.SafeString(options.fn(this.context));
};

Template.mathjax.rendered = function () {
  var self = this;
  MathJaxHandler.ready(function (MathJax) {
    var nodes = [];
    try {
      //TODO: restrict to user-defined class
      nodes = self.findAll('*');
    } catch (err) { // node not in DOM? ignore
      return err;
    }
    // we don't want to wait untill
    // everything is rendered
    Meteor.defer(function () {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, nodes]);
    });
  });
};

