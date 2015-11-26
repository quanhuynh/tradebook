TradePortfolios = new Mongo.Collection('tradeporfolios');

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

/* ***************** */
/* ROUTE TRANSITIONS */
/* ***************** */
/*
Transitioner.transition({
  fromRoute: 'home',
  toRoute: 'register',
  velocityAnimation: {
    in: 'transition.slideRightIn',
    out: 'transition.slideLeftOut'
  }
});
*/

/* ************************* */
/* METEOR CLIENT/SERVER CODE */
/* ************************* */
if (Meteor.isClient) {

  Template.header.events({
    'click .logout': function(event) {
      event.preventDefault();
      Meteor.logout();
      Router.go('loading');
      setTimeout(function(){Router.go('home')}, 1500);
    }
  });

  Template.loginform.events({
    'submit form': function(event) {
      event.preventDefault();
      var username = event.target.login_username.value;
      var password = event.target.login_password.value;
      Meteor.loginWithPassword(username, password, function(error) {
        if (error) {
          console.log(error.reason);
        } else {
          Router.go('loading');
          setTimeout(function(){Router.go('portfoliosdashboard')}, 1500);
        }
      });
    }
  });

  Template.registerform.events({
    'submit form': function(event) {
      event.preventDefault();
      var user = event.target.register_username.value;
      var pw = event.target.register_password.value;
      Accounts.createUser({
        username: user,
        password: pw
      }, function (error) {
        if (error) {
          console.log(error.reason);
        } else {
          Router.go('login');
        }
      });
    }
  });

  Template.portfoliosdashboard.helpers({
    count: function() {
      return TradePortfolios.find({createdBy: Meteor.userId()}).count();
    },
    portfolios: function() {
      return TradePortfolios.find({createdBy: Meteor.userId()});
    }
  });

  Template.newportfolio.events({
    'submit form': function(event) {
      event.preventDefault();
      var name = event.target.portfolio_name.value;
      var balance = event.target.portfolio_balance.value;
      var description = event.target.portfolio_description.value;

      Meteor.call("addPortfolio", name, balance, description);
      Router.go('portfoliosdashboard');
    }
  });

}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });
}

/* ************** */
/* METEOR METHODS */
/* ************** */
Meteor.methods({
  addPortfolio: function(name, balance, description) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("Not authorized");
    }
    TradePortfolios.insert({
      name: name,
      balance: balance,
      description: description,
      createdBy: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deletePortfolio: function(portfolioId) {
    TradePortfolios.remove(portfolioId);
  }
})