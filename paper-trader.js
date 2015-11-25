TradeAccounts = new Mongo.Collection("tradeaccounts");


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

/* ***************** */
/* ROUTE TRANSITIONS */
/* ***************** */
/* For some reason Transitioner is not defined
Transitioner.transition({
  fromRoute: 'login',
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
  // counter starts at 0

  Template.loginform.events({
    'submit form': function(event) {
      event.preventDefault();
      var user = event.target.login_username.value;
      var pw = event.target.login_password.value;
      Meteor.loginWithPassword(user, pw, function(error) {
        //deal with login failure
        if (error) {
          console.log(error.reason);
        } else {
          console.log("Login successful");
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
  addTradeAcc: function(name) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("Not Authorized");
    }
    TradeAccounts.insert({
      name: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      user: Meteor.user().username
    });
  },
  deleteTradeAcc: function(tradeAccID) {
    TradeAccounts.remove(tradeAccID);
  }
});
