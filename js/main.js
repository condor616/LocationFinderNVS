
//if (isTestCall()) alert('Enter main.js');

if(typeof VARS_PREVIOUS == "undefined")             VARS_PREVIOUS = "previous"; 
if(typeof VARS_NEXT == "undefined")                 VARS_NEXT = "next"; 
if(typeof VARS_ACCORDION_OPEN_ALL == "undefined")   VARS_ACCORDION_OPEN_ALL = "Expand all"; 
if(typeof VARS_ACCORDION_CLOSE_ALL == "undefined")  VARS_ACCORDION_CLOSE_ALL = "Collapse all"; 
if(typeof VARS_CLOSE == "undefined")                VARS_CLOSE = "close"; 

jQuery.noConflict();

// fading in the utility navigation bar after page is loaded
window.onload = function() {	
	if (jQuery.browser.msie && parseInt(jQuery.browser.version) < 7) {
        if (isTestCall()) alert('use onload');
        mainInit();
    }
    
    jQuery('#util-nav').delay(500).fadeIn(1500);
	
	jQuery('.media-item-section').each(function(){
		var x_height 	= 0;		
		jQuery(this).find('.media-item').each(function(i) {			
			var counting = i % 4;
			if (counting === 3) {
				jQuery(this).addClass('n4');
			}
			var elem_height	= 0;
			elem_height = jQuery(this).find('.image').height();
			
			if (elem_height > x_height) {
				x_height = elem_height;
			}
		});
		jQuery(this).find('.image').height(x_height);
		jQuery(this).find('.image a').css({position: 'absolute', bottom: '0'});		
	});    
}


jQuery(document).ready(function($){
    if (!jQuery.browser.msie || (jQuery.browser.msie && parseInt(jQuery.browser.version) > 6) ) {
        if (isTestCall()) alert('use Dom Ready');
        mainInit();
    }
});  //document.ready

