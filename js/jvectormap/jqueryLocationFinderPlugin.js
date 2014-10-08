(function($){
	var activeCountriesColor = "#f6eee0";
	var fillData = {};
	
	var methods = {
		init: function(settings){
			_defaultSettings = {
				hook: "#worldmap",
				countryList: "",
				mapName: "WorldNVS",
				activeCountriesCode: "",
				showLabelOnHover: false
			}
			
			if (settings) $.extend(_defaultSettings, settings);
			
			methods.setVariables(_defaultSettings.countryList, _defaultSettings.activeCountriesCode);
			methods.initMap(_defaultSettings.hook);
		},
		
		setVariables: function(){
			
			//empty fillData object
			fillData={};
			
			//create the fillData object, containing all the active countries with colors associated
			$.each(_defaultSettings.countryList, function(counter,element){
				fillData[element] = activeCountriesColor;
			});
			
		},
		
		initMap: function(hook, countryList){
			$('#' + _defaultSettings.hook).vectorMap({
			map: _defaultSettings.mapName,
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
					"stroke-width": 0.5
				},
				
				hover: {
					fill: "#f9c16c",
					stroke: "#9c8673",
					"stroke-width": 0.5
				}

       		},
			
			onRegionOver: function(e, code) {
				if ($.inArray(code, _defaultSettings.activeCountriesCode) < 0){
					//NOT FOUND
					e.preventDefault();
					return;
				}
				else{
					document.body.style.cursor = 'pointer';
				}
    		},
			
			onRegionOut: function(e, code) {
            	document.body.style.cursor = 'default';
        	},
			
			onRegionLabelShow: function(e, el, code){
				if (_defaultSettings.showLabelOnHover){
					if ($.inArray(code, _defaultSettings.activeCountriesCode) < 0){
						e.preventDefault();	
						return;
					} 		
				}
				else{	
   					return false;
				}
  		    },
			 
			onRegionClick: function(e,code){ 
				if ($.inArray(code, _defaultSettings.activeCountriesCode) < 0){
					//NOT FOUND
					e.preventDefault();
					return ;
				}
				else{
					gApp.selectCountry(code);
				}
			}
			
    	});
		}
	}; //ends methods
	
$.fn.jqueryLocationFinderPlugin = function(method){
		if (methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments,1));
		}
		if (typeof method == "object" || ! method){
			return methods.init.apply(this,arguments);
		}else{
			$.error(' Method ' + method + ' doesn\'t exis');
		}
}



})(jQuery);
