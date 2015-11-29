Template.portfoliosdashboard.helpers({
	count: function() {
	  return TradePortfolios.find({createdBy: Meteor.userId()}).count();
	},
	portfolios: function() {
	  return TradePortfolios.find({createdBy: Meteor.userId()});
	}
});

Template.header.helpers({
	username: function() {
		return Meteor.user().username;
	}
});