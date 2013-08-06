
Package.describe({
    summary: "Render math formulas with mathjax",
});

Package.on_use(function (api) {
    //TODO: remove underscore dependency?
    api.use(['templating', 'underscore', 'module-loader'], 'client');

    // HTML templates
    api.add_files('mathjax.html', 'client');

    // JS code
    api.add_files('mathjax.js', 'client');
    api.add_files('helpers.js', 'client');
});
