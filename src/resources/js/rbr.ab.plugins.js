if (document.getElementsByTagName) {
    var inputElements = document.getElementsByTagName('input');
    for (i = 0; inputElements[i]; i++) {
        inputElements[i].setAttribute('autocomplete', 'off');
    }
}
/* ========================================================================
 * reBrand.plgns: August 2014
 * Copyright 2014 AllianceBenstein
 *
 * ======================================================================== */
// <IE9 indexOf() fix
if (!Array.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0); i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}
/* ========================================================================
 * Created By Sam on August 2017 	
 * We have multiple scenario when we are setting Previous and Search URL as 
 * cookie to redirect user when the close login or Terms and condition popup. 
 * ======================================================================== */
if (typeof setPrevAndResearchCookie !== 'function') {
    var setPrevAndResearchCookie = function() {
        if (abQueryString.getCookie('researchURL')) {
            window.location = abQueryString.getCookie('researchURL');
        } else {
            if (abQueryString.getCookie('previousURL')) {
                window.location = abQueryString.getCookie('previousURL');
            } else {
                window.location = absegmenturl;
            }
        }
    }
}
var abpopupPlugin;
if (!abpopupPlugin) abpopupPlugin = {};
abpopupPlugin = {
    int: function(initialObject) {
        initialObject.options.docheight = $(document).height();
        initialObject.options.docwidth = $(document).width();
        initialObject.options.winheight = $(window).height();
        initialObject.options.winwidth = $(window).width();
        initialObject.options.scrollTop = $(window).scrollTop();
    },
    updateBox: function(videoHeight, videoWidth, initialObject) {
        var videoHeight = videoHeight;
        var videoWidth = videoWidth;
        var screenWidth = $(window).width() * 0.9,
            screenHeight = $(window).height() * 0.9;
        if (videoWidth > screenWidth || videoHeight > screenHeight) {
            var ratio = videoWidth / videoHeight > screenWidth / screenHeight ? videoWidth / screenWidth : videoHeight / screenHeight;
            videoWidth /= ratio;
            videoHeight /= ratio;
        }
        $(initialObject.options.contentBox).css({
            'width': videoWidth + 'px',
            'top': '100px',
            'left': ($(window).width() - videoWidth) / 2 + 'px'
        });
    },
    updateCss: function(initialObject) {
        $(initialObject.options.overLayclass).css({
            'width': initialObject.options.winwidth + 'px',
            'height': initialObject.options.docheight + 'px'
        });
        $(initialObject.options.windowBox).css({
            'width': initialObject.options.winwidth + 'px',
            'height': initialObject.options.winheight + 'px',
            'top': initialObject.options.scrollTop + 'px'
        });
    },
    showBid: function(initialObject, resizeBol) {
        abpopupPlugin.int(initialObject);
        if (!resizeBol) {
            $(initialObject.options.overLayclass).show();
        }
        abpopupPlugin.updateCss(initialObject);
        abpopupPlugin.updateBox(initialObject.options.descHeight, initialObject.options.descWidth, initialObject);
    },
    close: function(initialObject) {
        $(initialObject.options.id).fadeOut(300, "linear", function() {
            $(initialObject.options.id).html('');
            $(initialObject.options.overLayclass).hide();
        });
    },
    animatePopup: function(initialObject, filepath, callBackFn) {
        $(initialObject.options.id).fadeOut(300, "linear", function() {
            $(initialObject.options.id).html('');
            $(initialObject.options.id).load(filepath, function() {
                $('html, body').animate({
                    scrollTop: 0
                }, 100, function() {
                    abpopupPlugin.showBid(initialObject, false);
                });
                setTimeout(function() {
                    $(initialObject.options.id).fadeIn(300, "linear", callBackFn);
                }, 300);
            });
        });
    }
}
var abValidation;
if (!abValidation) abValidation = {};
abValidation = {
    emailValidation: function(email) {
        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    },
    validatePassword: function(password) {
        var passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordReg.test(password);
    },
    validateZipcode: function(zipcode) {
        var zipcodeReg = /^\d{5}$/;
        return zipcodeReg.test(zipcode);
    },
    validatePhone: function(phone) {
        var phoneReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneReg.test(phone);
    },
    validateName: function(name) {
        var newName = $.trim(name);
        var nameReg = /^[A-Za-z\-\'\.\,\/\&\ ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏàáâãäåæçèéêëìíîïÐÑÒÓÔÕÖØÙÚÛÜÝÞßðñòóôõöøùúûüýþÿs]+$/;
        return nameReg.test(newName);
    },
    checkEmptyField: function(requiredClass, errorClass, currentObject) {
        $(requiredClass).each(function(index, element) {
            var currentVal = $(element).val();
            var trimVal = currentVal.trim();
            if (trimVal.length == 0) {
                $(element).parent().addClass(errorClass);
                currentObject.options.frm_value = false;
            } else {
                $(element).parent().removeClass(errorClass);
                currentObject.options.frm_value = true;
            }
        });
    },
    removeError: function(inputClass, errorClass) {
        $(inputClass + ' input').each(function(index, element) {
            $(element).parent().removeClass('abui-a-error-input');
        });
    },
    onFocusRemoveError: function(element, removingClass) {
        $(element).parent().removeClass(removingClass);
    },
    addError: function(element, errorClass, currentObject) {
        $(element).parent().addClass(errorClass);
        currentObject.options.frm_value = false;
    },
    ajaxRequest: function(retype, url, data_type, data_value, callback) {
        $.ajax({
            type: retype,
            url: url,
            dataType: data_type,
            data: data_value,
            contentType: "application/json;charset=utf-8",
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                try {
                    console.log("Request: " + XMLHttpRequest.toString() + "\n\nStatus: " + textStatus + "\n\nError: " + errorThrown);
                } catch (e) {}
            },
            success: callback
        });
    }
}
var reBrandPlgns;
if (!reBrandPlgns) reBrandPlgns = {};
(function($) {
    $(function() {
        // START reBrand.plgns on DOM ready
        // ============================================================
        reBrandPlgns = {
            options: {
                speed: 500,
                subnav: '',
                subsubnav: '.subsub-wrapper',
                rowmobile: '.row-offcanvas-mbl',
                fixednav: 50
            },
            initializeDesktop: function(ops) {
                this.setOptions(ops);
                this.initMainMenu();
                this.triggerAccountAccess('.ab-header-account-access');
                this.stickyNavigation('.ab-local-desktop');
            },
            initializeMobile: function(ops) {
                this.setOptions(ops);
                this.initMobileMainMenu();
            },
            setOptions: function(optsObj) {
                if (!optsObj) return;
                for (var optName in optsObj) {
                    this.options[optName] = optsObj[optName];
                }
            },
            _get_index: function(ele, parent) {
                return $(ele).prevAll(parent).length;
            },
            is_offcanvas: function(ele, css) {
                if ($(ele).hasClass(css)) return true;
            },
            initSubMenus: function(event) {
                var $target = $('.subnav').eq($(event.target).parent().prevAll('.toggle-menu').length);
                if ($(event.target)[0].tagName != "SPAN") {
                    $target = $('.subnav').eq($(event.target).parent().parent().prevAll('.toggle-menu').length);
                }
                this.showSubMenus($($target));
            },
            initSubSubMenus: function(css, event) {
                $('.toggle-submenu span').removeClass('ab-active-link')
                $(event.target).addClass('ab-active-link');
                var index = $('.subnav.active').index();
                var i = $(event.target).parent().index();
                this.showSubSubMenus(index, $(event.target).parent(), i);
            },
            initMainMenu: function() {
                var self = this;
                $('.navbar-toggle').bind('click', function() {
                    self.masterReset();
                    submenu.closeSubmenu();
                    $('.ab-navbar-collapse').slideToggle('slow', function() {
                        if ($(this).is(":visible")) {
                            $('.navbar-toggle').addClass('open');
                            $('.ab-msg-default').show("slide", {
                                direction: "left"
                            }, self.options.speed);
                            $('.ab-tips-info').hide();
                        } else {
                            $('.navbar-toggle').removeClass('open');
                            $('.ab-tips-info').show();
                            self.options.fixednav = $('.ab-local-desktop').offset().top;
                        }
                    });
                });
            },
            initMobileMainMenu: function() {
                var self = this;
                var offcanvas = this.options.rowmobile;
                $('.ab-gm-trigger').bind('click', function() {
                    $('.ab-col-mbl').toggleClass('set-overflow');
                    $(offcanvas).add('.nav-mbl').toggleClass('ab-toggle-mobilemenu');
                    if (self.is_offcanvas(offcanvas, 'active') == true) {
                        $(offcanvas).add('.nav-mbl').removeClass('active').addClass('ab-toggle-mobilemenu');
                        $('.ab-col-mbl').addClass('set-overflow');
                    }
                    if ($('.nav-mbl').hasClass('ab-toggle-mobilemenu')) {
                        $('.ab-mbl-page-container').hide();
                    } else {
                        $('.ab-mbl-page-container').show();
                    }
                    if ($('.row-offcanvas-mbl').hasClass('ab-toggle-mobilemenu')) {
                        var menuHeight = $('.ab-mbl-menu').height();
                        $(offcanvas).css({
                            'height': menuHeight + 'px'
                        });
                    } else {
                        $(offcanvas).css({
                            'height': 'auto'
                        });
                    }
                });
                $('.ab-search-trigger').bind('click', function() {
                    $('.ab-mbl-header').addClass('active-search');
                });
                $('.btn-mbl-cancel').bind('click', function() {
                    $('.ab-mbl-header').removeClass('active-search');
                });
            },
            firstTimeGlobalNav: function(ele) {
                var self = this;
                if ($.cookie('FT_nav') && $.cookie('FT_nav') == 1) {
                    $(ele).addClass('visited')
                } else {
                    setTimeout(function() {
                        self.closeMenu()
                    }, 3000);
                    $.cookie('FT_nav', 1, {
                        expires: 20 * 365,
                        path: '/'
                    });
                }
            },
            showSubMenus: function(ele) {
                var self = this;
                if ($(ele).is(":hidden")) {
                    this.resetSubMenus('desktop');
                    $(ele).show("slide", {
                        direction: "left"
                    }, self.options.speed, function() {}).addClass('active');
                }
            },
            showMobileSubMenus: function(ele) {
                this.resetSubMenus('mobile');
                $(ele).show().addClass('active');
            },
            showSubSubMenus: function(index, parent, ele) {
                var self = this;
                this.resetSubSubMenus(index);
                $(this.options.subsubnav).eq(index).find(' > div').eq(ele).fadeIn()
            },
            resetSubMenus: function(env) {
                var self = this;
                if (env == 'mobile') {
                    $('.subnav').hide().removeClass('active');
                } else if (env == 'desktop') {
                    $('.subnav').hide("slide", {
                        direction: "right"
                    }, self.options.speed).removeClass('active');
                }
            },
            resetSubSubMenus: function(index) {
                var sbmnu = this.options.subsubnav;
                $(sbmnu).hide().eq(index).show();
                $(sbmnu).eq(index).find(' > div').hide();
            },
            masterReset: function() {
                var sbmnu = this.options.subsubnav;
                $(sbmnu).hide();
                $('.subnav').hide();
                $('span').removeClass('ab-active-link');
                $('.ab-msg-default h2').html('AHEAD OF TOMORROW<span style="font-family: KlavikaWebBasicLight, Arial, Helvetica, sans-serif; font-size:0.95em;">®');
                $('.ab-msg-default p').html('Every day brings a new set of investment challenges and opportunities. We bring together unique global insight, expertise and innovation to keep our clients AHEAD OF TOMORROW.<span style="font-family: KlavikaWebBasicLight, Arial, Helvetica, sans-serif; font-size:0.95em;">®</span>');
            },
            toggleMarketingMsg: function(event, link_name, description) {
                if (!$(event.target).hasClass('ab-active-link')) {
                    var sbmnu = this.options.subsubnav;
                    $(sbmnu).hide();
                    $('.ab-msg-default h2').html(link_name);
                    $('.ab-msg-default p').html(description);
                    $('.ab-msg-default').fadeIn();
                    $('span').removeClass('ab-active-link');
                }
                if ($(event.target)[0].tagName === "SPAN") {
                    $(event.target).addClass('ab-active-link');
                } else {
                    if ($(event.target)[0].tagName === "I") {
                        $(event.target).parent().addClass('ab-active-link');
                    };
                };
            },
            triggerAccountAccess: function(ele) {
                $(ele).bind('click', function() {
                    if ($('.ab-navbar-collapse').is(":hidden")) {
                        $('.navbar-toggle').trigger('click');
                        $('.btn-account-access span').trigger('click');
                    } else $('.btn-account-access span').trigger('click');
                })
            },
            initMobileSubMenus: function(event) {
                var $target = $('.subnav').eq($(event.target).parent().prevAll('.toggle-menu').length);
                //to allow a child node for style purposes in Context | The AB Blog
                if ($(event.target)[0].tagName != "SPAN") {
                    $target = $('.subnav').eq($(event.target).parent().parent().prevAll('.toggle-menu').length);
                }
                this.showMobileSubMenus($($target));
                $('.row-offcanvas-mbl').add('.nav-mbl').addClass('active');
            },
            initMobileLocalSubMenus: function(event) {
                var $target = $('.subnav').eq($(event.target).parent().parent().prevAll('.toggle-menu').length);
                this.showMobileSubMenus($($target));
                $('.row-offcanvas-mbl').add('.nav-mbl').addClass('active');
                var subMenuHeight = $('.ab-mbl-submenu').height();
                $(reBrandPlgns.options.rowmobile).css({
                    'height': subMenuHeight + 'px'
                });
            },
            closeMenu: function() {
                var self = this;
                $('.ab-navbar-collapse').slideUp('slow', function() {
                    $('.navbar-toggle').removeClass('open');
                    $('.ab-tips-info').show();
                    self.options.fixednav = $('.ab-local-desktop').offset().top - $(window).scrollTop();
                });
            },
            stickyNavigation: function(ele) {
                var self = this;
                $(window).scroll(function() {
                    if ($(this).scrollTop() > self.options.fixednav) {
                        $(ele).addClass('fixed');
                        $('.ab-fixednav-anchor').removeClass('hidden');
                    } else {
                        $(ele).removeClass('fixed');
                        $('.ab-fixednav-anchor').addClass('hidden');
                    }
                });
            }
        };
        // END reBrand.plgns
    });
})(jQuery);
/* ========================================================================
 * submenu.plgns: August 2014
 * Copyright 2014 AllianceBenstein *
 * ======================================================================== */
var submenu;
if (!submenu) submenu = {};
var gridAddline;
if (!gridAddline) gridAddline = {};
(function($) {
    //$('.subsubnav .subsub-wrapper').eq(0).show();
    $(function() {
        // START reBrand.plgns on DOM ready
        // ============================================================
        submenu = {
            options: {
                submenuid: '#localnavApp',
                submenid_prefix: 'submen_id_',
                submenuclass: '.ab-submenu-cnt',
                submenu_ul: '.ab-submenu__ul',
                submenu_ul_li: '.ab-submenu__ul > li',
                speed: 500,
                submenuBol: true,
                subcontent: '.ab-submenu-cnt-bg',
                currentId: null
            },
            initial: function() {
                submenu.showSearch();
                submenu.closeSearch();
            },
            show: function(id) {
                reBrandPlgns.closeMenu();
                var self = this;
                self.options.currentId = id;
                $(self.options.submenuclass).removeClass('active');
                $(self.options.subcontent).css({
                    'border-bottom': '1px solid #C4C4C4'
                });
                var contentHeight = $(self.options.submenuid).find('#' + self.options.submenid_prefix + id).height() + 60;
                $(self.options.submenu_ul_li).each(function() {
                    var anchar_id = $(this).find('a').attr('data-id');
                    if (anchar_id == id) {
                        $(self.options.submenu_ul).find("[data-id='" + id + "']").toggleClass("active");
                    } else {
                        $(this).find('a').removeClass('active');
                    }
                });
                $(self.options.subcontent).animate({
                    height: contentHeight
                }, 300, "easeOutSine");
                $(self.options.submenuid).find('#' + self.options.submenid_prefix + id).addClass('active');
                self.options.submenuBol = true;
                $('.ab-submenu__ul > li > a').each(function() {
                    if ($(this).hasClass('active')) {
                        self.options.submenuBol = false;
                    }
                });
                submenu.closeMenu(self.options.submenuBol);
            },
            showSearch: function() {
                $('.ab-search-btn').bind('click', function() {
                    //$(this).toggleClass('active');
                    $('.so-items-right').css({
                        right: -360
                    });
                    $('.so-text').css({
                        left: -380
                    });
                    $('#soBackground,.ab-search').show();
                    $('.so-items-right').animate({
                        right: 0
                    }, 400, "easeOutCubic", function() {
                        //$('.so-textfield').focus();
                        $('.ab-search').delay(100).css({
                            'border-left': '1px solid #6ECDCC'
                        });
                    });
                    $('.so-text').delay(200).animate({
                        left: 21
                    }, 400, "easeOutCubic");
                });
            },
            closeSearch: function() {
                $('#soBackground').bind('click', function() {
                    $('.so-textfield').val(""); // reset text
                    $('.so-items-right').delay(100).animate({
                        right: -360
                    }, 400, "easeOutCubic");
                    $('.ab-search').delay(50).css({
                        'border-left': '0px'
                    });
                    $('.so-text').animate({
                        left: -380
                    }, 400, "easeOutCubic", function() {
                        $('#soBackground,.ab-search,#results_wrapper').hide();
                    });
                });
            },
            closeSubmenu: function() {
                var self = this;
                $(self.options.subcontent).animate({
                    height: 0,
                    'margin-top': 0
                }, 300, "easeOutSine", function() {
                    $(self.options.submenuclass).removeClass('active');
                    $(self.options.submenu_ul_li).find('a').removeClass('active');
                    $(self.options.subcontent).attr('style', '');
                });
            },
            closeMenu: function(submenuBol) {
                var self = this;
                if (typeof submenuBol == 'undefined') {
                    var submenuBol = true;
                    var outsubmenuBol = true;
                }
                if (submenuBol) {
                    $(self.options.subcontent).animate({
                        height: 0,
                        'margin-top': 0
                    }, 300, "easeOutSine", function() {
                        $(self.options.submenuid).find('#' + self.options.submenid_prefix + self.options.currentId).removeClass('active');
                        $(self.options.subcontent).attr('style', '');
                    });
                }
                if (outsubmenuBol) {
                    $('.ab-submenu__ul > li > a').each(function() {
                        $(this).removeClass('active');
                    });
                }
            }
        };
        // END reBrand.plgns
        submenu.initial();
    });
})(jQuery);
/* ========================================================================
 * Email Signup:October 2014
 * Copyright 2014 AllianceBenstein
 *
 * ======================================================================== */
(function($) {
    $(function() {
        function removeErrorMesg(parentTag) {
            var errorDiv = parentTag.children(".error-message");
            if (errorDiv.length > 0) errorDiv.remove();
        }

        function showErrorMesg(parentTag, mesg) {
            var errorDiv = parentTag.children(".error-message");
            if (errorDiv.length == 0) {
                var clearEl = parentTag.children(".clear");
                var errEl = $("<div/>", {
                    "class": "error-message",
                    text: mesg
                });
                parentTag.append(errEl);
            }
        }

        function emailValidation(email) {
            var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        }
        emailForm = {};
        emailForm.validate = function(req_field) {
            emailForm.validSelections = true;
            req_field.each(function(index, element) {
                if (!$(element).val()) {
                    emailForm.validSelections = false;
                }
            });
        }
        $("#ab-email-submit").click(function() {
            var url = $("input[name='emailurl']").val();
            var thankyouMessage = $("input[name='emailthankyou']").val();
            var reqEmail = $("input.abEmail");
            var required = $("#ab-email-signup-cnt .required");
            reqEmail.removeClass('ab-error');
            $('.error').html('');
            var validSelections = true;
            emailForm.validate(required);
            validSelections = emailForm.validSelections;
            if (!emailValidation(reqEmail.val())) {
                validSelections = false;
                $('.error').html('Please type correct email');
                reqEmail.addClass('ab-error');
            }
            if (validSelections) {
                var toPost = $("input[name='email']");
                var keyVal = Object();
                $.each(toPost, function(index, val) {
                    var inputVal = $(val).val();
                    // alert(val.name + ':' + inputVal);
                    if (keyVal[val.name] === undefined) keyVal[val.name] = inputVal;
                    else keyVal[val.name] += "," + inputVal;
                });
                var myURL = '/Abcom/PardotRelay.ashx?ph=ReqInfo&url=' + encodeURIComponent(url);
                var jqxhr = $.post(myURL, toPost.serialize(), function(data, status) {
                    if (status == 'success') {
                        required.val('');
                        $('#ab-email-signup-cnt').html(thankyouMessage);
                    }
                });
                //alert('Thank you. Your request for information has been submitted.');
                //showErrorMesg($(".gmpThankYou"), "Thank you. Your request for information has been submitted.");
            }
        });
    });
})(jQuery);
/* ========================================================================
 * Blog.plgns: Ocotober 2014
 * Copyright 2014 AllianceBenstein
 * ======================================================================== */
