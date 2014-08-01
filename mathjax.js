
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
      options = this,
      wait = options.wait !== undefined ? options.wait : false;

  var update = function (firstNode, lastNode) {
    var alreadyThere = false;
    $(firstNode).parent().contents().each(function (index, node) {
      // TODO add support for text nodes
      if (node === firstNode) {
        alreadyThere = true;
      }
      if (alreadyThere && this.nodeType === 1) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this]);
      }
      return this !== lastNode;
    });
  }

  return Template.__create__('mathjax', function () { // render func
    var view = this, conent = '';
    if (view.templateContentBlock) {
      // this will trigger rerender every time the content is changed
      content = Blaze.toText(view.templateContentBlock, HTML.TEXTMODE.STRING);
    }
    return view.templateContentBlock;
  }, function (view) { // init view
    view.onRendered(function () {
      view.autorun(function () {
        dependency.depend();
        console.log(view.domrange.firstNode);
        //---------------------------------------
        MathJaxHandler.ready(function (MathJax) {
          if (!wait) {
            Meteor.defer(function () { update(view.domrange.firstNode(), view.domrange.lastNode()) });
          } else {
            update(view.domrange.firstNode(), view.domrange.lastNode());
          }
        }); // ready
      }); // autorun
    }); // onRendered

  });

});
