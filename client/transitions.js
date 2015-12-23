/* ******************* */
/* ROUTING TRANSITIONS */
/* ******************* */
Transitioner.default({
  in: 'transition.fadeIn',
  out: 'transition.fadeOut'
});

/* HOME SCREEN <-> REGISTER */
Transitioner.transition({
  fromRoute: 'home',
  toRoute: 'register',
  velocityAnimation: {
    in: 'transition.slideRightIn',
    out: 'transition.slideLeftBigOut'
  }
});
Transitioner.transition({
  fromRoute: 'register',
  toRoute: 'home',
  velocityAnimation: {
    in: 'transition.slideLeftIn',
    out: 'transition.slideRightBigOut'
  }
});

/* HOME SCREEN -> PORTFOLIOS SCREEN */
Transitioner.transition({
  fromRoute: 'home',
  toRoute: 'portfoliosdashboard',
  velocityAnimation: {
    in: 'transition.slideDownBigIn',
    out: 'transition.slideUpBigOut'
  }
});

/* PORTFOLIOS SCREEN <-> NEW PORTFOLIO */
Transitioner.transition({
  fromRoute: 'portfoliosdashboard',
  toRoute: 'newportfolio',
  velocityAnimation: {
    in: 'transition.slideRightIn',
    out: 'transition.slideLeftBigOut'
  }
});
Transitioner.transition({
  fromRoute: 'newportfolio',
  toRoute: 'portfoliosdashboard',
  velocityAnimation: {
    in: 'transition.slideLeftIn',
    out: 'transition.slideRightBigOut'
  }
});

/* PORTFOLIO SCREEN <-> DASHBOARD */
Transitioner.transition({
  fromRoute: 'dashboard',
  toRoute: 'portfoliosdashboard',
  velocityAnimation: {
    in: 'transition.slideDownBigIn',
    out: 'transition.fadeOut'
  }
});
Transitioner.transition({
  fromRoute: 'portfoliosdashboard',
  toRoute: 'dashboard',
  velocityAnimation: {
    in: 'transition.fadeIn',
    out: 'transition.slideUpBigOut'
  }
});

/* DASHBOARD <-> HOLDINGS */
Transitioner.transition({
  fromRoute: 'dashboard',
  toRoute: 'holdings',
  velocityAnimation: {
    in: 'transition.slideUpBigIn',
    out: 'transition.slideUpOut'
  }
});
Transitioner.transition({
  fromRoute: 'holdings',
  toRoute: 'dashboard',
  velocityAnimation: {
    in: 'transition.slideDownIn',
    out: 'transition.slideDownOut'
  }
});