function mainInit() {
    if (isTestCall()) alert('Dom Ready');    
        
        
	jQuery('#util-nav').hide();
	jQuery('ul.tabs').show();
	jQuery('.pane-content .headline').hide();
	jQuery('#sub .left-column > ul > li:last').addClass('last');	
	jQuery('.media-item-section .headline, .media-item-section .description').hide();
	jQuery('.content .functions ul li a.print').show().click(function() {
		window.print();			
		return false;
	});


	/********************************************
	* Font Resizer
	*********************************************/
	
	jQuery('.size-switch').sizeswitch();	
	
	/********************************************
	* Utility Navigation
	*********************************************/
	
	if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6 || jQuery.browser.msie && parseInt(jQuery.browser.version) == 7) {
		jQuery('#util-nav .pane2 .link-wrapper').hide();
	}
	
	var slideOpen = false;
	
	jQuery('#util-nav ul.tabs').tabs('#util-nav div.panes > div.pane-content', {
		initialIndex: 'null'		
	});
	
	
	jQuery('#util-nav ul.tabs').hover(function() {
		if(slideOpen == false && jQuery('#util-nav div.panes').is(':animated') == false) {
			jQuery('p.slider').animate({top: '0px'}, 300).animate({top: '-8px'}, 200, function(){
				// increase link height
				jQuery('#util-nav ul.tabs li a').css({'height': '25px'});
			});
		}
	}, function() {
		jQuery('p.slider').stop(true, false).animate({top: '-20px'}, 200);
		// reset link height
		jQuery('#util-nav ul.tabs li a').css('height', '18px');
	});
	
	
	// open utility navigation on click
	jQuery('#util-nav ul.tabs li a').click(function() {
		jQuery('p.slider').stop(true, false).css({top: '-20px'});
		jQuery('#util-nav ul.tabs li a').css('height', '18px');
		// close utility navigation if same button is clicked again
		if(slideOpen == true && jQuery(this).parent().hasClass('opened')) {
			jQuery('#util-nav ul.tabs li.opened').removeClass('opened');			
			/* avoid weird effect of absolute positioned element in IE 6/7 */
			if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6 || jQuery.browser.msie && parseInt(jQuery.browser.version) == 7  ) {
				jQuery('#util-nav .pane2 .link-wrapper').hide();
			}
			jQuery('#util-nav div.panes').slideUp('normal', function() {
				jQuery('#util-nav-wrapper').removeClass('active');
				jQuery('#util-nav ul.tabs li a.current').removeClass('current');
				jQuery('#util-nav ul.tabs li').not('.opened, .last').css({'background': 'url(/images/_common/borders/util-nav/dotted.gif) no-repeat right 1px', 'border-right': 'none'});				
				slideOpen = false;
			});	
		} else {
			jQuery('#util-nav ul.tabs li.opened').removeClass('opened');			
			jQuery('#util-nav-wrapper').addClass('active');
			jQuery(this).addClass('current');
			jQuery(this).parent().addClass('opened');			
			// open utility navigation
			jQuery('#util-nav div.panes').slideDown('slow', function(){
				jQuery('.slide-up').show();	
				/* avoid weird effect of absolute positioned element in IE 6/7 */
				if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6 || jQuery.browser.msie && parseInt(jQuery.browser.version) == 7  ) {
					jQuery('#util-nav .pane2 .link-wrapper').show();
				}
				slideOpen = true;				
			});
			jQuery('#util-nav ul.tabs li').not('.opened, .last').css({'background': 'url(/images/_common/borders/util-nav/dotted.gif) no-repeat right 1px', 'border-right': 'none'});
			jQuery('#util-nav ul.tabs li.opened').css({'background': 'none', 'border-right': 'none'});
			jQuery('#util-nav ul.tabs li.opened').prev('li').css({'background': 'none', 'border-right': '1px solid #d7d7d7'});			
		}		
	});
	
	// slide pane up on click on slider 
	jQuery('.slide-up').click(function() {
		/* avoid weird effect of absolute positioned element in IE 6/7 */
		if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6 || jQuery.browser.msie && parseInt(jQuery.browser.version) == 7  ) {
			jQuery('#util-nav .pane2 .link-wrapper').hide();
		}
		jQuery('#util-nav div.panes').slideUp('normal', function() {				
			jQuery('#util-nav-wrapper').removeClass('active');			
			jQuery('#util-nav ul.tabs li a.current').removeClass('current');
			// reset right borders
			jQuery('#util-nav ul.tabs li').not('.last').css({'background': 'url(/images/_common/borders/util-nav/dotted.gif) no-repeat right 1px', 'border-right': 'none'});
			slideOpen = false;
		});
		return false;
	});
	
	/********************************************
	* recent news
	* (open the first two month in the in the current year) 
	*********************************************/
	// check if the current year is selected - always the first element (span)
	// in the ".util-date" div-container	
	if (jQuery('.util-bar-mr.recent_news .util-date > span').index() === 0) {
		// add for the first two month the class "current"
		jQuery('.box-content.recent_news ul.accordion > li.acc:lt(2)').addClass('current');
	}
	
	
	/********************************************
	* Tabs
	*********************************************/
	
	jQuery('.content ul.tabs:not(.statictabs)').tabs('div.panes > div.pane-content', { history: true });
	jQuery('.stock-chart ul.tabs, #layerBox ul.tabs').tabs('div.panes > div.pane-content');

	
	/********************************************
	* News Scrollable
	*********************************************/	
	
    //IVK - add dummy items if needed - workaround for carousel
    var scroll_items_count = 3;
    jQuery.each(jQuery('#home div.news'), function() {
      var li_els = jQuery(this).find('ul.text-list li'); 
      var li_els_diff = scroll_items_count-(jQuery(this).find('ul.text-list li').size()%scroll_items_count); 
      if (li_els_diff < scroll_items_count) {
        var ul = jQuery(this).find('ul.text-list'); 
        for (var i=0; i<li_els_diff; i++) {
            ul.append('<li class="empty"></li>');
        }
      }
    });

    
    
	jQuery('#home div.news').jCarouselLite({		
		vertical: 'true',		
		circular: false,	
		scroll:scroll_items_count, //IVK
		speed:500,
        btnNext: '.up',
        btnPrev: '.down'		
    });
	
	jQuery('#home div.news-wrapper').addClass('news-wrapper-settings');
	
	var count = 0;
	jQuery('#home div.news-wrapper').mouseenter(function() {
		if (jQuery(this).find('ul.text-list li').size() > scroll_items_count) {	//IVK
            count ++;	
            
            jQuery('#home a.down').css({ opacity:0, visibility:'visible'}).fadeTo(300,1);
            jQuery('#home a.up').css({ opacity:0, visibility:'visible'}).fadeTo(300,1);
            
            if(count == 1)		
                jQuery('#home a.down').css('visibility', 'visible').addClass('disabled');
        }  //IVK      
	
	}).mouseleave(function() {		
		jQuery('#home a.up').css('visibility', 'hidden');
		jQuery('#home a.down').css('visibility', 'hidden');		
	});
	
	jQuery('#home a.up.disabled, #home a.down.disabled').live('click', function(){
		return false;
	})
	
	/* underlining news text on hover in ie6 */
	if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6) {
		jQuery('.news-wrapper ul.text-list li a').hover(function() {
			jQuery(this).find('span.list-text').addClass('ie6Hover');
		}, function() {
			jQuery(this).find('span.list-text').removeClass('ie6Hover');	
		});	
	}
	
	/********************************************
	* clear search field on focus
	*********************************************/	
	
	jQuery('.clearOnFocus').clearOnFocus();
	
	
	/********************************************
	* accordions
	*********************************************/	
	
	jQuery('ul.accordion').accordion({
                        txt_open: VARS_ACCORDION_OPEN_ALL,
                        txt_close: VARS_ACCORDION_CLOSE_ALL
    });
	
	
	/********************************************
	* Fancybox (mst)
	*********************************************/
	
	
	/* show magnifier on hover */
	jQuery('.show-imageBox').hover(function(){
	
		var imageBoxWidth = jQuery(this).width();
		var imageBoxHeight = jQuery(this).height();	
	
		var magHoverTop = (imageBoxHeight)/2-36;
		var magHoverLeft = imageBoxWidth/2-36;		
		
		if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6) {
			jQuery(this).prepend('<img class="mag-hover" src="/images/_common/icons/magnifier-hover-ie6.gif"  style="border: none; position: absolute; left: '+magHoverLeft+'px; top:'+magHoverTop+'px;"/>');
		}
		else {
			jQuery(this).prepend('<img class="mag-hover" src="/images/_common/icons/magnifier-hover.png" style="border: none; position: absolute; left: '+magHoverLeft+'px; top:'+magHoverTop+'px;"/>');
		}
	}, function(){
		jQuery('.mag-hover').remove();	
	});
       
    jQuery('.show-layerBox').fancybox({
    	'width'				: 425,
    	'height'			: 242, /* mst */
    	'padding'			: 0,
        'autoScale'     	: false,
        'autoDimensions'	: true,
        'showCloseButton'	: false,
		'titleShow'			: false,
        'transitionIn'		: 'none',
    	'transitionOut'		: 'none',
    	'type'				: 'iframe',
    	'overlayColor'		: '#000',
    	'overlayOpacity'	: 0.4,
		'onStart'			: function(data) {
			jQuery('#fancybox-wrap').css({left: 'auto', marginLeft: '0'});
		},
    	'onComplete'		:	function() {
    		jQuery('#fancybox-frame').load(function () {
    			/* resize the fancybox-layer to the iframe-content-height */
    			var iframe_height = jQuery('#fancybox-frame').contents().find('body').height();
    			//jQuery('#fancybox-wrap, #fancybox-inner').height(iframe_height);
    			
    			jQuery('#fancybox-wrap, #fancybox-inner').animate({
    				height: iframe_height
    			}, 200);
    			
    			/* set the fix height for the innerbox */
    			var inner_height = jQuery('#fancybox-frame').contents().find('#layerBox .innerBox').height();
    			jQuery('#fancybox-frame').contents().find('#layerBox .innerBox').height(inner_height);
    		});
    	}
    });
    
    jQuery('#layerBox .close').click(function(){
    	parent.jQuery.fancybox.close();
		return false;
    });
	
		
	
	
	
	jQuery('#flashBox .close').click(function(){	
		parent.jQuery.fancybox.close();
		return false;
	});
	
		
	 jQuery('.show-imageBox').fancybox({
		'titleShow'			: true,
		'titlePosition'		: 'inside',
		'overlayColor'		: '#000',
    	'overlayOpacity'	: 0.4,
		'padding'			: 0,
		'autoScale'			: false,
		'autoDimensions'	: false,
		'showCloseButton'	: false,
		'content'			: function() {
			var imgPath = jQuery('body').data('imgUrl');			
			var img		= false;
			
			if (jQuery.browser.msie) {
				img = '<img src="'+imgPath+'" />';
			} else {
				img 	= new Image();
				img.src = imgPath;
			}
			
			jQuery(img).load(function() {
				jQuery('#fancybox-content').html('<div id="imageBox"><div class="container"><div class="innerBox"><a href="#" class="link close" title="close">&nbsp;</a></div></div></div>');
				jQuery('#fancybox-content .innerBox').append(jQuery(this));
				
				var imgWidth	= jQuery(this).width();
				var imgHeight 	= jQuery(this).height();				
				var newWidth 	= 0;
				
				if (imgWidth > 950) {
					newWidth = 950;
				}
				else {
					newWidth = imgWidth;				
				}
				
				var resize 	= newWidth/imgWidth;
				newHeight = Math.round(imgHeight*resize);
				
				jQuery('#fancybox-content img').css({height: newHeight, width: newWidth});
				jQuery('#fancybox-title').css({width: newWidth});				
				jQuery('#fancybox-wrap, #fancybox-content').css({height: newHeight+28+57, width: newWidth+28});
				
				if (jQuery('#util-nav').is(':animated')) {
					jQuery('#util-nav').stop(false, true);
				}
                
                jQuery('#fancybox-wrap').stop(true, true);
                jQuery.fancybox.center(true);
			});
		},
		'onStart'			: function(data) {
			jQuery('#fancybox-wrap').css({left: 'auto', marginLeft: '0'});
			var imgUrl = jQuery(data).attr('href');
			jQuery('body').data('imgUrl', imgUrl);
		}
	 });
	 
	 jQuery('#imageBox .close').live('click', function(){
    	jQuery.fancybox.close();
		return false;
    });
	 
	 // IE6-hover-fix for Teaser in the right colum
	 if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6) {
		 jQuery('.right-column .box.teaser').hover(function(){
			 jQuery(this).addClass('ie6Hover');
		 }, function(){
			 jQuery(this).removeClass('ie6Hover');
		 })
	 }
	 
	 
	 /********************************************
	* Tooltips
	*********************************************/
	 
	 jQuery(".glossary").tooltip({
		position: "bottom center",
		relative: true,
		offset: [10, 0],
		effect: "fade"
	});
	
	/********************************************
	* Tables
	*********************************************/
	jQuery('.data-highlight').hover(function(){
		jQuery(this).children().addClass('hovered');
	},function(){
		jQuery(this).children().removeClass('hovered');
	});
	
	/********************************************
	 * Media Libary Tooltip
	 ********************************************/
	jQuery('.media-item .image img').xtooltip();
	
	
	// footer --------------------------------------------------
	footerSelect("#sites-select"); 
    footerSelect("#business-select");
    
    
    /********************************************
	* Mainmenu: Hide Selectboxes in IE6
	*********************************************/
    if (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6) {
        /*
        jQuery('#mainnav>ul>li').mouseleave(
            function() {
                jQuery('select').css('visibility', 'visible');
            }
        ).mouseenter(
            function() {
                jQuery('select').css('visibility', 'hidden');
            }
        ); 
        */
		/*
        jQuery('#mainnav>ul>li').live('mouseleave',
            function() {
                // jQuery('select').css('visibility', 'visible');
                showSelectBoxes();
            }
        ).live('mouseenter',
            function() {
                // jQuery('select').css('visibility', 'hidden');
                hideSelectBoxes();
            }
        );
		*/
		
		jQuery("#mainnav>ul>li ul").bgiframe();
		
		jQuery("#country-selector>ul>li>ul").bgiframe();

    }
    
    
    if (isTestCall()) alert('Dom Ready - DONE');
}