var abBlog;
if (!abBlog) abBlog = {};
(function($) {
    $(function() {
        abBlog = {
            options: {
                abBlogClass: '.ab-blog-block',
                abBlogCount: 0
            },
            initialize: function() {
                var self = this;
                $(self.options.abBlogClass).each(function(index, element) {
                    var postNumber = parseInt($(this).attr("data-no"));
                    var blogURL = $(this).attr("data-url");
                    //var blogURLQuery = blogURL.replace("http://blog.qa.acml.com/index.php", "");
                    var blogURLQuery;
                    if (blogURL.match('/index.php/') != null) {
                        blogURLQuery = blogURL.replace("http://blog.qa.acml.com/index.php", "");
                    } else if (blogURL.match('/post/') != null) {
                        var tempURL = blogURL.split('post');
                        var tempURL1 = tempURL[1].split('/');
                        tempURL1.splice(0, 2);
                        blogURLQuery = tempURL1.join('/');
                    } else {
                        blogURLQuery = blogURL;
                    }
                    var blogCategory = $(this).attr("data-category");
                    var abBlogAPI = null;
                    if (blogURL != '') {
                        var abBlogAPI = "/abcomwebservices/ABComServices.svc/GetabGlobalblog?numTopBlogItems=1&url=" + blogURLQuery;
                        self.getBlog(abBlogAPI, 0, element, abBlog.options.abBlogCount);
                    } else if ($.isNumeric(postNumber) && blogCategory == '') {
                        var abBlogAPI = "/abcomwebservices/ABComServices.svc/GetabGlobalblog?numTopBlogItems=" + postNumber;
                        self.getBlog(abBlogAPI, postNumber - 1, element, abBlog.options.abBlogCount);
                    } else if (!$.isNumeric(postNumber) && blogCategory != '') {
                        var abBlogAPI = "/abcomwebservices/ABComServices.svc/GetabGlobalblog?numTopBlogItems=1&category=" + blogCategory;
                        self.getBlog(abBlogAPI, 0, element, abBlog.options.abBlogCount);
                    } else if ($.isNumeric(postNumber) && blogCategory != '') {
                        var abBlogAPI = "/abcomwebservices/ABComServices.svc/GetabGlobalblog?numTopBlogItems=" + postNumber + "&category=" + blogCategory;
                        self.getBlog(abBlogAPI, postNumber - 1, element, abBlog.options.abBlogCount);
                    }
                    abBlog.options.abBlogCount = abBlog.options.abBlogCount + 1;
                });
            },
            getBlog: function(abBlogAPI, postNumber, element, backnumber) {
                $.getJSON(abBlogAPI).done(function(data) {
                    if (data.Blogs != null) {
                        if (data.Blogs.length != 0) {
                            if (data.Blogs[postNumber].Categories != 'undefined') {
                                var categoryLength = data.Blogs[postNumber].Categories.length;
                                var category = '';
                                /*for (var i = 0; i < categoryLength; i++) {
                                		if (i != (categoryLength - 1)) {
                                			category += data.Blogs[postNumber].Categories[i] + ', ';
                                		} else {
                                			category += data.Blogs[postNumber].Categories[i];
                                		}
                                	}*/
                                category += '<br /><br />';
                                category += 'by ' + data.Blogs[postNumber].Author;
                                var dateFormat = data.Blogs[postNumber].Date;
                                dateFormat = $.datepicker.formatDate('MM dd, yy', new Date(dateFormat));
                                $(element).find('.ab-block__date').html('| ' + dateFormat);
                                $(element).find('h5').html(data.Blogs[postNumber].Title);
                                //$(element).find('p').html(category);
                                var currentURL = data.Blogs[postNumber].Link;
                                if (window.location.host === 'methodeabcom.qa.acml.com') {
                                    currentURL = currentURL.replace("http://blog.abglobal.com/", "https://blog.qa.acml.com/");
                                }
                                $(element).find('a').attr('href', currentURL);
                                $(element).find('.ab-blog-loader').hide();
                            } else {
                                abBlog.backupBlog(element, backnumber);
                            }
                        } else {
                            abBlog.backupBlog(element, backnumber);
                        }
                    } else {
                        abBlog.backupBlog(element, backnumber);
                    }
                }).fail(function() {
                    abBlog.backupBlog(element, backnumber);
                });
            },
            backupBlog: function(element, backnumber) {
                $(element).remove();
                $('.ab-insight-cnt__cnt').each(function(index, element) {
                    $(this).abAddLine();
                });
                /*$.getJSON('/sites/resources/data/blogdata.json')
                	.done(function(backupdata) {
                		//console.log("New:"+backnumber);
                		$(element).find('.ab-block__date').html('| ' + backupdata.Blogs[backnumber].Blogdate);
                		$(element).find('h5').html(backupdata.Blogs[backnumber].Title);
                		$(element).find('a').attr('href', backupdata.Blogs[backnumber].Link);
                		$(element).find('.ab-blog-loader').hide();
                	});*/
            }
        }
        //abBlog.initialize();
    });
})(jQuery);
/* ========================================================================
 * Video.plgns: Ocotober 2014
 * Copyright 2014 AllianceBenstein
 * ======================================================================== */
var abVideo;
if (!abVideo) abVideo = {};
(function($) {
    $(function() {
        abVideo = {
            options: {
                abBlogClass: '.ab-video-block',
                videoHeight: null,
                videoWidth: null,
                docheight: null,
                docwidth: null,
                winheight: null,
                winwidth: null,
                scrollTop: null,
                videoID: null,
                playerID: null,
                playerKey: null,
                video: false
            },
            int: function() {
                abVideo.options.docheight = $(document).height();
                abVideo.options.docwidth = $(document).width();
                abVideo.options.winheight = $(window).height();
                abVideo.options.winwidth = $(window).width();
                abVideo.options.scrollTop = $(window).scrollTop();
            },
            showVideo: function(videoID, playerID, playerKey, videoHeight, videoWidth) {
                abVideo.int();
                var self = this;
                abVideo.options.video = true;
                abVideo.options.videoID = videoID;
                abVideo.options.playerID = playerID;
                abVideo.options.playerKey = playerKey;
                abVideo.options.videoHeight = videoHeight;
                abVideo.options.videoWidth = videoWidth;
                $('.ab-overlay').show();
                $('.ab-overlay').css({
                    'width': abVideo.options.docwidth + 'px',
                    'height': abVideo.options.docheight + 'px'
                });
                $('.ab-overlay > .ab-window').css({
                    'width': abVideo.options.winwidth + 'px',
                    'height': abVideo.options.winheight + 'px',
                    'top': abVideo.options.scrollTop + 'px'
                });
                abVideo.updateVideoBox(abVideo.options.videoHeight, abVideo.options.videoWidth);
                var po = "<object id='myExperience' class='BrightcoveExperience'>" + "<param name='bgcolor' value='#FFFFFF' />" + "<param name='width' value='" + videoWidth + "' />" + "<param name='height' value='" + videoHeight + "' />" + "<param name='playerID' value='" + playerID + "' />" + "<param name='playerKey' value='" + playerKey + "' />" + "<param name='isVid' value='true' />" + "<param name='isUI' value='true' />" + "<param name='dynamicStreaming' value='true' />" + "<param name='autoStart' value='true'>" + "<param name='secureConnections' value='true' />" + "<param name='secureHTMLConnections' value='true' />" + "<param name='@videoPlayer' value='" + videoID + "' />" + "</object>";
                $('.ab-overlay .ab-video #placeHolder').html(po);
                $('.ab-overlay').fadeIn(300);
                //console.log(videoID,playerID,playerKey,videoHeight,videoWidth);
                brightcove.createExperiences();
            },
            updateVideoBox: function(videoHeight, videoWidth) {
                var videoHeight = videoHeight;
                var videoWidth = videoWidth;
                var screenWidth = $(window).width() * 0.9,
                    screenHeight = $(window).height() * 0.9;
                if (videoWidth > screenWidth || videoHeight > screenHeight) {
                    var ratio = videoWidth / videoHeight > screenWidth / screenHeight ? videoWidth / screenWidth : videoHeight / screenHeight;
                    videoWidth /= ratio;
                    videoHeight /= ratio;
                }
                $('.ab-overlay .ab-video-box').css({
                    'width': videoWidth + 'px',
                    'height': videoHeight + 'px',
                    'top': ($(window).height() - videoHeight) / 2 + 'px',
                    'left': ($(window).width() - videoWidth) / 2 + 'px'
                });
            },
            closeVideo: function() {
                $('.ab-overlay .ab-video #placeHolder').html('');
                $('.ab-overlay').hide();
                abVideo.options.video = false;
            }
        }
        $(window).resize(function() {
            if (abVideo.options.video) {
                abVideo.options.docheight = $(document).height();
                abVideo.options.docwidth = $(window).width();
                abVideo.options.winheight = $(window).height();
                abVideo.options.winwidth = $(window).width();
                abVideo.options.scrollTop = $(window).scrollTop();
                $('.ab-overlay').css({
                    'width': abVideo.options.winwidth + 'px',
                    'height': $(document).height() + 'px'
                });
                $('.ab-overlay > .ab-window').css({
                    'width': $(window).width() + 'px',
                    'height': $(window).height() + 'px',
                    'top': abVideo.options.scrollTop + 'px'
                });
                abVideo.updateVideoBox(abVideo.options.videoHeight, abVideo.options.videoWidth);
                brightcove.createExperiences();
            }
        });
    });
})(jQuery);
/* ========================================================================
 * Mobile More.plgns: Ocotober 2014
 * Copyright 2014 AllianceBenstein
 * ======================================================================== */
(function($) {
    $.fn.abMobileMore = function(options) {
        var settings = $.extend({
            number: 2,
            totalHeight: 0,
            moreLink: '.ab-more',
            lessLink: '.ab-less'
        }, options);
        // variable
        var base = this;
        base.$el = $(this);
        base.divs = $(this).find(' > .tiles');
        base.more = $(this).parent('.ab-insight-cnt').find(settings.moreLink);
        base.less = $(this).parent('.ab-insight-cnt').find(settings.lessLink);
        base.lessDiv = $(this).parent('.ab-insight-cnt').find('.ab-less-div');
        base.lmoreDiv = $(this).parent('.ab-insight-cnt').find('.ab-more-div');
        base.init = function() {
            var totalDivs = $(this).find('> .tiles').length;
            if (totalDivs > settings.number) {
                base.lmoreDiv.show();
                var initialHeight = 0;
                $(base.divs).each(function(index, element) {
                    if (index < settings.number) {
                        settings.totalHeight += $(this).height();
                        settings.totalHeight += 36;
                    }
                });
                base.$el.css({
                    'height': settings.totalHeight + 'px'
                });
                $(base.more).click(function(e) {
                    base.$el.css({
                        'height': '100%'
                    });
                    base.lmoreDiv.hide();
                    base.lessDiv.show();
                    base.close();
                });
            }
        }
        base.close = function() {
            $(base.less).click(function(e) {
                base.$el.css({
                    'height': settings.totalHeight + 'px'
                });
                base.lmoreDiv.show();
                base.lessDiv.hide();
            });
        }
        base.init();
    };
}(jQuery));
/* ========================================================================
 * Addline Insight.plgns: Ocotober 2014
 * Copyright 2014 AllianceBenstein
 * ======================================================================== */
(function($) {
    $.fn.abAddLine = function(options) {
        var settings = $.extend({
            gridCnt: '.ab-insight-cnt__cnt',
            gridWidth: 0
        }, options);
        var base = this;
        base.init = function() {
            base.reomveLine();
            settings.gridWidth = $(base).width();
            var divwidth = 0,
                currentWidth = 0,
                nextWidth = 0;
            $(base).find(' div.tiles').each(function(index, element) {
                currentWidth = $(this).width() + 18;
                nextWidth = $(this).next('div').width() + 18;
                divwidth = divwidth + currentWidth;
                if ((divwidth + nextWidth) > settings.gridWidth) {
                    $(this).after('<div class="ab-grid-line"></div>');
                    divwidth = 0;
                }
            });
        }
        base.reomveLine = function() {
            $(base).find('.ab-grid-line').remove();
        }
        base.init();
    };
}(jQuery));
/* ========================================================================
 * Twitter.plgns: November 2014
 * Copyright 2014 AllianceBenstein
 * ======================================================================== */
var abTwitter;
if (!abTwitter) abTwitter = {};
String.prototype.parseURL = function() {
    return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g, function(url) {
        return url.link(url);
    });
};
String.prototype.parseUsername = function() {
    return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
        var username = u.replace("@", "")
        return u.link("http://twitter.com/" + username);
    });
};
String.prototype.parseHashtag = function() {
    return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
        var tag = t.replace("#", "%23")
        return t.link("http://search.twitter.com/search?q=" + tag);
    });
};
(function($) {
    $(function() {
        abTwitter = {
            options: {
                abTwClass: '.ab-twitter-block'
            },
            initialize: function() {
                var self = this;
                $(self.options.abTwClass).each(function(index, element) {
                    var postNumber = $(this).attr("data-no");
                    var twitterURL = $(this).attr("data-url");
                    var twitterHandlerTemp = $(this).attr("data-id");
                    var twitterURLQuery = null,
                        twitterHandler = null,
                        twitterURLQueryTemp = null;
                    if (typeof(twitterHandlerTemp) != 'undefined') {
                        twitterHandler = twitterHandlerTemp.replace("@", "");
                        twitterURLQueryTemp = twitterURL.split('status/');
                        twitterURLQuery = twitterURLQueryTemp[1];
                    } else {
                        twitterURLQuery = twitterURL.replace("https://twitter.com/AllianceBernstn/status/", "");
                    }
                    var abTwitterAPI = null;
                    if (twitterHandler != null) {
                        if (twitterURL != '') {
                            abTwitterAPI = "/ABComWebServices/ABComServices.svc/gettwitterfeed?id=" + twitterURLQuery + "&account=" + twitterHandler;
                            self.getTwitter(abTwitterAPI, 0, element, twitterURL);
                        } else if ($.isNumeric(postNumber)) {
                            abTwitterAPI = "/ABComWebServices/ABComServices.svc/gettwitterfeed?numRecords=" + postNumber + "&account=" + twitterHandler;
                            self.getTwitter(abTwitterAPI, postNumber - 1, element, twitterURL);
                        } else {
                            abTwitterAPI = "/ABComWebServices/ABComServices.svc/gettwitterfeed?numRecords=1&account=" + twitterHandler;
                            self.getTwitter(abTwitterAPI, 0, element, twitterURL);
                        }
                    } else {
                        if (twitterURL != '') {
                            abTwitterAPI = "/ABComWebServices/ABComServices.svc/gettwitterfeed?id=" + twitterURLQuery;
                            self.getTwitter(abTwitterAPI, 0, element, twitterURL);
                        } else if ($.isNumeric(postNumber)) {
                            abTwitterAPI = "/ABComWebServices/ABComServices.svc/gettwitterfeed?numRecords=" + postNumber;
                            self.getTwitter(abTwitterAPI, postNumber - 1, element, twitterURL);
                        } else {
                            abTwitterAPI = "/ABComWebServices/ABComServices.svc/gettwitterfeed?numRecords=1";
                            self.getTwitter(abTwitterAPI, 0, element, twitterURL);
                        }
                    }
                });
            },
            appliedTarget: function(element) {
                $(element).find('a').each(function() {
                    $(this).attr('target', '_blank');
                });
            },
            getData: function(data, element) {
                var self = this;
                var username, screen_name, classname;
                if (data) {
                    if (typeof(data.retweeted_status) != 'undefined') {
                        classname = 'retweet-icon';
                        username = data.retweeted_status.user.name;
                        screen_name = data.retweeted_status.user.screen_name;
                    } else {
                        classname = 'twitter-icon';
                        username = data.user.name;
                        screen_name = data.user.screen_name
                    }
                    $(element).find('span').html(username);
                    $(element).find('a.ab-twiiter-block__handler').html('@' + screen_name);
                    $(element).find('a.ab-twiiter-block__handler').attr('href', 'https://twitter.com/' + screen_name);
                    $(element).find('p').html(data.text.parseURL().parseUsername().parseHashtag());
                    $(element).find('div.twitter-icon').removeClass('twitter-icon').addClass(classname);
                    self.appliedTarget(element);
                    $(element).find('.ab-blog-loader').hide();
                } else {
                    $(element).find('.ab-blog-loader').hide();
                }
            },
            getTwitter: function(abTwitterAPI, postNumber, element, twitterURL) {
                var self = this;
                $.getJSON(abTwitterAPI).done(function(data) {
                    if (twitterURL != '') {
                        self.getData(data, element);
                    } else {
                        self.getData(data[data.length - 1], element);
                    }
                });
            }
        }
    });
})(jQuery);
/* ========================================================================
 * Product Search: November 2014
 * Copyright 2014 AllianceBenstein
 * ======================================================================== */
