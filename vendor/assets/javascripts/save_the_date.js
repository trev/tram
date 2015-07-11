/**
 * Save the Date - Responsive Wedding Invitation
 * -----------
 *
 * author: PeHaa Hetman
 * email: info@pehaa.com
 *
 * version 1.0 release date: 24.03.2013
 *
 **/
var save_the_date = {
    //-------------DEFAULT SETTINGS------------//
    defaults: {
        weddingDate: "",
        //Date : enter your wedding date
        labels: ["days", "hours", "minutes", "secs"],
        //Array of strings : labels of time units
        sendServerMessages: ["Thank you.", "Sorry, your message could not be sent due to an error."],
        //Array of strings : Messages from the server
        gallery: [],
        //FancyBox gallery images, ex ["gallery/image1.jpg", "gallery/image2.jpg", "gallery/image3.jpg"]
        titles: []
        //FancyBox gallery titles (optional) : ['Just us', 'Reception', 'Flowers we chose', 'In the eyes'],
    },
    option: {},
    init: function (customOption) {
        var self = this;
        // extend default option
        self.option = $.extend({}, self.defaults, customOption);
        // timer				
        if (self.option.weddingDate !== "") {
            //rAnf();
            self.weddingDate = new Date(self.option.weddingDate);
            self.setCountDown();
            self.days = $("#days");
            self.hours = $("#hours");
            self.minutes = $("#minutes");
            self.seconds = $("#seconds");
            self.doCountDown();
        }
        // gallery
        if (self.option.gallery.length > 0) {
            self.openGallery();
        }
        // small screens navigation	
        $("#full-menu").on('click', function () {
            $(this).parent('.nav').toggleClass('full');
            return false;
        });
        //	NAVIGATION	
        var y;
        $(".to-scroll").bind("click", function (event) {
            event.preventDefault();
            var $anchor = $(this);
            $('.active').removeClass('active');
            $anchor.addClass('active');
            if (notouch && $(window).width() > 1023 && $(window).height() > 829) {
                switch ($anchor.attr('href')) {
                    case "#top":
                        y = 0;
                        break;
                    case "#about":
                        y = threshold;
                        break;
                    default:
                        y = $($anchor.attr('href')).offset().top - 88;
                }

                $('html, body').stop().animate({
                    scrollTop: y
                });
            } else if (notouch && $(window).width() > 767) {
                $('html, body').stop().animate({
                    scrollTop: $($anchor.attr('href')).offset().top - 88
                });
            } else {
                $('html, body').stop().animate({
                    scrollTop: $($anchor.attr('href')).offset().top
                }, 1500);
            }
        });

        //slider		
        $(window).load(function () {
            $(".flexslider").flexslider({
                prevText: "&lsaquo;",
                nextText: "&rsaquo;",
                controlNav: false
            });
        });

        // google maps
        $(".map").click(function () {
            if ($(window).height() - $(this).offset().top + $(window).scrollTop() < 380) {
                $('html, body').stop().animate({
                    scrollTop: 430 - $(window).height() + $(this).offset().top
                }, 500);
            }
            var map,
                _lat = $(this).attr("data-lat"),
                _lng = $(this).attr("data-lng"),
                _title = $(this).attr("data-title");

            $(this).next(".my_map").fadeIn(1500);
            var map_container = $(this).next(".my_map").children("div").attr("id");
            map = new GMaps({
                el: map_container,
                lat: _lat,
                lng: _lng
            });
            map.addMarker({
                lat: _lat,
                lng: _lng,
                title: _title
            });
        });

        var notouch = !(Modernizr.touch),
            header_top = 92, // .nav-container height
            h2_height,
            threshold;

        var handler = function () {
            var sT = $(window).scrollTop();
            $(".header h2").css("opacity", (h2_height - 0.75 * sT) / h2_height);
            if (sT > threshold) {
                $(".header").removeClass("fixed").addClass("scrolled").css("top", threshold + header_top);
            } else {
                $(".header").addClass("fixed").removeClass("scrolled").css("top", header_top);
            }
        };

        var _init = function () {
            h2_height = parseInt($('h1').css("height"), 10) + parseInt($('.images').css("height"), 10) + header_top + 2 * 32 + 16,
            threshold = parseInt($('.content').css("top"), 10) - h2_height;
            if (notouch && $(window).width() > 1023 && $(window).height() > 830) {
                $(".header").removeClass("wide-short");
                if ($(window).scrollTop() <= threshold) {
                    $(".header").removeClass("scrolled").addClass("fixed").css("top", header_top);
                } else {
                    $(".header").removeClass("fixed").addClass("scrolled").css("top", threshold + header_top);
                }
                $(window).bind("scroll", handler);
            } else {
                $(window).unbind("scroll", handler);
                $(".header h2").css("opacity", 1);
                if (notouch && $(window).width() > 767) {
									$(".header").removeClass("fixed").removeClass("scrolled").addClass("wide-short");
								}         
            }
        };

        $(window).resize(function () {
            _init();
        });
        _init();


        // contact form
        self.rsvp();
    },

    openGallery: function () {
        var self = this;

        $(document).on("click", "#gallery", function () {
            var my_gallery = [];
            $(self.option.gallery).each(function (index, ele) {
                my_gallery[index] = {
                    href: ele,
                    title: self.option.titles[index]
                };
            });
            $.fancybox.open(my_gallery);
            $(".active").removeClass("active");
            $("#gallery").addClass("active");
            return false;
        });

    },

    setCountDown: function () {
        var self = this;
        var now = new Date();
        self.secondsDiff = Math.floor((self.weddingDate.getTime() - now.getTime()) / 1000);

        var $timer_html = 'in <span id="days"></span> ' + self.option.labels[0] +
            '  <span id="hours"></span> ' + self.option.labels[1] +
            '  <span id="minutes"></span> ' + self.option.labels[2] +
            '  <small><span id="seconds"></span> ' + self.option.labels[3] + '</small>';
            $("#timer").html($timer_html);
        
    },

    doCountDown: function () {
        var self = this;
        var count = function () {
            setTimeout(function () {
                requestAnimationFrame(count);
                var now = new Date(),
                    secondsDiff = Math.floor((self.weddingDate.getTime() - now.getTime()) / 1000);

                var seconds = secondsDiff,
                    minutes = Math.floor(seconds / 60),
                    hours = Math.floor(minutes / 60),
                    days = Math.floor(hours / 24);
                hours %= 24;
                minutes %= 60;
                seconds %= 60;
                self.days.html(Math.max(days, 0));
                self.hours.html(Math.max(hours, 0));
                self.minutes.html(Math.max(minutes, 0));
                self.seconds.html(Math.max(seconds, 0));
            }, 1000);
        };
        count();
    },



    rsvp: function () {
        var self = this;

        $("#check-reception:checked").parent().parent().next("#guests").show();

        $("#check-reception").change(function () {
            $("#guests").slideToggle('slow');
        });

        if (!Modernizr.input.placeholder) {
            var inputs = ["#name", "#email", "textarea", "#adults", "#children"];
            $(inputs).each(function (index, ele) {
                $(ele).val($(ele).attr("placeholder"));
            });
        }

        $("#rsvp form").submit(function () {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            var address = $("#email").val(),
                name = $("#name").val(),
                reception = $("#check-reception").is(':checked'),
                adults = $("#adults").val(),
                stopped = false;
            $(".error").removeClass("error");
            if (reception) {
                if (adults !== undefined && (adults === "" || adults === $("#adults").attr("placeholder"))) {
                    $("#adults").addClass("error");
                    stopped = true;
                }
            }

            if (name === "" || name === $("#name").attr("placeholder")) {
                $("#name").addClass("error");
                stopped = true;
            }

            if ((address === "") || (reg.test(address) === false)) {
                $("#email").addClass("error");
                stopped = true;
            }

            if (!(stopped)) {
                var form = $(this);

                var formData = $(form).serialize(),
                    $note = $('#note');

                $.ajax({
                    type: "POST",
                    url: "send.php",
                    data: formData,
                    success: function (response) {
                        var result = '';
                        switch (response) {
                            case "success":
                                $(form).hide();
                                $("html, body").animate({
                                    scrollTop: $(document).height()
                                }, "slow");
                                result = self.option.sendServerMessages[0];
                                break;
                            case "error":
                                result = self.option.sendServerMessages[1];
                                break;
                        }
                        $note.html(result);
                    }
                });

                return false;
            }
            return false;
        });
    }

};

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());
