(function($){ 
     $.fn.extend({  
         accordion: function(options) {       
            $.fn.accordion.defaults = {
					container_selector: '.accordion_box',
					links_selector: 'li.acc>a',  /* li.acc>a if only a-tag or li.acc>hx if h-tag around a-tag */
					li_selector: 'li.acc',
					contents_selector: 'ul.acc_sub, div.acc_sub',
					current_selector: 'li.current',
					link_highlight_class: 'highlight',
					li_highlight_class: 'active',
					open_selector: 'a.show_all_accordion',
					txt_open: 'Expand all',
					txt_close: 'Collapse all',
					count_li: -1,
					close_other: false,
                    url_param: 'condition'
			};
			
			// build main options before element iteration
			var opts = $.extend({}, $.fn.accordion.defaults, options);
			
			// get link tag out of links_selector
			var link_tag = opts.links_selector.split(">")[1];
			
			return this.each(function() {
				if($(this).data('accordiated'))
					return false;									
				$.each($(this).find(opts.contents_selector), function(){
					$(this).data('accordiated', true);
					$(this).hide();
				});
				$.each($(this).find(opts.links_selector), function(){				
					$(this).click(function(e){	
						if (opts.close_other) activate(e.target, 'slideToggle','',true);
						//else activate(e.target, 'slideToggle', 'parents', false);
						else activate(e.target, 'slideToggle','',false);
						return false;
					});
				});
				
				//open selected item------
				var active = false;
				var active_pos = parseInt(grab_param(opts.url_param, window.location.search));
                
                if(active_pos != "" && active_pos > 0 && active_pos <= $(this).find(opts.links_selector).size() ) {
					active = $(this).find(opts.links_selector).eq(active_pos-1);
                    //active = $(this).find('a[href=' + location.hash + ']')[0];
				} else {				
					if($(this).find(opts.current_selector).length > 0) {
						//active = $(this).find(opts.current_selector+' a')[0]; // open only one with current_selector on load
						active = $(this).find(opts.current_selector+' a'); // open all with current_selector on load
						//2nd level?
						if ($(active).parent().find(opts.current_selector).length > 0) active = $(active).parent().find(opts.current_selector+' a')[0];
					}
				}		
				
				if(active){
					activate(active, 'toggle','parents', true);
					$(active).parents().show();
				}
				
				//init show all button -----------------------------------------
				opts.count_li = $(this).find(opts.links_selector).length;	
				
				//$(opts.open_selector).click(function(e){	
				$(this).parents(opts.container_selector).find(opts.open_selector).click(function(e){
						showAll(e.target);
						return false;
				});
				
				
				function activate(el,effect,parents, close_other){
		
					var liTag = $(el)[(parents || 'parent')](opts.li_selector);	
					
					if (close_other) liTag.siblings().children('a').removeClass(opts.link_highlight_class);
					liTag.toggleClass(opts.li_highlight_class);
					if (close_other) liTag.siblings().removeClass(opts.li_highlight_class).children(opts.contents_selector).slideUp('fast');
	
	
					if(link_tag == 'a') {
						$(el).siblings(opts.contents_selector)[(effect || 'slideToggle')]((!effect)?'fast':'fast');
						liTag.find('>a').toggleClass(opts.link_highlight_class);
					}
					else {
						$(el).parent().siblings(opts.contents_selector)[(effect || 'slideToggle')]((!effect)?'fast':'fast');							
						$(el).parent().children(link_tag).toggleClass(opts.link_highlight_class);
					}
					
					/*************************************/
					
					updateShowAllBtn(el);
				}
				
				function showAll(el) {	
					
					var elem = $(el);
					
					//alert(elem.parent().parent().parent().html()); // -> accordion_box !
										
					var open = elem.hasClass(opts.link_highlight_class); 
					
					if (open) {
						//close
						elem.html(opts.txt_open);					
						if($(el).hasClass('close_all')) {$(el).removeClass('close_all')};						
						elem.parent().parent().parent().find(opts.li_selector).removeClass(opts.li_highlight_class).find(link_tag).removeClass(opts.link_highlight_class).siblings(opts.contents_selector).slideUp('fast');
						
						//$(opts.li_selector).removeClass(opts.li_highlight_class).find(link_tag).removeClass(opts.link_highlight_class).siblings(opts.contents_selector).slideUp('fast');
					} else {
						//open
						elem.html(opts.txt_close);
						$(el).addClass('close_all');
						
						elem.parent().parent().parent().find(opts.li_selector).addClass(opts.li_highlight_class).find(link_tag).addClass(opts.link_highlight_class).siblings(opts.contents_selector).slideDown('fast');
						
						//$(opts.li_selector).addClass(opts.li_highlight_class).find(link_tag).addClass(opts.link_highlight_class).siblings(opts.contents_selector).slideDown('fast');
					}
					
					elem.toggleClass(opts.link_highlight_class);
				}
				
				function updateShowAllBtn(el) {
					var elem = $(el);
					var list_el = elem.parent().parent().parent();
					var currentCount =  list_el.find(opts.li_selector+"."+opts.li_highlight_class).length;
					
					if (currentCount == 0) {
						list_el.find(opts.open_selector).removeClass(opts.link_highlight_class).removeClass('close_all').html(opts.txt_open);
					}

					if (currentCount == opts.count_li) {
						list_el.find(opts.open_selector).addClass(opts.link_highlight_class).addClass('close_all').html(opts.txt_close);
					}					
				}
                
                function grab_param(name,url){
                  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
                  var regexS = "[\\?&]"+name+"=([^&#]*)";
                  var regex = new RegExp( regexS );
                  var results = regex.exec( url );
                  if( results == null )
                    return "";
                  else
                    return results[1];
                }

				
            });
        } 
    }); 
})(jQuery);

