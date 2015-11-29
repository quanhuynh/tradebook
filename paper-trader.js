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



/* ************************* */
/* METEOR CLIENT/SERVER CODE */
/* ************************* */
if (Meteor.isClient) {

  Meteor.subscribe('tradeportfolios');

  Template.header.events({
    'click .logout': function(event) {
      event.preventDefault();
      Meteor.logout();
      Router.go('loading');
      setTimeout(function(){Router.go('home')}, 1500);
    }
  });

  Template.loginform.onRendered(function() {
    $('.login-form').validate({
      submitHandler: function(event) {
        var username = $('[name=login_username]').val();
        var password = $('[name=login_password]').val();
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
  });

  /*
  Template.loginform.events({
    
  });
  */

  Template.registerform.onRendered(function() {
    var registerValidator = $('.register-form').validate({
      rules: {
        register_password: {
          minlength: 6
        }
      },
      messages: {
        register_password: {
          minlength: "Password must be at least {0} characters"
        }
      },
      submitHandler: function(event) {
        var user = $('[name=register_username]').val();
        var pw = $('[name=register_password]').val();
        Accounts.createUser({
          username: user,
          password: pw
        }, function (error) {
          if (error) {
            if (error.reason == "Username already exists.") {
              registerValidator.showErrors({
                register_username: error.reason
              });
            }
          } else {
            Router.go('home');
          }
        });
      },
    });
  });

  /*
  Template.registerform.events({
    
  });
  */

  Template.portfoliosdashboard.helpers({
    count: function() {
      return TradePortfolios.find({createdBy: Meteor.userId()}).count();
    },
    portfolios: function() {
      return TradePortfolios.find({createdBy: Meteor.userId()});
    }
  });

  
  Template.portfoliosdashboard.events({
    /*
    'click .edit': function(event) {
      event.preventDefault();
      var portfolioName = $('.edit').parent().parent().data('name');
      var currentUser = Meteor.userId();

    },
    */
    'click .remove': function(event) {
      event.preventDefault();
      var portfolioName = $('.remove').parent().parent().data('name');
      var portfolioBalance = $('.remove').parent().parent().data('balance');
      var retVal = confirm("Are you sure you want to delete this portfolio?");
      if (retVal) {
        var portfolioId = TradePortfolios.findOne({name: portfolioName})._id;
        Meteor.call("deletePortfolio", portfolioId);
      }
      
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
  Meteor.publish('tradeportfolios', function() {
    return TradePortfolios.find({createdBy: this.userId});
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


/* ***************** */
/* ROUTE TRANSITIONS */
/* ***************** */
