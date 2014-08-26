Package.describe({
  summary: "Render math formulas with mathjax",
  varsion: "0.6.0",
  name: "apendua:mathjax",
  git: "https://github.com/apendua/meteor-mathjax.git"
});

Package.onUse(function (api) {
  api.versionsFrom('0.9.0');
  api.use(['ui', 'templating'], 'client');
  api.addFiles('mathjax.js', 'client');
});
