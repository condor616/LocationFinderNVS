// global vars
gApp = null;
pathToSwf = 'flash/';
countryListLetterMouseOver = '#ffffff';
countryListLetterBackgroundColor = '#e2e2e2';
countryBackgroundColor = '#ffffff';
//countryMouseOverBackgroundColor = '#ffffff';
countryMouseOverBackgroundColor = '#F0F0F0';
Prototype.Browser.IE6 = Prototype.Browser.IE && parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)) == 6;
accordionToggleText = 'Expand all';


// application class
var NovLocations = Class.create({
	
	initialize: function() {
		this.initGMap();
		this.initCountries();
		this.initFlashMap();
		this.ccd = new CountryDropdown($("country-list"));
		this.initFilters();
	},
	
	initFlashMap: function() {
	
		// remove current map if present
		var fmap = $('worldmap');
		if(fmap) {
			fmap.remove();
		}
		// create container		
		var div = new Element('div', {'id':'worldmap-container'}).setStyle('display: table-cell; vertical-align: middle;');
		var lImg = new Element('img', {src:'images/_common/icons/loading.gif', width:32, height:32, alt:'Loading ...'}).setStyle('display: block; margin: auto;');
		if(Prototype.Browser.IE) {
			lImg.setStyle('margin-top: 108px;');
		}
		div.appendChild(lImg);
		//div.appendChild(cet('p', 'Adobe Flash required'));
		$('google-map-container').insert({before: div});	
		
		// run rest with a slight delay (IE fix)
		var delay = 1;		
		if(Prototype.Browser.IE) {
			delay = 500;
		}
		window.setTimeout(function() {	
			// create flash object
			var flashvars = {};
			flashvars.jsActive = arrayToString(this.getCC3List()).toLowerCase();
			
			//insert SVG and NO FLASH
			jQuery('#worldmap-container').after("<div id=\"worldmap\" style=\"width: 100%; height:450px; \"></div>");
			jQuery('#worldmap-container').remove();
			jQuery("#location_finder_box").show();
			
			var settings = {
				hook: "worldmap",
				countryList: this.countries,
				mapName: "WorldNVS",
				activeCountriesCode: this.countries,
				showLabelOnHover: true,
			};
			
			jQuery('#worldmap').jqueryLocationFinderPlugin('init', settings ); //'#worldmap', this.countries, "WorldNVS"
			
		}.bind(this), delay);
	},
	
	initGMap: function() { 
		this.gmap = new GMap2($("google-map-container"), {size: new GSize(773, 273)});
		this.gmap.setCenter(new GLatLng(41, -98), 1);
		this.gmap.enableScrollWheelZoom(); // enable scroll wheel zooming
		this.gmap.enableContinuousZoom();
		this.gmap.addControl(new GSmallMapControl());
		this.gmap.addControl(new GMapTypeControl());
		this.gmap.enableDoubleClickZoom();
		this.gdir = new GDirections(this.gmap, $('google-dir-container'));
		this.initStatusMsgs();
		GEvent.addListener(this.gdir, 'error', function() {
			alert('Could not fetch directions: ' + this.sms[this.gdir.getStatus().code]);
		}.bind(this)); 
		this.gmm = new MarkerManager(this.gmap);
		$(this.gmap.getContainer()).observe("DOMMouseScroll", function(e) {
			e.stop();
		});
		$(this.gmap.getContainer()).observe("mousewheel", function(e) {
			e.stop();
		});
	}, /******************************************************************************* commented out ********************************************************************/
	
	initStatusMsgs: function() {
		this.sms = [];
		this.sms[G_GEO_SUCCESS]            = "Success";
		this.sms[G_GEO_BAD_REQUEST]		   = "Invalid request";
		this.sms[G_GEO_MISSING_ADDRESS]    = "Missing Address";
		this.sms[G_GEO_UNKNOWN_ADDRESS]    = "Unknown Address";
		this.sms[G_GEO_UNAVAILABLE_ADDRESS]= "Unavailable Address";
		this.sms[G_GEO_UNKNOWN_DIRECTIONS] = "No route";
		this.sms[G_GEO_BAD_KEY]            = "Bad Key";
		this.sms[G_GEO_TOO_MANY_QUERIES]   = "Too Many Queries";
		this.sms[G_GEO_SERVER_ERROR]       = "Server error";
		this.sms[403]                      = "Error 403";
	},
	
	initFilters: function() {
		var names = ['all', 'pharma','vnd','sandoz','ch','cv','ah','group', 'al'];
		this.filters = {'all':'bu-filter-all','pharma':'bu-filter-pharma','vnd':'bu-filter-vnd','sandoz':'bu-filter-sandoz','ch':'bu-filter-ch','cv':'bu-filter-cv','ah':'bu-filter-ah','group':'bu-filter-group', 'al':'bu-filter-al'};
		this.filterValues = {'pharma':['PH', 'PR', 'BL'],'vnd':['CR', 'VD'],'sandoz':['GX', 'GN'],'ch':['CH', 'OT'],'cv':['CV'],'ah':['AH'],'group':['GR', 'CO'], 'al':['AL', 'AR']};
		names.each(function(n) {
			var ele = $(this.filters[n]);
			if(ele) {
				/*ele.observe('mouseover', function() {
					ele.setStyle('color: #FFFFFF');
				}.bind(this));
				ele.observe('mouseout', function() {
					ele.setStyle('color: #f6e4d0');
				}.bind(this));*/
				ele.observe('click', function() {
					this.toggleFilter(n);
				}.bind(this));
				
				if(n == 'all') {
					ele.addClassName('bu-filter-value-selected');
				}
				else {
					ele.addClassName('bu-filter-value-not-selected');
				}
				
			}
		}.bind(this));
		// default applied filters
		this.filter = [];
	},
	
	toggleFilter: function(fname) {
		if(!this.filter) {
			this.filter = [];
		}
		// all filter clicked while other filter(s) active
		if(fname == 'all') {
			if(this.filter.length > 0) {
				// deselect all (except all of course ;)
				$H(this.filters).values().each(function(ele) {
					if(ele != 'bu-filter-all') {
						$(ele).removeClassName("bu-filter-value-selected");
						$(ele).addClassName("bu-filter-value-not-selected");
					}
				}.bind(this));
				// remove all filters
				this.filter = [];
			}
		}
		else {
			var vals = this.filterValues[fname];
			var removed = false;
			if(vals) {
				vals.each(function(v) {
					if(removed || this.filter.indexOf(v) > -1) {
						removed = true;
						this.filter = this.filter.without(v);
					}
					else {
						this.filter.push(v);
					}
				}.bind(this));
				var ele = this.filters[fname];
				if(ele) {
					if(removed) {
						$(ele).removeClassName("bu-filter-value-selected");
						$(ele).addClassName("bu-filter-value-not-selected");
					}
					else {
						$(ele).removeClassName("bu-filter-value-not-selected");
						$(ele).addClassName("bu-filter-value-selected");
					}
				}
			}
		}
		// (de)select all depending on current filters
		if(this.filter.length > 0) {
			$('bu-filter-all').removeClassName("bu-filter-value-selected");
			$('bu-filter-all').addClassName("bu-filter-value-not-selected");
		}
		else {
			$('bu-filter-all').removeClassName("bu-filter-value-not-selected");
			$('bu-filter-all').addClassName("bu-filter-value-selected");			
		}
		// update country cache or flashmap
		this.initCountries();
		if(this.country) {
			this.selectCountry(this.country.code);
		}
		else {
			
			var settings = {
				hook: "worldmap",
				countryList: this.countries,
				mapName: "WorldNVS",
				activeCountriesCode: this.countries,
				showLabelOnHover: true,
				
			};
			
			jQuery('#' + settings.hook).children().remove();
			//console.log("removed")
			jQuery('#' + settings.hook ).jqueryLocationFinderPlugin('init', settings ); //'#worldmap', this.countries, "WorldNVS"
			//console.log("added");
		}
	},
	
	initCountries: function() {
		this.countries = [];
		gLocations.each(function(val) {
			var cc2 = val.cc.toUpperCase();
			if(this.filter && this.filter.length > 0) {
				if(val.bu != "*" && this.filter.indexOf(val.bu) == -1) {
					return;
				}
			}
			if(this.countries.indexOf(cc2) == -1) {
				this.countries.push(cc2);
			}
		}.bind(this));
		
	},
	
	getCC3List: function() {
		var result = [];
		if(this.countries) {
			gCountries.each(function(c) {
				if(this.countries.indexOf(c.code2) > -1) {
					result.push(c.code);
				}
			}.bind(this));
		}
		
		return result;
	},
	
	displayWorldmap: function() {
		this.hideGMap();
		var fmap = $('worldmap');
		if(fmap) {
			fmap.show();
			this.toggleFilter("all");
		}
		else {
			this.initFlashMap();
		}
		$('location-title').innerHTML = '&nbsp;';
		$('numOfLocationsFor').innerHTML = '&nbsp;';
	},
	
	hideWorldmap: function() {
		var fmap = $('worldmap');
		if(fmap) {
			if(Prototype.Browser.Gecko) {
				fmap.hide();
			}
			else {
				fmap.remove();	
			}
		}
		$('back-to-world').show();
	},
	
	displayGMap: function() {
		this.hideWorldmap();
		$('google-dir-container').hide();
		$('google-map-container').show();
	},
	
	hideGMap: function() {
		this.gmap.closeInfoWindow();
		$('locations-container').hide();
		$('google-dir-container').hide();
		$('google-map-container').hide();
		$('back-to-world').hide();
		this.country = null;
	},
	
	
	selectCountry: function(cc) {
		if(Prototype.Browser.IE) {
			this.hideWorldmap();
		}
		this.gmm.clearMarkers();
		this.gmap.clearOverlays();
	this.gmap.setCenter(new GLatLng(41, -98), 1); 
	
		//if cc is made up of 2chars, then get the 3chars version
		if (cc.length == 2){
			this.country = get2DigitCode(cc);
		}
		else{
			this.country = getCountry(cc);
		}
		
		if(this.country) {
			this.locations = [];
			var cc2 = this.country.code2;
			if(cc2) {
				gLocations.each(function(val) {
					if(val.cc.toUpperCase() == cc2) {
						if(this.filter && this.filter.length > 0) {
							if(val.bu == "*" || this.filter.indexOf(val.bu) > -1) {
								this.locations.push(val);
							}
						}
						else {
							this.locations.push(val);
						}
					}
				}.bind(this));
				this.locations.sort(function(a, b) {
					if(a.city == b.city) {
						return 0;
					}
					var test = new Array(a.city, b.city);
					test.sort();
					if(test[0] == a.city) {
						return -1;
					}
					else {
						return 1;
					}
				}.bind(this));
			}
// $('location-title').innerHTML = 'Locations in ' + this.country.name;
		}
		this.displayLocations();
		this.placeSiteMarkers();
		this.displayGMap();
	},
	
	placeSiteMarkers: function() {
		if(this.gmm && this.locations) {
			//var SW = new GLatLng(-84.9999,-179.9999);
        	//var NE = new GLatLng(84.9999,179.9999); 
			var bounds = new GLatLngBounds();
			var markers = [];
			var cache = [];
			this.locations.each(function(loc) {
				var ll = this.getLatLng(loc);
				if(ll) {
					if(cache.indexOf(loc.latlng) == -1) {
						bounds.extend(ll);
						var m = new GMarker(ll);
						m.bindInfoWindow(this.createSiteInfoWindow(loc.latlng));
						markers.push(m);
						cache.push(loc.latlng);
					}
				}
			}.bind(this));
			if(markers.length > 0) {
					this.gmm.addMarkers(markers, 0, 17); // 11 - 17
					this.gmm.refresh();
					//this.gmap.setCenter(bounds.getCenter(), this.gmap.getBoundsZoomLevel(bounds));
			}
			// zoom to country
			var zoom = this.country.zoom ? this.country.zoom : 3;
			var point = null;
			var data = this.country.latlng.split(',');
			if(data.length == 3) {
				point = new GLatLng(data[1], data[0]);
			}
			if(Prototype.Browser.IE) {
				window.setTimeout(function() {		
					if(point) {
						this.gmap.setCenter(point, zoom);
					}
				}.bind(this), 500);
			}
			else {
				if(point) {
					this.gmap.setCenter(point, zoom);
				}
			}
		}
	},
	
	getLatLng: function(loc) {
		if(loc.latlng && loc.latlng.length > 0) {
			var data = loc.latlng.split(',');
			if(data.length == 3) {
				return new GLatLng(data[1], data[0]); 
			}
		}
	},
	
	displayLocations: function() {
		if(this.locations) {
			$('locations-container').innerHTML = '';
	
			var content = ce('div');
			$(content).addClassName('accordion_box');
			
			var accordionTitle = ce('div');
			$(accordionTitle).addClassName('accordion_title');
			
			var accordionHeadline = ce('h3');
			var locationTitle = ce('span');
			$(locationTitle).addClassName('location-list-header');
			locationTitle.setAttribute('id', 'location-title');
			
			var numOfLocations = ce('span');
			numOfLocations.setAttribute('id', 'numOfLocationsFor');

			
			var accordionToggle = ce('div');
			$(accordionToggle).addClassName('accordion_toggle');
			
			accordionToggle.innerHTML = '<a href="#" class="show_all_accordion">'+accordionToggleText+'</a>';
			
			accordionHeadline.appendChild(locationTitle);
			accordionHeadline.appendChild(numOfLocations);
			
			//accordionTitle.appendChild(accordionToggle);
			//content.appendChild(accordionTitle);
			
			
			
		
			
			
			
			
			
			
			var contentAccordion = ce('ul');
			$(contentAccordion).addClassName('accordion');
			
			
			// helper vars
			var bu_names = {'CR':'Vaccines & Diagnostics','VD':'Vaccines & Diagnostics','PH':'Pharmaceuticals','PR':'Pharmaceuticals','BL':'Pharmaceuticals','CV':'CIBA Vision','CH':'OTC','OT':'OTC','GN':'Sandoz','GX':'Sandoz','AH':'Animal Health','GR':'Group','CO':'Group', 'AL':'Alcon', 'AR':'Alcon'};
			var locCount = 0;
				
				// get cities
			var cities = [];
			this.locations.each(function(loc) {
					if(cities.indexOf(loc.city) == -1) {
						cities.push(loc.city);
					}
			}.bind(this));
			
		cities.each(function(city, idx) {
			
			var accLi = ce('li');
			$(accLi).addClassName('acc');
			var accTrigger = cet('a', city);			
			var accSub = ce('div');
			$(accSub).addClassName('acc_sub');
			var accInner = ce('div');
			$(accInner).addClassName('inner');
			
			
			
			// locations
			
			// create content table
			var table = ce('table');
			var tbody = ce('tbody');
			// add location rows
			
			var locPerCity = 0;
			
			this.locations.each(function(loc) {
				if(loc.city != city) {
					locPerCity = 0;
					return;
				}
				
				locPerCity++;
				
				if(locPerCity > 1) {
				// spacer row				
				var row = ce("tr");
				var td = cet("td", String.fromCharCode(160));
				td.setAttribute("colspan", "4", 0);
				$(td).setStyle('background: transparent url(http://www.novartis.com/images/_common/h-divider.gif) repeat-x scroll left center;');
				row.appendChild(td);
				tbody.appendChild(row);
				}
				
				// BU
				row = ce("tr");
				var col1 = cet("td", "Business Unit:");				
				$(col1).addClassName('col1');
				row.appendChild(col1);
				var col2 = ce("td");
				var buName = cet("strong", (bu_names[loc.bu] ? bu_names[loc.bu] : loc.bu));
				$(buName).setStyle({'color': '#634329'});

				col2.appendChild(buName);
				$(col2).addClassName('col2');				
				row.appendChild(col2);					
				var col3 = ce("td");				
				$(col3).addClassName('col3');
				row.appendChild(col3);
				var col4 = ce("td");
				$(col1).addClassName('col1');				
				row.appendChild(col4);
				
				tbody.appendChild(row);
				// Address
				if(loc.addr) {
					var addr = loc.name.split("\n");
					var mail_addr = loc.addr.split("\n");
					mail_addr.each(function(a) {
						addr.push(a);
					});
					var title = false;
					var rowCount = 0;
					addr.each(function(a) {
						rowCount++;
						row = ce("tr");
						if(!title) {
							var col1 = cet("td", "Address:");
							$(col1).addClassName('col1');
							//col1.setAttribute('class', 'col1');
							row.appendChild(col1);
							title = true;
						}
						else {
							var col1 = ce("td");
							//col1.setAttribute('class', 'col1');
							$(col1).addClassName('col1');
							row.appendChild(col1);
						}
						
						var col2 = cet("td", a);
						//col2.setAttribute('class', 'col2');
						$(col2).addClassName('col2');
						row.appendChild(col2);
						
						switch (rowCount) {
							case 1: // Phone
							if(loc.phone) {
								var col3 = cet('td', "Phone:");
								//col3.setAttribute('class', 'col3');
								$(col3).addClassName('col3');
								row.appendChild(col3);								
								var col4 = cet("td", loc.phone);
								//col4.setAttribute('class', 'col4');
								$(col4).addClassName('col4');
								row.appendChild(col4);
							}
							else {
								var col3 = ce("td");							
								row.appendChild(col3);
								$(col3).addClassName('col3');
								var col4 = ce("td");							
								$(col4).addClassName('col4');
								row.appendChild(col4);
							}						
							break;
							case 2: // Fax
							if(loc.fax) {
							var col3 = cet("td", "Fax:");
							//col3.setAttribute('class', 'col3');
							$(col3).addClassName('col3');
							row.appendChild(col3);
							var col4 = cet("td", loc.fax);
							//col4.setAttribute('class', 'col4');
							$(col4).addClassName('col4');
							row.appendChild(col4);								
							}
							else {
								var col3 = ce("td");							
								row.appendChild(col3);
								$(col3).addClassName('col3');
								var col4 = ce("td");							
								$(col4).addClassName('col4');
								row.appendChild(col4);
							}
							break;
							case 3: // www
							if(loc.url && loc.url != '-') {
								var col3 = cet("td", "Homepage:");							
								$(col3).addClassName('col3');
								row.appendChild(col3);
								
								var href = cet('a', loc.url);
								href.setAttribute('href', loc.url, 0);
								href.setAttribute('target', '_blank');
								var td = ce('td');						
								$(td).addClassName('col4');
								td.appendChild(href);
								row.appendChild(td);
							}
							else {
								var col3 = ce("td");							
								row.appendChild(col3);
								$(col3).addClassName('col3');
								var col4 = ce("td");							
								$(col4).addClassName('col4');
								row.appendChild(col4);
							}
							break;
							default:
							var col3 = ce("td");							
							row.appendChild(col3);
							$(col3).addClassName('col3');
							var col4 = ce("td");							
							$(col4).addClassName('col4');
							row.appendChild(col4);
						}
					
						tbody.appendChild(row);
					});
				}
				
				// Site Address
				if(loc.site) {
					var addr = loc.name.split("\n");
					var site_addr = loc.site.split("\n");
					site_addr.each(function(a) {
						addr.push(a);
					});
					var title = false;
					addr.each(function(a) {
						row = ce("tr");
						if(!title) {
							var col1 = cet("td", "Site Address:");
							//col1.setAttribute('class', 'col1');
							$(col1).addClassName('col1');
							row.appendChild(col1);
							title = true;
							
						}
						else {
							var col1 = ce("td");
							//col1.setAttribute('class', 'col1');
							$(col1).addClassName('col1');
							row.appendChild(col1);
						}
						var col2 = cet("td", a);
						//col2.setAttribute('class', 'col2');
						$(col2).addClassName('col2');
						row.appendChild(col2);
						var col3 = ce("td");
						//col3.setAttribute('class', 'col3');
						$(col3).addClassName('col3');
						row.appendChild(col3);
						var col4 = ce("td");
						//col4.setAttribute('class', 'col4');
						$(col4).addClassName('col4');
						row.appendChild(col4);
						
						tbody.appendChild(row);
					});
				}
				// Show on map link
				var ll = this.getLatLng(loc);
				if(ll) {
					row = ce("tr");						
					var col1 = ce("td");				
					$(col1).addClassName('col1');
					row.appendChild(col1);	
					//var href = cet("a", "Show on map �");
					var linkText = "Show on map &rsaquo;";
					var href = ce("a");
					href.innerHTML = linkText;					
					href.setAttribute('href', 'javascript:;', 0);
					$(href).observe('click', function() {
						this.gmap.setCenter(ll);
						this.gmap.setZoom(15);
						window.scrollTo(0, 0);
					}.bind(this));
					var col2 = ce("td");
					col2.appendChild(href);
					//col2.setAttribute('class', 'col2')
					$(col2).addClassName('col2');
					row.appendChild(col2);
					var col3 = ce("td");						
					//col3.setAttribute('class', 'col3')
					$(col3).addClassName('col3');
					row.appendChild(col3);
					var col4 = ce("td");						
					//col4.setAttribute('class', 'col4')
					$(col4).addClassName('col4');
					row.appendChild(col4);
					
					tbody.appendChild(row);
				}
				// get directions link
				if(ll) {
					var dv = ce("div"); // directions form
					$(dv).addClassName('directions-form');
					row = ce("tr");
					
					var col1 = ce("td");
					//col1.setAttribute('class', 'col1');
					$(col1).addClassName('col1');
					row.appendChild(col1);
					//var href= cet("a", "Get directions >");
					var linkText = "Get directions &rsaquo;";
					var href = ce("a");
					href.innerHTML = linkText;
					href.setAttribute("href", "javascript:;", 0);
					$(href).observe("click", function() {
						$(dv).toggle();
					});
					var col2 = ce("td");
					col2.appendChild(href);
					//col2.setAttribute('class', 'col2')
					$(col2).addClassName('col2');
					row.appendChild(col2);
					
					var col3 = ce("td");						
					//col3.setAttribute('class', 'col3')
					$(col3).addClassName('col3');
					row.appendChild(col3);
					var col4 = ce("td");						
					//col4.setAttribute('class', 'col4')
					$(col4).addClassName('col4');
					row.appendChild(col4);
					
					// close row
				
					tbody.appendChild(row);
					
					// create new row
					row = ce("tr");
						var col1 = ce("td");
					//col1.setAttribute('class', 'col1');
					$(col1).addClassName('col1');
					row.appendChild(col1);
					
					var span = cet("span", "From:");
					dv.appendChild(span);
					var input = ce("input");
					input.setAttribute("type", "text", 0);
					$(input).observe('keypress', function(e) {
						if(e.keyCode == Event.KEY_RETURN) {
							this.getDirections(input.value, loc);
						}
					}.bindAsEventListener(this));
					dv.appendChild(input);
					href = ce("a");					
					href.setAttribute("href", "javascript:;", 0);
					//href.setAttribute("class", "fromBtn");
					$(href).addClassName('fromBtn');
					$(href).observe('click', function(e) {
						if(Prototype.Browser.IE) {
							window.setTimeout(function() {
								this.getDirections(input.value, loc);
							}.bind(this), 500);
						}
						else {
							this.getDirections(input.value, loc);
						}
					}.bindAsEventListener(this));
					var img = ce("img");
					img.setAttribute("src", "../images/_common/buttons/go1.gif", 0);
					img.setAttribute("width", "25", 0);
					img.setAttribute("height", "13", 0);
					img.setAttribute("alt", "Go", 0);
					href.appendChild(img);
					dv.appendChild(href);
					
					
					
					var col2 = ce("td");
					//col2.setAttribute('class', 'col2');
					$(col2).addClassName('col2');
					$(dv).hide();
					col2.appendChild(dv);
					row.appendChild(col2);
					
					var col3 = ce("td");						
					//col3.setAttribute('class', 'col3')
					$(col3).addClassName('col3');
					row.appendChild(col3);
					var col4 = ce("td");						
					//col4.setAttribute('class', 'col4')
					$(col4).addClassName('col4');
					row.appendChild(col4);
					
					// close row
					tbody.appendChild(row);
				}
				// spacer row				
				/*var row = ce("tr");
				var td = cet("td", String.fromCharCode(160));
				td.setAttribute("colspan", "4", 0);
				$(td).setStyle('background: transparent url(http://www.novartis.com/images/_common/h-divider.gif) repeat-x scroll left center;');
				row.appendChild(td);
				tbody.appendChild(row);*/
				// increment location count
				locCount += 1;
			}.bind(this));
			// add city content
			table.appendChild(tbody);
			
			accInner.appendChild(table);		
			accSub.appendChild(accInner);
			accLi.appendChild(accTrigger);
			accLi.appendChild(accSub);
			contentAccordion.appendChild(accLi);		
			
		}.bind(this));
			
		// display message if no locations rendered
			if(locCount == 0) {
				var msg_div = ce('div');
				var msg = (this.filter && (this.filter.length == 0 || this.filter.length == 7) ? 'There are no Novartis offices in ' + this.country.name : 'No matching Novartis offices found in ' + this.country.name + ' for the selected filter settings');
				msg_div.appendChild(cet('p', msg));
				content.appendChild(msg_div);
			}
			
			// show locations headline
			
			var selectedFilters = [];
			
			$$('.bu-filter-value-selected').each(function(el) {
				selectedFilters.push(el.innerHTML);
			});

			
			var numOfLocationsFor = '('+locCount+' results found';
			
			if(selectedFilters.indexOf('All') == -1) {
			
				numOfLocationsFor +=' for ';
				var numOfFilters = selectedFilters.size();
				selectedFilters.each(function(el, index) {					
					if(index == numOfFilters-1) // last element
						numOfLocationsFor += el+')';
					else
						numOfLocationsFor += el+', ';
					
				});
			}
			else
				numOfLocationsFor += ')';
			
			
			locationTitle.innerHTML = 'Locations in ' + this.country.name;
			numOfLocations.innerHTML = numOfLocationsFor;
			
			
			//$('location-title').innerHTML = 'Locations in ' + this.country.name;
			//$('numOfLocationsFor').innerHTML = numOfLocationsFor;
			
			accordionTitle.appendChild(accordionHeadline);
			
			if(locCount != 0) 		
				accordionTitle.appendChild(accordionToggle);
			
			content.appendChild(accordionTitle);
		
			
			
			content.appendChild(contentAccordion);
			$('locations-container').appendChild(content);
				$('locations-container').show();
		
			jQuery('ul.accordion').accordion();
	
		}
	},
	
	
	
	
	createSiteInfoWindow: function(latlng) {
		if(this.locations) {
			var names = [];
			var headers = [];
			var lLoc = null;
			this.locations.each(function(loc) {
				if(loc.latlng == latlng) {
					if(names.indexOf(loc.name) == -1) {
						names.push(loc.name);
						if(loc.url && loc.url != '-') {
							var href = cet('a', loc.name.replace("\n", " "));
							href.setAttribute('href', loc.url, 0);
							href.setAttribute('target', '_blank');
							headers.push(ce("p", href));
						}
						else {
							headers.push(ce("p", cet("strong", loc.name.replace("\n", " "))));
						}
					}
					lLoc = loc;
				}
			}.bind(this));
			names = null;
			var div = ce("div");
			$(div).addClassName("site-info-window");
			// add site names
			headers.each(function(h) {
				div.appendChild(h);
			}.bind(this));
			// add address
			var addr = lLoc.site.split("\n");
			addr.each(function(a) {
				div.appendChild(cet("p", a));
			}.bind(this));
			// add directions form
			var dv = ce("div");
			$(dv).addClassName('directions-form');
			var ph = cet("span", String.fromCharCode(160));
			
			var input = ce("input");
			input.setAttribute("type", "text", 0);
			input.setAttribute("value", "From", 0);
			$(input).observe('keypress', function(e) {
				if(e.keyCode == Event.KEY_RETURN) {
					this.gmap.closeInfoWindow();
					this.getDirections(input.value, lLoc);
				}
			}.bindAsEventListener(this));
			$(input).observe('focus', function(e) {
				input.setAttribute("value", "", 0);
			}.bindAsEventListener(this));
			$(input).observe('blur', function(e) {
				if(input.value == "") {
					input.setAttribute("value", "From", 0);	
				}
			}.bindAsEventListener(this));			
			dv.appendChild(input);
			href = ce("a");
			href.setAttribute("href", "javascript:;", 0);
			$(href).observe('click', function(e) {
				this.gmap.closeInfoWindow();
				if(Prototype.Browser.IE) {
					window.setTimeout(function() {
						this.getDirections(input.value, lLoc);
					}.bind(this), 500);
				}
				else {
					this.getDirections(input.value, lLoc);
				}
			}.bindAsEventListener(this));
			/*var img = ce("img");
			img.setAttribute("src", "img/button-go.gif", 0);
			img.setAttribute("width", "29", 0);
			img.setAttribute("height", "18", 0);
			img.setAttribute("alt", "Go", 0);
			href.appendChild(img);*/
			var img = ce("img");
			img.setAttribute("src", "/images/_common/buttons/go1.gif", 0);
			img.setAttribute("width", "25", 0);
			img.setAttribute("height", "13", 0);
			img.setAttribute("alt", "Go", 0);
			href.appendChild(img);
			dv.appendChild(document.createTextNode(String.fromCharCode(160)));
			dv.appendChild(href);
			var p = ce("p", ph);
			p.appendChild(dv);
			div.appendChild(p);
			$(dv).hide();
			
			//var href = cet("a", "Get directions >");
			var linkText = "Get directions &rsaquo;";
			var href = ce("a");
			href.innerHTML = linkText;
			href.setAttribute("href", "javascript:;", 0);
			$(href).observe("click", function() {
				$(dv).toggle();
				$(ph).toggle();
			});
			//div.appendChild(ce("p", document.createTextNode(String.fromCharCode(160))));
			div.appendChild(ce("p", href));
						
			return div;
		}
		return ce('div');
	},
	
	getDirections: function(from, to) {
		if(this.gdir) {
			this.gdir.clear();
			var ll = this.getLatLng(to);
			var to_str = to.name.replace("\n", " ") + "@" + ll.lat() + "," + ll.lng();
			var str = "from: " + from + " to: " + to_str;
			this.gdir.load(str);
			$('google-dir-container').show();
			window.scrollTo(0, 0);
		}
	},
	
	countryList: function(letter) {
		var result = [];
		if(this.countries) {
			gCountries.each(function(c) {
				if(this.countries.indexOf(c.code2) > -1 && c.name && c.name.substring(0, 1).toUpperCase() == letter.toUpperCase()) {
					result.push(c);
				}
			}.bind(this));
		}
		return result;
	}
});

