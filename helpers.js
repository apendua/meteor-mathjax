
Handlebars.registerHelper('mathjax', function (options) {
  var self = this;
  var template = Template.mathjax;
  if (!template)
    // fallback solution
    return new Handlebars.SafeString(options.fn(self));
  //---------------------------------------------------
  return template({
    options: options,
    context: this,
  });
});
