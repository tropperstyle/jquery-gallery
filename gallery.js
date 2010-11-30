/*!
 * jQuery Gallery
 * https://github.com/tropperstyle/jquery-gallery
 *
 * Copyright, Jonathan Tropper.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * MIT-LICENSE.txt
 * GPL-LICENSE.txt
 */
 
(function($) {
    $.widget('ui.gallery', {
        options: {
            images: null,
            animateDuration: 500,
            width: 800,
            height: 700,
            autoOpen: true
        },
        _create: function() {
    		this.gallery = $(this._template).appendTo('body').hide();
    		this.overlay = $.ui.dialog.overlay.create(this).hide().css({ background: '#000 none', opacity: 0.25 });
    		this._bindEvents();
    		
    		if (this.options.autoOpen) { this.open(); }
        },
        destroy: function() {
            this.gallery.remove();
            $.ui.dialog.overlay.destroy(this.overlay);
            $.Widget.prototype.destroy.apply(this, arguments);
        },
        close: function() {
            var base = this;
            base.overlay.fadeOut(base.options.animateDuration);
            base.gallery.animate($.extend(base._originalLocation(), { opacity: 0 }), base.options.animateDuration, function() { base.destroy(); });
        },
        open: function() {
            this.loading(true);
            if (!this.options.images) { this.options.images = [{ src: this.element.attr('src') }]; }
            this._setupInitialImage();
            this._addInfo();
            if (this.options.images.length > 1) { this._addThumbnails(); }
        },
        loading: function(show) {
            if (show) {
                if (!this.loader) {
                    this.loader = $('<div class="ui-gallery-loading"/>').css(this._originalLocation()).css('opacity', 0.5);
                    this.loader.appendTo('body');
                }
            } else {
                this.loader.remove();
            }
        },
        _addInfo: function() {
            var container = this.gallery.find('.ui-gallery-information');
            var shown = false;
            var timer;
            
            this.gallery.bind({
                mousemove: function() {
                    if (shown) {
                        window.clearTimeout(timer);
                        timer = window.setTimeout(function() {
                            container.slideUp();
                            shown = false;
                        }, 2000);
                    } else {
                        container.slideDown();
                        shown = true;
                    }
                },
                mouseleave: function() {
                    container.slideUp();
                    shown = false;
                }
            });
        },
        _addThumbnails: function() {
            var base = this;
            var chooser = this.gallery.find('.ui-gallery-chooser');
            
            chooser.html($.map(this.options.images, function(image, i) {
                return '<img src="'+image.src+'" title="'+image.title+'"/>';
            }).join('\n')).find('img').css('opacity', 0.9);
            
            this.gallery.find('img').bind('click', function() {
                var url = this.src;
                base.gallery.find('.ui-gallery-title').html(this.title);
                base.gallery.find('.ui-gallery-content img').fadeOut(base.options.animateDuration/2, function() {
                    $(this).attr('src', url).fadeIn(base.options.animateDuration/2);
                });
            });
        },
        _bindEvents: function() {
            var base = this;
            this.gallery.find('.ui-gallery-close').bind('click', function() {
                base.close();
                return false;
            });
        },
        _centerLocation: function(image) {
            var width = this.options.width, height = this.options.height;
            
            // Scale the image proportionally
            if (image.width > image.height) {
                var difference = image.width / width;
                height = image.height / difference;
            } else {
                var difference = image.height / height;
                width = image.width / difference;
            }
            
            var topOffset = $(document).scrollTop(), leftOffset = $(document).scrollLeft();
            topOffset += ($(window).height() - height) / 2;
            leftOffset += ($(window).width() - width) / 2;
            
            // Ensure top is not out of the window area
            if (topOffset < 0) topOffset = 0;
            
            return {
                top: topOffset,
                left: leftOffset,
                width: width,
                height: height
            };
    	},
    	_originalLocation: function() {
    	    var offset = this.element.offset();
            return {
                top: offset.top - parseInt(this.gallery.css('padding-top'), 10),
                left: offset.left - parseInt(this.gallery.css('padding-left'), 10),
                width: this.element.width(),
                height: this.element.height()
            };
    	},
        _setupInitialImage: function() {
            var image = this.options.images[0];
            var base = this;
            $('<img/>').one('load', function() {
                base.loading(false);
                var duration = base.options.animateDuration, newLoction = base._centerLocation(this);
                base.gallery.find('.ui-gallery-content').html(this);
                base.gallery.css(base._originalLocation()).show();
                base.overlay.fadeIn(duration);
                base.gallery.find('.ui-gallery-title').html(image.title);
                base.gallery.animate(newLoction, duration, function() {
                    $(this).find('.ui-gallery-content img').fadeIn(duration/2);
                });
            }).attr('src', image.src);
        },
        _template: ' \
         <div class="ui-gallery"> \
            <div class="ui-gallery-container"> \
                <div class="ui-gallery-close"/> \
                <div class="ui-gallery-content"/> \
                <div class="ui-gallery-information"> \
                    <div class="ui-gallery-title"/> \
                    <div class="ui-gallery-chooser"/> \
                </div> \
                <div class="ui-gallery-shadows"> \
                    <div class="ui-gallery-shadow-top"/> \
                    <div class="ui-gallery-shadow-bottom"/> \
                    <div class="ui-gallery-shadow-right"/> \
                    <div class="ui-gallery-shadow-left"/> \
                    <div class="ui-gallery-shadow-corder-bottom-left"/> \
                    <div class="ui-gallery-shadow-corder-bottom-right"/> \
                    <div class="ui-gallery-shadow-corder-top-left"/> \
                    <div class="ui-gallery-shadow-corder-top-right"/> \
                </div> \
            </div> \
        </div>'
    });

    $.extend($.ui.gallery, {
        version: 0.1
    });
})(jQuery);
