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
      holdings: {},
      current: false
    });
  },
  deletePortfolio: function(portfolioId) {
    TradePortfolios.remove(portfolioId);
  },
  buyStock: function(portfolio, symbol, companyName, quantity, price) {
    var stockObj = TradePortfolios.findOne({name:portfolio}).holdings[companyName];
    if (stockObj === undefined) {
      stockObj = new Stock(symbol, quantity, price);
      holdings[companyName] = stockObj;
    }
    stockObj.costBasis += quantity*price + fee;
    stockObj.quantity += quantity;
    stockObj.avgBuyPrice = stockObj.costBasis/stockObj.quantity;
    
  },
  sellStock: function(portfolio, companyName, quantity, price) {
    var stockObj = TradePortfolios.findOne({name:portfolio}).holdings[companyName];
    stockObj.costBasis += fee;
    stockObj.costBasis -= quantity*price;
    stockObj.quantity -= quantity;
    stockObj.avgBuyPrice = stockObj.costBasis/stockObj.quantity;
  },
  getCompanyName: function(symbol) {
    var data = YahooFinance.snapshot({
      symbols: [symbol],
      fields: ['n']
    });
    return data[0];
  },
  getQuote: function(symbol) {
    var data = YahooFinance.snapshot({
      symbols: [symbol],
      fields: ['n', 'a', 'b', 'c1', 'g', 'h', 'j', 'k', 'v']
      //[Name, Ask, Bid, Day Change, Day's Low, Day's High, 52-Week Low, 52-Week High, Volume]
    });
    return data[0];
  },
  getHistorical: function(symbol) {
    var end = new Date();
    var start = new Date(end);
    start.setDate(start.getDate() - 366);

    var data = YahooFinance.historical({
      symbol: symbol,
      from: start,
      to: end
    });

    return data;
  } 
});