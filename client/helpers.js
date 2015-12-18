Template.loginform.helpers({
	moveToPortfolios: function() {
		Router.go('portfoliosdashboard');
	}
});

Template.portfoliosdashboard.helpers ({
	count: function() {
	  return TradePortfolios.find({createdBy: Meteor.userId()}).count();
	},
	portfolios: function() {
	  return TradePortfolios.find({createdBy: Meteor.userId()});
	}
});

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
		if (selector == "total") {

		} else {
			var currentTrade = Session.get('currentTrade');
			if (currentTrade !== undefined) {
				return currentTrade[selector];
			}
		}
	}
});

Template.maindashboard.helpers ({
	portfolio: function() {
		if (TradePortfolios.findOne({current:true})) {
			return TradePortfolios.findOne({current: true}).name;
		}
	},
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