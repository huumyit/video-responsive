/**
 *  @name youtube-control
 *  @description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    window on resize
 *  @methods
 *    init
 *    destroy
 */
;(function($, window) {
    'use strict';

    var pluginName = 'youtube-control';

    function Plugin(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var that = this,
                elm = that.element;

            that.vars = {
                player: new window.YT.Player(elm[0], {
                    events: {
                        'onStateChange': that.onStateChange
                    }
                })
            };
            
        },

        playVideo: function() {
            this.vars.player.playVideo();
        },
        pauseVideo: function() {
            this.vars.player.pauseVideo();
        },
        stopVideo: function() {
            this.vars.player.stopVideo();
        },
        mute: function() {
            this.vars.player.mute();
        },
        unmute: function() {
            this.vars.player.unmute();
        },
        onStateChange: function(event) {
            var iframe = null;
            // if video ended
            if (event.data === window.YT.PlayerState.ENDED) {
                iframe = $(event.target.getIframe());
                if (iframe.parents('[data-slider]') &&
                    iframe.parents('[data-slider]').length &&
                    (iframe.parents('[data-slider]').data('autoplay') === true)) {
                    // if video inside carousel and carousel set auto slide => when end video will auto next slide
                    event.target.stopVideo();
                    iframe.siblings('.layer-video').removeClass('hidden');
                    iframe.parents('[data-slider]').slick('slickNext');
                } else {
                    if (iframe.data('loop')) {
                        if (iframe.data('loop') === false) {
                            // stop video to hide controler
                            event.target.stopVideo();
                            iframe.siblings('.layer-video').removeClass('hidden');
                        } else { // repeat
                            event.target.playVideo();
                        }
                    } else {
                        // stop video to hide controler
                        event.target.stopVideo();
                        iframe.siblings('.layer-video').removeClass('hidden');
                    }
                }
            }
            if (event.data === window.YT.PlayerState.PAUSED) {
                iframe = $(event.target.getIframe());
                if (iframe.parents('[data-slider]') &&
                    iframe.parents('[data-slider]').length &&
                    (iframe.parents('[data-slider]').data('autoplay') === true)) {
                    //when pause video will autoslide
                    iframe.parents('[data-slider]').slick('slickPlay');
                }
            }

            if ((event.data === window.YT.PlayerState.BUFFERING) || (event.data === window.YT.PlayerState.PLAYING)) {
                iframe = $(event.target.getIframe());
                
                if (iframe.siblings('.layer-video') && iframe.siblings('.layer-video').length) {
                    // $(event.target.getIframe()).css('opacity', '1');
                    iframe.siblings('.layer-video').addClass('hidden');
                }
            }
        },
        destroy: function() {
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            var instance = $.data(this, pluginName);
            if (!instance) {
                $.data(this, pluginName, new Plugin(this, options));
            } else if (instance[options]) {
                instance[options](params);
            }
        });
    };

    $.fn[pluginName].defaults = {};
    
}(jQuery, window));
