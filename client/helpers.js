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
	}
});

Template.maindashboard.helpers ({
	portfolio: function() {
		if (TradePortfolios.findOne({current:true})) {
			return TradePortfolios.findOne({current: true}).name;
		}
	},
	showQuickQuote: function() {
		return Session.get('quickquote') !== undefined;
	},
	quickQuote: function(info) {
		if (Session.get('quickquote') !== undefined) {
			return Session.get('quickquote')[info];
		}
	},
	showQuoteChart: function() {
		var data = Session.get('historical');
		if (data) {
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
	}
});