function showSelectBoxes(){
	var selects = document.getElementsByTagName("select");
	for (i = 0; i != selects.length; i++) {
		selects[i].style.visibility = "visible";
	}
}

function hideSelectBoxes(){
	var selects = document.getElementsByTagName("select");
	for (i = 0; i != selects.length; i++) {
		selects[i].style.visibility = "hidden";
	}
}


/* Sharing functionality */
var d = document, l = top.location, e = encodeURIComponent, t = top.document;
var share_this = {
	to: function (service) {
		switch(service) {
			case 'facebook':
				 this.addto_facebook();
				break;
			case 'myspace':
				 this.addto_myspace();
				break;
			case 'digg':
				 this.addto_digg();
				break;
			case 'delicious':
				 this.addto_delicious();
				break;
			case 'stumbleupon':
				 this.addto_stumbleupon();
				break;
			case 'twitter':
				 this.addto_twitter();
				break;
			case 'google':
				 this.addto_google();
				break;
			/*
			case 'orkut':
				 this.addto_orkut();
				break;
			*/
			case 'linkedin':
				 this.addto_linkedin();
				break;
			case 'xing':
				 this.addto_xing();
				break;
			default: 
				return true;
		}
		return false;
	},				
	addto_facebook: function () {
		var s = 'http://www.facebook.com/share', p = '.php?u=' + e(l.href) + '&t=' + e(t.title);
		if (!window.open(s + 'r' + p, 'sharer', 'toolbar=0,status=0,resizable=1,width=626,height=436'))
			l.href = s + p;
	},				
	addto_myspace: function () {
		this.add_action('http://www.myspace.com/', 'index.cfm?fuseaction=postto&u' + e(l.href) + '&t=' + e(t.title));
	},
	addto_digg: function () {
		this.add_action('http://digg.com/', 'submit?phase=2&url=' + e(l.href) + '&title=' + e(t.title));					
	},
	addto_delicious: function () {
		this.add_action('https://delicious.com/save?v=5&noui&jump=close&url=' + e(l.href) + '&title=' + e(t.title));					
	},
	addto_stumbleupon: function () {
		this.add_action('http://www.stumbleupon.com/', 'submit?url=' + e(l.href) + '&title=' + e(t.title));					
	},
	addto_twitter: function () {
		this.add_action('https://twitter.com/', 'share?url=' + e(l.href) + '&text=' + e(t.title));					
	},
	addto_google: function () {
		this.add_action('http://plus.google.com/', 'share?url=' + e(l.href));					
	},
	/*
	addto_orkut: function () {
		this.add_action('http://promote.orkut.com/', 'preview?nt=orkut.com&tt=' + e(t.title) + '&du=' + e(l.href) );					
	},
	*/
	addto_linkedin: function () {
		this.add_action('http://www.linkedin.com/', 'shareArticle?mini=true&url=' + e(l.href) + '&title=' + e(t.title));					
	},
	addto_xing: function () {
		this.add_action('https://www.xing.com/social_plugins/share?url=' + e(l.href) + "&wtmc=XING" );					
	},
	add_action: function(s, p) {
		
		if (!p){
			if (!window.open(s , '_blank', ''))
			l.href = s;
			return;
		}
		
		if (!window.open(s + p, '_blank', ''))
			l.href = s + p;
	}
};