var abRtl;
(function($) {
    $(function() {
        if (!abRtl) abRtl = {
            options: {
                global_overlay: 'globalOverlay_retail'
            },
            hideSelectBoxes: function() {
                //$('select').hide();
                //$('select').addClass('hidden');
            },
            resetSelectBoxes: function() {
                //$('select').show();
                //$('select').removeClass('hidden');
            }
        };
        abRtl.FundsSearch = {
            options: {
                animation_speed: 400,
                show_per_page: 8,
                total_results: 0,
                current_page: 0,
                hostname: '/abcomwebservices',
                urlString: '/fundviewservice.svc/getsearchterms?term=',
                results_panel: '#results_wrapper_inner',
                tip_src: 'bg_serachResultsTop.gif',
                fund_results_list: 'results_list',
                results_wrapper: '#results_wrapper',
                go_button: '.btn_search',
                results_showing_to: '.showing_to',
                results_showing_from: '.showing_from',
                inactive_class_name: 'inactive',
                bottom_tip_height: 7,
                new_page: 0,
                currSelection: null,
                currentSelectedIndex: 0,
                str_noResults: false
            },
            init: function(opts) {
							
                this.setOptions(opts);
                B = this.options.element;
                var A;
                if (!B) {
                    var B = window.event
                }
                if (B.keyCode) {
                    A = B.keyCode
                } else {
                    if (B.which) {
                        A = B.which
                    }
                }
                if (A == 40) {
                    if ((parseInt(abRtl.FundsSearch.getSelectedIndex() + 1) < abRtl.FundsSearch.options.total_results) || ((abRtl.FundsSearch.options.current_page + 1) * abRtl.FundsSearch.options.show_per_page) <= abRtl.FundsSearch.options.total_results) {
                        abRtl.FundsSearch.keySelection("down")
                    }
                } else {
                    if (A == 38) {
                        if (parseInt(abRtl.FundsSearch.getSelectedIndex()) != 0 || abRtl.FundsSearch.options.current_page != 0) abRtl.FundsSearch.keySelection("up");
                    } else {
                        if (A == 13) {
                            if (abRtl.FundsSearch.options.str_noResults == false) abRtl.FundsSearch.goToSelection();
                        } else {
                            abRtl.FundsSearch.fetchData(false, false);
                        }
                    }
                }
                return false
            },
            setOptions: function(optsObj) {
                if (!optsObj) return;
                for (var optName in optsObj) {
                    this.options[optName] = optsObj[optName];
                }
            },
            keySelection: function(A) {
                if (abRtl.FundsSearch.options.currSelection == null) {
                    $("#results_list li:first-child").removeClass('div_hover');
                    if ($("#results_list")) {
                        if (window.ie) {
                            newSelection = $('#results_list').children()[0]
                        } else {
                            newSelection = $('#results_list').children()[1]
                        }
                    } else {
                        newSelection = false;
                    }
                } else {
                    if (A == "down") {
                        newSelection = $(abRtl.FundsSearch.options.currSelection).next();
                    } else {
                        if (A == "up") {
                            newSelection = $(abRtl.FundsSearch.options.currSelection).prev();
                        }
                    }
                }
                if (newSelection) {
                    abRtl.FundsSearch.setSelectedRow(newSelection, A)
                }
            },
            setSelectedRow: function(A, direction) {
                if (abRtl.FundsSearch.options.currSelection != null) {
                    $(abRtl.FundsSearch.options.currSelection).removeClass('div_hover');
                }
                abRtl.FundsSearch.options.currSelection = $(A);
                $(A).addClass('div_hover');
                currSelectedPos = abRtl.FundsSearch.getSelectedIndex();
                newPageNum = abRtl.FundsSearch.options.current_page + 1;
                scrollType = "";
                if (typeof(currSelectedPos) == "undefined") {
                    abRtl.FundsSearch.options.currentSelectedIndex = (direction == "down") ? 0 : 7;
                    scrollType = direction;
                }
                if (scrollType == "down") {
                    if (((abRtl.FundsSearch.options.current_page + 1) * abRtl.FundsSearch.options.show_per_page) <= abRtl.FundsSearch.options.total_results) {
                        abRtl.FundsSearch.goNext(abRtl.FundsSearch.options.total_results);
                    } else {
                        $(A.prevObject).addClass('div_hover');
                    }
                }
                if (scrollType == "up") {
                    if (abRtl.FundsSearch.options.current_page >= 0) {
                        abRtl.FundsSearch.goPrevious();
                    } else {
                        $(A.prevObject).addClass('div_hover');
                        $(A.prevObject).focus();
                    }
                }
            },
            getSelectedIndex: function() {
                arrItems = $("#results_list li");
                for (i = 0; i < arrItems.length; i++) {
                    if ($($(arrItems)[i]).html() == $(abRtl.FundsSearch.options.currSelection).html()) {
                        return i;
                        break
                    }
                }
            },
            goToSelection: function() {
                if (abRtl.FundsSearch.options.currSelection != null) {
                    var itemLink = $(abRtl.FundsSearch.options.currSelection).find('a');
                    window.location = $(itemLink).attr('href');
                }
            },
            checkvalue: function(value) {
                return value.match(/[A-Za-z][A-Za-z0-9 ]*/);
            },
            fetchData: function(isNext, isPrev) {
                var self = this;
                var instructions = $(self.options.serach_box).val();
                if (instructions == null || instructions.length == 0) {
                    $(self.options.results_panel).empty();
                    self.fundsSearch_closePanel();
                    return;
                }
                var url = self.options.hostname + self.options.urlString + instructions + "&currentPage=" + self.options.current_page;
                url += "&isNext=" + isNext + "&isPrev=" + isPrev;
                $.getJSON(url, function(data) {
                    self.displayData(data, instructions);
                });
            },
            displayData: function(data, terms) {
				var self = this;
                self.options.str_noResults = false;
                self.resetPagination();
                var loc = self.options.location;
                if (loc == 'explore_more') $(self.options.results_wrapper).addClass('explore_moreSearch').appendTo($(".em_searchBox"));
                else $(self.options.results_wrapper).appendTo($(".centerIt"));
                $(self.options.results_wrapper).fadeIn(self.options.animation_speed, function() {});
                $(self.options.results_panel).empty();
                var data;
                $.each(data.GetSearchTermsResult, function(index, obj) {
                    if (obj.Key == "total") {
                        $(self.options.total_results = obj.Value);
                    }
                    if (obj.Key == "products") {
                        data = obj.Value;
                    }
                });
                $(self.options.results_panel).html(data);
                var searchResults = $(self.options.results_panel + " li");
                self.searchPagination(searchResults);
                this.fundsSearch_clickListener.call(this);
                abRtl.hideSelectBoxes();
                if (data == null || self.options.total_results == 0) {
                    self.showNoResults();
                    self.hidePagination();
                    this.updateOrientation($(this.options.results_wrapper).height());
                    return;
                }
                if (self.options.total_results <= self.options.show_per_page) {
                    self.disablePageLink('.li_next_link a');
                }
                self.showPagination();
                $(self.options.results_wrapper + " ul li:nth-child(8n)").addClass('last');
                self.searchPagination(searchResults);
                self.updateOrientation($(self.options.results_wrapper).height());
                this.fundsSearch_overListener.call(this);
                $("#results_list li:first-child").addClass('div_hover');
                abRtl.FundsSearch.options.currSelection = $("#results_list li:first-child")
            },
            updateData: function(data, terms) {
                var self = this;
                var data;
                $.each(data.GetSearchTermsResult, function(index, obj) {
                    if (obj.Key == "total") {
                        $(self.options.total_results = obj.Value);
                    }
                    if (obj.Key == "products") {
                        data = obj.Value;
                    }
                });
                $(self.options.results_panel).html(data);
                this.fundsSearch_overListener.call(this);
                currentRow = abRtl.FundsSearch.options.currentSelectedIndex + 1;
                $("#results_list li:nth-child(" + currentRow + ")").addClass('div_hover');
                abRtl.FundsSearch.options.currSelection = $("#results_list li:nth-child(" + currentRow + ")");
            },
            updateDataMobile: function(data, terms) {
                var self = this;
                var data;
                $.each(data.GetSearchTermsResult, function(index, obj) {
                    if (obj.Key == "total") {
                        $(self.options.total_results = obj.Value);
                    }
                    if (obj.Key == "products") {
                        data = obj.Value;
                    }
                });
                $(self.options.results_panel).append(data);
                this.fundsSearch_overListener.call(this);
                currentRow = abRtl.FundsSearch.options.currentSelectedIndex + 1;
                $("#results_list li:nth-child(" + currentRow + ")").addClass('div_hover');
                abRtl.FundsSearch.options.currSelection = $("#results_list li:nth-child(" + currentRow + ")");
            },
            searchPagination: function(items) {
                var self = this;
                var number_of_pages = Math.ceil(self.options.total_results / this.options.show_per_page);
                this.options.total_results <= this.options.show_per_page ? $(this.options.results_showing_to).html(this.options.total_results) : $(this.options.results_showing_to).html(this.options.show_per_page)
                $(this.options.results_showing_from).html(1 + ' - ');
                $('.showing_total').html(' of ' + self.options.total_results + ' results');
                $('.li_next_link a').attr('href', 'javascript:abRtl.FundsSearch.goNext(' + self.options.total_results + ')');
                $('#' + this.options.fund_results_list).children().addClass('hide').slice(0, this.options.show_per_page).removeClass('hide').addClass('show');
            },
            fundsSearch_overListener: function() {
                var self = this;
                $(self.options.results_wrapper + " ul li").each(function(i, e) {
                    $(this).mouseover(function() {
                        $("#results_list li").removeClass('div_hover');
                        $(this).addClass('div_hover');
                        abRtl.FundsSearch.setSelectedRow(this);
                    });
                    $(this).mouseout(function() {});
                });
            },
            fundsSearch_clickListener: function() {
                var self = this;
                $('body').click(function() {
                    self.fundsSearch_closePanel();
                });
                $(self.options.results_wrapper).click(function(event) {
                    event.stopPropagation();
                });
                $(self.options.go_button).click(function() {
                    if (self.options.str_noResults == false) abRtl.FundsSearch.goToSelection();
                });
            },
            fundsSearch_closePanel: function() {
                var self = this;
                $(self.options.results_wrapper).fadeOut(self.options.animation_speed, function() {
                    $(self.options.results_wrapper).removeClass('explore_moreSearch'); /* For Keys update Natalia 01.13.2012*/
                    abRtl.FundsSearch.options.currSelection = null;
                });
                self.resetPagination();
                abRtl.resetSelectBoxes();
            },
            resetPagination: function() {
                this.options.current_page = 0;
                this.enablePageLink('.li_next_link a');
                this.disablePageLink('.li_previous_link a');
            },
            hidePagination: function() {
                $('#result_pagination').hide();
            },
            showPagination: function() {
                $('#result_pagination').show();
            },
            enablePageLink: function(link) {
                $(link).removeClass(this.options.inactive_class_name);
            },
            disablePageLink: function(link) {
                $(link).addClass(this.options.inactive_class_name);
            },
            updateOrientation: function(h) {
                var orientation = this.options.orientation;
                if (orientation == 'orientation_up') {
                    h = h + $('#utilities table tr td#searchPanel').height() / 2;
                    $(this.options.results_wrapper).css('marginTop', '-' + h + 'px');
                    $('#results_wrapper .no_result').addClass('orientationUp');
                    append_bottom_tip = $('<div />', {
                        'class': 'search_bottom_tip',
                        html: '<img src="/abcom/web/resources/images/bg/bg_serachResultsBottom.gif"  style="display:block"/>'
                    })
                    $('#result_pagination').add($('#results_wrapper_container')).addClass('orientationUp');
                    $('#results_wrapper_point').remove();
                    if ($(".search_bottom_tip").length != 0) return;
                    else $('#result_pagination').after(append_bottom_tip);
                }
            },
            goNext: function(total_number) {
                var self = this;
                results_showing_to = parseInt($(self.options.results_showing_to).html());
                abRtl.FundsSearch.options.new_page = parseInt(self.options.current_page) + 1;
                if (total_number > results_showing_to) {
                    var instructions = $(self.options.serach_box).val();
                    self.goToPage(abRtl.FundsSearch.options.new_page);
                    var url = self.options.hostname + self.options.urlString + instructions + "&currentPage=" + self.options.current_page;
                    url += "&isNext=true" + "&isPrev=false";
                    $.getJSON(url, function(data) {
                        self.updateData(data, instructions);
                    });
                    self.enablePageLink('.li_previous_link a');
                }
                if (results_showing_to >= (total_number - this.options.show_per_page)) {
                    $(this.options.results_showing_to).html(this.options.total_results);
                    this.disablePageLink('.li_next_link a');
                }
            },
            goNextMobile: function(total_number) {
                var self = this;
                results_showing_to = parseInt($(self.options.results_showing_to).html());
                abRtl.FundsSearch.options.new_page = parseInt(self.options.current_page) + 1;
                if (total_number > results_showing_to) {
                    var instructions = $(self.options.serach_box).val();
                    self.goToPage(abRtl.FundsSearch.options.new_page);
                    var url = self.options.hostname + self.options.urlString + instructions + "&currentPage=" + self.options.current_page;
                    url += "&isNext=true" + "&isPrev=false";
                    $.getJSON(url, function(data) {
                        self.updateDataMobile(data, instructions);
                    });
                    self.enablePageLink('.li_previous_link a');
                }
                if (results_showing_to >= (total_number - this.options.show_per_page)) {
                    $(this.options.results_showing_to).append(this.options.total_results);
                    this.disablePageLink('.li_next_link a');
                }
            },
            goPrevious: function() {
                var self = this;
                results_showing_to = parseInt($(this.options.results_showing_to).html());
                abRtl.FundsSearch.options.new_page = parseInt(this.options.current_page) - 1;
                if (results_showing_to > this.options.show_per_page) {
                    var instructions = $(self.options.serach_box).val();
                    self.goToPage(abRtl.FundsSearch.options.new_page);
                    var url = self.options.hostname + self.options.urlString + instructions + "&currentPage=" + self.options.current_page;
                    url += "&isNext=false" + "&isPrev=true";
                    $.getJSON(url, function(data) {
                        self.updateData(data, instructions);
                    });
                    this.enablePageLink('.li_next_link a');
                }
                if (parseInt($(this.options.results_showing_from).html()) == 1) this.disablePageLink('.li_previous_link a');
            },
            goToPage: function(page_num) {
                from = page_num * this.options.show_per_page;
                to = from + this.options.show_per_page;
                abRtl.FundsSearch.options.new_page = page_num;
                this.options.current_page = page_num;
                $(this.options.results_showing_to).html(((abRtl.FundsSearch.options.new_page + 1) * this.options.show_per_page));
                $(this.options.results_showing_from).html((this.options.show_per_page * page_num) + 1 + ' - ');
                this.updateOrientation($(this.options.results_wrapper).height());
            },
            showNoResults: function() {
                var self = this;
                $('<div/>', {
                    'class': 'no_result',
                    html: "No Results Found"
                }).appendTo(self.options.results_panel);
                self.options.str_noResults = true;
            }
        }

        function searchInit(orientation) {
            //var searchBoxInput = [$("#productSearch")[0], $("#em_productSearch")[0]];
            var searchBoxInput = $("input.searchField");
            var searchBoxFocusHandler = function() {
                $(searchBoxInput).each(function(i, ele) {
                    if ($(ele).val() == "Enter Fund Name, ID, Ticker or CUSIP") $(ele).val('');
                });
            }
            var searchBoxBlurHandler = function(ele) {
							var placeholder = 'Enter Fund Name, ID, Ticker or CUSIP'
							$(searchBoxInput).each(function(i, ele) {
									if ($(ele).attr('id') == 'abpc-search-input') {
											placeholder = 'Fund Name, ISIN or Bloomberg'
									}
									if ($(ele).val() == "") $(ele).val(placeholder);
							});
						}
            $(searchBoxInput).focus(function(event) {
                searchBoxFocusHandler();
            });
            $(searchBoxInput).blur(function(event) {
                searchBoxBlurHandler();
            });
            $(searchBoxInput).keyup(function(e) {
                var id = $(this).attr('id');
                var loc;
                if (id === 'productSearch') {
                    loc = 'tool_bar';
                } else if (id === 'em_productSearch') {
                    loc = 'explore_more';
                }
                abRtl.FundsSearch.init({
                    'serach_box': '#' + id,
                    'location': loc,
                    'orientation': orientation,
                    'element': e
                });
            });
        }
        searchInit();
        var theElement = document.getElementById("results_wrapper");

        function handlerFunction(event) {
            abRtl.FundsSearch.goNextMobile(abRtl.FundsSearch.options.total_results);
        }
        if (theElement != null) {
            if (theElement.addEventListener) {
                theElement.addEventListener("touchmove", handlerFunction, false);
            } else {
                theElement.attachEvent("touchmove", handlerFunction, false);
            }
        }
    });
})(jQuery);
/* ========================================================================
 * Library Search: December 2014
 * Copyright 2014 AllianceBenstein
 * ======================================================================== */
(function($) {
    $(function() {
        $('#btnLibSearch').bind('click', function(e) {
            document.location.href = "/abcom/Research_Library/ResearchLibrary_ResultsPage.htm?SearchString=" + escape($("#librarySearch").val())
        });
        $('#librarySearch').keypress(function(event) {
            if (event.which == 13 || event.keyCode == 13) {
                event.preventDefault();
                document.location.href = "/abcom/Research_Library/ResearchLibrary_ResultsPage.htm?SearchString=" + escape($("#librarySearch").val());
            }
        });
    });
})(jQuery);
/* ========================================================================
 * Hero: December 2014
 * Copyright 2014 AllianceBenstein
 * ======================================================================== */
(function($) {
    $(function() {
        var abHeroPlgns;
        if (!abHeroPlgns) abHeroPlgns = {};
        abHeroPlgns = {
            options: {
                barHeight: 0,
                barImg: null
            },
            initial: function() {
                abHeroPlgns.options.barImg = $('.ab-hero-vdo').html();
                $('.grey-background').html(abHeroPlgns.options.barImg);
            },
            onResize: function() {
                abHeroPlgns.options.barHeight = $('.ab-hero-v3-teaser').outerHeight() + 20;
                $('.grey-left-half').height(abHeroPlgns.options.barHeight);
            }
        }
        abHeroPlgns.initial();
        abHeroPlgns.onResize();
        setTimeout(function() {
            abHeroPlgns.onResize();
        }, 100);
        $(window).resize(function() {
            abHeroPlgns.onResize();
        });
    });
})(jQuery);
/* ========================================================================
 * ExternalLink.plgns: Ocotober 2014
 * Copyright 2014 AllianceBenstein
 * ======================================================================== */
var abExternallink;
if (!abExternallink) abExternallink = {};
(function($) {
    $(function() {
        abExternallink = {
            options: {
                abBlogClass: '.ab-video-block',
                videoHeight: null,
                videoWidth: null,
                docheight: null,
                docwidth: null,
                winheight: null,
                winwidth: null,
                scrollTop: null,
                url: null,
                abExternallinkBol: false
            },
            int: function() {
                abExternallink.options.docheight = $(document).height();
                abExternallink.options.docwidth = $(document).width();
                abExternallink.options.winheight = $(window).height();
                abExternallink.options.winwidth = $(window).width();
                abExternallink.options.scrollTop = $(window).scrollTop();
            },
            show: function(url) {
                var self = this;
                abExternallink.options.abExternallinkBol = true;
                abExternallink.options.url = url;
                abExternallink.options.videoHeight = 250;
                abExternallink.options.videoWidth = 560;
                abExternallink.int();
                $('.ab-overlay').show();
                $('.ab-overlay').css({
                    'width': abExternallink.options.docwidth + 'px',
                    'height': abExternallink.options.docheight + 'px'
                });
                $('.ab-overlay > .ab-window').css({
                    'width': abExternallink.options.winwidth + 'px',
                    'height': abExternallink.options.winheight + 'px',
                    'top': abExternallink.options.scrollTop + 'px'
                });
                abExternallink.updateVideoBox(250, 560);
                var po = "<div class='ab-external-popup'><p>The content on this page may include link(s) that will take you out of our website. This is provided for your information and convenience. We are not responsible for the content of any third party's website, including the website(s) you may link to. We are not affiliated with any other website and do not endorse any information contained on any third party's website.<br /><br />Do you wish to continue?</p>";
                po += '<a href="javascript:void(abExternallink.external());" class="ab-agree">Agree</a>';
                po += '<a href="javascript:void(abExternallink.closeVideo());" class="ab-decline">Decline</a>';
                po += '</div>';
                $('.ab-overlay .ab-video #placeHolder').html(po);
                $('.ab-overlay').fadeIn(300);
            },
            updateVideoBox: function(videoHeight, videoWidth) {
                var screenWidth = $(window).width() * 0.9,
                    screenHeight = $(window).height() * 0.9;
                if (videoWidth > screenWidth || videoHeight > screenHeight) {
                    var ratio = videoWidth / videoHeight > screenWidth / screenHeight ? videoWidth / screenWidth : videoHeight / screenHeight;
                    videoWidth /= ratio;
                    videoHeight /= ratio;
                }
                $('.ab-overlay .ab-video-box').css({
                    'width': videoWidth + 'px',
                    'height': videoHeight + 'px',
                    'top': ($(window).height() - videoHeight) / 2 + 'px',
                    'left': ($(window).width() - videoWidth) / 2 + 'px'
                });
            },
            external: function() {
                $('.ab-overlay .ab-video #placeHolder').html('');
                $('.ab-overlay').hide();
                abExternallink.options.abExternallinkBol = false;
                window.open(abExternallink.options.url, '_blank');
                abExternallink.options.abExternallinkBol = false;
            },
            closeVideo: function() {
                $('.ab-overlay .ab-video #placeHolder').html('');
                $('.ab-overlay').hide();
            }
        }
        $(window).resize(function() {
            if (abExternallink.options.abExternallinkBol) {
                abExternallink.options.docheight = $(document).height();
                abExternallink.options.docwidth = $(document).width();
                abExternallink.options.winheight = $(window).height();
                abExternallink.options.winwidth = $(window).width();
                abExternallink.options.scrollTop = $(window).scrollTop();
                $('.ab-overlay').css({
                    'width': abExternallink.options.docwidth + 'px',
                    'height': abExternallink.options.docheight + 'px'
                });
                $('.ab-overlay > .ab-window').css({
                    'width': abExternallink.options.winwidth + 'px',
                    'height': abExternallink.options.winheight + 'px',
                    'top': abExternallink.options.scrollTop + 'px'
                });
                abExternallink.updateVideoBox(abExternallink.options.videoHeight, abExternallink.options.videoWidth);
            }
        });
        abExternallink.int();
    });
})(jQuery);
/* ========================================================================
 * Logout.plgns: December 2014
 * Copyright 2014 AllianceBenstein
 * ======================================================================== */
var abLogoutlink;
if (!abLogoutlink) abLogoutlink = {};
(function($) {
    $(function() {
        abLogoutlink = {
            options: {
                abBlogClass: '.ab-video-block',
                videoHeight: null,
                videoWidth: null,
                docheight: null,
                docwidth: null,
                winheight: null,
                winwidth: null,
                scrollTop: null,
                url: null,
                abLogoutlinkBol: false
            },
            int: function() {
                $('#ab-logout').click(function() {
                    //alert('logout');
                    $.ajax({
                        url: "/abcom/System/Logout.aspx",
                        cache: false,
                        success: function(data) {
                            if (data) {
                                $('#ab-logout').parent('div').html('<div class="ab-logged-out">You logged out<div>');
                                if (document.cookie.indexOf("loggedout") == -1) {
                                    document.cookie = 'loggedout=success; expires=Fri, 25 Dec 2015 20:47:11 UTC; path=/';
                                } else {
                                    document.cookie = 'loggedout=success; expires=Fri, 25 Dec 2015 20:47:11 UTC; path=/';
                                }
                                window.location = absegmenturl;
                            } else {
                                $('#ab-logout').parent('div').html('<div class="ab-logged-error">Error in logout.</div>');
                                window.location = absegmenturl;
                            }
                        }
                    });
                });
            },
            show: function() {
                var self = this;
                abExternallink.options.abLogoutlinkBol = true;
                abLogoutlink.options.docheight = $(document).height();
                abLogoutlink.options.docwidth = $(document).width();
                abLogoutlink.options.winheight = $(window).height();
                abLogoutlink.options.winwidth = $(window).width();
                abLogoutlink.options.scrollTop = $(window).scrollTop();
                abLogoutlink.options.videoHeight = 130;
                abLogoutlink.options.videoWidth = 350;
                abLogoutlink.int();
                $('.ab-overlay').show();
                $('.ab-overlay').css({
                    'width': abLogoutlink.options.docwidth + 'px',
                    'height': abLogoutlink.options.docheight + 'px'
                });
                $('.ab-overlay > .ab-window').css({
                    'width': abLogoutlink.options.winwidth + 'px',
                    'height': abLogoutlink.options.winheight + 'px',
                    'top': abLogoutlink.options.scrollTop + 'px'
                });
                abLogoutlink.updateVideoBox(130, 350);
                var po = "<div class='ab-external-popup'><div class='heading'>Logout</div><p>You are successfully logged out.</p>";
                po += '<a href="javascript:void(abLogoutlink.closeVideo());" class="ab-agree">Close</a>';
                po += '</div>';
                $('.ab-overlay .ab-video #placeHolder').html(po);
                $('.ab-overlay .ab-close').hide();
                $('.ab-overlay').fadeIn(300);
            },
            updateVideoBox: function(videoHeight, videoWidth) {
                var screenWidth = $(window).width() * 0.9,
                    screenHeight = $(window).height() * 0.9;
                if (videoWidth > screenWidth || videoHeight > screenHeight) {
                    var ratio = videoWidth / videoHeight > screenWidth / screenHeight ? videoWidth / screenWidth : videoHeight / screenHeight;
                    videoWidth /= ratio;
                    videoHeight /= ratio;
                }
                $('.ab-overlay .ab-video-box').css({
                    'width': videoWidth + 'px',
                    'height': videoHeight + 'px',
                    'top': ($(window).height() - videoHeight) / 2 + 'px',
                    'left': ($(window).width() - videoWidth) / 2 + 'px'
                });
            },
            closeVideo: function() {
                $('.ab-overlay .ab-video #placeHolder').html('');
                $('.ab-overlay').hide();
                abExternallink.options.abLogoutlinkBol = false;
                if (document.cookie.indexOf("loggedout") != -1) {
                    document.cookie = 'loggedout=not; expires=Fri, 25 Dec 2014 20:47:11 UTC; path=/';
                }
            },
            getCookie: function(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
                }
                return "";
            }
        }
        $(window).resize(function() {
            if (abExternallink.options.abLogoutlinkBol) {
                abLogoutlink.options.docheight = $(document).height();
                abLogoutlink.options.docwidth = $(document).width();
                abLogoutlink.options.winheight = $(window).height();
                abLogoutlink.options.winwidth = $(window).width();
                abLogoutlink.options.scrollTop = $(window).scrollTop();
                $('.ab-overlay').css({
                    'width': abLogoutlink.options.docwidth + 'px',
                    'height': abLogoutlink.options.docheight + 'px'
                });
                $('.ab-overlay > .ab-window').css({
                    'width': abLogoutlink.options.winwidth + 'px',
                    'height': abLogoutlink.options.winheight + 'px',
                    'top': abLogoutlink.options.scrollTop + 'px'
                });
                abLogoutlink.updateVideoBox(abLogoutlink.options.videoHeight, abLogoutlink.options.videoWidth);
            }
        });
        abLogoutlink.int();
        var loggedOut = abLogoutlink.getCookie("loggedout");
        if (loggedOut == 'success') {
            abLogoutlink.show();
        }
    });
})(jQuery);
/* ========================================================================
   Welcome Video
 *
 * ======================================================================== */
