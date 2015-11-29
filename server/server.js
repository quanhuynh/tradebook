Meteor.publish('tradeportfolios', function() {
	return TradePortfolios.find({createdBy: this.userId});
});