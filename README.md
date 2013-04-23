meteor-mathjax
==============

The package provides a handlebars helper that enables rendering mathematical formulas with [mathjax](http://www.mathjax.org/). Currently, the `mathjax` source code is loaded from cloud as soon as the first formula is being rendered. This is done with a help of a very simple [module-loader](https://github.com/apendua/module-loader) tool.

An example use of `mathjax` in a template may look like this:
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

Remember to use single dollars `$...$` for inline math, and double `$$...$$` for displaying equations.