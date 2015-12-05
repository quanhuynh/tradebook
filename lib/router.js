/* ******* */
/* ROUTING */
/* ******* */
Router.configure({
  layoutTemplate: 'main'
  //loadingTemplate:
});

Router.route('/', {
  name: 'home',
  template: 'loginform'
});

Router.route('/loginform', {
  name:'login',
  template: 'loginform'
});

Router.route('/registerform', {
  name: 'register',
  template: 'registerform'
});

Router.route('/portfoliosdashboard', {
  name: 'portfoliosdashboard',
  template: 'portfoliosdashboard',
  onBeforeAction: function() {
    var currentUser = Meteor.userId();
    if (currentUser) {
      this.next();
    } else {
      this.render('deniedaccess');
    }
  }
});

Router.route('/newportfolio', {
  name: 'newportfolio',
  template: 'newportfolio',
  onBeforeAction: function() {
    var currentUser = Meteor.userId();
    if (currentUser) {
      this.next();
    } else {
      this.render('deniedaccess');
    }
  }
});

Router.route('/deniedaccess', {
  name: 'deniedaccess',
  template: 'deniedaccess'
});

Router.route('/loading', {
  name: 'loading',
  template: 'loading'
});

Router.route('/dashboard', {
  name: 'dashboard',
  template: 'maindashboard'
});

Router.route('/trade', {
  name: 'trade',
  template: 'trade'
});