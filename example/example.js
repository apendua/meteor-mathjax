if (Meteor.isClient) {

  var mathjax = new MeteorMathJax.Helper({
    
  });

  Template.registerHelper('mathjax', mathjax.getTemplate());

  Session.set('index', 0);

  var equations = [
    "$$\\frac{x^2+y^2}{z^2}=1$$",
    "$$\\sin^2x+\\cos^2x=1$$",
  ];

  Template.hello.equation = function () {
    return equations[Session.get('index') % equations.length];
  };

  Template.hello.events({
    'click input': function () {
      Session.set('index', Session.get('index') + 1);
    }
  });
}
