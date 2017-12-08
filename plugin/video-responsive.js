/**
 *  @name video rwd
 *  @description Change source matching with screen
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    window on resize
 *  @methods
 *    init
 *    destroy
 */
;(function($, PSA) {
	'use strict';

	var pluginName = 'video-responsive';

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

	var initPlugin = function(ele, opts) {
		if (PSA.isMobile()) {
			ele.find('source').attr('src', opts.videoResponsive.mobile);
		}
		if (PSA.isTablet()) {
			ele.find('source').attr('src', opts.videoResponsive.tablet);
		}
		if (PSA.isDesktop()) {
			ele.find('source').attr('src', opts.videoResponsive.desktop);
		}
		ele.load();
	};

	function Plugin(element, options) {
		this.element = $(element);
		this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
		this.init();
	}

	Plugin.prototype = {
		init: function() {
			var that = this,
				ele = that.element,
				controlslistEle = ele.attr('controlslist'),
				opts = that.options,
				lastScreen = checkScreen(),
				timeout = null;

			if (controlslistEle === 'nodownload') {
				ele.each(function(){
	        ele.on('contextmenu', function(e) {
	          e.preventDefault();
	        }, false);
	      });
			}

			initPlugin(ele, opts);

			PSA.vars.win.on('resize', function(e) {
				clearTimeout(timeout);
				timeout = setTimeout(function() {
					e.preventDefault();
					if (lastScreen !== checkScreen()) {
						initPlugin(ele, opts);
						lastScreen = checkScreen();
					}
				}, 300);
			});
			// PSA.vars.body.on('click', '[data-controls-layer]', function(e) {
			// 	e.preventDefault();
			// 	$(this).siblings('video').get(0).play();
			// });

			// ele.on('play', function(e) {
			// 	e.preventDefault();
			// 	ele.siblings('[data-controls-layer]').hide();
			// });

			// ele.on('pause', function(e) {
			// 	e.preventDefault();
			// 	ele.siblings('[data-controls-layer]').show();
			// });
		},
		destroy: function() {
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

	$.fn[pluginName].defaults = {};

	$(function() {
		$('[data-' + pluginName + ']')[pluginName]();
	});

}(jQuery, window.PSA));