(function($) {
    $(function() {
        var welcome_video;

        function getDatafromQuerystring(key) {
            var qs = (new RegExp('[\\?&]' + key + '=([^&#]*)')).exec(window.location.href);
            if (qs == null) return false;
            else return qs[1];
        }
        welcome_video = getDatafromQuerystring('ab-email');
        try {
            console.log(welcome_video);
        } catch (e) {}
        if (welcome_video) {
            if (welcome_video == 'true') {
                abVideo.showVideo(3984037492001, 3973569768001, 'AQ~~,AAAB_76juOk~,zkV5Cahz1rLNLR-vgSbbPY5kEhQtjY89', 568, 1010);
                //$('.ab-hero-vdo-btn').trigger('click');
            }
        }
    });
    $(function() {
        //$( '.ab-hero-teaser').mouseenter( function() {$('.ab-hero-teaser h4.teaser').addClass('over')} ).mouseleave( function() { $('.ab-hero-teaser h4.teaser').removeClass('over')} );
        $('.ab-hero-teaser').mouseenter(function() {
            $(this).find('h4.teaser').addClass('over')
        }).mouseleave(function() {
            $(this).find('h4.teaser').removeClass('over')
        });
    })
})(jQuery);
/* ========================================================================
 * QueryString with set Cookie and get Cookie.plgns: May 2015
 * Copyright 2015 AllianceBenstein
 * ======================================================================== */
var abQueryString;
if (!abQueryString) abQueryString = {};
(function($) {
    $(function() {
        abQueryString = {
            getDatafromQuerystring: function(key) {
                var qs = (new RegExp('[\\?&]' + key + '=([^&#]*)')).exec(window.location.href);
                if (qs == null) return false;
                else return qs[1];
            },
            setCookie: function(cname, cvalue, exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
            },
            deleteCookie: function(cname) {
                var expires = "expires=Thu, 01-Jan-70 00:00:01 GMT";
                document.cookie = cname + "='';" + expires + ";path=/";
            },
            getCookie: function(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
                }
                return "";
            }
        }
    })
})(jQuery);
/* ========================================================================
 * Locked Content
 *
 * ======================================================================== */
var lockedContentDialog;
if (!lockedContentDialog) lockedContentDialog = {};
(function($) {
    $(function() {
        lockedContentDialog = {
            options: {
                modial_window: '<div id="ab-login-dialog"><div class="ab-login-form">&#160;</div><div/>',
                //form_path:'/sites/fixed-income/investments/us/login_fa_test.htm'
                login_dialog: '#ab-login-dialog',
                height: 575,
                init_forgot_password: false,
                login_responce: null,
                url: null,
                target: null,
                forgot_pw: false,
            },
            init_dialog: function() {},
            create_dialog: function() {
                var self = this;
                $("body").append(self.options.modial_window);
                $(self.options.login_dialog).dialog({
                    autoOpen: false,
                    draggable: false,
                    resizable: false,
                    dialogClass: "ab-default-dialog ab-login-dialog",
                    width: 450,
                    modal: true,
                    open: function(event, ui) {
                        self.load_form('#ab-login-dialog .ab-login-form', '/ABCOM/web/common/controls/Retail/RetailLoginService.aspx', 'form[name="ab-frm-login"]');
                        //$.fn.placeholder();
                        $(window).resize(function() {
                            self.center_dialog(self.options.login_dialog);
                            lockedContentDialog.resize_main_window();
                        });
                        lockedContentDialog.resize_main_window();
                    },
                    show: function(event, ui) {
                        $(this).fadeIn();
                    },
                    close: function(event, ui) {
                        if (abQueryString.getCookie('researchURL')) {
                            window.location = abQueryString.getCookie('researchURL');
                        } else {
                            if (abQueryString.getCookie('previousURL')) {
                                window.location = abQueryString.getCookie('previousURL');
                            }
                        }
                    }
                });
                try {
                    if (c == '10') {
                        $('.ab-locked-blk').removeClass('show').addClass('hide');
                    } else {
                        if (!abQueryString.getDatafromQuerystring('ab-login')) {
                            this.login_popup('.ab-locked-blk.show');
                        }
                    }
                } catch (err) {}
                if (abQueryString.getDatafromQuerystring('ab-login')) {
                    $('.ab-locked-blk').remove();
                }
            },
            login_popup: function(ele) {
                $(ele).next().bind('click', function(event) {
                    event.preventDefault();
                    lockedContentDialog.options.url = $(this).find('.abfa-locked-links').attr('href') ? $(this).find('.abfa-locked-links').attr('href') : $(this).context['href'];
                    lockedContentDialog.options.target = $(this).find('.abfa-locked-links').attr('target') ? $(this).find('.abfa-locked-links').attr('target') : $(this).context['target'];
                    abQueryString.setCookie('contentLink', lockedContentDialog.options.url, 365);
                    abQueryString.setCookie('contentTarget', lockedContentDialog.options.target, 365);
                    $('#ab-login-dialog').dialog('open');
                });
            },
            load_form: function(ele, path, form_name) {
                var self = this;
                $(ele).load(path, function() {
                    self.center_dialog(self.options.login_dialog);
                    if (self.options.init_forgot_password == false);
                    //self.initForgotPassword('.abl-login-forgotpassword');
                    self.frm_validate(form_name);
                    self.close_dialog('.ui-widget-overlay');
                    return false;
                });
            },
            resize_main_window: function() {
                if ($(document).width() <= 560) {
                    $('.ui-dialog').css({
                        'width': '100%'
                    });
                }
            },
            frm_validate: function(frm_name) {
                var self = this;
                errors_array = [];
                values_array = [];
                var i;
                var success_variable;
                var linked_in_win;
                $(frm_name).find("input.ab-frm-input-required").focus(function() {
                    $(this).removeClass('error');
                });
                $(frm_name).submit(function(event) {
                    event.preventDefault();
                    errors_array.length = 0;
                    values_array.length = 0;
                    i = 0;
                    var jsonData;
                    var url = window.location.href;
                    if ($("input[name=userid]").val() && $("input[name=password]").val()) {
                        var username = escape($("input[name=userid]").val());
                        $.ajax({
                            type: "POST",
                            url: "/ABCOM/web/common/controls/Retail/RetailLoginService.aspx/Authenticate",
                            async: false,
                            data: '{name: "' + username + '", password: "' + $("input[name=password]").val() + '", rememberme: "' + $('#rememberme').is(":checked") + '" }',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function(response) {
                                try {
                                    console.log(response);
                                } catch (err) {}
                                lockedContentDialog.options.login_responce = response;
                                //AuthenticateLogin();
                            },
                            failure: function(response) {
                                try {
                                    console.log(response.d);
                                } catch (err) {}
                            }
                        });
                        if (lockedContentDialog.options.login_responce != null) {
                            jsonData = lockedContentDialog.options.login_responce;
                            if (jsonData.d == "Failed") {
                                $(frm_name).find('.ab-error-msg-wrapper').show();
                            }
                            if (jsonData.d == "Success") {
                                success_variable = "Success";
                                if (lockedContentDialog.options.url == null) {
                                    var currentLocation = window.location.href.split('?')
                                    lockedContentDialog.options.url = currentLocation[0];
                                }
                                if (!window.location.search) {
                                    if (lockedContentDialog.options.target == '_blank') {
                                        if (url.indexOf('?') > -1) {
                                            window.open(lockedContentDialog.options.url);
                                            window.location.href = url + "&r=true";
                                        } else {
                                            window.open(lockedContentDialog.options.url);
                                            window.location.href = url + "?&r=true";
                                        }
                                    } else {
                                        window.location.href = lockedContentDialog.options.url;
                                    }
                                } else {
                                    if (lockedContentDialog.options.target == '_blank') {
                                        window.open(lockedContentDialog.options.url);
                                        window.location.href = url;
                                    } else {
                                        window.location.href = lockedContentDialog.options.url;
                                    }
                                }
                            }
                        }
                    } else if ($("input[name=forgotPasswd]").val()) {
                        $.ajax({
                            type: "POST",
                            url: "/ABCOM/web/common/controls/Retail/RetailLoginService.aspx/ForgotPasswordBtn_Click",
                            data: '{email: "' + $("input[name=forgotPasswd]").val() + '" }',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function(response) {
                                jsonData = response;
                                ForgotPassword();
                            },
                            failure: function(response) {
                                alert(response.d);
                            }
                        });

                        function ForgotPassword() {
                            try {
                                console.log(jsonData);
                            } catch (err) {}
                            if (jsonData.d == "OK") {
                                self.load_form('#ab-login-dialog .ab-login-form', '/ABCOM/web/common/controls/Retail/RetailLoginService.aspx', 'form[name="ab-frm-login"]');
                            }
                        }
                    } else {
                        //errors_array.push($(element))
                        $(frm_name).find('.ab-error-msg-wrapper').show();
                    }
                });
            },
            close_dialog: function(ele) {
                var self = this;
                $(ele).add('.ab-btn-cancel').bind('click', function(event) {
                    event.preventDefault();
                    $(self.options.login_dialog).dialog('close');
                });
            },
            center_dialog: function(ele) {
                $(ele).dialog("option", "position", "center");
            },
            initForgotPassword: function(ele) {
                this.options.init_forgot_password = true;
                var self = this;
                $('.abl-login-forgotpassword').bind('click', function(event) {
                    abRetailLogin_v1.closeSignup();
                    event.preventDefault();
                    $('#ab-login-dialog').dialog('open');
                    setTimeout(function() {
                        lockedContentDialog.load_form('#ab-login-dialog .ab-login-form', '/abcom/System/Login/Retail/retention_assets/Content/forgot_password.html', 'form[name="ab-frm-forgotpassword"]');
                    }, 100);
                });
            },
        }
        if ($('.ab-locked-blk').hasClass('show')) {
            lockedContentDialog.create_dialog();
        } else {};
        // Check for LinkedIn login to open
        if (abQueryString.getDatafromQuerystring('LinkedIn') == 'success' && c == '10') {
            if (abQueryString.getCookie('contentLink')) {
                if (abQueryString.getCookie('contentTarget') == '_blank') {
                    window.open(abQueryString.getCookie('contentLink'));
                    abQueryString.setCookie('contentLink', null, -365);
                    abQueryString.setCookie('contentTarget', null, -365);
                } else {
                    if (abQueryString.getCookie('contentTarget') != null) {
                        window.location.href = abQueryString.getCookie('contentLink');
                    }
                }
            }
        };
        if ($("#ab-login-dialog").length == 0) {
            lockedContentDialog.create_dialog();
        }
    })
})(jQuery);
/* ========================================================================
 * Remove last commas from Audiencs/Segmens names 
 * ======================================================================== */
var removeCommaString;
if (!removeCommaString) removeCommaString = {};
(function($) {
    $(function() {
        removeCommaString = {
            init: function() {
                $('.ab-audiences').each(function() {
                    var currentHTML = $(this).html();
                    if (currentHTML != '') {
                        var modifiedString = currentHTML.replace(/,\s*$/, '');
                        $(this).html('For ' + modifiedString);
                    }
                });
            }
        }
        removeCommaString.init();
    });
})(jQuery);
/* ========================================================================
 * Orieatation change
 * ======================================================================== */
(function($) {
    $(function() {
        window.onorientationchange = function() {
            abVideo.closeVideo();
        }
    });
})(jQuery);
/* ========================================================================
 * Close Local Navigation on body click 
 * ======================================================================== */
(function($) {
    try {
        var _local_navigation = $('#localnavApp');
        $(_local_navigation).bind('click', function(e) {
            e.stopPropagation();
        })
        $('body, html').not(_local_navigation).bind('click', function(e) {
            submenu.closeSubmenu();
        })
    } catch (e) {}
})(jQuery);
/* ========================================================================
 * Insight Dropdown Change JS 
 * ======================================================================== */
var abInsightDrop;
if (!abInsightDrop) abInsightDrop = {};
(function($) {
    $(function() {
        abInsightDrop = {
            init: function() {
                var _insigh_dropdown = $('.ab-select');
                _insigh_dropdown.bind('click', function(e) {
                    e.stopPropagation();
                });
                $('.dropdown-arrow,.ab-select').click(function() {
                    $('.ab-insight-ul').toggle();
                });
                $('.ab-insight-ul li a').click(function() {
                    var currentText = $(this).html();
                    $('.ab-select').html(currentText);
                    $('.ab-insight-ul').toggle();
                });
                $('body, html').not(_insigh_dropdown).bind('click', function() {
                    $('.ab-insight-ul').hide();
                });
            },
            changeType: function() {
                var type = window.location.hash.substr(1);
                var res = type.replace("/", "");
                if (res == '') {
                    res = 'Overview';
                }
                $('.ab-select').html(res);
            }
        }
        abInsightDrop.init();
    });
})(jQuery);
/* ========================================================================
 * AB Tracking JS 
 * ======================================================================== */
var abTracking;
if (!abTracking) abTracking = {};
(function($) {
    $(function() {
        abTracking = { // Mediamind button function for tracking 
            ebConversion: function(conversionID, redirURL, targetWin) {
                try {
                    var elem = document.createElement("SCRIPT");
                    elem.src = "https://bs.serving-sys.com/BurstingPipe/ActivityServer.bs?cn=as&#38;ActivityID=" + conversionID + "&#38;rnd=" + (Math.round(Math.random() * 1000000));
                    document.body.appendChild(elem);
                    if (typeof(redirURL) != "undefined") {
                        if (typeof(targetWin) == "undefined" || targetWin == "_blank") {
                            window.open(redirURL);
                        } else {
                            var redirFunction = function() {
                                document.location.href = redirURL
                            };
                            setTimeout(redirFunction, 1000);
                        }
                    }
                } catch (e) {}
            },
            ebConversionPopup: function(conversionID) {
                try {
                    var elem = document.createElement("SCRIPT");
                    elem.src = "https://bs.serving-sys.com/BurstingPipe/ActivityServer.bs?cn=as&#38;ActivityID=" + conversionID + "&#38;rnd=" + (Math.round(Math.random() * 1000000));
                    document.body.appendChild(elem);
                } catch (e) {}
            }
        }
    });
})(jQuery);
/* ========================================================================
 * Desktop More.plgns: July 2015
 * Copyright 2015 AB
 * ======================================================================== */
(function($) {
    $.fn.abDesktopMore = function(options) {
        var settings = $.extend({
            number: 2,
            totalHeight: 0,
            moreLink: '.ab-more',
            lessLink: '.ab-less'
        }, options);
        // variable
        var base = this;
        base.$el = $(this);
        base.divs = $(this).find(' > .tiles');
        base.more = $(this).parents('.ab-insight-cnt').find(settings.moreLink);
        base.less = $(this).parents('.ab-insight-cnt').find(settings.lessLink);
        base.lessDiv = $(this).parents('.ab-insight-cnt').find('.ab-less-div');
        base.lmoreDiv = $(this).parents('.ab-insight-cnt').find('.ab-more-div');
        base.init = function() {
            var totalDivs = $(this).find('> .tiles').length;
            if (totalDivs > settings.number) {
                var initialHeight = 0;
                if ($(window).width() > 480) {
                    $(base.divs).each(function(index, element) {
                        if (index < settings.number) {
                            if ($(this).height() > settings.totalHeight) {
                                settings.totalHeight = $(this).height();
                            }
                        }
                    });
                    settings.totalHeight += 36;
                } else {
                    $(base.divs).each(function(index, element) {
                        if (index < settings.number) {
                            settings.totalHeight += $(this).height();
                            settings.totalHeight += 36;
                        }
                    });
                }
                base.$el.css({
                    'height': settings.totalHeight + 'px',
                    'overflow': 'hidden'
                });
                $(base.more).click(function(e) {
                    base.$el.css({
                        'height': '100%'
                    });
                    base.lmoreDiv.hide();
                    base.lessDiv.show();
                    base.close();
                    base.lessDiv.css({
                        'border-top': '1px solid #ccc'
                    });
                });
                base.lmoreDiv.show();
            }
        }
        base.close = function() {
            $(base.less).click(function(e) {
                base.$el.css({
                    'height': settings.totalHeight + 'px',
                });
                base.lmoreDiv.show();
                base.lessDiv.hide();
            });
        }
        base.init();
    };
}(jQuery));
/* ========================================================================
   IE8 Overlay
 *
 * ======================================================================== */
var ie8Plgn;
if (!ie8Plgn) ie8Plgn = {};
(function($) {
    $(function() {
        ie8Plgn = {
            options: {
                width: 0,
                height: 0,
                overlay: ''
            },
            setOptions: function(optsObj) {
                if (!optsObj) return;
                for (var optName in optsObj) {
                    this.options[optName] = optsObj[optName];
                }
            },
            init: function(ops) {
                this.setOptions(ops);
                this.createIE8Overlay();
                this.openIE8Dialog();
            },
            createIE8Overlay: function() {
                $("body").append("<div id='temp-ie8-overlay'></div>");
                $("#temp-ie8-overlay").height($(document).height()).css({
                    'opacity': 0.7,
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'background-color': '#000000',
                    'width': '100%'
                });
            },
            openIE8Dialog: function() {
                var self = this;
                ie8_dialog = $("<div id='ab-dialog-ie8'><p>&nbsp;</p></div>").dialog({
                    resizable: false,
                    autoOpen: false,
                    width: 600,
                    //modal: true,
                    header: 'dfghdfh',
                    dialogClass: "abrwd-dialog-modal ab-dialog-ie8 ie8-dialog",
                    beforeClose: function() {
                        $('#temp-ie8-overlay').fadeOut();
                    }
                });
                ie8_dialog.dialog("open");
                _path = "/resources/data/ie8/ie_json_en.htm";
                if (typeof ablangNameShort !== 'undefined') {
                    _path = "/resources/data/ie8/ie_json_" + ablangNameShort + ".htm"
                }
                $.getJSON(_path).done(function(json) {
                    dialog_header = json.upgrade_message[0].header;
                    dialog_bodytext = json.upgrade_message[0].snippet;
                    txt = '<h1>' + dialog_header + '</h1>' + dialog_bodytext;
                    $("#ab-dialog-ie8 p").html(txt);
                    $.cookie('ie_legacy', 1, {
                        path: '/'
                    });
                }).fail(function(jqxhr, textStatus, error) {
                    var err = textStatus + ", " + error;
                    //console.log( "Request Failed: " + err );
                });
                $(window).resize(function() {
                    $("#ab-dialog-ie8").dialog("option", "position", "center");
                });
                this.closeIE8Overlay();
            },
            closeIE8Overlay: function() {
                $('#temp-ie8-overlay').bind('click', function() {
                    $(this).fadeOut();
                    ie8_dialog.dialog('close');
                });
            }
        }
    });
    $(function() {
        try {
            function isIE() {
                var myNav = navigator.userAgent.toLowerCase();
                return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
            }
            //console.log( isIE())
            if (isIE() && isIE() < 11) {
                if ($.cookie('ie_legacy')) {} else {
                    ie8Plgn.init();
                }
            } else {}
        } catch (err) {}
    });
})(jQuery);
/* ========================================================================
   Help Tips Overlay
 *
 * ======================================================================== */
/* ========================================================================
   Default Segment Overlay
 *
 * ======================================================================== */
