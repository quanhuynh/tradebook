TradePortfolios = new Mongo.Collection('tradeporfolios');

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
