# meteor-mathjax

The package provides a template helper that allows you to render mathematical formulas
with [mathjax](http://www.mathjax.org/). The `MathJax` source code is loaded from CDN
as soon as the first formula is being rendered, which makes the package as lightweight
as possible. Currently, the only relevant package dependency is `jquery`.

## Basic usage

To render equations, simply put them inside a `mathjax` block helper.
Use single dollars `$...$` for inline math, and double dollars `$$...$$`
for "display mode".

```html
{{#mathjax}}
<p>Let $(a_n)$, $(b_n)$ and $(c_n)$ be series
   of real numbers with $a_n\leq b_n\leq c_n$
   for each $n$. Supposing that $(a_n)$ and $(c_n)$
   are convergent to the same limit, $(b_n)$
   is also convergent, and moreover</p>
<p>
  <!-- this equation will be displayed -->
  $$
  \lim a_n=\lim b_n=\lim c_n.
  $$
</p>
{{/mathjax}}
```

## Limitations

Please note that because of the way `MathJax` renders the equation, each equation
must be wrapped in an HTML tag, so for example

```html
{{#mathjax}}
$$x^2+y^2=z^2$$
{{/mathjax}}
```

will not work as you expect. The formula source code will not be transformed by `MathJax`.

Another thing is that `mathjax` block helper mimics the behavior of the built-in
`markdown` helper, i.e. everything that goes inside `mathjax` block helper
gets rendered to text first and then it's injected as "raw html". This is good
because otherwise it would be practically impossible to detect reactive changes
that may potentially happen to parts of the text. On the other hand it breaks
templates that you may theoretically put inside the `mathjax` block, so for example

```html
<template name="someTemplate">
  {{#mathjax}}
    {{> mySuperDuperFormula}}
  {{/mathjax}}
</template>

<template name="mySuperDuperFormula">
  <p>$$x^2+y^2=z^2$$</p>
</template>
```

will render correctly, but if there are any events hooked to  `mySuperDuperFormula`
template, they will be totally ignored.

Because of the two limitations described above, you should probably not wrap
a large part of your templates code within the `markdown` block. Instead, try
to put it as close to the equations as possible.

## Configuration

Starting from version `0.7.0`, the package exports `MeteorMathJax` object
which purpose is to allow custom `MathJax` configuration. You can overwrite
any of the following values to get the results what you want.

```javascript
// NOTE: Below are the default values currently used by the package
MeteorMathJax.sourceUrl = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
MeteorMathJax.defaultConfig = {
  skipStartupTypeset: true,
  showProcessingMessages: false,
  tex2jax: {
    inlineMath: [['$','$'],['\\(','\\)']]
  }  
};
```
Please note that changing the `config` query parameter in `sourceUrl` will allow you to choose
one from many possible pre-defined configuration files as described
[here](http://docs.mathjax.org/en/latest/config-files.html).

Setting `MeteorMathJax.sourceUrl` to `''` will prevent the package from
loading `MathJax` automatically. This is useful if you want to load it manually.

## Advanced usage

By default, the `MathJax` source code is not loaded until the first usage
of `mathjax` helper. This is intentional because it helps your application to load faster.
However, in some scenarios you may want to load this code in advance to ensure that there's
no visible delay before the formulas get transformed.
There are at least two ways to achieve this.

### Force `MathJax` loading

The `MeteorMathJax` object exposes a `require` method. Calling this method
will force the `MathJax` code to be loaded as soon as possible, e.g.

```javascript
MeteorMathJax.require(function (MathJax) {
  // here you can be sure that MathJax is loaded
});
```

### Load `MathJax` manually

In a manual mode, you will first need to tell the package not to download `MathJax` automatically.
You can do it by using one of these methods:

1. Creating a global `window.MathJax` object containing your
   [configuration](http://docs.mathjax.org/en/latest/configuration.html#using-in-line-configuration-options).
   Note that this object has to be defined before the `MathJax` source code is actually loaded.

2. Setting `MeteorMathJax.sourceUrl = ''`.

Secondly, you will need to tell the package when `MathJax` is actually loaded by calling

```javascript
MeteorMathJax.ready();
```

## Formulas caching

Caching formulas reduces the render time by saving the HTML rendered by `MathJax`
in a form of text that can be reused later on when the same formula is being transformed.
This is an experimental feature so it's not enabled by default. To enable it, you will need
to overwrite the default helper

```javascript
Template.registerHelper('mathjax', new MeteorMathJax.Helper().getTemplate());
```