var defaultSegPlgn;
if (!defaultSegPlgn) defaultSegPlgn = {};
(function($) {
    $(function() {
        defaultSegPlgn = {
            options: {
                overlay: '.ab-tips-overlay'
            },
            setOptions: function(optsObj) {
                if (!optsObj) return;
                for (var optName in optsObj) {
                    this.options[optName] = optsObj[optName];
                }
            },
            init: function(ops) {
                this.setOptions(ops);
            },
            initSegSetOverlay: function(redirect_url, segname, txt, header, global_domain, link_name, current_text, btn_yes, btn_no) {
                if ($.cookie('ab_segpage') && $.cookie('ab_segpage') == redirect_url) {
                    window.location.href = redirect_url;
                } else {
                    this.openSegSetOverlay(redirect_url, segname, txt, header, global_domain, link_name, current_text, btn_yes, btn_no);
                }
            },
            cookieAutoSet: function(redirect_url, global_domain) {
                if (global_domain.indexOf(document.domain) != -1) {
                    $.cookie('ab_segpage', encodeURI(redirect_url), {
                        expires: 10 * 365,
                        path: '/'
                    });
                } else if (redirect_url.indexOf(global_domain) != -1) {
                    redirect_url = redirect_url + '&set_default=' + redirect_url;
                } else if (redirect_url.indexOf(document.domain) != -1) {
                    redirect_url = global_domain + '/sites/cookie_portal.html?path=' + redirect_url;
                }
                window.location.href = redirect_url;
            },
            openSegSetOverlay: function(redirect_url, segname, txt, header, global_domain, link_name, current_text, btn_yes, btn_no) {
                segment_dialog = $("<div id='ab-dialog-segment'><p>&nbsp;</p></div>").dialog({
                    resizable: false,
                    autoOpen: false,
                    width: 600,
                    modal: true,
                    //: header,
                    dialogClass: "abrwd-dialog-modal ab-dialog-segment",
                    buttons: [{
                        text: btn_yes,
                        "class": 'btn-dialog-accept',
                        click: function() {
                            if (global_domain.indexOf(document.domain) != -1) {
                                $.cookie('ab_segpage', encodeURI(redirect_url), {
                                    expires: 10 * 365,
                                    path: '/'
                                });
                                $.cookie('ab_segpage_name', encodeURI(segname), {
                                    expires: 10 * 365,
                                    path: '/'
                                });
                            } else if (redirect_url.indexOf(global_domain) != -1) {
                                redirect_url = redirect_url + '?set_default=' + redirect_url + '&set_name=' + segname;
                            } else if (redirect_url.indexOf(document.domain) != -1) {
                                redirect_url = global_domain + '/sites/cookie_portal.html?path=' + redirect_url + '&set_name=' + segname;
                            }
                            $(this).dialog("close");
                            window.location.href = redirect_url;
                        }
                    }, {
                        text: btn_no,
                        "class": 'btn-dialog-cancel',
                        click: function() {
                            $(this).dialog("close");
                            window.location.href = redirect_url;
                        }
                    }]
                });
                segment_dialog.dialog("open");
                if ($.cookie('ab_segpage')) {
                    //txt = current_text + ' <strong>' + decodeURI( $.cookie('ab_segpage_name')) + '</strong> <br> ' + txt + '<br> <h1> ' + segname + '</h1>';
                    txt = '<h1>' + segname + '</h1>' + txt + '<br/><br/>' + current_text + ' <strong>' + decodeURI($.cookie('ab_segpage_name')) + '</strong>';
                } else {
                    txt = '<h1>' + segname + '</h1><br/>' + txt;
                }
                $("#ab-dialog-segment p").html(txt);
                $(window).resize(function() {
                    $("#ab-dialog-segment").dialog("option", "position", "center");
                });
            },
            closeSegSetOverlay: function() {
                $('.ab-tips-overlay').bind('click', function() {
                    $(this).hide();
                });
            }
        };
        // END defaultSegPlgn
    });
    $(function() {
        try {
            var seg_url = abQueryString.getDatafromQuerystring('set_default');
            var myObject = domains[0],
                urlBoolean = false;
            for (var key in myObject) {
                if (myObject.hasOwnProperty(key)) {
                    if (seg_url.indexOf(myObject[key]) == 0) {
                        urlBoolean = true;
                    }
                }
            }
            if (seg_url && urlBoolean) {
                $.cookie('ab_segpage', seg_url, {
                    expires: 10 * 365,
                    path: '/'
                });
                $.cookie('ab_segpage_name', abQueryString.getDatafromQuerystring('set_name'), {
                    expires: 10 * 365,
                    path: '/'
                });
            }
        } catch (e) {}
        defaultSegPlgn.init();
    });
})(jQuery);
/* ========================================================================
 * GLP locked Content *
 * ======================================================================== */
var glpLockedContent;
if (!glpLockedContent) glpLockedContent = {};
(function($) {
    $(function() {
        glpLockedContent = {
            options: {
                modial_window: '<div id="dialog-terms-of-use-glp"><div class="ab-login-form">&#160;</div><div/>',
                login_dialog: '#dialog-terms-of-use-glp',
                url: null,
                type: null,
                insittutionalIds: ["2", "3", "4", "5", "6", "20"],
                faonly: ["16", "18"],
                accepted: false
            },
            getDatafromQuerystring: function(key, contentLink) {
                var qs = (new RegExp('[\\?&]' + key + '=([^&#]*)')).exec(contentLink);
                if (qs == null) return false;
                else return qs[1];
            },
            create_dialog: function() {
                var self = this;
                $("body").append(self.options.modial_window);
                $('#dialog-terms-of-use-glp').dialog({
                    autoOpen: false,
                    draggable: false,
                    resizable: false,
                    width: 700,
                    dialogClass: "ab-default-dialog ab-login-dialog",
                    modal: true,
                    open: function(event, ui) {
                        self.load_form('#dialog-terms-of-use-glp .ab-login-form', '/resources/partials/termofuse.htm');
                        $(window).resize(function() {
                            lockedContentDialog.center_dialog('#dialog-terms-of-use-glp');
                            glpLockedContent.resize_main_window();
                        });
                        glpLockedContent.resize_main_window();
                        $('.ui-dialog-titlebar').css({
                            'display': 'none'
                        });
                    },
                    close: function(event, ui) {
                        if (!glpLockedContent.options.accepted) {
                            if (abQueryString.getCookie('researchURL')) {
                                window.location = abQueryString.getCookie('researchURL');
                            } else {
                                if (abQueryString.getCookie('previousURL')) {
                                    window.location = abQueryString.getCookie('previousURL');
                                }
                            }
                        }
                    }
                });
            },
            openUrl: function(contentLink, urltype) {
                var w, h;
                if (w == '' || w == '0') {
                    w = '1024';
                }
                if (h == '' || h == '0') {
                    h = '768';
                }
                var attribute = "width=" + w + ",height=" + h + ",resizable=yes,menubar=no,scrollbars=yes";
                if (urltype == '_blank') {
                    var childWindow = window.open(contentLink, "PDF", attribute);
                    if (null == childWindow) alert("Window blocked, please disable all Popup blockers.");
                    else try {
                        childWindow.focus();
                        window.location.reload();
                    } catch (e) {}
                } else {
                    window.location = contentLink;
                }
            },
            init: function(contentLink, intCompliancelevel, faCompliancelevel, urltype) {
                glpLockedContent.options.url = contentLink;
                glpLockedContent.options.type = urltype;
                var segid = null;
                if (glpLockedContent.getDatafromQuerystring('seg', contentLink)) {
                    segid = glpLockedContent.getDatafromQuerystring('seg', contentLink);
                } else {
                    segid = currentSegment;
                }
                var insittutionalIds = glpLockedContent.options.insittutionalIds;
                var faonly = glpLockedContent.options.faonly;
                if ((insittutionalIds.indexOf(segid) != -1) && (intCompliancelevel == '4')) {
                    if (InstTC != '1') {
                        $('#dialog-terms-of-use-glp').dialog('open');
                    } else {
                        glpLockedContent.openUrl(contentLink, urltype);
                    }
                } else if ((faonly.indexOf(segid) != -1) && faCompliancelevel == '2') {
                    if (c != '10') {
                        lockedContentDialog.options.url = contentLink;
                        lockedContentDialog.options.target = urltype;
                        $('#ab-login-dialog').dialog('open');
                    } else {
                        glpLockedContent.openUrl(contentLink, urltype);
                    }
                } else {
                    glpLockedContent.openUrl(contentLink, urltype);
                }
                //console.log(segid);
            },
            maininit: function(intCompliancelevel, faCompliancelevel) {
                glpLockedContent.options.url = window.location.href;
                glpLockedContent.options.type = '_self';
                var segid = currentSegment;
                var insittutionalIds = glpLockedContent.options.insittutionalIds;
                var faonly = glpLockedContent.options.faonly;
                if ((insittutionalIds.indexOf(segid) != -1) && (intCompliancelevel == '4')) {
                    if (InstTC != '1') {
                        if (!abQueryString.getCookie('researchURL')) {
                            abQueryString.setCookie('previousURL', absegmenturl, 365);
                        }
                        $('#dialog-terms-of-use-glp').dialog('open');
                    }
                } else if ((faonly.indexOf(segid) != -1) && faCompliancelevel == '2') {
                    if (c != '10') {
                        if (!abQueryString.getCookie('researchURL')) {
                            abQueryString.setCookie('previousURL', absegmenturl, 365);
                        }
                        lockedContentDialog.options.url = glpLockedContent.options.url;
                        lockedContentDialog.options.target = glpLockedContent.options.type;
                        $('#ab-login-dialog').dialog('open');
                    }
                }
            },
            faonly: function(faCompliancelevel, contentLink, urltype) {
                abQueryString.setCookie('previousURL', window.location.href, 365);
                abQueryString.setCookie('researchURL', window.location.href, 365);
                if (c != '10' && faCompliancelevel == '2') {
                    lockedContentDialog.options.url = contentLink;
                    lockedContentDialog.options.target = urltype;
                    $('#ab-login-dialog').dialog('open');
                } else {
                    glpLockedContent.openUrl(contentLink, urltype);
                }
            },
            load_form: function(ele, path) {
                var self = this;
                $(ele).load(path, function() {
                    lockedContentDialog.center_dialog(self.options.login_dialog);
                    return false;
                });
            },
            resize_main_window: function() {
                if ($(document).width() <= 750) {
                    $('.ui-dialog').css({
                        'width': '100%'
                    });
                }
            },
            modalClose: function(accept) {
                glpLockedContent.options.accepted = accept;
                $('#dialog-terms-of-use-glp').dialog('close');
                if (accept) {
                    var iDiv = document.createElement('div');
                    iDiv.id = 'block';
                    iDiv.className = 'block';
                    document.getElementsByTagName('body')[0].appendChild(iDiv);
                    document.getElementById("block").innerHTML = '<object type="text/html" data="/resources/partials/termofuseacceptyes.htm" ></object>';
                    setTimeout(function() {
                        glpLockedContent.openUrl(glpLockedContent.options.url, glpLockedContent.options.type);
                    }, 1000);
                }
            },
            createlink: function() {
                $('.abfa-locked-links-glp').click(function() {
                    abQueryString.setCookie('previousURL', window.location.href, 365);
                    abQueryString.setCookie('researchURL', window.location.href, 365);;
                    var urllink = $(this).attr('data-link');
                    var urltype = $(this).attr('data-urltype');
                    var intCompliancelevel = $(this).attr('data-ins');
                    var faCompliancelevel = $(this).attr('data-fa');
                    glpLockedContent.init(urllink, intCompliancelevel, faCompliancelevel, urltype);
                });
            },
            explore: function(intJson, faJson) {
                var exinsittutionalIds = glpLockedContent.options.insittutionalIds;
                //var swfObject = 'swfObjectSlide' + intJson.swfObjectSlide;
                if ((exinsittutionalIds.indexOf(currentSegment) != -1) && intJson.intcompliancelevel == '4') {
                    //LaunchInstrumentation(intJson.mylink, intJson.inline, intJson.availableto, intJson.prospectingTargetEmail, intJson.width, intJson.height, client, intJson.related, currentSegment, complianceLevel, InstTC, intJson.intcompliancelevel, swfObject);
                    glpLockedContent.options.url = intJson.mylink;
                    glpLockedContent.options.type = '_blank';
                    if (InstTC != '1') {
                        if (!abQueryString.getCookie('researchURL')) {
                            abQueryString.setCookie('previousURL', absegmenturl, 365);
                        }
                        $('#dialog-terms-of-use-glp').dialog('open');
                    } else {
                        glpLockedContent.openUrl(glpLockedContent.options.url, glpLockedContent.options.type);
                    }
                } else if ((glpLockedContent.options.faonly.indexOf(currentSegment) != -1) && faJson.facompliancelevel == '2' && c != '10') {
                    lockedContentDialog.options.url = faJson.mylink;
                    lockedContentDialog.options.target = '_blank';
                    $('#ab-login-dialog').dialog('open');
                } else {
                    glpLockedContent.openUrl(intJson.mylink, '_blank');
                }
            },
            explorelink: function() {
                $('.ab-rsb-exploremore').click(function() {
                    abQueryString.setCookie('previousURL', window.location.href, 365);
                    abQueryString.setCookie('researchURL', window.location.href, 365);
                    var intJson = JSON.parse($(this).attr('data-int'));
                    var faJson = JSON.parse($(this).attr('data-fa'));
                    glpLockedContent.explore(intJson, faJson);
                });
            }
        }
        glpLockedContent.create_dialog();
        glpLockedContent.createlink();
        glpLockedContent.explorelink();
    });
})(jQuery);
/* ========================================================================
 * Addspace Insight.plgns: July 2015
 * Copyright 2015 AllianceBenstein
 * ======================================================================== */
(function($) {
    $.fn.abAddspace = function(options) {
        var settings = $.extend({
            gridCnt: '.ab-insight-cnt__cnt',
            gridWidth: 0
        }, options);
        var base = this;
        base.init = function() {
            base.reomveLine();
            settings.gridWidth = $(base).width();
            var divwidth = 0,
                currentWidth = 0,
                nextWidth = 0;
            $(base).find(' div.tiles').each(function(index, element) {
                currentWidth = $(this).width() + 18;
                nextWidth = $(this).next('div').width() + 18;
                divwidth = divwidth + currentWidth;
                if ((divwidth + nextWidth) > settings.gridWidth) {
                    $(this).after('<div class="ab-grid-space"></div>');
                    divwidth = 0;
                }
            });
        }
        base.reomveLine = function() {
            $(base).find('.ab-grid-space').remove();
        }
        base.init();
    };
}(jQuery));
/* ========================================================================
 * new Inline Video.plgns: Ocotober 2015
 * Copyright 2015 AB
 * ======================================================================== */
var HTML5BCL = {};
HTML5BCL.playerData = {
    "accountId": null,
    "playerId": null,
    "videoId": null,
    "Id": null
};
HTML5BCL.myPlayer = null;
HTML5BCL.isPlayerAdded = false;

HTML5BCL.addPlayer = function() {
    if (HTML5BCL.isPlayerAdded == false) {
        var playerHTML = "";
        playerHTML = '<div id="placeHolder"><video id=\"myPlayerIn\" data-video-id=\"' + HTML5BCL.playerData.videoId + '\"  data-account=\"' + HTML5BCL.playerData.accountId + '\" data-player=\"' + HTML5BCL.playerData.playerId + '\" data-embed=\"default\" class=\"video-js\" controls></video></div>';
        document.getElementById(HTML5BCL.playerData.Id).innerHTML = playerHTML;
        var s = document.createElement('script');
        s.src = "//players.brightcove.net/" + HTML5BCL.playerData.accountId + "/" + HTML5BCL.playerData.playerId + "_default/index.min.js";
        document.body.appendChild(s);
        s.onload = function() {
            HTML5BCL.myPlayer = videojs('myPlayerIn');
            HTML5BCL.myPlayer.play();
            HTML5BCL.isPlayerAdded = true;
        }
    } else {}
};
HTML5BCL.removePlayer = function() {
    if (HTML5BCL.isPlayerAdded == true) {
        HTML5BCL.isPlayerAdded = false;
        HTML5BCL.myPlayer.dispose();
        document.getElementById(HTML5BCL.playerData.Id).innerHTML = "";
    }
};
/* ========================================================================
 * new Popup Video.plgns: Ocotober 2015
 * Copyright 2015 AB
 * ======================================================================== */
var abVideoHTML5;
if (!abVideoHTML5) abVideoHTML5 = {};
(function($) {
    $(function() {
        abVideoHTML5 = {
            options: {
                myPlayer: null,
                abBlogClass: '.ab-video-block',
                videoHeight: null,
                videoWidth: null,
                docheight: null,
                docwidth: null,
                winheight: null,
                winwidth: null,
                scrollTop: null,
                playerData: {
                    'accountId': null,
                    'playerId': null,
                    'videoId': null
                },
                video: false,
                myPlayer: null
            },
            int: function() {
                abVideoHTML5.options.docheight = $(document).height();
                abVideoHTML5.options.docwidth = $(document).width();
                abVideoHTML5.options.winheight = $(window).height();
                abVideoHTML5.options.winwidth = $(window).width();
                abVideoHTML5.options.scrollTop = $(window).scrollTop();
            },
            showVideo: function(accountId, playerId, videoId, videoHeight, videoWidth) {
                abVideoHTML5.int();
                var self = this;
                abVideoHTML5.options.video = true;
                abVideoHTML5.options.playerData.accountId = accountId;
                abVideoHTML5.options.playerData.playerId = playerId;
                abVideoHTML5.options.playerData.videoId = videoId;
                abVideoHTML5.options.videoHeight = videoHeight;
                abVideoHTML5.options.videoWidth = videoWidth;
                $('.ab-overlay').show();
                $('.ab-overlay').css({
                    'width': abVideoHTML5.options.docwidth + 'px',
                    'height': abVideoHTML5.options.docheight + 'px'
                });
                $('.ab-overlay > .ab-window').css({
                    'width': abVideoHTML5.options.winwidth + 'px',
                    'height': abVideoHTML5.options.winheight + 'px',
                    'top': abVideoHTML5.options.scrollTop + 'px'
                });
                abVideoHTML5.updateVideoBox(abVideoHTML5.options.videoHeight, abVideoHTML5.options.videoWidth);
                var po = '<video id=\"myPlayer\" data-video-id=\"' + abVideoHTML5.options.playerData.videoId + '\"  data-account=\"' + abVideoHTML5.options.playerData.accountId + '\" data-player=\"' + abVideoHTML5.options.playerData.playerId + '\" data-embed=\"default\" class=\"video-js\" controls></video>';
                $('.ab-overlay .ab-video #placeHolder').html(po);
                $('.ab-overlay').fadeIn(300);
                var s = document.createElement('script');
                s.src = "//players.brightcove.net/" + abVideoHTML5.options.playerData.accountId + "/" + abVideoHTML5.options.playerData.playerId + "_default/index.min.js";
                document.body.appendChild(s);
                s.onload = function() {
                    abVideoHTML5.options.myPlayer = videojs('myPlayer');
                    abVideoHTML5.options.myPlayer.play();
                }
            },
            updateVideoBox: function(videoHeight, videoWidth) {
                var videoHeight = videoHeight;
                var videoWidth = videoWidth;
                var screenWidth = $(window).width() * 0.9,
                    screenHeight = $(window).height() * 0.9;
                if (videoWidth > screenWidth || videoHeight > screenHeight) {
                    var ratio = videoWidth / videoHeight > screenWidth / screenHeight ? videoWidth / screenWidth : videoHeight / screenHeight;
                    videoWidth /= ratio;
                    videoHeight /= ratio;
                }
                $('.ab-overlay .ab-video-box').css({
                    'width': videoWidth + 'px',
                    'height': videoHeight + 'px',
                    'top': ($(window).height() - videoHeight) / 2 + 'px',
                    'left': ($(window).width() - videoWidth) / 2 + 'px'
                });
            },
            closeVideo: function() {
                if (abVideoHTML5.options.myPlayer) {
                    abVideoHTML5.options.myPlayer.dispose();
                }
                $('.ab-overlay .ab-video #placeHolder').html('');
                $('.ab-overlay').hide();
                abVideoHTML5.options.video = false;
            }
        }
        $(window).resize(function() {
            if (abVideoHTML5.options.video) {
                abVideoHTML5.options.docheight = $(document).height();
                abVideoHTML5.options.docwidth = $(window).width();
                abVideoHTML5.options.winheight = $(window).height();
                abVideoHTML5.options.winwidth = $(window).width();
                abVideoHTML5.options.scrollTop = $(window).scrollTop();
                $('.ab-overlay').css({
                    'width': abVideoHTML5.options.winwidth + 'px',
                    'height': $(document).height() + 'px'
                });
                $('.ab-overlay > .ab-window').css({
                    'width': $(window).width() + 'px',
                    'height': $(window).height() + 'px',
                    'top': abVideoHTML5.options.scrollTop + 'px'
                });
                abVideoHTML5.updateVideoBox(abVideoHTML5.options.videoHeight, abVideoHTML5.options.videoWidth);
            }
        });
    });
})(jQuery);
/* ========================================================================
 * new Login.plgns: November 2015
 * Copyright 2015 AB
 * ======================================================================== */
