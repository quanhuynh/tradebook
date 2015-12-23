/* ************************** */
/* PUBLISHING AND PERMISSIONS */
/* ************************** */
Meteor.publish('tradeportfolios', function() {
	return TradePortfolios.find({createdBy: this.userId});
});
Meteor.publish('holdings', function() {
	return Holdings.find({createdBy: this.userId});
});
Meteor.publish('watchlist', function() {
	return Watchlist.find({createdBy: this.userId});
});

TradePortfolios.allow({
	'update': function(userId, doc, fields, modifier) {
		return modifier.$set != null && Meteor.userId() == userId;
	}
});

Holdings.allow({
	'update': function(userId, doc, fields, modifier) {
		return modifier.$set != null && Meteor.userId() == userId;
	}
});

Watchlist.allow({
	'update': function(userId, doc, fields, modifier) {
		return modifier.$set != null && Meteor.userId() == userId;
	}
})