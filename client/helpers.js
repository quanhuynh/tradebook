Meteor.subscribe('tradeportfolios');
Meteor.subscribe('holdings');
Meteor.subscribe('watchlist');
Meteor.subscribe('orders');

///////////////
// FUNCTIONS //
///////////////
function getSymbols() {
	var symbols = [];
	Holdings.find().forEach(function(holding) {
		if (holding !== undefined) {
			symbols.push(holding.symbol);
		}
	});
	return symbols;
}

function getWatchlistSymbols() {
	var symbols = [];
	Watchlist.find().forEach(function(watched) {
		if (watched !== undefined) {
			symbols.push(watched.symbol);
		}
	});
	return symbols;
}

function getMarketPrice(symbol) {
	Meteor.call('getMarketPrice', symbol, function(error, result) {
		if (result !== null) {
			Session.set("tempAskPrice" + symbol, result.ask);
			Session.set("tempBidPrice" + symbol, result.bid);
		}
	});
}

function getMarketBid(symbol) {
	Meteor.call('getMarketPrice', symbol, function(error, result) {
		if (result !== null ) {
			
		}
	})
}

//////////////
// HELPERS ///
//////////////

// FORMS
Template.loginform.helpers({
	moveToPortfolios: function() {
		Router.go('portfoliosdashboard');
	}
});

Template.trade.helpers({
	showQuickQuote: function() {
		return Session.get('quickquote') !== undefined && Session.get('quickquote').name !== null;
	},

	quickQuote: function(info) {
		if (Session.get('quickquote') !== undefined) {
			return Session.get('quickquote')[info];
		}
	},

	previewMode: function() {
		return Session.get('previewMode') !== undefined;
	},

	previewInfo: function(selector) {
		var currentTrade = Session.get('currentTrade');
		getMarketPrice(currentTrade.symbol);
		var priceType;
		var fee = 4.99;

		if (currentTrade) {
			if (currentTrade.option == "Buy") {
				priceType = "Ask";
			} else {
				priceType = "Bid";
				fee = -fee;
			}
			var marketPrice = Session.get("temp" + priceType + "Price" + currentTrade.symbol);


			if (selector == "total") {
				var shares = Number(currentTrade.shares);
				return "$" + (marketPrice*shares+fee).toFixed(2);
			} else if (selector == "price") {
				return "$" + marketPrice.toFixed(2);
			} else {
				return currentTrade[selector]; 
			}
		}
		
	}
});

// DASHBOARDS
Template.portfoliosdashboard.helpers ({
	count: function() {
	  return TradePortfolios.find({createdBy: Meteor.userId()}).count();
	},
	portfolios: function() {
	  return TradePortfolios.find({createdBy: Meteor.userId()});
	}
});

