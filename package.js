Package.describe({
  summary: "Render math formulas with mathjax",
  version: "0.6.1",
  name: "mrt:mathjax",
  git: "https://github.com/apendua/meteor-mathjax.git"
});

Package.onUse(function (api) {
  api.versionsFrom('0.9.0');
  api.use(['ui', 'templating'], 'client');
  api.addFiles('mathjax.js', 'client');
});
