var app = (function () {

    var __initImageSwitcher = function(){
        var $activeImgCont = $('.image-selector li.active');
        var activeClass = 'active';

        var activateImg = {
            url: $activeImgCont.find('a').attr('href'),
            show: function(){
                var $container = $('.product-image');
                $container.attr('src', this.url);
            }
        };

        $(document).on('click', '.image-selector li', function(ev){
            ev.preventDefault();
            var $this = $(this);            
            $activeImgCont.removeClass(activeClass);    

            activateImg.url = $this.find('a').attr('href');
            $this.addClass('active');
            
            activateImg.show();
        });

        activateImg.show();
    }

    var __initApp = function () {
        jQuery('img').filter(function () {
            return this.src.match(/.*\.svg$/);
        }).each(function () {
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            jQuery.get(imgURL, function (data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');

                // Add replaced image's ID to the new SVG
                if (typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if (typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass + ' replaced-svg');
                }

                $svg.removeClass('not-visible');

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');
                var iconLastPath = $svg.find('.js-image').attr('xlink:href');
                $svg.find('.js-image').attr('xlink:href', Drupal.settings.theme_path + 'images' + iconLastPath);

                // Replace image with new SVG
                $img.replaceWith($svg);

            }, 'xml');
        });
    }

    var __initMatcher = function () {
        var $datepickers = $('.datepicker');

        var dateNumberEnum = [];
        dateNumberEnum[01] = 'იანვარი';
        dateNumberEnum[02] = 'თებერვალი';
        dateNumberEnum[03] = 'მარტი';
        dateNumberEnum[04] = 'აპრილი';
        dateNumberEnum[05] = 'მაისი';
        dateNumberEnum[06] = 'ივნისი';
        dateNumberEnum[07] = 'ივლისი';
        dateNumberEnum[08] = 'აგვისტო';
        dateNumberEnum[09] = 'სექტემბერი';
        dateNumberEnum[10] = 'ოქტომბერი';
        dateNumberEnum[11] = 'ნოემბერი';
        dateNumberEnum[12] = 'დეკემბერი';


        $datepickers.datepicker({
            changeYear: true,
            dateFormat: 'dd/mm',
            onSelect: function (dateText, inst) {
                var $dayLabel = $(this).parent().find('.date-input .day');
                var $monthLabel = $(this).parent().find('.date-input .month');
                var $placeholder = $(this).parent().find('.date-input .placeholder');
                var data = dateText.split('/');

                $dayLabel.html(data[0]);
                $monthLabel.html(dateNumberEnum[parseInt(data[1])]);
                $placeholder.hide();
            }
        });

        $(document).on('click', '.date-input', function () {
            $($(this).next()).datepicker("show");
        });
    }

    var __initCartModule = function () {
        var $listenTo = $('.js_add_to_cart');
        var __cartCookieName = "cartItems";

        $(document).on('click', $listenTo, function (ev) {
            ev.preventDefault();
            var self = this;
            var newCookieValue = '';
            var id = $(self).id;

            var currentValue = cookieHelpers.readCookie(__cartCookieName);
            if (currentValue) {
                //TODO: updateCookie
                var arrayOfItems = cookieHelpers.parseCartCookieValue(currentValue);

                newCookieValue = arrayOfItems.push(id).join(',');

                //delete prev cookie
                cookieHelpers.eraseCookie(__cartCookieName);
            }
            else {
                newCookieValue = id;
            }


            cookieHelpers.createCookie(__cartCookieName, newCookieValue, 30);
            //TODO: create notification that item was added
        });
    }

    var __renderCartItemsFromCookie = function () {
        //TODO: make ajax call to server and retrive data
    }

    var __size = {
        small: 5,
        medium: 10,
        large: 15
    }

    function __getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function __getRandomSign() {
        var sign = 1;
        var rnd = Math.random() - 0.5;
        if (rnd == 0) {
            sign = 1;
        } else {
            sign = Math.sign(rnd);
        }

        return sign;
    }




    var cookieHelpers = function () {
        this.createCookie = function createCookie(name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            }
            else var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        }

        this.readCookie = function readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        this.eraseCookie = function eraseCookie(name) {
            createCookie(name, "", -1);
        }

        this.parseCartCookieValue = function (val) {
            var response = [];
            values = val.split(",");
            for (var i = 0; i < values.length; i++) {
                var currentVal = values[i];
                response.push(parseInt(currentVal));
            }

            return response;
        }
    }

    return {
        initCartModule: __initCartModule,
        renderCartItems: __renderCartItemsFromCookie,
        initMatcher: __initMatcher,
        initApp: __initApp,
        initImageSwitcher: __initImageSwitcher
    }
})();