var abAdvisorLogin;
if (!abAdvisorLogin) abAdvisorLogin = {};
(function($) {
    $(function() {
        var urlAdvisor = abQueryString.getDatafromQuerystring('advisor');
        abAdvisorLogin = {
            show: function() {
                if (c != '10') {
                    lockedContentDialog.options.url = '/financial-professional/us/home.htm';
                    abQueryString.setCookie('researchURL', window.location.href, 365);
                    $('.ab-navbar-collapse').slideToggle();
                    $('#ab-login-dialog').dialog('open');
                }
            },
            checklogin: function() {
                if (c != '10') {
                    lockedContentDialog.options.url = window.location.href;
                    if (abQueryString.getDatafromQuerystring('seg')) {
                        abQueryString.setCookie('researchURL', absegmenturl, 365);
                    } else {
                        if (!abQueryString.getCookie('researchURL')) {
                            abQueryString.setCookie('researchURL', '/', 365);
                        }
                    }
                    $('#ab-login-dialog').dialog('open');
                }
            },
            init: function() {
                if (advisor) {
                    abAdvisorLogin.checklogin();
                }
            },
            firstinit: function() {
                if (urlAdvisor) {
                    abAdvisorLogin.checklogin();
                }
            }
        }
        if (urlAdvisor === 'true') {
            abAdvisorLogin.firstinit();
        } else {
            if (typeof(advisor) != 'undefined') {
                abAdvisorLogin.init();
            }
        }
    });
})(jQuery);
/* ========================================================================
 * new Microsite Scroll to content button
 * Copyright 2015 AB
 * ======================================================================== */
$(document).ready(function() {
    function scrollToAnchor(aid) {
        var aTag = $("#" + aid);
        var aTop = aTag.offset().top;
        $('html,body').animate({
            scrollTop: aTop
        }, 'fast');
    }
    $("#abpl-content-scroll").click(function() {
        scrollToAnchor('abpl-content-start');
    });
});
/* ========================================================================
 * Retail JS
 * Copyright 2016 AB
 * ======================================================================== */
var abRetailLogin_v1;
if (!abRetailLogin_v1) abRetailLogin_v1 = {};
(function($) {
    $(function() {
        abRetailLogin_v1 = {
            options: {
                wrapperHtml: '<div id="ab-retail-login"></div>',
                docheight: null,
                docwidth: null,
                winheight: null,
                winwidth: null,
                scrollTop: null,
                bioImg: null,
                bioDesc: null,
                descWidth: 770,
                descHeight: 100,
                current: 0,
                total: null,
                currentID: null,
                title: null
            },
            createHtml: function() {
                var self = this;
                $("body").append(self.options.wrapperHtml);
            },
            int: function() {
                abRetailLogin_v1.options.docheight = $(document).height();
                abRetailLogin_v1.options.docwidth = $(document).width();
                abRetailLogin_v1.options.winheight = $(window).height();
                abRetailLogin_v1.options.winwidth = $(window).width();
                abRetailLogin_v1.options.scrollTop = $(window).scrollTop();
            },
            showBid: function() {
                abRetailLogin_v1.int();
                var self = this;
                $('#ab-retail-login .ab-overlay').show();
                $('#ab-retail-login .ab-overlay').css({
                    'width': abRetailLogin_v1.options.docwidth + 'px',
                    'height': abRetailLogin_v1.options.docheight + 'px'
                });
                $('#ab-retail-login .ab-overlay > .ab-window').css({
                    'width': abRetailLogin_v1.options.winwidth + 'px',
                    'height': abRetailLogin_v1.options.winheight + 'px',
                    'top': abRetailLogin_v1.options.scrollTop + 'px'
                });
                abRetailLogin_v1.updateBox(abRetailLogin_v1.options.descHeight, abRetailLogin_v1.options.descWidth);
            },
            updateBox: function(videoHeight, videoWidth) {
                var videoHeight = videoHeight;
                var videoWidth = videoWidth;
                var screenWidth = $(window).width() * 0.9,
                    screenHeight = $(window).height() * 0.9;
                if (videoWidth > screenWidth || videoHeight > screenHeight) {
                    var ratio = videoWidth / videoHeight > screenWidth / screenHeight ? videoWidth / screenWidth : videoHeight / screenHeight;
                    videoWidth /= ratio;
                    videoHeight /= ratio;
                }
                $('#ab-retail-login .ab-overlay .ab-retail-login-box').css({
                    'width': videoWidth + 'px',
                    'top': '100px',
                    'left': ($(window).width() - videoWidth) / 2 + 'px'
                });
            },
            closeSignup: function() {
                $('#ab-retail-login').html('');
                $('.ab-overlay').hide();
            }
        }
        $(window).resize(function() {
            abRetailLogin_v1.options.docheight = $(document).height();
            abRetailLogin_v1.options.docwidth = $(window).width();
            abRetailLogin_v1.options.winheight = $(window).height();
            abRetailLogin_v1.options.winwidth = $(window).width();
            abRetailLogin_v1.options.scrollTop = $(window).scrollTop();
            $('#ab-retail-login .ab-overlay').css({
                'width': abRetailLogin_v1.options.winwidth + 'px',
                'height': $(document).height() + 'px'
            });
            $('#ab-retail-login .ab-overlay > .ab-window').css({
                'width': $(window).width() + 'px',
                'height': $(window).height() + 'px',
                'top': abRetailLogin_v1.options.scrollTop + 'px'
            });
            abRetailLogin_v1.updateBox(abRetailLogin_v1.options.descHeight, abRetailLogin_v1.options.descWidth);
        });
        abRetailLogin_v1.createHtml();
        $('body').on('click', '.ab-retail-login-btn,.ab-retail-lock', function(event) {
            event.stopPropagation();
            var loadHTML = '/sites/investments/us/resources/partials/retail-login.html';
            $('#ab-retail-login').load(loadHTML, function() {
                lockedContentDialog.options.url = '/investments/us/home.htm';
                abQueryString.setCookie('researchURL', window.location.href, 365);
                abRetailLogin_v1.showBid();
                if (c != '10') {
                    lockedContentDialog.load_form('#ab-retail-advisor-login', '/ABCOM/web/common/controls/Retail/RetailLoginService.aspx', 'form[name="ab-frm-login"]');
                    /*$('.abl-login-forgotpassword').bind('click', function(event) {
                    	abRetailLogin_v1.closeSignup();
                    	lockedContentDialog.create_dialog();
                    	event.preventDefault();
                    	lockedContentDialog.load_form('#ab-login-dialog .ab-login-form', '/abcom/System/Login/Retail/retention_assets/Content/forgot_password.html', 'form[name="ab-frm-forgotpassword"]');
                    });*/
                } else {
                    $('#ab-retail-advisor-login').html('<a href="javascript:;" class="abui-retail-logout">Logout</a><div><a href="javascript:;" class="abui-retail-changepwd">Change Password</a></div>');
                    $('.abui-retail-logout').click(function() {
                        $.ajax({
                            url: "/abcom/System/Logout.aspx",
                            cache: false,
                            success: function(data) {
                                if (data) {
                                    if (document.cookie.indexOf("loggedout") == -1) {
                                        document.cookie = 'loggedout=success; expires=Fri, 25 Dec 2015 20:47:11 UTC; path=/';
                                    } else {
                                        document.cookie = 'loggedout=success; expires=Fri, 25 Dec 2015 20:47:11 UTC; path=/';
                                    }
                                    window.location = absegmenturl;
                                } else {
                                    window.location = absegmenturl;
                                }
                            }
                        });
                    });
                }
                $('#abRetailClose').click(function() {
                    abRetailLogin_v1.closeSignup();
                });
            });
            return false;
        });

        function abRetailChangeLogin() {
            try {
                if (c == '10') {
                    $('.ab-retail-login-btn').html('Account Access');
                } else {
                    $('.ab-retail-login-btn').html('Log In');
                }
            } catch (e) {}
        }
        setTimeout(function() {
            abRetailChangeLogin();
            $('.abui-nav-mobile h3').each(function(index, element) {
                $(element).on("click", function() {
                    $(this).next('.abui-cntx-mobile').slideToggle();
                    $(element).toggleClass('abui-nav-active');
                });
            });
        }, 500);
        abRetailChangeLogin();
        try {
            $('.abui-mobilenav-icn').click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                if ($(this).hasClass('is-active')) {
                    $(this).removeClass('is-active')
                } else {
                    $(this).addClass('is-active');
                }
                $('.abui-nav-mobile').slideToggle()
            });
        } catch (e) {}

        function abRetailRemoveLock() {
            try {
                if (c == '10') {
                    $('.abui-download-wrapper').html('<div class="abui-download-icon"></div>');
                    if ($(window).width() < 1024) {
                        $('.ab-retail-blog a').html('AB Blog');
                    } else {
                        $('.ab-retail-blog a').html('Context: AB Blog');
                    }
                }
                if (currentSegment === '18') {
                    $('.ab-header-account-access').hide();
                }
            } catch (e) {}
        }
        abRetailRemoveLock();
        $('.ab-retail-whitepaper').click(function() {
            var linkHref = $(this).attr("data-href");
            var faOnly = $(this).attr("data-story");
            if (c != '10') {
                if (faOnly == '2') {
                    lockedContentDialog.options.url = linkHref;
                    lockedContentDialog.options.target == '_blank';
                    abQueryString.setCookie('researchURL', window.location.href, 365);
                    $('.ab-navbar-collapse').hide();
                    $('#ab-login-dialog').dialog('open');
                } else {
                    window.open(linkHref);
                }
            } else {
                window.open(linkHref);
            }
        });
        //Resize Local Navigation
        $('body').on('mouseover', '.ab-retail-nav > ul > li > a', function() {
            //$('.ab-retail-nav > ul > li > a').on('mouseover', function() {
            var rn = $('.ab-retail-dropdown-nav');
            var mq = window.matchMedia("(max-width: 1524px)");
            var w = $('.outer-wrapper');
            if (mq.matches) {
                w = $('.ab-container-full');
            }
            $(rn).width($(w).width()).offset({
                left: $(w).offset().left
            });
        });
    });
})(jQuery);
/* ========================================================================
 * New Global Navigation
 * Copyright 2017 AB
 * ======================================================================== */
