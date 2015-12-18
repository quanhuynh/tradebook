var fee = 5;

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
      originalBalance: Number(balance),
      available: Number(balance),
      description: description,
      createdBy: Meteor.userId(),
      username: Meteor.user().username,
      current: false
    });
  },
  deletePortfolio: function(portfolioId) {
    var portfolioName = TradePortfolios.findOne({_id:portfolioId}).name;
    TradePortfolios.remove(portfolioId);
    Holdings.remove({portfolioName:portfolioName});
  },
  buyStock: function(symbol, companyName, quantity, price) {
    var portfolio = TradePortfolios.findOne({current:true});
    var curHolding = Holdings.findOne({symbol:symbol});

    if (curHolding === undefined) {
      Holdings.insert({
        portfolioName: portfolio.name,
        createdBy: Meteor.userId(),
        company: companyName,
        symbol: symbol,
        quantity: Number(quantity),
        costBasis: Number(quantity)*Number(price) + fee,
        avgBuyPrice: (Number(quantity)*Number(price) + fee) / quantity
      });
      var newHolding = Holdings.findOne({company:companyName});
      var newAvailable = portfolio.available - newHolding.costBasis;
      TradePortfolios.update(portfolio._id, {
        $set: {available: newAvailable}
      });

    } else {

    }

    
  },
  sellStock: function(portfolio, companyName, quantity, price) {
    var portfolio = TradePortfolios.findOne({current:true});
    var curHolding = Holdings.findOne({symbol:symbol});

    if (curHolding === undefined) {
      //doesn't own the stock
    } else {
      if (quantity > curHolding.quantity) {
        //selling too much
      } else if (quantity == curHolding.quantity) {
        //selling everything -> remove holding
        var rev = quantity*price;
        var newAvailable = portfolio.available + rev;
        Holdings.remove(curHolding._id);
        TradePortfolios.update(portfolio._id, {
          $set: {available:newAvailable}
        });
      }
    }
    
  },
  getName: function(symbol) {
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