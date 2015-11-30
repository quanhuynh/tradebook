Meteor.subscribe('tradeportfolios');

Template.loginform.onRendered(function() {
  var loginValidator = $('.login-form').validate({
    submitHandler: function(event) {
      var username = $('[name=login_username]').val();
      var password = $('[name=login_password]').val();
      Meteor.loginWithPassword(username, password, function(error) {
        if (error) {
          loginValidator.showErrors({
            login_username: "Username and/or password not correct",
            login_password: "Username and/or password not correct"
          });
        } else {
          Router.go('loading');
          setTimeout(function(){Router.go('portfoliosdashboard')}, 1500);
        }
      });
    }
  });
});


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

Template.newportfolio.onRendered(function() {
  $('.new-portfolio-form').validate();
})