var abuiGlobalNav;
if (!abuiGlobalNav) abuiGlobalNav = {};
abuiGlobalNav = {
    options: {
        glblnav_trigger: '.abui-trgr-globalnav',
        glblnav_list: '.abui-global-nav',
        glblnav_flag: ''
    },
    initialize: function(ops) {
        $('.abui-slider-wrapper').addClass('toggle-z-index');
        this.setOptions(ops);
        this.toggle_cntry_list(this.options.glblnav_trigger, this.options.glblnav_list);
        this.toggle_gnav_glp_sgmnt('.abui-glp-toggle');
        this.toggle_globalnav_sgmt('.abui-glbnav-toggle');
        this.domainpath_handler();
        this.mobilenav_handler();
        try {
            if (abglobal_usercountry == 'unknown') {
                $(this.options.glblnav_list).addClass('stop-transitions abui-nav-opened');
                $('.abui-slider-wrapper').removeClass('toggle-z-index');
            }
        } catch (err) {}
    },
    setOptions: function(optsObj) {
        if (!optsObj) return;
        for (var optName in optsObj) {
            this.options[optName] = optsObj[optName];
        }
    },
    set_flag: function() {},
    get_flag: function() {
        return $('.abui-trgr-globalnav').attr('data-role');
    },
    domainpath_handler: function() {
        $('#abuiglp-local-nav ul ul li a').on('click', function(event) {
            event.preventDefault();
            location.href = domains[0].global + $(this).attr('href');
        });
        $('.abuiglp-local-nav ul ul li a').on('click', function(event) {
            event.preventDefault();
            //var curr_loc = $.cookie('current_locale');
            var curr_loc = abglobal_usercountry;
            if ($(this).hasClass('abui-home')) {
                if (domains[0]['global'].indexOf(document.domain) != -1) {
                    $.cookie('ab_segpage', encodeURI(domains[0]['global'] + '/home.htm?r=no&locale=' + curr_loc), {
                        expires: 10 * 365,
                        path: '/'
                    });
                }
                location.href = domains[0]['global'] + '/home.htm?r=no&locale=' + curr_loc;
            } else {
                location.href = domains[0]['global'] + $(this).attr('href') + '?locale=' + curr_loc;;
            }
        });
    },
    toggle_gnav_glp_sgmnt: function(ele) {
        var self = this;
        if ($(ele).parents('.abui-glp-wrapper').length) {
            self.toggle_gnav_glp(ele)
        } else {
            self.close_nav_pages(ele)
        }
    },
    toggle_gnav_glp: function(ele) {
        var self = this;
        $(ele).on('click', function() {
            $.cookie("handleGLP", 1);
            if ($('.abui-action-showhide').hasClass('top-done')) {
                self.open_cntry_chooser();
            } else {
                self.close_cntry_chooser();
                if ($(self.options.glblnav_list).hasClass('abui-nav-opened')) {
                    $(self.options.glblnav_trigger).trigger('click');
                    return false;
                }
            }
        });
    },
    close_nav_pages: function(ele) {
        $(ele).on('click', function() {
            $('.abui-glbnav-toggle').trigger('click');
        });
    },
    toggle_globalnav_sgmt: function(ele) {
        var self = this;
        var emplbar = 0;
        if ($('#employeeViewBar').length) {
            emplbar = $('#employeeViewBar').height();
        }
        $(ele).on('click', function() {
            if ($(this).hasClass("is-open")) {
                $('.abui-glb-overlay, #abui-global-sgmt').fadeOut(500, function() {});
                $(".abui-glbl-nav-overlay").fadeOut(500, function() {}).remove();
            } else {
                $('.abui-glb-overlay, #abui-global-sgmt').fadeIn(500, function() {});
                $("<div class='ui-widget-overlay ui-front abui-glbl-nav-overlay'></div>").appendTo('body').fadeIn(500, function() {});
                $('#abui-global-sgmt').animate({
                    'marginTop': emplbar
                }, 100);
            }
            $(this).toggleClass('is-open');
            $(ele).parent().toggleClass('active');
            return false;
        });
    },
    close_cntry_chooser: function() {
        var sc = $(".abui-glp-tagline");
        var offset = sc.offset();
        $('.abui-glp-hero').stop().animate({
            'marginTop': -($('.abui-glp-hero').height() * 0.61)
        }, 700, function() {
            $('.abui-action-showhide').addClass('top-done');
        });
        $('.abui-glnav-sgmnt-wrapper').fadeOut();
        $('.abui-glp-toggle').addClass(this.get_flag()).addClass('active');
    },
    open_cntry_chooser: function() {
        $('.abui-glp-hero').stop().animate({
            'marginTop': '0'
        }, 700, function() {
            $('.abui-action-showhide').removeClass('top-done')
        });
        $('.abui-glnav-sgmnt-wrapper').fadeIn();
        $('.abui-glp-toggle').removeClass(this.get_flag()).removeClass('active');
    },
    show_cntry_list: function(lst) {
        $('.abui-slider-wrapper').removeClass('toggle-z-index');
        $(lst).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
            $('.abui-slider-wrapper').removeClass('toggle-z-index');
        });
    },
    hide_cntry_list: function(lst) {
        $(lst).bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
            $('.abui-slider-wrapper').addClass('toggle-z-index');
        });
    },
    toggle_cntry_list: function(trgr, lst) {
        var self = this;
        $(trgr).on('click', function(e) {
            $(self.options.glblnav_list).removeClass('stop-transitions');
            $(lst).toggleClass('abui-nav-opened');
            if ($(lst).hasClass('abui-nav-opened')) {
                self.show_cntry_list(lst);
                $(trgr).addClass('remove-hover');
            } else {
                self.hide_cntry_list(lst);
                $(trgr).removeClass('remove-hover');
            }
        })
    },
    mobilenav_handler: function() {
        $('.abui-trgr-mobile-globalnav').parent().on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($(this).hasClass('abui-nav-active')) {
                $(this).removeClass('abui-nav-active')
            } else {
                $(this).addClass('abui-nav-active');
            }
            $('.abui-mbl-offset-pnl').toggleClass('opened')
        })
        $('.mbl-country-chooser').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('.abui-mbl-offset-pnl').addClass('move');
        });
    },
    pos_offset_mobilepanel: function() {
        $('.abui-mbl-offset-pnl').removeClass('move');
        $('.abui-trgr-mobile-globalnav').parent().removeClass('abui-nav-active');
    }
}
$(document).ready(function() {
    abuiGlobalNav.initialize();
    $('#glblNavigationApp').add('#localnavApp').on('click touchstart touchend touchmove', function(event) {
        event.stopPropagation();
    });
});
/* Pop up for GLP */
var glpInvestorPopup;
if (!glpInvestorPopup) glpInvestorPopup = {};
// START on DOM ready
// ============================================================
glpInvestorPopup = {
    options: {
        width: 740,
        height: 600
    },
    setOptions: function(optsObj) {
        if (!optsObj) return;
        for (var optName in optsObj) {
            this.options[optName] = optsObj[optName];
        }
    },
    init: function(ops) {
        this.setOptions(ops);
    },
    clearClass: function(ele, class_name) {
        $(ele).removeClass(class_name);
    },
    applyClass: function(ele, class_name) {
        $(ele).addClass(class_name);
    },
    modal_language_change: function(ele, text_y, text_n) {
        $(ele).bind('click', function() {
            var self = this;
            var currentId = $(self).attr('id');
            glpInvestorPopup.clearClass('.abui-glp-pop-cnt li', 'strong');
            glpInvestorPopup.applyClass($(this).parent(), 'strong')
            $(this).closest('div').find('div').each(function(index, element) {
                if ($(element).hasClass($(self).attr('class'))) $(element).removeClass('hide')
                else $(element).addClass('hide')
            });
            if (currentId == 'en') {
                $('#buttonY').html('<span class="ui-button-text">Yes</span>');
                $('#buttonN').html('<span class="ui-button-text">No</span>');
            } else {
                $('#buttonY').html('<span class="ui-button-text">' + text_y + '</span>');
                $('#buttonN').html('<span class="ui-button-text">' + text_n + '</span>');
            }
        });
    },
    initDialog: function(url, domain_name, txt, text_y, text_n) {
        var self = this;
        var current_text = "<div id='abinvestor-dialog-segment'><p>&nbsp;</p></div>";
        investor_dialog = $(current_text).dialog({
            resizable: false,
            autoOpen: false,
            width: 'auto',
            modal: true,
            dialogClass: "abrwd-dialog-modal ab-dialog-segment abinvestor-dialog-segment",
            buttons: [{
                text: text_y,
                id: "buttonY",
                "class": 'btn-dialog-accept',
                click: function() {
                    defaultSegPlgn.cookieAutoSet(url, domain_name);
                    $('.abui-glbl-popup-overlay').remove();
                    $(this).dialog('destroy').remove();
                }
            }, {
                text: text_n,
                id: "buttonN",
                "class": 'btn-dialog-cancel',
                click: function() {
                    $('.abui-glbl-popup-overlay').remove();
                    $(this).dialog('destroy').remove();
                }
            }]
        });
        $(window).resize(function() {
            $("#abinvestor-dialog-segment").dialog("option", "position", "center");
        });
        $("#abinvestor-dialog-segment").load(txt);
        $('body').append('<div class="ui-widget-overlay ui-front abui-glbl-popup-overlay"></div>')
        investor_dialog.dialog("open");
        setTimeout(function() {
            $("#abinvestor-dialog-segment").dialog("option", "position", "center");
        }, 200);
        setTimeout(function() {
            glpInvestorPopup.modal_language_change('#abinvestor-dialog-segment li a', text_y, text_n);
        }, 1000);
    }
};
(function($) {
    $(function() {
        glpInvestorPopup.init();
        if (currentSegment != '0' && currentSegment != '100') {
            try {
                $('.abui-segmentname').html(absegmentname);
            } catch (e) {}
        }
    });
})(jQuery);
// END glpInvestorPopup
/*+++++++++++++++++++++++++++++// END New Global Navigation++++++++++++++++++++++++++++++++++*/
/* Pop up for Advisor Registration Start */
var abuiAdvisorSignupN;
if (!abuiAdvisorSignupN) abuiAdvisorSignupN = {};
(function($) {
    $(function() {
        abuiAdvisorSignupN = {
            options: {
                wrapperHtml: '<div id="advisorSignupN"></div>',
                id: '#advisorSignupN',
                closeId: '#advisorClose',
                overLayclass: '.abui-a-overlay',
                windowBox: '.abui-a-overlay > .abui-window',
                contentBox: '.abui-a-overlay .abui-a-signup-box',
                partialpath: '/resources/partials/advisor-registration/',
                docheight: null,
                docwidth: null,
                winheight: null,
                winwidth: null,
                scrollTop: null,
                bioImg: null,
                bioDesc: null,
                descWidth: 800,
                descWidthSb: 400,
                descHeight: 100,
                frm_value: true
            },
            createHtml: function() {
                var self = this;
                $("body").append(self.options.wrapperHtml);
            },
            initial: function() {
                abuiAdvisorSignupN.createHtml();
            },
            closeSignup: function() {
                abuiAdvisorSignupN.options.descWidth = 700;
                $(abuiAdvisorSignupN.options.id).fadeOut(300, "linear", function() {
                    $(abuiAdvisorSignupN.options.id).html('');
                    $('.abui-a-overlay').hide();
                });
            },
            closeSignupEvent: function() {
                try {
                    $(abuiAdvisorSignupN.options.closeId + ',.abui-a-btn-grey').click(function() {
                        abuiAdvisorSignupN.closeSignup();
                    });
                } catch (err) {}
            },
            animatePopup: function(fileName, callBackFn) {
                $(abuiAdvisorSignupN.options.id).fadeOut(300, "linear", function() {
                    try {
                        $('#ab-retail-login').html('');
                    } catch (e) {}
                    $(abuiAdvisorSignupN.options.id).html('');
                    var loadHTML = abuiAdvisorSignupN.options.partialpath + fileName;
                    $(abuiAdvisorSignupN.options.id).load(loadHTML, function() {
                        $('html, body').animate({
                            scrollTop: 0
                        }, 100, function() {
                            abpopupPlugin.showBid(abuiAdvisorSignupN, false);
                        });
                        setTimeout(function() {
                            $(abuiAdvisorSignupN.options.id).fadeIn(300, "linear", callBackFn);
                        }, 300);
                    });
                });
            },
            submitAdvisorEmail: function() {
                $('.abui-a-btn-teal').click(function() {
                    $('.abui-a-error-input > p').removeClass('show');
                    abValidation.removeError('.abui-a-inputs', 'abui-a-error-input');
                    abuiAdvisorSignupN.options.frm_value = true;
                    var _email = $("input[name=email]").val();
                    abValidation.checkEmptyField('.abui-a-required', 'abui-a-error-input', abuiAdvisorSignupN);
                    if (abValidation.emailValidation(_email) == false) {
                        abValidation.addError($("input[name=email]"), 'abui-a-error-input', abuiAdvisorSignupN);
                    }
                    if (abuiAdvisorSignupN.options.frm_value) {
                        //Need to Put AJAX call to get data;
                        var sendData = 'email=' + _email;
                        abValidation.ajaxRequest('GET', '/sites/api_service/Advisor/GetEmail', 'json', sendData, function(jqXHR, status) {
                            if (jqXHR != 'Exists' && jqXHR != 'Invalid') {
                                //var json = jQuery.parseJSON(jqXHR);								
                                abuiAdvisorSignupN.advisorReg(jqXHR, _email);
                            } else {
                                $('.abui-a-error-input > p').addClass('show');
                            }
                        });
                    }
                });
            },
            advisorEmail: function() {
                abuiAdvisorSignupN.animatePopup('advisoremail.htm', function() {
                    abuiAdvisorSignupN.closeSignupEvent();
                    abuiAdvisorSignupN.submitAdvisorEmail();
                });
            },
            fillRegForm: function(currentObj) {
                (currentObj.FirstName != 'null') ? $("input[name=firstname]").val(currentObj.FirstName): $("input[name=firstname]").val();
                (currentObj.LastName != 'null') ? $("input[name=lastname]").val(currentObj.LastName): $("input[name=lastname]").val();
                (currentObj.PhoneNumber != 'null') ? $("input[name=phone]").val(currentObj.PhoneNumber): $("input[name=phone]").val();
                (currentObj.ZipCode != 'null') ? $("input[name=zip]").val(currentObj.ZipCode): $("input[name=zip]").val();
                (currentObj.DealerName != 'null') ? $("input[name=dealer]").val(currentObj.DealerName): $("input[name=dealer]").val();
                (currentObj.BranchNumber != 'null') ? $("input[name=branch]").val(currentObj.BranchNumber): $("input[name=branch]").val();
                (currentObj.AENumber != 'null') ? $("input[name=ae]").val(currentObj.AENumber): $("input[name=ae]").val();
                (currentObj.IsRIA) ? $('#ria-yes').attr('checked', 'checked'): $('#ria-no').attr('checked', 'checked');
                switch (currentObj.RIAAssetsUnderManagement) {
                    case '1':
                        $('#ria-assets-1').attr('checked', 'checked');
                        break;
                    case '2':
                        $('#ria-assets-2').attr('checked', 'checked');
                        break;
                    case '3':
                        $('#ria-assets-3').attr('checked', 'checked');
                        break;
                    case '4':
                        $('#ria-assets-4').attr('checked', 'checked');
                        break;
                    case '5':
                        $('#ria-assets-5').attr('checked', 'checked');
                        break;
                }
            },
            checkPwd: function(pwd, conpwd) {
                if (abValidation.validatePassword(pwd) == false) {
                    abValidation.addError($("input[name=abregpassword]"), 'abui-a-error-input', abuiAdvisorSignupN);
                }
                if (abValidation.validatePassword(conpwd) == false) {
                    abValidation.addError($("input[name=confirmpwd]"), 'abui-a-error-input', abuiAdvisorSignupN);
                }
                if (pwd !== conpwd) {
                    abValidation.addError($("input[name=abregpassword]"), 'abui-a-error-input', abuiAdvisorSignupN);
                    abValidation.addError($("input[name=confirmpwd]"), 'abui-a-error-input', abuiAdvisorSignupN);
                }
            },
            submitAdvisorReg: function(currentObj, reEmail) {
                abuiAdvisorSignupN.fillRegForm(currentObj);
                $('.abui-a-btn-teal').click(function() {
                    $('.abui-a-error-input > p').removeClass('show');
                    abValidation.removeError('.abui-a-inputs', 'abui-a-error-input');
                    abuiAdvisorSignupN.options.frm_value = true;
                    var email = reEmail;
                    var firstname = $("input[name=firstname]").val();
                    var lastname = $("input[name=lastname]").val();
                    var phone = $("input[name=phone]").val();
                    var zipcode = $("input[name=zip]").val();
                    var dealername = $("input[name=dealer]").val();
                    var branchno = $("input[name=branch]").val();
                    var aeno = $("input[name=ae]").val();
                    var pwd = $("input[name=abregpassword]").val();
                    var conpwd = $("input[name=confirmpwd]").val();
                    var ria = (typeof($("input[name=ria]:checked").val()) != 'undefined') ? $("input[name=ria]:checked").val() : 'none';
                    var aum = (typeof($("input[name=ria-assets]:checked").val()) != 'undefined') ? $("input[name=ria-assets]:checked").val() : 'none';
                    abValidation.checkEmptyField('.abui-a-required', 'abui-a-error-input', abuiAdvisorSignupN);
                    if (abValidation.validateName(firstname) == false) {
                        abValidation.addError($("input[name=firstname]"), 'abui-a-error-input', abuiAdvisorSignupN);
                    }
                    if (abValidation.validateName(lastname) == false) {
                        abValidation.addError($("input[name=lastname]"), 'abui-a-error-input', abuiAdvisorSignupN);
                    }
                    if (abValidation.validateZipcode(zipcode) == false) {
                        abValidation.addError($("input[name=zip]"), 'abui-a-error-input', abuiAdvisorSignupN);
                    }
                    if (abValidation.validatePhone(phone) == false) {
                        abValidation.addError($("input[name=phone]"), 'abui-a-error-input', abuiAdvisorSignupN);
                    }
                    if (abValidation.validateName(dealername) == false) {
                        abValidation.addError($("input[name=dealer]"), 'abui-a-error-input', abuiAdvisorSignupN);
                    }
                    abuiAdvisorSignupN.checkPwd(pwd, conpwd);
                    //console.log(firstname,lastname,phone,zipcode,dealername,branchno,aeno,pwd,conpwd);			
                    if (abuiAdvisorSignupN.options.frm_value) {
                        //Need to Put AJAX call to get data;
                        var Advisor = JSON.stringify({
                            FirstName: firstname,
                            LastName: lastname,
                            Password: pwd,
                            Comfirmpassword: conpwd,
                            AENumber: aeno,
                            BranchNumber: branchno,
                            DealerName: dealername,
                            PhoneNumber: phone,
                            ZipCode: zipcode,
                            Email: email,
                            RIA: ria,
                            RIAssets: aum,
                            CommunicationForInsights: ''
                        });
                        abValidation.ajaxRequest('POST', '/sites/api_service/advisor/IsPasswordValid?password=' + pwd, 'json', pwd, function(jqXHR, status) {
                            if (jqXHR === 'OK') {
                                abValidation.ajaxRequest('POST', '/sites/api_service/Advisor/Register?Advisor=' + Advisor, 'json', Advisor, function(jqXHR, status) {
                                    if (jqXHR === 'OK') {
                                        abuiAdvisorSignupN.pardotRegSubmition(email, Advisor);
                                        abuiAdvisorSignupN.advisorThankyou();
                                    } else {
                                        $('.abui-a-error-input > p').addClass('show');
                                        $('.abui-a-error-input > p').html(jqXHR);
                                    }
                                });
                            } else {
                                $('.abui-a-error-input > p').addClass('show');
                            }
                        });
                    }
                });
            },
            advisorReg: function(currentObj, reEmail) {
                abuiAdvisorSignupN.animatePopup('advisor-reg.htm', function() {
                    abuiAdvisorSignupN.closeSignupEvent();
                    abuiAdvisorSignupN.submitAdvisorReg(currentObj, reEmail);
                });
            },
            pardotRegSubmition: function(email, Advisor) {
                var adRegData = 'email=' + encodeURIComponent(email) + '&fname=' + encodeURIComponent(Advisor.firstname) + '&lname=' + encodeURIComponent(Advisor.lastname) + '&company=' + encodeURIComponent(Advisor.dealername) + '&isRia=' + encodeURIComponent(Advisor.ria) + '&riaAUM=' + encodeURIComponent(Advisor.aum);
                var myURL = '/Abcom/PardotRelay.ashx?ph=ReqInfo&url=' + encodeURIComponent('http://pardot.alliancebernstein.com/l/23012/2017-03-20/4j3yqq');
                $.post(myURL, adRegData, function(data, status) {
                    if (status == 'success') {
                        try {
                            console.log('Regestration Submmited to Pardot');
                        } catch (e) {}
                    }
                });
            },
            advisorThankyou: function() {
                abuiAdvisorSignupN.animatePopup('advisor-thankyou.htm', function() {
                    abuiAdvisorSignupN.closeSignupEvent();
                });
            },
            advisorConfirm: function() {
                abuiAdvisorSignupN.animatePopup('advisor-confirm.htm', function() {
                    abuiAdvisorSignupN.closeSignupEvent();
                    if (c == '10') {
                        $('#abui-a-login').hide();
                    }
                    $('.abui-a-btn-teal').click(function() {
                        abuiAdvisorSignupN.closeSignup();
                        //$('.ab-retail-login-btn').trigger('click');
                        $('#ab-login-dialog').dialog('open');
                    });
                });
            },
            tokenError: function() {
                abuiAdvisorSignupN.animatePopup('token-error.htm', function() {
                    abuiAdvisorSignupN.closeSignupEvent();
                });
            },
            checkEmailActivation: function() {
                var active = abQueryString.getDatafromQuerystring('action');
                var token = abQueryString.getDatafromQuerystring('token');
                if (active == 'activation' && token) {
                    var sendData = 'token=' + token;
                    abValidation.ajaxRequest('GET', '/sites/api_service/Advisor/GetEmailActivation', 'json', sendData, function(jqXHR, status) {
                        if (jqXHR === 'OK') {
                            abuiAdvisorSignupN.advisorConfirm();
                        } else {
                            abuiAdvisorSignupN.tokenError();
                        }
                    });
                }
            },
            forgotPwd: function() {
                abuiAdvisorSignupN.animatePopup('forgot-pwd.htm', function() {
                    abuiAdvisorSignupN.closeSignupEvent();
                    $('.abui-a-btn-teal').click(function() {
                        abValidation.removeError('.abui-a-inputs', 'abui-a-error-input');
                        abuiAdvisorSignupN.options.frm_value = true;
                        var _email = $("input[name=email]").val();
                        abValidation.checkEmptyField('.abui-a-required', 'abui-a-error-input', abuiAdvisorSignupN);
                        if (abValidation.emailValidation(_email) == false) {
                            abValidation.addError($("input[name=email]"), 'abui-a-error-input', abuiAdvisorSignupN);
                        }
                        if (abuiAdvisorSignupN.options.frm_value) {
                            var sendData = 'email=' + _email;
                            abValidation.ajaxRequest('GET', '/sites/api_service/Advisor/GetResetPassword', 'json', sendData, function(jqXHR, status) {
                                if (jqXHR === 'OK') {
                                    abuiAdvisorSignupN.closeSignup();
                                } else {
                                    $('.abui-a-error-input > p').addClass('show');
                                }
                            });
                        }
                    });
                });
            },
            checkResetpwdLink: function() {
                var action = abQueryString.getDatafromQuerystring('action');
                var timestamp = abQueryString.getDatafromQuerystring('TimeStamp');
                var guid = abQueryString.getDatafromQuerystring('Guid');
                var emailid = abQueryString.getDatafromQuerystring('EmailId');
                if (action == 'reset' && timestamp && guid) {
                    var sendData = 'emailId=' + emailid + '&timeStamp=' + timestamp + '&guid=' + guid;
                    abValidation.ajaxRequest('GET', '/sites/api_service/Advisor/GetResetPasswordVerification', 'json', sendData, function(jqXHR, status) {
                        if (jqXHR === 'OK') {
                            abuiAdvisorSignupN.resetPwd(timestamp, guid, emailid);
                        } else {
                            abuiAdvisorSignupN.tokenError();
                        }
                    });
                }
            },
            resetPwd: function(timestamp, guid, emailid) {
                abuiAdvisorSignupN.animatePopup('reset-pwd.htm', function() {
                    abuiAdvisorSignupN.closeSignupEvent();
                    $('.abui-a-btn-teal').click(function() {
                        var pwd = $("input[name=abregpassword]").val();
                        var conpwd = $("input[name=confirmpwd]").val();
                        $('.abui-a-error-input > p').removeClass('show');
                        abValidation.removeError('.abui-a-inputs', 'abui-a-error-input');
                        abuiAdvisorSignupN.options.frm_value = true;
                        abuiAdvisorSignupN.checkPwd(pwd, conpwd);
                        if (abuiAdvisorSignupN.options.frm_value) {
                            var sendData = 'email=' + emailid + '&timeStamp=' + timestamp + '&guid=' + guid + '&password=' + pwd;
                            abValidation.ajaxRequest('POST', '/sites/api_service/Advisor/ResetPassword?' + sendData, 'json', sendData, function(jqXHR, status) {
                                console.log(jqXHR, status);
                                if (jqXHR === 'OK') {
                                    abuiAdvisorSignupN.updatedPwd();
                                } else {
                                    $('.abui-a-error-input > p').addClass('show');
                                }
                            });
                        }
                    });
                });
            },
            updatedPwd: function() {
                abuiAdvisorSignupN.animatePopup('pwd-updated.htm', function() {
                    abuiAdvisorSignupN.closeSignupEvent();
                    $('.abui-a-btn-teal').click(function() {
                        abuiAdvisorSignupN.closeSignup();
                        //$('.ab-retail-login-btn').trigger('click');
                        $('#ab-login-dialog').dialog('open');
                    })
                });
            },
            changedPwdSuccess: function() {
                abuiAdvisorSignupN.animatePopup('pwd-changed.htm', function() {
                    abuiAdvisorSignupN.closeSignupEvent();
                });
            },
            changePwd: function() {
                abuiAdvisorSignupN.animatePopup('change-pwd.htm', function() {
                    abuiAdvisorSignupN.closeSignupEvent();
                    $('.abui-a-btn-teal').click(function() {
                        var currentpwd = $("input[name=currentpwd]").val();
                        var pwd = $("input[name=abregpassword]").val();
                        var conpwd = $("input[name=confirmpwd]").val();
                        $('.abui-a-error-input > p').removeClass('show');
                        abValidation.removeError('.abui-a-inputs', 'abui-a-error-input');
                        abuiAdvisorSignupN.options.frm_value = true;
                        if (abValidation.validatePassword(currentpwd) == false) {
                            abValidation.addError($("input[name=currentpwd]"), 'abui-a-error-input', abuiAdvisorSignupN);
                        }
                        abuiAdvisorSignupN.checkPwd(pwd, conpwd);
                        if (currentpwd == pwd || currentpwd == conpwd) {
                            abValidation.addError($("input[name=currentpwd]"), 'abui-a-error-input', abuiAdvisorSignupN);
                            abValidation.addError($("input[name=abregpassword]"), 'abui-a-error-input', abuiAdvisorSignupN);
                            abValidation.addError($("input[name=confirmpwd]"), 'abui-a-error-input', abuiAdvisorSignupN);
                            $('.abui-a-error-input > p.samepwd').addClass('show');
                        }
                        if (abuiAdvisorSignupN.options.frm_value) {
                            var sendData = 'currentPassword=' + currentpwd + '&newPassword=' + pwd;
                            abValidation.ajaxRequest('POST', '/sites/api_service/Advisor/ChangePassword?' + sendData, 'json', sendData, function(jqXHR, status) {
                                if (jqXHR === 'OK') {
                                    abuiAdvisorSignupN.changedPwdSuccess();
                                } else {
                                    $('.abui-a-error-input > p.pwderror').addClass('show');
                                }
                            });
                        }
                    });
                });
            },
            checkLinkedinEmail: function() {
                var action = abQueryString.getDatafromQuerystring('d');
                if (action == 'false') {
                    abuiAdvisorSignupN.advisorEmail();
                }
            },
            closeLogin: function() {
                try {
                    $('.ab-login-dialog,.ui-widget-overlay').hide();
                } catch (e) {}
            },
            cancelRegistrationEvent: function(email, Advisor) {
                try {
                    $(abuiAdvisorSignupN.options.closeId + ',.abui-a-btn-grey').click(function() {
                        abuiAdvisorSignupN.cancelRegistration(email, Advisor);
                    });
                } catch (err) {}
            },
            cancelRegistration: function(email, Advisor) {
                abuiAdvisorSignupN.animatePopup('cancel-registration.htm', function() {
                    $(abuiAdvisorSignupN.options.closeId + ',.abui-a-btn-grey').click(function() {
                        abuiAdvisorSignupN.advisorInsights(email, Advisor);
                    });
                    $('.abui-a-btn-teal').click(function() {
                        abuiAdvisorSignupN.closeSignup();
                    });
                });
            },
            addonClickEventForReg: function() {
                $('body').on('click', '#ab-retailregister', function() {
                    abuiAdvisorSignupN.closeLogin();
                    abuiAdvisorSignupN.advisorEmail();
                });
                $('body').on('click', '.abl-login-forgotpassword,#abui-pwd-reset', function() {
                    abuiAdvisorSignupN.closeLogin();
                    abuiAdvisorSignupN.forgotPwd();
                });
                $('body').on('click', '.abui-retail-changepwd', function() {
                    abuiAdvisorSignupN.changePwd();
                });
            }
        }
        $(window).resize(function() {
            abpopupPlugin.showBid(abuiAdvisorSignupN, true);
        });
        abuiAdvisorSignupN.initial();
        abuiAdvisorSignupN.checkEmailActivation();
        abuiAdvisorSignupN.checkResetpwdLink();
        abuiAdvisorSignupN.checkLinkedinEmail();
        abuiAdvisorSignupN.addonClickEventForReg();
    });
})(jQuery);
/* Pop up for Advisor Registration End */
try {
    $('.glbl-language-chooser .dropdown').bind('click', function(e) {
        $('.glbl-language-chooser .nav-dropdown-list').toggle("slide", {
            'direction': 'up'
        }, function() {});
        $(this).toggleClass('active');
    });
} catch (e) {}
/* Global Terms and Condition Based on Segment ID and JSON */
var globalTerms;
if (!globalTerms) globalTerms = {};
(function($) {
    $(function() {
        globalTerms = {
            options: {
                wrapperHtml: '<div id="abGlobalTerms"></div>',
                id: '#abGlobalTerms',
                closeId: '#advisorClose',
                overLayclass: '.abui-a-overlay',
                windowBox: '.abui-a-overlay > .abui-window',
                contentBox: '.abui-a-overlay .abui-a-signup-box',
                docheight: null,
                docwidth: null,
                winheight: null,
                winwidth: null,
                scrollTop: null,
                bioImg: null,
                bioDesc: null,
                descWidth: 800,
                descWidthSb: 400,
                descHeight: 100,
                currentCookie: null,
                urltype: null,
                url: null,
                html: '/resources/partials/terms/global-popup.html'
            },
            setOptions: function(optsObj) {
                if (!optsObj) return;
                for (var optName in optsObj) {
                    this.options[optName] = optsObj[optName];
                }
            },
            createHtml: function() {
                var self = this;
                $("body").append(self.options.wrapperHtml);
            },
            checkCookie: function(value, urltype) {
                abValidation.ajaxRequest('GET', '/resources/data/terms-condition.htm', 'json', "", function(data, status) {
                    if (status == 'success') {
                        if (typeof(data[value]) !== 'undefined') {
                            if (typeof(data[value][currentSegment]) !== 'undefined') {
                                if ($.cookie(data[value][currentSegment].cookievalue) && $.cookie(data[value][currentSegment].cookievalue) == 1) {
                                    if (urltype == 'pdf') {
                                        window.open(globalTerms.options.url);
                                    }
                                    return false;
                                } else {
                                    //globalTerms.createHtml();									
                                    globalTerms.options.currentCookie = data[value][currentSegment].cookievalue;
                                    abpopupPlugin.animatePopup(globalTerms, globalTerms.options.html, function() {
                                        if (typeof(data[value][currentSegment].language[language].popup_head) != 'undefined' && data[value][currentSegment].language[language].popup_head != '') {
                                            $('#abGlobalTermsHead').html(data[value][currentSegment].language[language].popup_head);
                                        }
                                        if (typeof(data[value][currentSegment].language[language].popup_text) != 'undefined' && data[value][currentSegment].language[language].popup_text != '') {
                                            $('#abGlobalTermsPera').html(data[value][currentSegment].language[language].popup_text);
                                        }
                                        if (typeof(data[value][currentSegment].language[language].popup_btn_y) != 'undefined' && data[value][currentSegment].language[language].popup_btn_y != '') {
                                            $('#accept').html(data[value][currentSegment].language[language].popup_btn_y);
                                        }
                                        if (typeof(data[value][currentSegment].language[language].popup_btn_n) != 'undefined' && data[value][currentSegment].language[language].popup_btn_n != '') {
                                            $('#dont-accept').html(data[value][currentSegment].language[language].popup_btn_n);
                                        }
                                    });
                                }
                            } else {
                                if (urltype == 'pdf') {
                                    window.open(globalTerms.options.url);
                                }
                                return false;
                            }
                        }
                    }
                });
            },
            updateLockIcon: function(passedClass) {
                abValidation.ajaxRequest('GET', '/resources/data/terms-condition.htm', 'json', "", function(data, status) {
                    if (status == 'success') {
                        $(passedClass).each(function() {
                            var self = this;
                            var dataLink = JSON.parse($(this).attr('data-compliance'));
                            $(dataLink).each(function(index, value) {
                                if (typeof(data[value]) !== 'undefined') {
                                    if (typeof(data[value][currentSegment]) !== 'undefined') {
                                        if ($.cookie(data[value][currentSegment].cookievalue) && $.cookie(data[value][currentSegment].cookievalue) == 1) {
                                            $(self).addClass('unlock')
                                            $(self).removeClass('lock');
                                        } else {
                                            $(self).addClass('lock');
                                            $(self).removeClass('unlock');
                                        }
                                    }
                                }
                            })
                        });
                    }
                });
            },
            accept: function() {
                $.cookie(globalTerms.options.currentCookie, 1, {
                    expires: 20 * 365,
                    path: '/'
                });
                abpopupPlugin.close(globalTerms);
                if (globalTerms.options.urltype == 'pdf') {
                    window.open(globalTerms.options.url);
                    location.reload(true);
                }
            },
            dontaccept: function(redirect) {
                abpopupPlugin.close(globalTerms);
                if (typeof redirect !== 'undefined') {
                    setPrevAndResearchCookie();
                } else {
                    window.location = redirect;
                }
            },
            displayTerms: function(compliance, url, urltype) {
                globalTerms.options.urltype = urltype;
                globalTerms.options.url = url;
                if (compliance.indexOf('3') != -1 || compliance.indexOf('4') != -1) {
                    if ($(compliance).length > 0) {
                        $(compliance).each(function(index, value) {
                            globalTerms.checkCookie(value, urltype);
                        });
                    }
                } else {
                    if (urltype == 'pdf') {
                        window.open(globalTerms.options.url);
                    }
                    return false;
                }
            }
        }
        try {
            if (typeof(compliance) != 'undefined') {
                globalTerms.displayTerms(compliance, 'null', 'link');
            }
        } catch (e) {}
        globalTerms.createHtml();
        globalTerms.updateLockIcon('.abtl-research-terms');
        //
    });
})(jQuery);
/* Global Terms and Condition end here */
/* Who are you on summary page */
var globalWAY;
if (!globalWAY) globalWAY = {};
(function($) {
    $(function() {
        globalWAY = {
            options: {
                wrapperHtml: '<div id="abGlobalWay"></div>',
                id: '#abGlobalWay',
                closeId: '#advisorClose',
                overLayclass: '.abui-a-overlay',
                windowBox: '.abui-a-overlay > .abui-window',
                contentBox: '.abui-a-overlay .abui-a-signup-box',
                docheight: null,
                docwidth: null,
                winheight: null,
                winwidth: null,
                scrollTop: null,
                bioImg: null,
                bioDesc: null,
                descWidth: 1170,
                descWidthSb: 400,
                descHeight: 100,
                currentCookie: null,
                loginSegId: '18',
                currentURL: null,
                openType: null,
            },
            setOptions: function(optsObj) {
                if (!optsObj) return;
                for (var optName in optsObj) {
                    this.options[optName] = optsObj[optName];
                }
            },
            createHtml: function() {
                var self = this;
                $("body").append(self.options.wrapperHtml);
            },
            whoareyou: function() {
                globalWAY.createHtml();
                abpopupPlugin.animatePopup(globalWAY, '/resources/partials/who-are-you/who-are-you.html', function() {});
            },
            displayMessage: function() {
                globalWAY.createHtml();
                abpopupPlugin.animatePopup(globalWAY, '/resources/partials/who-are-you/display-message.html', function() {});
            },
            segId: function(id, clang, clocale) {
                abQueryString.setCookie('abFrontEndSeg', id, 365);
                if (window.location.href.indexOf('?') > -1) {
                    var urlDivder = window.location.href.split('?');
                    if (urlDivder[1] != '') {
                        if (window.location.href.indexOf('seg=') > -1) {
                            window.location = urlDivder[0] + '?seg=' + id + '&lang=' + clang + '&locale=' + clocale;
                        } else {
                            window.location = window.location + '&seg=' + id + '&lang=' + clang + '&locale=' + clocale;
                        }
                    } else {
                        window.location = window.location + 'seg=' + id + '&lang=' + clang + '&locale=' + clocale;
                    }
                } else {
                    window.location = window.location + '?seg=' + id + '&lang=' + clang + '&locale=' + clocale;
                }
            },
            displaySelection: function() {
                globalWAY.whoareyou();
            },
            close: function() {
                abpopupPlugin.close(globalWAY);
                try {
                    if (typeof(domains) != 'undefined') {
                        window.location = domains[0].global;
                    } else {
                        window.location = '/'
                    }
                } catch (e) {}
            },
            login_or_terms: function(compliance, url, opentype, typeofURL) {
                globalWAY.options.currentURL = url;
                globalWAY.options.openType = opentype;
                if (compliance.indexOf('2') != -1 && globalWAY.options.loginSegId == currentSegment) {
                    if (c != '10') {
                        if (!abQueryString.getCookie('researchURL')) {
                            abQueryString.setCookie('previousURL', absegmenturl, 365);
                        }
                        lockedContentDialog.options.url = globalWAY.options.currentURL;
                        lockedContentDialog.options.target = globalWAY.options.openType;
                        $('#ab-login-dialog').dialog('open');
                    } else {
                        if (typeofURL == 'pdf') {
                            window.open(globalWAY.options.currentURL);
                        }
                    }
                } else {
                    globalTerms.displayTerms(compliance, url, typeofURL);
                }
            },
            explorelink: function() {
                try {
                    $('.abtl-rsb-exploremore').on('click', function() {
                        abQueryString.setCookie('previousURL', window.location.href, 365);
                        abQueryString.setCookie('researchURL', window.location.href, 365);
                        var intLink = JSON.parse($(this).attr('data-link'));
                        if ($(intLink.intcompliancelevel).length > 0) {
                            globalWAY.login_or_terms(intLink.intcompliancelevel, intLink.mylink, '_blank', 'pdf');
                        } else {
                            window.open(intLink.mylink);
                        }
                    });
                } catch (e) {}
            }
        }
        globalWAY.explorelink();
        //
    });
})(jQuery);
/* Who are you on summary page */
/*==================================================================
2017_ThoughtLeadership Insights HP Filters and Search==========
======================================================= */
var insightsTL;
if (!insightsTL) insightsTL = {};
// iniT insightsTL on DOM ready
// ============================================================
insightsTL = {
    options: {
        filters: '.abtl-filter > div',
        desktop_filters: '.abtl-filter.abtl-filter-desktop > div',
        triggers: '.abtl-filter ol li a'
    },
    setOptions: function(optsObj) {
        if (!optsObj) return;
        for (var optName in optsObj) {
            this.options[optName] = optsObj[optName];
        }
    },
    init: function() {
        this.set_filters();
        this.reset_filters();
        this.update_headers();
    },
    set_filters: function() {
        this.set_mobile_filters();
        var self = this;
        $(self.options.triggers).each(function(index, element) {
            self.repos_filters(index, element);
            $(element).on('click', function() {
                $(self.options.filters).not(':eq(' + index + ')').hide();
                $(self.options.filters).eq(index).toggle();
                $(self.options.triggers).not(':eq(' + index + ')').removeClass('abtl-filters-active');
                $(this).toggleClass('abtl-filters-active');
            });
        });
        $('.abtl-trigger-dialog').on('click', function() {
            self.reset_filters()
            if ($(self.options.filters).eq(1).is(":hidden")) $(self.options.triggers).eq(1).trigger('click')
        });
    },
    set_mobile_filters: function() {
        $('.abtl-filter-mobile header').on('click', function() {
            $("#abtl-filter-mobile").slideToggle();
            $(this).find('a').toggleClass('abtl-flters-active');
        });
        $("#abtl-filter-mobile").accordion({
            heightStyle: "content",
            collapsible: true,
            active: false,
            create: function(event, ui) {
                //$( "#abtl-filter-mobile" ).addClass('abtl-acc-active');
            }
        });
    },
    update_headers: function() {
        this.update_desktop_headers();
        this.update_mobile_headers();
    },
    update_desktop_headers: function() {
        var self = this;
        $('.abtl-filter.abtl-filter-desktop > div').each(function(index, element) {
            $(element).find('ul a').on('click', function(event) {
                if ($(this).hasClass('abtl-disabled')) return false;
                var choice = $(this).html();
                //$(this).addClass('ab-font-strong');
                $('.abtl-filter-desktop ol li').eq(index + 1).find('a').html(choice);
                $('.abtl-filter-desktop ol li a').each(function(index, element) {
                    insightsTL.repos_filters(index, element);
                });
                $(self.options.filters).hide();
                $('.abtl-filters-active').removeClass('abtl-filters-active');
            });
        });
    },
    update_mobile_headers: function() {
        var self = this;
        $('#abtl-filter-mobile > div').each(function(index, element) {
            $(element).find('ul a').on('click', function(event) {
                if ($(this).hasClass('abtl-disabled')) return false;
                var choice = $(this).html();
                //$(this).addClass('ab-font-strong');
                var cache = $('#abtl-filter-mobile h3').eq(index).children();
                $('#abtl-filter-mobile h3').eq(index).text(choice).append(cache);
            });
        });
    },
    repos_filters: function(index, element) {
        var position = $(element).position();
        $(this.options.filters).eq(index).css({
            left: (position.left - 0) + "px"
        })
    },
    reset_filters: function() {
        var self = this;
        $('.abtl-filter').add('.abtl-trigger-dialog').on('click', function(e) {
            e.stopPropagation();
        });
        $('html, body').on('click', function(e) {
            $(self.options.desktop_filters).hide();
            $('.abtl-filters-active').removeClass('abtl-filters-active');
        });
    }
};

