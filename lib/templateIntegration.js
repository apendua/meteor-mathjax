var Blaze;

if (Package.templating) {
  Blaze = Package.blaze.Blaze; // implied by `templating`

  /**
   * Register the mathjax helper in the default form.
   */
  Blaze.Template.registerHelper('mathjax', new Helper().getTemplate());
}
