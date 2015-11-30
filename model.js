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
      username: Meteor.user().username,
      holdings: {'Google': new Stock('GOOG', 500, 250)},
      current: false
    });
  },
  deletePortfolio: function(portfolioId) {
    TradePortfolios.remove(portfolioId);
  },
  buyStock: function(portfolio, companyName, quantity, price) {
    var stockObj = TradePortfolios.findOne({name:portfolio}).holdings[companyName];
    stockObj.costBasis += quantity*price + fee8;
    stockObj.quantity += quantity;
    stockObj.avgBuyPrice = stockObj.costBasis/stockObj.quantity;
  },
  sellStock: function(portfolio, companyName, quantity, price) {
    var stockObj = TradePortfolios.findOne({name:portfolio}).holdings[companyName];
    stockObj.costBasis += fee;
    stockObj.costBasis -= quantity*price;
    stockObj.quantity -= quantity;
    stockObj.avgBuyPrice = stockObj.costBasis/stockObj.quantity;
  }
})