var CountryDropdown = Class.create({

	
	initialize: function(parent) {
	
		this.parent = $(parent);	
		this.mop = false;
		this.mom = false;
		this.parent.observe("mouseover", function() {			
			this.mop = true;			
		}.bindAsEventListener(this));
		this.parent.observe("mouseout", function() {
			this.mop = false;			
			window.setTimeout(function() {
				if(!this.mom && !this.mop) {
					this.hide();
				}
			//}.bind(this), 500);
			}.bind(this),1 );
		}.bindAsEventListener(this));
		this.createMenu();
		this.hookLetters();
	},
	
	hookLetters: function() {
		var eles = $$("span.country-list-letter");
		eles.each(function(e) {
			e.observe("mouseover", function() {	

				if(this.cLetter) {				
					this.cLetter.setStyle('background-color: '+countryListLetterBackgroundColor+'; height: 19px; border-bottom: 1px solid #e2e2e2;');
				}
				
				this.mop = true;				
				var numOfCountries = this.getNumOfCountries(e.innerHTML);
				if(numOfCountries > 0)	{			
					e.setStyle('background-color: '+countryListLetterMouseOver+'; height: 23px; border-bottom: 1px solid #ffffff;');
					}
					else	{
						e.setStyle('background-color: '+countryListLetterMouseOver+'');
						this.menu.hide();
					}						
				
				this.cLetter = e;	
				if(numOfCountries > 0)
					this.show(e);
				
			}.bindAsEventListener(this));	
			e.observe("mouseout", function() {	
				this.cLetter.setStyle('background-color: '+countryListLetterBackgroundColor+'; height: 19px;');
			}.bindAsEventListener(this));
		}.bind(this));
	},
	
	createMenu: function() {

		this.menu = $(ce('div'));
		this.menu.addClassName('dsel');
		this.menu.observe("mouseover", function() {	
		
		if(this.cLetter) {							
			this.cLetter.setStyle('background-color: '+countryListLetterMouseOver+'; height: 23px; border-bottom: 1px solid #ffffff;');
				}
			this.mom = true;		
		
		}.bindAsEventListener(this));
		this.menu.observe("mouseout", function() {
			this.mom = false;
			window.setTimeout(function() {
				if(!this.mom && !this.mop) {
					if(this.cLetter) {
						this.cLetter.setStyle('background-color: '+countryListLetterBackgroundColor+'; height: 19px; border-bottom: 1px solid #e2e2e2;');
					}
					this.hide();
				}
		//	}.bind(this), 500);
			}.bind(this),1);
			
		}.bindAsEventListener(this));
		this.menu.hide();
		document.body.appendChild(this.menu);
	},
	
	select: function(c) {
		this.hide();
		gApp.selectCountry(c.code);
	},
	
	getNumOfCountries : function(letter) {	
		var countries = gApp.countryList(letter);	
		var numOfCountries = countries.length;		
		return numOfCountries;
	},
	
	show: function(e) {		
		this.populateMenu(e.innerHTML);
		/*this.menu.setStyle({top: (this.getTop(e) + this.parent.offsetHeight -11) + 'px', left: (this.getLeft(e)) + 'px', position: 'absolute'});*/
		
		
		if(Prototype.Browser.IE6)		
			this.menu.setStyle({top: (this.getTop(e) + this.parent.offsetHeight -13) + 'px', left: (this.getLeft(e)) + 'px', position: 'absolute'});
		else
			this.menu.setStyle({top: (this.getTop(e) + this.parent.offsetHeight -11) + 'px', left: (this.getLeft(e)) + 'px', position: 'absolute'});
		
			
			
			
		this.menu.show();
	},
	
	populateMenu: function(letter) {
	
		var ul = ce('ul');
		this.menu.innerHTML = "";
		var countries = gApp.countryList(letter);		
		countries.each(function(c) {
			var li = ce("li");
			var span = cet('span', c.name);
			$(li).observe('mouseover', function() {
				li.setStyle('background-color: '+countryMouseOverBackgroundColor+'');
				/*span.setStyle('color: #FFFFFF'); mouse over color country*/ 
			}.bind(this));
			$(li).observe('mouseout', function() {
				li.setStyle('background-color: '+countryBackgroundColor+'');				
				$(span).setStyle({'color': '#715541'}); 
			}.bind(this));
			$(li).observe('click', function() {
				this.select(c);
			}.bind(this));
			/*
			var href = cet('a', c.name);
			href.setAttribute('href', 'javascript:;', 0);
			$(href).observe('click', function() {
				this.select(c);
			}.bindAsEventListener(this));
			*/
			li.appendChild(span);
			ul.appendChild(li);
		}.bind(this));
		this.menu.appendChild(ul);
	},
	
	hide: function() {
		this.menu.hide();
	},
	
	getLeft: function(e) {
		var offset = 0;
		var element = e;
		while(element) {
			offset += element.offsetLeft;
			element = element.offsetParent;
		}
		return offset;
	},
	
	getTop: function(e) {
	    var offset = 0;
	    var element = e;
	    while (element) {
			offset += element.offsetTop;
			element = element.offsetParent;
	    }
	    return offset;	
	}
});

// on load event
Event.observe(window, 'load', function() {
	gApp = new NovLocations();
});

// on unload event
Event.observe(window, 'unload', function() {
	GUnload();
});

// country clicked event
function countryClicked(cc) {
	if(gApp) {
		gApp.selectCountry(cc);
	}
}

// create element
function ce(ele, child) {
	var obj = document.createElement(ele);
	if(child) {
		obj.appendChild(child);
	}
	return obj;
}

// create element with text node
function cet(ele, txt) {
	var obj = ce(ele);
	obj.appendChild(document.createTextNode(txt));
	return obj;
}

// array serializer
function arrayToString(arr) {
	var result = '';
	if(arr && arr.length) {
		arr.each(function(val, idx) {
			result += val;
			if(idx != arr.length-1) {
				result += ',';
			}
		}.bind(this));
	}
	return result;
}