// preloading images for the 3Rs
(function($) {
  var cache = [];
  // Arguments are image paths relative to the current page.
  $.preLoadImages = function() {
    var args_len = arguments.length;
    for (var i = args_len; i--;) {
      var cacheImage = document.createElement('img');
      cacheImage.src = arguments[i];
      cache.push(cacheImage);		 
    }
  }
})(jQuery)


jQuery.fn.clearOnFocus = function() {
	return this.focus(function() {
		if( this.value == this.defaultValue ) {
			this.value = "";
		}
	}).blur(function() {
		if( !this.value.length ) {
			this.value = this.defaultValue;
		}
	});
};

jQuery.cookie = function (key, value, options) {
    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = jQuery.extend({}, options);

        if (value === null) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? String(value) : encodeURIComponent(String(value)),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }
    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};


(function($) {
	$.fn.xtooltip = function(options) {
		// Standart-Setup
		var defaults = {
			speed: 200,
			delay: 300
		};
		
		var options = $.extend(defaults, options);
	
		get_xtooltip = function() {
			var xtt_construct = '<div class="media-item-tooltip">'
									+'<div class="shadow">'
										+'<div class="outer">'
											+'<div class="container">'
												+'<div class="image"></div>'
												+'<div class="headline"></div>'
												+'<div class="description"></div>'
											+'</div>'
										+'</div>'
									+'</div>'
								+'</div>';
			return xtt_construct;
		}
		
		$('body').prepend(get_xtooltip());
	
		return this.each(function() {
			var obj			= $(this);
			var xtooltip	= $('div.media-item-tooltip');
			
			obj.hover(function() {				
				var xtt_content		= $(this).parent().parent().parent();
				var xtt_image		= $(xtt_content).find('.image a').attr('href');
				var xtt_headline	= $(xtt_content).find('.headline').html();
				var xtt_description	= $(xtt_content).find('.description').html();
				
				xtooltip.find('.headline').html(xtt_headline);
				xtooltip.find('.description').html(xtt_description);

				
				var img 	= new Image();
				$(img).load(function (){
					xtooltip.find('.image').html(' ').append($(this));
					var img_width	= $(this).attr('width');
					var img_height 	= $(this).attr('height');
					xtooltip.find('.image img').css({width: img_width, height: img_height});
					
					set_xtooltip(obj);
					setTimer();
				}).attr('src', xtt_image);;
				
				
			}, function() {				
				stopTimer();
				xtooltip.hide();
				
			});
			
			setTimer = function() {
				obj.show_xtooltip_timer = setTimeout("show_xtooltip()", defaults.delay);
			}
					
			stopTimer = function() {
				clearTimeout(obj.show_xtooltip_timer);
			}
	
			set_xtooltip = function(obj) {
				var obj_offset		= obj.offset();
				var obj_left		= obj_offset.left;
				var obj_top			= obj_offset.top;
				var xtt_outerHeight	= xtooltip.outerHeight(true);
				var xtt_left		= obj_left + 136;
				var xtt_top			= obj_top - (xtt_outerHeight/2) + 70;
				
				if (obj.parentsUntil('.media-item-section').hasClass('n4')) {
					xtt_left		= obj_left - 300;
				}
				
				xtooltip.css({
					'top': xtt_top+'px',
					'left': xtt_left+'px'
				});
			}
			
			show_xtooltip = function() {
				stopTimer();
				xtooltip.animate({
					"opacity": "toggle"
				}, defaults.speed);
			}
		});
	};
})(jQuery);



