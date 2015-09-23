$(document).ready( function() {

	$('form').on( 'keyup keypress keydown change focus blur', function(){

		
		//checks eligibility for 20% Top Rated Seller discount		
			var isTopRated = $('input[value="top-rated"]').prop('checked');
		
		//sets top rated discount amt in cents	
			var topRatedDiscount = +$('input[name="sold-price"]').val() * 2;

		//starting bid; required for reserve calculation
			var startingBid =  +$('input[name="start-price"]').val() * 100;
	
		//sum of sold price and shipping charged to buyer in cents
			var grossRev = (+$('input[name="sold-price"]' ).val()  +   +$('input[name="buyer-shipping"]').val()) * 100;
			
		//seller's cost to ship in cents
			var costToShip = (+$('input[name="cost-to-ship"]').val()) * 100 ; 
	
		//checks whether listing is auction 
			var isFixed = $('input[value="fixed-price"]').prop('checked');
	
		//checks if listing is in book, dvd, music, movie, or video game category
			var isMedia = $('option:selected').hasClass('media');
	
		//checks whether to add insertion fee
			var addInsFee = $('input[value="add-insert"]').prop('checked');
			var insertionFee = 0;
			//tests whether add insertion fee radio button is selected
			if (addInsFee) {
				insertionFee = insertFee(isMedia, isFixed);
			}

		//checks if Value Pack button is checked
			var isValChecked = $('input[name="valpack"]').prop('checked');
	
		//toggles subtitle, gallery plus, listing designer options when value pack button is checked
			toggleVal(isValChecked);
		
		var isAuction = $('input[value="auction"]').prop("checked");
		//toggles 30-day and good til canceled buttons when auction button is checked
			toggleDuration(isAuction);	
		
		//cost to acquire item
			var itemCost = (+$('input[name="item-cost"]').val())*100;
		
		//ebay fees. eFee is divided by 100 to account for numbers being in cents, not dollars
			var eFee = ebayTotal(topRatedDiscount, grossRev, isTopRated, insertionFee, startingBid, isAuction, isFixed)
			$('#ebay-fee').text((eFee/100).toFixed(2));
	
		//paypal fees. pFee also divided by 100 b/c numbers are in cents
			var pFee = paypalFee(grossRev);
			$('#paypal-fee').text((pFee/100).toFixed(2));
		
		//total fees	
			var fees = eFee + pFee;
	
		//profit
			var profitCents = profit(itemCost, costToShip, fees, grossRev);
			$('#profit').text((profitCents /100).toFixed(2));
			if (profitCents < 0) {
			  $('#profit').css("color", "red");
			}
			else {
			 $('#profit').css("color", "black"); 
			}
		//resets profit, ebay fee, and paypal fee fields when "reset" button is clicked
		$('button').on('click', function() {
			$('#profit').text('');
			$('#ebay-fee').text('');
			$('#paypal-fee').text('');
		});

});



//HELPER FUNCTIONS

	var insertFee = function (isMedia, isFixed) {
	//insertion fee variable
		var  fee;
	
	// fixed price books, DVDs, CDs, movies, music, 
	// & video games that require insertion fees are charged $.05
		if (isMedia && isFixed) {
			fee = 5;
		}
	//everything else is $.30
		else {
			fee = 30;
		}
		return fee;
	};

	var ebayTotal = function(topRatedDiscount,grossRev, isTopRated, insertionFee, startingBid, isAuction, isFixed) {
	
	//calculates basic upgrade fees
		var totalUpgradeFee = 0;
		//loops through each input in upgrade class
			$('.upgrades').find('input').each(function () {
				if ( $(this).prop('checked') ) {
				 /* checks whether 30 day or good 'til cancelled option is chosen,
				 whether the relevant data attribute is a number,
				and calculates upgrade fees */
				if ( ($('input[value="30-day"]').prop('checked') || $('input[value="gtc"]').prop('checked')) && ($.isNumeric($(this).data('longtermfixed')) )) {
						totalUpgradeFee += +$(this).data('longtermfixed');
				}
					else if ($.isNumeric($(this).data('auction')))   {
						totalUpgradeFee += +$(this).data('auction');
					}
			}
			});
	// adds 40 cent charge if auction-style listing is extended to 10 days
		if ($('input[value="10-day"]').prop('checked') && isAuction) {
			totalUpgradeFee += 40;
		};
		
	//international visibility fees
		var isIntl = $('input[name="intlvisibility"]').prop('checked');
		toggleIntl(isIntl);
		if ($('input[name="intlvisibility"]').prop('checked')){
		  
		  if (isAuction ) {
			console.log(isAuction);
				if (startingBid < 1000) {
				  	totalUpgradeFee += 10;
				}

				else if (startingBid < 5000) {
					totalUpgradeFee += 20;
				}

				else {
					totalUpgradeFee += 40;
				}

			}
		else if (isFixed) {
		  totalUpgradeFee += 50; 
		  }
		}
		
	//reserve fees
	var hasReserve = $('input[name="reserve"]').prop('checked');
	toggleReserve(hasReserve);
	
	if (hasReserve) {
	  var reserve = $('input[name="reserve-price"]').val() * 100;
	    if (reserve < 20000) {
		totalUpgradeFee += 200;
	    }
	    else if (reserve <= 500000) {
		totalUpgradeFee += reserve / 100;
	    }
	    else if (reserve > 500000) {
		totalUpgradeFee += 5000;
	    }
	}

	// 10% Final Value Fee
		var fee = grossRev * 0.10;
	//max final value fee as of 2/19/2015 is $750; fee amt is in cents, not dollars
		if (fee > 75000) {
			fee = 75000;
			topRatedDiscount = .2 * fee;
		}				
	//deducts discount for Top Rated seller status
		if (isTopRated) {		
			return fee - topRatedDiscount + insertionFee + totalUpgradeFee;
			}
		else {
			return fee + insertionFee + totalUpgradeFee;
		};
	    
	};

	var paypalFee = function(grossRev){
		//Paypal fee rate is 2.9% + $0.30
		var fee = (grossRev *.029) + 30;
		return fee;
	};
	
	var profit = function (itemCost, costToShip, fees, grossRev){
		var expenses = itemCost + costToShip + fees;
		return grossRev - expenses;
	
	};

//toggles gallery plus, listing designer, subtitle buttons
		var toggleVal = function(isValChecked) {
			if (isValChecked){
				$('input[name="list-design"]').prop({
					"checked": false
				});
				$('input[name="subtitle"]').prop({
					"checked": false
				});
				$('input[name="gallery"]').prop({
					"checked": false
				});
			};

			$('input[name="list-design"]').prop("disabled", isValChecked);
			$('input[name="subtitle"]').prop("disabled", isValChecked);
			$('input[name="gallery"]').prop("disabled", isValChecked);

		};

//disables 30 day and good 'til canceled listing options when auction radio button is selected
	var toggleDuration = function(isAuction) {
		$('input[value="30-day"]').prop("disabled", isAuction);
		$('input[value="gtc"]').prop("disabled", isAuction);

		if (isAuction) {
			$('input[value="30-day"]').prop("checked", false);
			$('input[value="gtc"]').prop("checked", false);
		};
		
	};
//shows reserve class when reserve radio button is selected
	var toggleReserve = function(hasReserve) {
	    if (hasReserve) {
	     $('.reserve').show();
	    }
	    else {
		$('.reserve').hide();
	    }
	};
//shows starting price when international visibility button is selected
	var toggleIntl = function(isIntl) {
	    if (isIntl) {
		$('.start-price').show();
	    }
	    else {
	      $('.start-price').hide();
	    }
	};
});