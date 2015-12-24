var fee = 4.99;


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
      initialBalance: Number(balance),
      available: balance,
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
    Watchlist.remove({portfolioName:portfolioName});
    Orders.remove({portfolioName:portfolioName});
  },

  addToWatchlist: function(symbol, name, currentPrice) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("Not authorized");
    }
    var portfolio = TradePortfolios.findOne({current:true});
    var curTime = new Date();
    if (Watchlist.findOne({symbol:symbol}) === undefined && portfolio !== undefined) {
      Watchlist.insert({
        portfolioName: portfolio.name,
        name: name,
        symbol: symbol,
        initial: currentPrice.toFixed(2),
        createdBy: Meteor.userId(),
        dateAdded: curTime
      });
    }
    
  },

  deleteWatched: function(watchedId) {
    Watchlist.remove(watchedId);
  },

  BuyStock: function(symbol, companyName, quantity, price) {
    var portfolio = TradePortfolios.findOne({current:true});
    var curHolding = Holdings.findOne({symbol:symbol});
    var costBasisRep = Number(quantity)*Number(price) + fee;
    costBasisRep = costBasisRep.toFixed(2);
    var avgPriceRep = (Number(quantity)*Number(price) + fee) / Number(quantity);
    avgPriceRep = avgPriceRep.toFixed(2);

    if (curHolding === undefined) {
      Holdings.insert({
        portfolioName: portfolio.name,
        createdBy: Meteor.userId(),
        company: companyName,
        symbol: symbol,
        quantity: quantity,
        costBasis: costBasisRep,
        avgBuyPrice: avgPriceRep,
      });
      var newHolding = Holdings.findOne({company:companyName});
      var newAvailable = Number(portfolio.available) - Number(newHolding.costBasis);
      TradePortfolios.update(portfolio._id, {
        $set: {available: newAvailable}
      });

    } else {
      var newQuantity = Number(curHolding.quantity) + Number(quantity);
      var tradeCostBasis = Number(quantity)*Number(price) + fee;
      var newCostBasis = Number(curHolding.costBasis) + tradeCostBasis;
      newCostBasis = newCostBasis.toFixed(2);
      var newAvgBuyPrice = newCostBasis / newQuantity;
      newAvgBuyPrice = newAvgBuyPrice.toFixed(2);

      Holdings.update(curHolding._id, {
        $set: {
          quantity: newQuantity,
          costBasis: newCostBasis,
          avgBuyPrice: newAvgBuyPrice,

        }
      });

      var newAvailable = Number(portfolio.available) - tradeCostBasis;
      TradePortfolios.update(portfolio._id, {
        $set: {available: newAvailable}
      });

    }

    var curDate = new Date();
    Orders.insert({
      portfolioName: portfolio.name,
      createdBy: Meteor.userId(),
      tradeType: "Buy",
      company: companyName,
      symbol: symbol,
      quantity: quantity,
      date: curDate
    });

    
  },

  SellStock: function(symbol, companyName, quantity, price) {
    var portfolio = TradePortfolios.findOne({current:true});
    var curHolding = Holdings.findOne({symbol:symbol});
    var valid;

    if (curHolding === undefined || quantity > curHolding.quantity) {
      //doesn't own the stock or selling too much
      valid = false;
    } else {
      var rev = quantity*price - fee;
      console.log("Revenue: " + rev);
      var newAvailable = portfolio.available + rev;
      if (quantity == curHolding.quantity) {
        //selling everything -> remove holding
        Holdings.remove(curHolding._id);
        
      } else {
        //not selling everything
        var newQuantity = curHolding.quantity - quantity;
        var newCostBasis = price*newQuantity + fee;
        var newAvgBuyPrice = newCostBasis/newQuantity;
        Holdings.update(curHolding._id, {
          $set: {
            quantity: newQuantity, 
            costBasis: newCostBasis.toFixed(2),
            avgBuyPrice: newAvgBuyPrice.toFixed(2)
          }
        });
      }
      TradePortfolios.update(portfolio._id, {
        $set: {available:newAvailable}
      });
      valid = true;
        
    }

    if (valid) {
      var curDate = new Date();
      Orders.insert({
        portfolioName: portfolio.name,
        createdBy: Meteor.userId(),
        tradeType: "Sell",
        company: companyName,
        symbol: symbol,
        quantity: quantity,
        date: curDate
      });
    }
    
    
    
  },

  getName: function(symbol) {
    var data = YahooFinance.snapshot({
      symbols: [symbol],
      fields: ['n']
    });
    return data[0];
  },

  getMarketPrice: function(symbol) {
    var data = YahooFinance.snapshot({
      symbols: [symbol],
      fields: ['a', 'b']
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