function openExternalLink(href, target) {
  var newwin = window.open('/util/exit-notice.shtml?url=' + encodeURIComponent(href) + '&target=' + encodeURIComponent(target),'openlink','width=420,height=199,screenX=100,screenY=100,top=100,left=100,resizable=yes,toolbar=no,scrollbars=no')
  newwin.focus();
}

function setupExternalLinks() {
	var links = document.getElementsByTagName('a');
	for (var i = links.length; i != 0; i--) {
		var a = links[i-1];
		if (!a.href) continue;
		domain = a.href.split("?");	
			
		if (domain[0].indexOf('http') != -1 &&
		domain[0].indexOf(window.location.hostname) == -1 &&
		!excludeUrl(domain[0])) {
			a.onclick = function() {
				openExternalLink(this.href, this.target);
				return false;
			}
		}
	}
}

var excludeUrls = Array();
function excludeUrl(url){
  re = /www./gi;
  for(var l = 0; l < excludeUrls.length; l++){
	if(url.indexOf(excludeUrls[l]) == 0 || url.indexOf(excludeUrls[l].replace(re, "")) == 0){
	  return true;
	}
  }
  return false;
}

function detectFlashShowLayer(version, layer, flashlayer) {
	var playerVersion = swfobject.getFlashPlayerVersion(); // returns a JavaScript object
	var majorVersion = playerVersion.major; // access the major, minor and release version numbers via their respective properties
	
	if (majorVersion < version) {
		layer.show();
	} else {
		flashlayer.show();
	}
}

function footerSelect(sel){
    jQuery(sel).find('button').click(function(){ 
            var val = jQuery(this).parent().find('select').val(); 
            if (val != "") window.open(val); 
            return false; 
        });
}

/*
function detectFlashShowLayer(version, layer, flashlayer) {
	var versionObj = deconcept.SWFObjectUtil.getPlayerVersion();
	if (versionObj['major'] < version) {
		layer.show();
	} else {
		flashlayer.show();
	}
}
*/
