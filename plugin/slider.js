/**
 *  @name slider
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
; (function ($, PSA) {
  'use strict';

  var pluginName = 'slider';

  var checkScreen = function() {
    if (PSA.isMobile()) {
      return 'mobile';
    }
    if (PSA.isTablet()) {
      return 'tablet';
    }
    if (PSA.isDesktop()) {
      return 'desktop';
    }
  };

  var ratioScreen = function(ele, ratio) {
    var screenWidth = ele.width();
    ele.find('.item').css('padding-bottom', screenWidth * ratio);
    ele.find('.slick-arrow').css('top', (screenWidth * ratio) / 2);
  };

  var initRatio = function(ele, opts) {
    if (opts.ratio) {
      switch (checkScreen()) {
        case 'mobile':
          ratioScreen(ele, opts.ratio.mobile);
          break;
        case 'tablet':
          ratioScreen(ele, opts.ratio.tablet);
          break;
        default:
          ratioScreen(ele, opts.ratio.desktop);
          break;
      }
    }
  };

  var customSlider = function (ele, opts) {
    if (ele.data('custom-slider')) {
      opts.dots = {
        dots: false,
        arrows: true
      };
      opts.adaptiveHeight = true;
      opts.responsive = [
        {
          breakpoint: PSA.config.phones,
          settings: {
            dots: true,
            // arrows: false
            arrows: true
          }
        }
      ];
    }
  };


  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var that = this,
        ele = that.element,
        opts = that.options,
        timer = null,
        controlslistEle = ele.find('[controlslist="nodownload"]');

      customSlider(ele, opts);

      controlslistEle.each(function(){
        controlslistEle.on('contextmenu', function(e) {
          e.preventDefault();
        }, false);
      });

      ele.on('beforeChange', function (event, slick, currentSlide, nextSlide) {

        var currentVideo = $(slick.$slides.get(currentSlide)).find('video'),
          nextVideo = $(slick.$slides.get(nextSlide)).find('video'),
          currentIframe = $(slick.$slides.get(currentSlide)).find('iframe'),
          nextIframe = $(slick.$slides.get(nextSlide)).find('iframe');

        if (ele.data('autoplay') === true) {
          ele.slick('setOption', 'autoplaySpeed', 0);
          ele.slick('slickPlay');
        }

        // if (currentVideo.length) {
        //   currentVideo[0].pause();
        // }

        // if (nextVideo.length) {
        //   ele.addClass('current-video');
        //   if(PSA.vars.html.hasClass('no-touch')){
        //     nextVideo[0].play();
        //   }
        // }else{
        //   ele.removeClass('current-video');
        // }

        if (currentVideo.length || currentIframe.length) {
          if (currentVideo.length) {
            currentVideo[0].pause();
          }
          if (currentIframe.length) {
            currentIframe['youtube-control']();
            currentIframe['youtube-control']('pauseVideo');
          }
        }

        if (PSA.isDesktop()) {
          if (nextVideo.length || nextIframe.length) {
            ele.addClass('current-video');
            if (nextVideo.length) {
              nextVideo[0].play();
            }
            if (nextIframe.length) {
              ele.slick('slickPause');
              nextIframe['youtube-control']();
              nextIframe['youtube-control']('playVideo');
            }
          }else {
            ele.removeClass('current-video');
          }
        }

      });

      ele.on('init', function (event, slick) {
        setTimeout(function () {
          var currentSlide = ele.slick('slickCurrentSlide');
          var currentVideo = $(slick.$slides.get(currentSlide)).find('video');
          var currentIframe = $(slick.$slides.get(currentSlide)).find('iframe');
          var slideTime = $(slick.$slides.get(currentSlide)).data('time');

          if (slideTime === 0) {
            ele.slick('slickPause');
          }

          // if (currentVideo.length) {
          //   ele.addClass('current-video');
          //   if(PSA.vars.html.hasClass('no-touch')){
          //     currentVideo[0].play();
          //   }
          // }

          if (currentVideo.length || currentIframe.length) {
            ele.addClass('current-video');
            if (PSA.isDesktop()) {
              if (currentVideo.length) {
                currentVideo[0].play();
              }
              if (currentIframe.length) {
                ele.slick('slickPause');
                if (document.readyState === 'complete') {
                  currentIframe['youtube-control']();
                  currentIframe['youtube-control']('playVideo');
                } else {
                  $(window).on('load', function() {
                    currentIframe['youtube-control']();
                    currentIframe['youtube-control']('playVideo');
                  });
                }
              }
            }
          }
        });
      });

      if (ele.data('autoplay') === true) {
        ele.on('afterChange', function(e, slick, currentSlide) {
          var slideTime = $(slick.$slides.get(currentSlide)).data('time');
          var currentIframe = $(slick.$slides.get(currentSlide)).find('iframe');

          ele.slick('slickPause');

          if (slideTime === 0) {
          } else {
          	ele.slick('slickPlay');
            ele.slick('setOption', 'autoplaySpeed', slideTime);
          }

          if (slideTime !== 0 && currentIframe.length) {
            ele.slick('slickPause');
          } else {
          	ele.slick('slickPlay');
            ele.slick('setOption', 'autoplaySpeed', slideTime);
          }
        });
      }

      // ele.slick(that.options);
      ele.slick(opts);

      initRatio(ele, opts);

      PSA.vars.win.on('resize', function(e) {
        e.preventDefault();
        clearTimeout(timer);
        timer = setTimeout(function() {
          initRatio(ele, opts);
          ele.slick('setPosition');
        }, 300);
      });

    },
    destroy: function () {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function (options, params) {
    return this.each(function () {
      var instance = $.data(this, 'plugin_' + pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      }
    });
  };

  $.fn[pluginName].defaults = {
    speed: PSA.vars.speedFast,
    arrows: true,
    dots: true,
    adaptiveHeight: false,
    slideToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false,
    ratio: ''
  };

  $(function () {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window.PSA));
