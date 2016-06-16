'use strict';

/**
 * Creates an instance of Helper, which is essentially a template generator.
 * @param {Object} options
 * @param {Boolean} options.useCache
 */
Helper = function (options) {
  this.cache = {};
  this.options = {
    useCache  : options && options.useCache !== undefined ? options.useCache : false,
    transform : options && options.transform,
  };
}

/**
 * Create a template that can be used as helper to Render
 * MathJax content. A typical use would be:
 *
 * Template.registerHelper('mathjax', Helper.getTemplate());
 */
Helper.prototype.getTemplate = function getTemplate () {

  var context = this;
  var update = function (MathJax, firstNode, lastNode) {
    var firstNodeReached = false;
    $(firstNode).parent().contents().each(function (index, node) {
      // TODO add support for text nodes
      var cacheKey;
      if (node === firstNode) {
        firstNodeReached = true;
      }
      if (firstNodeReached && this.nodeType === 1) {
        cacheKey = context.options.useCache && node.innerHTML;
        if (context.options.useCache && context.cache[cacheKey]) {
          node.innerHTML = context.cache[cacheKey];
        } else {
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, this], function () {
            if (context.options.useCache)
              context.cache[cacheKey] = node.innerHTML;
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
    if (typeof context.options.transform === 'function') {
      content = context.options.transform(content);
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
    MeteorMathJax.require(function (MathJax) {
      update(MathJax, self.firstNode, self.lastNode);
    });
  });

  return template;
};
