
Template.registerHelper('mathjax', function () {
  var options = this,
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
  };
  
  var mathjax = new Template('mathjax', function () {
    var view = this, conent = '';
    if (view.templateContentBlock) {
      content = HTML.toText(Blaze._expandView(Blaze._TemplateWith(Template.parentData(),
        view.templateContentBlock.renderFunction)), HTML.TEXTMODE.STRING);
    }
    return HTML.Raw(content);
  });

  mathjax.onRendered(function () {
    var self = this;
    //---------------------------------
    onMathJaxReady(function (MathJax) {
      if (!wait) {
        Meteor.defer(function () { update(self.firstNode, self.lastNode); });
      } else {
        update(self.firstNode, self.lastNode);
      }
    }); // ready
  });

  return mathjax;
});

// loading MathJax

function onMathJaxReady(callback) {
  if (window.MathJax) {
    callback(window.MathJax);
  } else {
    if (!onMathJaxReady.listeners) {
      $.getScript( // TODO: let the user change the source
        'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML'
      ).done(function () {
        //------------------
        MathJax.Hub.Config({
          skipStartupTypeset: true,
          showProcessingMessages: false,
          tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] }
        });
        //-------------------------------------------------------------------------------------------------------
        while (onMathJaxReady.listeners.length > 0) { onMathJaxReady.listeners.pop().call(null, window.MathJax) }
      });
      onMathJaxReady.listeners = [];
    }
    onMathJaxReady.listeners.push(callback);
  }
}