Template.maindashboard.helpers ({
	clean: function() {
		Session.set('quickquote', undefined);
	},

	portfolio: function() {
		if (TradePortfolios.findOne({current:true})) {
			return TradePortfolios.findOne({current: true}).name;
		}
	},

	//OVERVIEW
	overview: function() {
		var curPortfolio = TradePortfolios.findOne({current:true});
		if (curPortfolio) {
				var available = Number(curPortfolio.available);
				Session.set('available', available);
		}
		
		var accountValue = Number(available);

		Holdings.find({portfolioName:curPortfolio.name}).forEach(function(holding) {
			getMarketPrice(holding.symbol);
			var query = "tempAskPrice" + holding.symbol;
			var marketPrice = Session.get(query);
			var holdingMarketVal = marketPrice*holding.quantity;
			accountValue += holdingMarketVal;
		});
		var totalChange = accountValue - curPortfolio.initialBalance;

		Session.set('accountValue', accountValue);
		Session.set('totalChange', totalChange);
		
	},

	availableFunds: function() {
		var ava = Session.get('available');
		if (ava !== undefined) {
			return "$" + ava.toFixed(2);
		}
	},

	accountValue: function() {
		var val = Session.get('accountValue');
		if (val !== undefined) {
			return "$" + val.toFixed(2);
		}
	},

	totalChange: function() {
		var delta = Session.get('totalChange')
		if (delta !== undefined) {
			if (delta < 0) {
				return "-$" + Math.abs(delta).toFixed(2);
			} else {
				return "$" + delta.toFixed(2);
			}
		}
	},

	//HOLDINGS
	holdings: function() {
		var portfolio = TradePortfolios.findOne({current:true});
		if (portfolio) {
			return Holdings.find({
				createdBy: Meteor.userId(),
				portfolioName:portfolio.name
			});
		}
		
	},

	//QUICK QUOTE
	showQuickQuote: function() {
		return Session.get('quickquote') !== undefined && Session.get('quickquote').name !== null;
	},

	quickQuote: function(info) {
		if (Session.get('quickquote') !== undefined) {
			return Session.get('quickquote')[info];
		}
	},

	showQuoteChart: function() {
		var data = Session.get('historical');
		if (data !== undefined && data.length > 0) {
			series = [{
				type: 'area',
				data: data.map(function(element) {
					return {
						x: element.date.getTime(),
						y: element.close
					}
				}),
				tooltip: {
					valueDecimals: 2
				},
				threshold: null
			}];
			//console.log(series);
			$('.chart').highcharts('StockChart', {
				rangeSelector: {
					selected: 1
				},
				title: {
					text: data[data.length-1].symbol
				},
				series: series
			});
		}
	},

	yahooFinanceLink: function() {
		if (Session.get('quickquote') !== undefined && Session.get('quickquote').name !== null) {
			return "http://finance.yahoo.com/q?s=" + Session.get('quickquote')['symbol'];
		}
	},

	getNews: function() {
		if (Session.get('quickquote') !== undefined && Session.get('quickquote').name !== null) {
			var symbol = Session.get('quickquote').symbol;
			var url = "//finance.yahoo.com/rss/headline?s=" + symbol;
			console.log("About to make call to " + document.location.protocol + url);
			$.ajax({
				type: 'GET',
				url: "https://crossorigin.me" + document.location.protocol + url,
				success: function(data) {
					console.log("here");
					if (data.responseData.feed && data.responseData.feed.entries) {
						console.log("whoa");
						console.log(data);
					} else {
						console.log("fucking shit");
					}
						
					/*
					if (data.responseData.feed && data.responseData.feed.entries) {
						$.each(data.responseData.feed.entries, function(i, e) {
							console.log("---------");
							console.log(e.title);
							console.log(e.link);
							console.log(e.description);
						});
					}
					*/
				},
				complete: function(data) {
					console.log("Completed call");
				},
				error: function(xhr, status, error) {
					console.log(xhr);
				}
			});
		}
		
	}
});

// MISC

Template.header.helpers ({
	username: function() {
		if (Meteor.user()) {
			return Meteor.user().username;
		}
	},
	dashboardable: function() {
		return TradePortfolios.findOne({current:true}) !== undefined;
	}
});

// PAGES
Template.holdings.helpers({
	holdings: function() {
		var portfolio = TradePortfolios.findOne({current:true});
		if (portfolio) {
			return Holdings.find({
				createdBy: Meteor.userId(),
				portfolioName: portfolio.name
			});
		}
		
	},

	update: function(symbol) {
		getMarketPrice(symbol);
		var curHolding = Holdings.findOne({symbol:symbol});
		var query = "tempAskPrice" + symbol;
		var marketPrice = Session.get(query);
		var marketValue;
		var change;
		if (curHolding) {
			marketValue = marketPrice*curHolding.quantity;
			change = marketValue - curHolding.costBasis;
		}
		Session.set("marketPrice" + symbol, marketPrice);
		Session.set("marketValue" + symbol, marketValue);
		Session.set("change" + symbol, change);
		
	},

	holdingInfo: function(selector, symbol) {
		var value = Session.get(selector + symbol);
		if (value < 0) {
			return "-$" + Math.abs(value).toFixed(2);
		} else {
			return "$" + value.toFixed(2);
		}
	}
});

Template.watchlist.helpers({

	watcheds: function() {
		var portfolio = TradePortfolios.findOne({current:true});
		if (portfolio) {
			return Watchlist.find({
				createdBy: Meteor.userId(),
				portfolioName: portfolio.name
			});
		}
	},

	marketPrice: function(symbol) {
		getMarketPrice(symbol);
		var marketPrice = Session.get("tempAskPrice" + symbol);
		return "$" + marketPrice.toFixed(2);
	},

	date: function(symbol) {
		var watched = Watchlist.findOne({symbol:symbol});
		if (watched) {
			var date = watched.dateAdded;
			var dd = date.getDate();
			var mm = date.getMonth() +1;
			var yyyy = date.getFullYear();
			return "" + mm + "/" + dd + "/" + yyyy;
		}
	}
});

Template.orders.helpers({
	
	orders: function() {
		var portfolio = TradePortfolios.findOne({current:true});
		if (portfolio) {
			return Orders.find({
				createdBy: Meteor.userId(),
				portfolioName: portfolio.name
			});
		}
	},

	date: function(date) {
		var order = Orders.findOne({date:date});
		if (order) {
			var date = order.date;
			var dd = date.getDate();
			var mm = date.getMonth() + 1;
			var yyyy = date.getFullYear();
			return "" + mm + "/" + dd + "/" + yyyy;
		}
	}

});