function initSearch() {
    var _placeholder = "Search";
    $('.abtl-search-icn').on('click', function(e) {
        e.stopPropagation();
        $('body').append("<div class='abui-global-overlay'><div class='abui-widget-close'>Close</div></div>").append('<div class="abui-blog-search"></div>');
        $('<section></section>').appendTo('.abui-blog-search');
        $('<input type="text" autocomplete="off" placeholder="' + _placeholder + '" name="Search" class="abui-blog-input" autofocus>').appendTo('.abui-blog-search section');
        $('<div class="abui-sr-btn-full"></div>').appendTo('.abui-blog-search section');
        $('.abui-global-overlay').click(function(e) {
            $(this).remove();
            $('.abui-blog-search').detach();
        });
        /*$(window).keydown(function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        });*/
        $('.abui-sr-btn-full').click(function() {
            if (!$('.abui-blog-input').val()) return false;
            window.location = "/library/search.htm?term=" + $('.abui-blog-input').val();
        });
        $('.abui-blog-input').keyup(function(ev) {
            if (ev.which === 13) {
                window.location = "/library/search.htm?term=" + $('.abui-blog-input').val();
            }
        });
    });
}
$(function() {
    $('<aside class="abtl-search-icn"><a href="#">search</a></aside>').prependTo($('.abtl-filter.abtl-filter-desktop'));
    initSearch();
});
$(window).load(function() {
    insightsTL.init();
    try {
        $(window).resize(function() {
            $('.abtl-filter ol li a').each(function(index, element) {
                insightsTL.repos_filters(index, element);
            });
        });
        if (!$(".tl-hero-overlay").length) {
            $('<div class="tl-hero-overlay"></div>').insertAfter($('.abtl-hero-img img'));
            $('<div class="tl-hero-overlay"></div>').insertAfter($('.abtl-featured img'));
        }
    } catch (e) {}
});
/*==================================================================
END  2017_ThoughtLeadership Insights HP Filters and Search==========
======================================================= */
var abChangeTextBasedOnLang;
if (!abChangeTextBasedOnLang) abChangeTextBasedOnLang = {};
abChangeTextBasedOnLang = {
    options: {
        currenttext: '',
        interVal: true,
        id: null,
        classOrId: null
    },
    setOptions: function(optsObj) {
        if (!optsObj) return;
        for (var optName in optsObj) {
            this.options[optName] = optsObj[optName];
        }
    },
    initialize: function(ops) {
        this.setOptions(ops);
        this.changeText();
    },
    changeText: function() {
        abValidation.ajaxRequest('GET', '/resources/data/textbasedonlang.json', 'json', "", function(jqXHR, status) {
            if (status == 'success') {
                if (typeof(jqXHR[language]) != 'undefined') {
                    abChangeTextBasedOnLang.options.currenttext = jqXHR[language][abChangeTextBasedOnLang.options.id];
                } else {
                    abChangeTextBasedOnLang.options.currenttext = jqXHR['en'][abChangeTextBasedOnLang.options.id];
                }
                setInterval(function() {
                    if (abChangeTextBasedOnLang.options.interVal) {
                        $(abChangeTextBasedOnLang.options.classOrId).each(function() {
                            $(this).html(abChangeTextBasedOnLang.options.currenttext);
                            abChangeTextBasedOnLang.options.interVal = false;
                        });
                    }
                }, 500);
            } else {
                return '';
            }
        });
    },
    EncodeEntities: function(s) {
        return $("<div/>").text(s).html();
    },
    DencodeEntities: function(s) {
        return $("<div/>").html(s).text();
    },
    updateUrlforTopic: function(data) {
        $('.abtl-sites-links li a,.abtl-breadcrumbs li a').each(function() {
            var that = this;
            var currentText = $(that).text(),
                currentUrl, prevUrl;
            currentText = $.trim(currentText.replace('/', ''));
            prevUrl = $(that).attr('href');
            $.each(data.translator, function(i, item) {
                if (currentText == item.Key) {
                    abValidation.ajaxRequest('GET', '/sites/api_service/Insights/GetTranslations?texts=' + encodeURIComponent(item.Key), 'json', '', function(data, status) {
                        if (status == 'success') {
                            var currentVal;
                            for (key in data) {
                                if (data.hasOwnProperty(key)) {
                                    var currentVal = data[key]
                                }
                            }
                            if (prevUrl.indexOf('?topic=') > -1) {
                                currentUrl = '/library/topic.htm?topic=' + encodeURIComponent(abChangeTextBasedOnLang.DencodeEntities(currentVal));
                                $(that).attr('href', currentUrl);
                            } else if (prevUrl.indexOf('?insightCategory=') > -1) {
                                currentUrl = '/library/topic.htm?insightCategory=' + abChangeTextBasedOnLang.EncodeEntities(encodeURIComponent(abChangeTextBasedOnLang.DencodeEntities(currentVal)));
                                $(that).attr('href', currentUrl);
                            }
                        }
                    });
                }
            });
        });
    },
    changeOnlyText: function() {
        abValidation.ajaxRequest('GET', '/admin/translations_ui.json', 'json', '', function(data, status) {
            if (status == 'success') {
                abChangeTextBasedOnLang.updateUrlforTopic(data);
                $.each(data.translator, function(i, item) {
                    $.each(item.Value, function(index, obj) {
                        if (obj.Key == language) {
                            $(".abtl-bg-featured.abtl-featured *:not(h1),.abtl-noimg-featured-light *:not(h1),.abpl-authors-rsb *,#moreRelatedArticles *,.abtl-wrap-content *,.abtl-rsb-exploremore *").contents().filter(function() {
                                return this.nodeType === 3;
                            }).replaceWith(function() {
                                return this.textContent.replace(item.Key, obj.Value);
                            });
                        }
                    });
                });
            }
        });
    },
    changeDate: function(myDate) {
        $(myDate).each(function() {
            var that = this;
            var currentDate = $(that).text(),
                dateArray = [],
                year, date, month, createdDate, name_month_en;
            var separators = [',', ' '];
            dateArray = currentDate.split(new RegExp(separators.join('|'), 'g'));
            month = dateArray[0];
            date = dateArray[1];
            year = $.trim(dateArray[3]);
            switch (month) {
                case 'January':
                    name_month_en = '01';
                    break;
                case 'February':
                    name_month_en = '02';
                    break;
                case 'March':
                    name_month_en = '03';
                    break;
                case 'April':
                    name_month_en = '04';
                    break;
                case 'May':
                    name_month_en = '05';
                    break;
                case 'June':
                    name_month_en = '06';
                    break;
                case 'July':
                    name_month_en = '07';
                    break;
                case 'August':
                    name_month_en = '08';
                    break;
                case 'September':
                    name_month_en = '09';
                    break;
                case 'October':
                    name_month_en = '10';
                    break;
                case 'November':
                    name_month_en = '11';
                    break;
                case 'December':
                    name_month_en = '12';
                    break;
            }
            createdDate = name_month_en + '/' + date + '/' + year;
            abValidation.ajaxRequest('GET', '/sites/api_service/Insights/getdateformat?datestring=' + createdDate + '&language=' + language, 'json', '', function(data, status) {
                if (status == 'success') {
                    if (data) {
                        $(that).html(data);
                    }
                }
            });
        });
    },
    runTranslate: function() {
        abChangeTextBasedOnLang.changeDate('.abtl-date');
        abChangeTextBasedOnLang.changeOnlyText();
    }
}
var abpcTranslatePlugin;
if (!abpcTranslatePlugin) abpcTranslatePlugin = {};
abpcTranslatePlugin = {
    init: function() {
        this.translatePCDetails();
		
    },
    translatePCDetails: function() {
        abValidation.ajaxRequest('GET', '/sites/api_service/Translation/GetABIITranslations', 'json', '', function(data, status) {
            if (status == 'success') {
							try {
                $.each(data, function(i, item) {
                    $(".abpc-global-translate .abpc-translate[data-rel='" + item.key + "']").contents().filter(function() {
                        return this.nodeType === 3;
                    }).replaceWith(function() {
                        return this.textContent.replace(this.textContent, item.value);
                    });
                });
								}
						catch(error) {
							console.log(error);
						 }
            }
        });
    }
}
$(function() {
    abChangeTextBasedOnLang.initialize({
        interval: true,
        id: 'loadmore',
        classOrId: '#rct-insights-lazyload .abtl-button,#rct-author-lazyload .abtl-button'
    });
    //abChangeTextBasedOnLang.initialize({interval:true,id:'loadmore',classOrId:'#rct-author-lazyload .abtl-button'});
    abChangeTextBasedOnLang.runTranslate();
    abpcTranslatePlugin.init();
});
/*==================================================================
LOGO swap for specific segment only                       ==========
======================================================= */
validateSegment = function(c) {
    var segment_lookup = ['33', '6', '28', '100', '2', '24', '5', '37'];
    if ($.inArray(c, segment_lookup) != -1) return c;
    else return false;
}
setLogo = function() {
    if (typeof currentSegment !== 'undefined') {
        if (!validateSegment(currentSegment)) {
            $('.abcom-logo.abcom-logo-desktop').hide();
            $('.abcom-logo.abcom-logo-mobile').show();
        }
    }
}



var abpcTranslatePlugin;
if (!abpcTranslatePlugin) abpcTranslatePlugin = {};
abpcTranslatePlugin = {
	options: {
      data_log: ''
   },
	beforeInit: function() {
        this.init();
   },
    init: function() {
		console.log('inside init ' + this.options.data_log)
        this.translatePCDetails();
    },
    translatePCDetails: function() {
		var self = this;
		//alert(this.options.data_log)
        abValidation.ajaxRequest('GET', 'http://methodeabcom-dev.staging.acml.com/sites/api_service/Translation/GetABIITranslations?language=en-gb', 'json', '', function(data, status) {
            if (status == 'success') {
                try {
					self.options.data_log = data;
                    $.each(data, function(i, item) {
                        $(".abpc-global-translate .abpc-translate[data-rel='" + item.key + "']").contents().filter(function() {
                            return this.nodeType === 3;
                        }).replaceWith(function() {
                            return this.textContent.replace(this.textContent, item.value);
                        });
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }
}












$(function() {
    setLogo();
	abpcTranslatePlugin.beforeInit();
});
$(window).resize(function() {
    setLogo()
});
window.onload = function(e) {
    //console.log('page fully loaded')
    //abpcTranslatePlugin.init();
};