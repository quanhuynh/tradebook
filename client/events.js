Template.header.events({
  'click .logout': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('loading');
    setTimeout(function(){Router.go('home')}, 1500);
  },
  'click .portlink': function(event) {
    event.preventDefault();
    Router.go('home');
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
      if (!(oldCurrent === undefined)) {
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
  }
});

Template.trade.events({
  'submit form': function(event) {
    event.preventDefault();

    var tradeOption = $('input[name=trade-option]:checked').val();
    var priceOption = $('input[name=price-option]:checked').val();
    
    if (tradeOption === undefined || priceOption === undefined) {
      alert("Please select valid options");
    
    } else {

      var shares = $('input[name=trade_shares]').val();
      var symbol = $('input[name=trade_symbol]').val();

      var companyName;
      Meteor.call("getCompanyName", symbol, function(error, result) {
        if (result.name === null) {
          alert("Company does not exist");
          return
        } else {
          companyName = result.name;
        }
      });


      if (tradeOption === "buy") {
                

      } else if (tradeOption === "sell") {

      } 
      
      if (priceOption === "market") {

      } else if (priceOption === "limit") {

      } else if (priceOption === "stop") {
      
      }

    }
  },

  'click .lookup': function(event) {
    event.preventDefault();
    var symInput = $('input[name=trade_symbol]').val();
    Meteor.call("getQuote", symInput, function(error, result) {
      Session.set('quickquote', result);
    });
  }

});