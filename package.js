Package.describe({
  summary: "Render math formulas with mathjax",
  version: "0.6.3",
  name: "mrt:mathjax",
  git: "https://github.com/apendua/meteor-mathjax.git"
});

Package.onUse(function (api) {
  api.versionsFrom('0.9.1');
  api.use(['templating'], 'client');
  api.addFiles('mathjax.js', 'client');
});
