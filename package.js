Package.describe({
  summary: "Render math formulas with mathjax",
  version: "0.7.0",
  name: "mrt:mathjax",
  git: "https://github.com/apendua/meteor-mathjax.git"
});

Package.onUse(function (api) {
  api.versionsFrom('1.3');
  
  api.use('templating', 'client', { week: true });
  api.use('jquery', 'client');
  
  api.addFiles([
    'lib/_.js',
    'lib/Helper.js',
    'lib/MeteorMathJax.js',
    'lib/templateIntegration.js',
  ], 'client');
  
  api.export('MeteorMathJax');
});
