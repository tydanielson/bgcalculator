'use strict';

(function(){
	angular.module('wsi')
		.service('CalculationService', function($q) {
			var srv = this;



			var isRevenueValid = function(ratios) {
				return ratios.revenue >= 500 ? true : false;
			};

			//greater then 2.0 = half pt
			var isCurrentRatioValid = function(ratios) {
				return ratios.currentRatio >= 2.0 ? true : false;
			};

			//greater then 1.0 = half pt
			var isLongTermDebtCoverageRatioValid = function(ratios) {
				return ratios.longTermDebtCoverageRatio >= 1.0 ? true : false;
			};

			//p/e less then 15 = one point
			var isPeRatioValid = function(quote){
				if (quote.PeRatio == null) {
					return false;
				}
				return quote.PeRatio <= 15 ? true : false;
			};

			//p/b ratio less then 1.5 = one point
			var isPriceToBookValid = function(quote) {
				return quote.priceToBook  <= 1.5 ? true : false;
			};

			//10 yrs of positive income = one point
			var isNetIncomeValid = function(ratios) {
				return ratios.netincome === 10 ? true : false;
			};

			//10 yrs of dividends = one point
			var isDividendTotalValid = function(ratios) {
				return ratios.dividendTotal === 10 ? true : false;
			};

			//10+ years of earning per share growth over 3%
			var isRevenueTenYrValid = function(ratios) {
				return ratios.revenuetenyr >= 3.0 ? true : false;
			};

			var setStockValues = function (ratios, quote) {
				var data =  {
					"revenue": {},
					"currentRatio": {},
					"longTermCovRatio": {},
					"peRatio": {},
					"pbRatio": {},
					"netIncome": {},
					"dividend": {}
				};

				data.revenue = {"value": ratios.revenue, "passed": isRevenueValid(ratios)}
				data.currentRatio = {"value": ratios.currentRatio, "passed": isCurrentRatioValid(ratios)}
				data.longTermCovRatio = {"value": ratios.longTermDebtCoverageRatio, "passed": isLongTermDebtCoverageRatioValid(ratios)}
				data.peRatio = {"value": quote.PeRatio, "passed": isPeRatioValid(quote)}
				data.pbRatio = {"value": quote.priceToBook, "passed": isPriceToBookValid(quote)}
				data.netIncome = {"value": ratios.netincome, "passed": isNetIncomeValid(ratios)}
				data.dividend = {"value": ratios.dividendTotal, "passed": isDividendTotalValid(ratios)}
				data.revenuetenyr = {"value": ratios.revenuetenyr, "passed": isRevenueTenYrValid(ratios)}


				return data;
			};

			this.calculatepts = function(ratios, quote) {
				return $q(function(resolve, reject) { 

					var sdata = setStockValues(ratios, quote);

					var totalpts = 0;
					var outOfPts = 6;
					
					if (sdata.revenue.passed) {
						totalpts++;
					}

					//sometimes this data is undefined for some stocks
					if (sdata.currentRatio.value !== undefined) {
						if (sdata.currentRatio.passed) {
							totalpts = totalpts + 0.5;
						}
						outOfPts = outOfPts + 0.5;
					}

					//sometimes this data is null for some stocks
					if (sdata.longTermCovRatio.value !== null) {
						if (sdata.longTermCovRatio.passed) {
							totalpts = totalpts + 0.5;
						}
						outOfPts = outOfPts + 0.5;
					}

					if (sdata.peRatio.passed) {
						totalpts++;
					}

					if (sdata.pbRatio.passed) {
						totalpts++;
					}

					if (sdata.netIncome.passed) {
						totalpts++;
					}

					if (sdata.dividend.passed) {
						totalpts++;
					}

					if (sdata.revenuetenyr.passed) {
						totalpts++;
					}
					resolve({"totalpts": totalpts, "outOfPts": outOfPts , "stockData": sdata});
				});
			};
		});

})();
