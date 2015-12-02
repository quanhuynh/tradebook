Template.loginform.helpers({
	moveToPortfolios: function() {
		Router.go('portfoliosdashboard');
	}
});

Template.portfoliosdashboard.helpers ({
	count: function() {
	  return TradePortfolios.find({createdBy: Meteor.userId()}).count();
	},
	portfolios: function() {
	  return TradePortfolios.find({createdBy: Meteor.userId()});
	}
});

Template.header.helpers ({
	username: function() {
		if (Meteor.user()) {
			return Meteor.user().username;
		}
	}
});

Template.maindashboard.helpers ({
	portfolio: function() {
		if (TradePortfolios.findOne({current:true})) {
			return TradePortfolios.findOne({current: true}).name;
		}
	},
	showQuickQuote: function() {
		return Session.get('quickquote') !== undefined;
	},
	quickQuote: function(info) {
		if (Session.get('quickquote') !== undefined) {
			return Session.get('quickquote')[info];
		}
	}
});