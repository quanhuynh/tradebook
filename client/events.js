

Template.header.events({
  'click .logout': function(event) {
    event.preventDefault();
    Meteor.logout();
    Session.keys = {};
    Router.go('loading');
    setTimeout(function(){Router.go('home')}, 1500);
  },
  'click .logo': function(event) {
    event.preventDefault();
    Session.keys = {};
    Router.go('home');
  }
});

Template.sidebar.events({
  'click a': function(event) {
    Session.set('previewMode', undefined);
  }
});

Template.portfoliosdashboard.events({
  /*
  'click .edit': function(event) {
    event.preventDefault();
    var portfolioName = $('.edit').parent().parent().data('name');
    var currentUser = Meteor.userId();

  },
  */
  'click .portfolio': function(event) {
    event.preventDefault();
    var portfolioName = event.currentTarget.getAttribute('data-name');
    if (event.target.className != "remove") {
      var oldCurrent = TradePortfolios.findOne({current:true});
      if (oldCurrent !== undefined) {
        TradePortfolios.update(oldCurrent._id, {
          $set: {current: false}
        });
      }
      TradePortfolios.update(TradePortfolios.findOne({name:portfolioName})._id, {
        $set: {current: true}
      });
      Router.go('dashboard');
    }
  },

  'click .remove': function(event) {
    event.preventDefault();
    var portfolioName = $(event.currentTarget).parent().parent().data('name');
    var retVal = confirm("Are you sure you want to delete this portfolio?");
    if (retVal) {
      var portfolioId = TradePortfolios.findOne({name: portfolioName})._id;
      Meteor.call("deletePortfolio", portfolioId);
    }
    
  }
});

Template.newportfolio.events({
  'submit form': function(event) {
    event.preventDefault();
    var name = event.target.portfolio_name.value;
    var balance = event.target.portfolio_balance.value;
    var description = event.target.portfolio_description.value;

    Meteor.call("addPortfolio", name, balance, description);
    Router.go('portfoliosdashboard');
  }
});


Template.maindashboard.events({
  'submit .search-field': function(event) {
    event.preventDefault();
    var symInput = event.target.symbol;
    Meteor.call("getQuote", symInput.value, function(error, result) {
      Session.set('quickquote', result);
    });
    Meteor.call("getHistorical", symInput.value, function(error, result) {
      Session.set('historical', result);
    });
    symInput.value = "";
  },

  'click .watchlistAdd': function(event) {
    event.preventDefault();
    var input = event.target;
    var source = Session.get('quickquote');
    if (source !== undefined) {
      var symbol = source.symbol;
      var name = source.name;
      var curPrice = source.ask;
      Meteor.call('addToWatchlist', symbol, name, curPrice);
    }
    input.text = "Added!";
    setTimeout(function() {
      input.text = "Add to Watchlist";
    }, 2000);
  }

});

Template.trade.events({
  'submit .trade-form': function(event) {
    event.preventDefault();
    var tradeOption = $('input[name=trade-option]:checked').val();
    var symbol = $('input[name=trade_symbol').val();
    var shares = $('input[name=trade_shares').val();

    if (tradeOption === undefined) {
      alert("Please select valid options");
    } else {
      Meteor.call("getName", symbol, function(error, result) {
        if (result !== null) {
          if (result.name !== undefined) {
            Session.set("previewMode", true);
            var currentTrade = {
              option: tradeOption,
              name: result.name,
              symbol: symbol,
              shares: shares
            }
            Session.set("currentTrade", currentTrade);
          } else {
            alert("Symbol does not match any company");
          }
        }
      });
    }
  },

  'click .lookup': function(event) {
    event.preventDefault();
    var symInput = $('input[name=trade_symbol]').val();
    Meteor.call("getQuote", symInput, function(error, result) {
      Session.set('quickquote', result);
    });
  },

  'submit .preview': function(event) {
    event.preventDefault();
    var curTrade = Session.get('currentTrade');
    if (curTrade !== undefined) {
      var method = curTrade.option + "Stock";
      var name = curTrade.name;
      var symbol = curTrade.symbol;
      var shares = Number(curTrade.shares);


      Meteor.call("getQuote", symbol, function(error, result) {
        if (result !== null) {
          Meteor.call(method, symbol, name, shares, result.ask);
          Router.go('loading');
          setTimeout(function(){
            alert("Trade Successfully Submitted");
            Router.go('dashboard');
          }, 1500);
        }

      });

    }

    
  }

});

Template.watchlist.events({
  'click #remove': function(event) {
    event.preventDefault();
    var symbol = $(event.currentTarget).parent().parent().data('symbol');
    var watchedId = Watchlist.findOne({symbol:symbol});
    var retVal = confirm("Are you sure you want to delete this watched stock?");
    if (retVal) {
      Meteor.call("deleteWatched", watchedId);
    }
  }
});