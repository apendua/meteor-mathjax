
if (Package.templating) {
  var Template = Package.templating.Template;
  var Blaze = Package.blaze.Blaze; // implied by `templating`
  var HTML = Package.htmljs.HTML; // implied by `blaze`

  /**
   * Register the mathjax helper in the default form.
   */
  Blaze.Template.registerHelper('mathjax', new Helper().getTemplate());
}
