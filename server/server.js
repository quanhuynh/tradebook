Meteor.publish('tradeportfolios', function() {
	return TradePortfolios.find({createdBy: this.userId});
});

TradePortfolios.allow({
	'update': function(userId, doc, fields, modifier) {
		return modifier.$set != null && Meteor.userId() == userId;
	}
});