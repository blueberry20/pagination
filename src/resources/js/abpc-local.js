var abpcPlgns;
if (!abpcPlgns) abpcPlgns = {};
// START reBrand.plgns on DOM ready
// ============================================================
abpcPlgns = {
    options: {
        initialtab: 2
    },
    setOptions: function(optsObj) {
        if (!optsObj) return;
        for (var optName in optsObj) {
            this.options[optName] = optsObj[optName];
        }
    },
    init: function() {
        var self = this;
        $("#abpc-tabs-second-set").tabs({
            //collapsible: true,
            active: self.options.initialtab
        });
        //start US PC
       /* $("#abpc-tabs-vehicles-set").tabs({
            collapsible: true,
           active: 0
        });*/
        $("#abpc-tabs-first-charts").tabs({
            //collapsible: true,
            active: 0
        });
        $("#abpc-tabs-second-charts").tabs({
            //collapsible: true,
            active: 0
        });
       
       
        //checkboxes for Literature
        /*
        checked = $(".abpc-lit-block input:checked").length;
        $('.abpc-floating-footer .abps-checked').html(checked)
        $(":checkbox").on('click', function() {
            count = $(".abpc-lit-block input[type='checkbox']").length;		
            $('.abpc-floating-footer .abps-checked').html($(".abpc-lit-block input:checked").length)
            alert(checked)
        })*/
       
       
       
        $(".abpc-collapse-trigger").on('click', function() {
            $("#abpc-dropdown-collapse").toggleClass('show-dropdown')
        })
       
      $("#abpc-tabs-lit-type").tabs({
            //collapsible: true,
           active: 0
       });

        
      /*  $("#mf-accordion").accordion({
            collapsible: true,
            heightStyle: "content"
        });*/

        /*$("#mf-prod-accordion").accordion({ 
            collapsible: true,
            heightStyle: "content"
        });*/


       /* $(".abpc-btn-emailshare").on('click', function() {
			$('.abpc-overlay-email').addClass('ab-fade-in-keys')
		})
		$(".abpc-dialog-close").on('click', function() {
			$('.abpc-overlay-email').removeClass('ab-fade-in-keys').addClass('.ab-fade-out-keys');
		})*/
        //end US PC
        reBrandPlgns.stickyNavigation('.abpc-product-utility-bar');
        this.top_bar_listener();
    },
    init_accordion: function(num) {},
    has_fixed: function() {
        if ($(".fixed").length > 0) {
            return true
        } else return false;
    },
    top_bar_listener: function() {
        var self = this;
        $('.abpc-utility-nav li').off('click');
        $('.abpc-utility-nav li').each(function(index, element) {
            $(element).on('click', function() {
                $('.abpc-li-active').removeClass('abpc-li-active');
                $(this).addClass('abpc-li-active');
                var thresh = $('.abpc-product-utility-bar').outerHeight(true) + $('.ab-local-nav').outerHeight(true)
                var ele = $('.abpc-anchor-link').eq(index);
                self.top_bar_animation(ele, thresh, index)
            })
        });
    },
    top_bar_animation: function(ele, thresh, i) {
        var self = this;
        if (!this.has_fixed() && i == 0) {
            return false;
        }
        $('html,body').animate({
            scrollTop: ele.offset().top - thresh
        }, 300, function() {
            if (!self.has_fixed() && i == 0) {
                return false;
            }
            $('html,body').animate({
                scrollTop: ele.offset().top - ($('.abpc-product-utility-bar.fixed').outerHeight(true) + $('.ab-local-nav.fixed').outerHeight(true))
            }, 300, function() {});
        });
    }
}
var abpcInputDisable;
if (!abpcInputDisable) abpcInputDisable = {};
abpcInputDisable = {
    options: {
        id: null
    },
    setOptions: function(optsObj) {
        if (!optsObj) return;
        for (var optName in optsObj) {
            this.options[optName] = optsObj[optName];
        }
    },
    init: function() {
        setTimeout(function() {
            $('input.highcharts-range-selector').attr('disabled', 'disabled');
            $('input.highcharts-range-selector').off('click');
        }, 500);
    },
    addhideyieldtab: function() {
        var addHtml = '<li class="yield"><a class="abpc-translate" data-rel="FD_YIELD_AND_DISTRIBUTION_NAV" href="javascript:;">Yield and Distribution</a></li>';
        if ($('.abpc-utility-nav').find('li.yield').length <= 0) {
            $(addHtml).insertAfter($('.abpc-utility-nav li:nth-child(2)'));
            abpcInputDisable.hightlightUtilityBar();
            abpcPlgns.top_bar_listener();
        }
        $('.abpc-yield-footnote').show();
    },
    hideyieldtab: function() {
        $('.abpc-utility-nav').find('li.yield').remove();
        $('.abpc-yield-footnote').hide();
        abpcInputDisable.hightlightUtilityBar();
        abpcPlgns.top_bar_listener();
    },
    has_fixed: function() {
        if ($(".ab-local-nav.fixed").length > 0) {
            return true
        } else return false;
    },
    hightlightUtilityBar: function() {
        var self = this;
        const mq = window.matchMedia("(max-width: 1023px)");
        $(window).scroll(function() {
            var reposition = $('.abpc-product-utility-bar').outerHeight(true) + $('.ab-local-nav').outerHeight(true);
            if (!mq.matches) {
                if (self.has_fixed()) {
                    $('.abpc-objective-zone').css('margin-top', reposition);
                } else {
                    $('.abpc-objective-zone').css('margin-top', '0px');
                }
            }
            $('.abpc-anchor-link').each(function(index, element) {
                var nav_bottom = $('.abpc-utility-nav').offset().top + $('.abpc-utility-nav').outerHeight(true)
                var ele_top = $(element).offset().top;
                if (ele_top - nav_bottom < 70) {
                    $('.abpc-li-active').removeClass('abpc-li-active');
                    $('.abpc-utility-nav li').eq(index).addClass('abpc-li-active');
                }
            });
        })
    },
    repositionForSmallScreen: function() {
        const mq = window.matchMedia("(max-width: 1023px)");
        if (mq.matches) {
            $('.abpc-objective-zone').css('margin-top', '0px');
        }
    }
}
var abpcFundFilter;
if (!abpcFundFilter) abpcFundFilter = {};
abpcFundFilter = {
    options: {
        mainfilerclass: '.abpc-filter',
        filters: '.abpc-filter-box',
        activefilter: '.abpc-filter .ab-col-6.active',
        cheboxclass: '.abpc-checkbox',
        clearfilterclass: '.abpc-clear-filter',
        textupdate: '.abpc-filter .ab-col-6.active > .abpc-filter-box > header > p',
        alltextupdate: '.abpc-filter .abpc-filter-box > header > p',
        checkboxcount: 0
    },
    setOptions: function(optsObj) {
        if (!optsObj) return;
        for (var optName in optsObj) {
            this.options[optName] = optsObj[optName];
        }
    },
    init: function() {
        this.reset_filters();
        this.set_filters();
        //this.update_selection();
        this.clear_selection();
    },
    set_filters: function() {
        var self = this;
        $(self.options.filters).each(function(index, element) {
            $(element).on('click', function() {
                $(self.options.filters).parent().not(':eq(' + index + ')').removeClass('active');
                $(this).parent().toggleClass('active');
            });
        });
    },
    reset_filters: function() {
        var self = this;
        $('.abpc-filter-box').on('click', function(e) {
            e.stopPropagation();
        });
        $('html, body').not(self.options.filters).on('click', function(e) {
            $(self.options.filters).parent().removeClass('active');
        });
    },
    update_text: function(count) {
        var self = this;
        if ($.isNumeric(count)) {
            if (count > 0) {
                $(self.options.textupdate).html(count + ' active filters');
            } else {
                $(self.options.textupdate).html('No filters applied')
            }
        } else {
            $(self.options.alltextupdate).html('No filters applied')
        }
    },
    update_selection: function() {
        var self = this;
        $(self.options.cheboxclass).click(function() {
            self.options.checkboxcount = 0;
            $(self.options.activefilter + ' ' + self.options.cheboxclass).each(function() {
                if ($(this).is(':checked')) {
                    self.options.checkboxcount = self.options.checkboxcount + 1;
                }
            });
            self.update_text(self.options.checkboxcount);
        });
    },
    clear_selection: function() {
        var self = this;
        $($(self.options.clearfilterclass)).on('click', function() {
            var dataid = $(this).data('id');
            if (dataid == 'all') {
                $(self.options.mainfilerclass).find(self.options.cheboxclass).attr('checked', false);
                //self.update_text('all');
            } else {
                $(self.options.clearfilterclass).parent().find(self.options.cheboxclass).attr('checked', false);
                //self.update_text(0);
            }
        });
    }
}
$(function() {
   abpcPlgns.init();
    abpcInputDisable.hightlightUtilityBar();
    if (currentSegment === '0') {
        if (abQueryString.getCookie('abFrontEndSeg') == '') {
            globalWAY.displaySelection();
        } else {
            globalWAY.segId(abQueryString.getCookie('abFrontEndSeg'));
        }
    } else {
        globalWAY.login_or_terms(['3'], window.location.href, '_self', 'link');
    }
    $('#abpc-search-input').keydown(function(event) {
        var x = event.which || event.keyCode;
        if (x == 13) {
            event.preventDefault();
            return false;
        }
    });
    abRtl.FundsSearch.init({
        'hostname': '/sites/api_service/Fundexplorer',
        'urlString': '/GetSearchBoxResults?searchTerm=',
        'element': '#abpc-search-input'
    });
    $(window).resize(function() {
        abpcInputDisable.repositionForSmallScreen();
    });
});
$(window).load(function() {
   /* $('.uspc-filter-box').on('click', function(event) {
        $(this).parent().find('ul').toggle()
    })*/
    $('.abpc-uspc-filters span').on('click', function(event) {
       // $('.uspc-filter-box-dropdown').hide()
    })

    $('.abpc-utility-nav li').eq(0).addClass('abpc-li-active');
    
})