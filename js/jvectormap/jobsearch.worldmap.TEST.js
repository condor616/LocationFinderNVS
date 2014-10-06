var activeCountriesColor = "#f6eee0";
var activeCountriesCode = Object.getOwnPropertyNames(JScountries);
//var fillData = JScountries;
var fillData = jQuery.extend({}, JScountries);
$(function(){
	
	
		//create the fillData object, containing all the active countries with colors associated
		$.each(fillData, function(key,value){
			fillData[key] = activeCountriesColor;
		});
			
		$('#vectormap').vectorMap({
			map: 'WorldNVS',
      		backgroundColor: 'transparent',
			zoomButtons:  false, 
			zoomMax: 8,
            zoomMin: 1.2,
			scale: 1.4,
			series: {
        		regions: 
				[
					{
						values: fillData,
						attribute: 'fill'
    				},
					
				]
    		},
			
			
      		regionStyle: {
				
            	initial: {
					fill: "white",
					stroke: "#9c8673",
					"stroke-width": 0.5,
				},
				
				
				hover: {
					fill: "#f9c16c",
					stroke: "#9c8673",
					"stroke-width": 0.5,
				}

       		},
			
			onRegionOver: function(e, code) {
				if ($.inArray(code, activeCountriesCode) < 0){
					//NOT FOUND
					e.preventDefault();
				}
    		},
			onRegionOut: function(e, code) {
            	
        	},
			onRegionLabelShow: function(e, el, code){
				e.preventDefault();
   				return false;
  		    },
			 
			onRegionClick: function(e,code){ 
			
				var map = $('#vectormap').vectorMap('get', 'mapObject');
			
				if ($.inArray(code, activeCountriesCode) > 0){
					//FOUND
					//alert(map.getRegionName(code));
					jQuery('#jobsearch').jobsearch('search', 'country', code);
				}
			},
			
    	});
});