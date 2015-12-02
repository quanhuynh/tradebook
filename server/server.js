var fee = 5;

/* ******* */
/* OBJECTS */
/* ******* */
function Stock (stockSym, quantity, purchasePrice) {
  this.symbol = stockSym;
  this.quantity = quantity;
  this.costBasis = quantity * purchasePrice + fee;
  this.avgBuyPrice = this.costBasis/this.quantity;
}

/* ************************** */
/* PUBLISHING AND PERMISSIONS */
/* ************************** */
Meteor.publish('tradeportfolios', function() {
	return TradePortfolios.find({createdBy: this.userId});
});

TradePortfolios.allow({
	'update': function(userId, doc, fields, modifier) {
		return modifier.$set != null && Meteor.userId() == userId;
	}
});