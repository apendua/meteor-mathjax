Package.describe({
    summary: "Render math formulas with mathjax",
});

Package.on_use(function (api) {
    //TODO: remove underscore dependency?
    api.use(['underscore', 'module-loader', 'ui'], 'client');
    api.add_files('mathjax.js', 'client');
});
