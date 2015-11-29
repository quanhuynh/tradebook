/*
Template.registerform.events({
  
});
*/

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