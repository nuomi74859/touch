/**
 * Created by Administrator on 2014/8/20.
 */
(function(bodyStyle,$) {
    $.fn.canvasGame = function(options){
        'use strict';
        var self = this;
        var opt = $.extend({
            target:'canvas',
            img:'',
            percent:0.5,
            loadTarget:'#ajax-load',
            loadLocation:'/mobileLoad.html'
        }, options);
//        bodyStyle.mozUserSelect = 'none';
//        bodyStyle.webkitUserSelect = 'none';

        var img = new Image();
        var canvas = document.querySelector(opt.target);
        var $canvas = self;
        canvas.style.backgroundColor='transparent';
        canvas.style.position = 'relative';

        img.addEventListener('load', function(e) {
            var ctx;
            var w = $canvas.width(),
                h = $canvas.height();

            var mousedown = false;

            function layer(ctx) {
                ctx.fillStyle = 'gray';
                ctx.fillRect(0, 0, w, h);
            }

            function eventDown(e){
                e.preventDefault();
                mousedown=true;
            }

            function eventCallback() {
                var data=ctx.getImageData(0,0,w,h).data;
                for(var i=0,j=0;i<data.length;i+=4){
                    if(data[i] && data[i+1] && data[i+2] && data[i+3]){
                        j++;
                    }
                }
                if(j<=w*h*opt.percent){
                    $canvas.off();
                    $(opt.loadTarget).empty().load(opt.loadLocation);
                }
            }

            function eventUp(e){
                e.preventDefault();
                mousedown = false;
                eventCallback();
            }

            function eventMove(e){
                e.preventDefault();

                if(mousedown) {
                    if(e.changedTouches){
                        e=e.changedTouches[e.changedTouches.length-1];
                    }
                    var x = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0,
                        y = (e.clientY + document.body.scrollTop || e.pageY) - offsetY || 0;
                    ctx.beginPath();
                    ctx.arc(x, y, 20, 0, Math.PI * 2);
                    ctx.fill();

                }
                eventCallback();
            }

            canvas.width=w;
            canvas.height=h;
            canvas.style.backgroundImage='url('+img.src+')';
            ctx=canvas.getContext('2d');
            ctx.fillStyle='transparent';
            layer(ctx);
            var offsetX = $canvas.offset().left,
            offsetY = $canvas.offset().top;
            ctx.globalCompositeOperation = 'destination-out';

//            canvas.addEventListener('touchstart', eventDown);
//            canvas.addEventListener('touchend', eventUp);
//            canvas.addEventListener('touchmove', eventMove);
//            canvas.addEventListener('mousedown', eventDown);
//            canvas.addEventListener('mouseup', eventUp);
//            canvas.addEventListener('mousemove', eventMove);
            $canvas.on({
                'touchstart':eventDown,
                'touchend':eventUp,
                'touchmove':eventMove,
                'mousedown':eventDown,
                'mouseup':eventUp,
                'mousemove':eventMove
            });
        });
        img.src = opt.img;
    };
    return self;
})(document.body.style,window.Zepto);
;/*
	Base.js, version 1.1a
	Copyright 2006-2010, Dean Edwards
	License: http://www.opensource.org/licenses/mit-license.php
*/

var Base = function() {
	// dummy
};

Base.extend = function(_instance, _static) { // subclass
	
	"use strict";
	
	var extend = Base.prototype.extend;
	
	// build the prototype
	Base._prototyping = true;
	
	var proto = new this();
	
	extend.call(proto, _instance);
	
	proto.base = function() {
	// call this method from any other method to invoke that method's ancestor
	};

	delete Base._prototyping;
	
	// create the wrapper for the constructor function
	//var constructor = proto.constructor.valueOf(); //-dean
	var constructor = proto.constructor;
	var klass = proto.constructor = function() {
		if (!Base._prototyping) {
			if (this._constructing || this.constructor == klass) { // instantiation
				this._constructing = true;
				constructor.apply(this, arguments);
				delete this._constructing;
			} else if (arguments[0] !== null) { // casting
				return (arguments[0].extend || extend).call(arguments[0], proto);
			}
		}
	};
	
	// build the class interface
	klass.ancestor = this;
	klass.extend = this.extend;
	klass.forEach = this.forEach;
	klass.implement = this.implement;
	klass.prototype = proto;
	klass.toString = this.toString;
	klass.valueOf = function(type) {
		//return (type == "object") ? klass : constructor; //-dean
		return (type == "object") ? klass : constructor.valueOf();
	};
	extend.call(klass, _static);
	// class initialisation
	if (typeof klass.init == "function") klass.init();
	return klass;
};

Base.prototype = {	
	extend: function(source, value) {
		if (arguments.length > 1) { // extending with a name/value pair
			var ancestor = this[source];
			if (ancestor && (typeof value == "function") && // overriding a method?
				// the valueOf() comparison is to avoid circular references
				(!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) &&
				/\bbase\b/.test(value)) {
				// get the underlying method
				var method = value.valueOf();
				// override
				value = function() {
					var previous = this.base || Base.prototype.base;
					this.base = ancestor;
					var returnValue = method.apply(this, arguments);
					this.base = previous;
					return returnValue;
				};
				// point to the underlying method
				value.valueOf = function(type) {
					return (type == "object") ? value : method;
				};
				value.toString = Base.toString;
			}
			this[source] = value;
		} else if (source) { // extending with an object literal
			var extend = Base.prototype.extend;
			// if this object has a customised extend method then use it
			if (!Base._prototyping && typeof this != "function") {
				extend = this.extend || extend;
			}
			var proto = {toSource: null};
			// do the "toString" and other methods manually
			var hidden = ["constructor", "toString", "valueOf"];
			// if we are prototyping then include the constructor
			var i = Base._prototyping ? 0 : 1;
			while (key = hidden[i++]) {
				if (source[key] != proto[key]) {
					extend.call(this, key, source[key]);

				}
			}
			// copy each of the source object's properties to this object
			for (var key in source) {
				if (!proto[key]) extend.call(this, key, source[key]);
			}
		}
		return this;
	}
};

// initialise
Base = Base.extend({
	constructor: function() {
		this.extend(arguments[0]);
	}
}, {
	ancestor: Object,
	version: "1.1",
	
	forEach: function(object, block, context) {
		for (var key in object) {
			if (this.prototype[key] === undefined) {
				block.call(context, object[key], key, object);
			}
		}
	},
		
	implement: function() {
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "function") {
				// if it's a function, call it
				arguments[i](this.prototype);
			} else {
				// add the interface using the extend method
				this.prototype.extend(arguments[i]);
			}
		}
		return this;
	},
	
	toString: function() {
		return String(this.valueOf());
	}
});
/*jshint smarttabs:true */

var FlipClock;
	
/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
	
	/**
	 * FlipFlock Helper
	 *
	 * @param  object  A jQuery object or CSS select
	 * @param  int     An integer used to start the clock (no. seconds)
	 * @param  object  An object of properties to override the default	
	 */
	 
	FlipClock = function(obj, digit, options) {
		if(typeof digit == "object") {
			options = digit;
			digit = 0;
		}

		return new FlipClock.Factory(obj, digit, options);
	};

	/**
	 * The global FlipClock.Lang object
	 */

	FlipClock.Lang = {};
	
	/**
	 * The Base FlipClock class is used to extend all other FlipFlock
	 * classes. It handles the callbacks and the basic setters/getters
	 *	
	 * @param 	object  An object of the default properties
	 * @param 	object  An object of properties to override the default	
	 */

	FlipClock.Base = Base.extend({
		
		/**
		 * Build Date
		 */
		 
		buildDate: '2014-06-03',
		
		/**
		 * Version
		 */
		 
		version: '0.5.5',
		
		/**
		 * Sets the default options
		 *
		 * @param	object 	The default options
		 * @param	object 	The override options
		 */
		 
		constructor: function(_default, options) {
			if(typeof _default !== "object") {
				_default = {};
			}
			if(typeof options !== "object") {
				options = {};
			}
			this.setOptions($.extend(true, {}, _default, options));
		},
		
		/**
		 * Delegates the callback to the defined method
		 *
		 * @param	object 	The default options
		 * @param	object 	The override options
		 */
		 
		callback: function(method) {
		 	if(typeof method === "function") {
				var args = [];
								
				for(var x = 1; x <= arguments.length; x++) {
					if(arguments[x]) {
						args.push(arguments[x]);
					}
				}
				
				method.apply(this, args);
			}
		},
		 
		/**
		 * Log a string into the console if it exists
		 *
		 * @param 	string 	The name of the option
		 * @return	mixed
		 */		
		 
		log: function(str) {
//			if(window.console && console.log) {
//				console.log(str);
//			}
		},
		 
		/**
		 * Get an single option value. Returns false if option does not exist
		 *
		 * @param 	string 	The name of the option
		 * @return	mixed
		 */		
		 
		getOption: function(index) {
			if(this[index]) {
				return this[index];
			}
			return false;
		},
		
		/**
		 * Get all options
		 *
		 * @return	bool
		 */		
		 
		getOptions: function() {
			return this;
		},
		
		/**
		 * Set a single option value
		 *
		 * @param 	string 	The name of the option
		 * @param 	mixed 	The value of the option
		 */		
		 
		setOption: function(index, value) {
			this[index] = value;
		},
		
		/**
		 * Set a multiple options by passing a JSON object
		 *
		 * @param 	object 	The object with the options
		 * @param 	mixed 	The value of the option
		 */		
		
		setOptions: function(options) {
			for(var key in options) {
	  			if(typeof options[key] !== "undefined") {
		  			this.setOption(key, options[key]);
		  		}
		  	}
		}
		
	});
	
}(jQuery));

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
	
	/**
	 * The FlipClock Face class is the base class in which to extend
	 * all other FlockClock.Face classes.
	 *
	 * @param 	object  The parent FlipClock.Factory object
	 * @param 	object  An object of properties to override the default	
	 */
	 
	FlipClock.Face = FlipClock.Base.extend({
		
		/**
		 * An array of jQuery objects used for the dividers (the colons)
		 */
		 
		dividers: [],

		/**
		 * An array of FlipClock.List objects
		 */		
		 
		factory: false,
		
		/**
		 * An array of FlipClock.List objects
		 */		
		 
		lists: [],

		/**
		 * Constructor
		 *
		 * @param 	object  The parent FlipClock.Factory object
		 * @param 	object  An object of properties to override the default	
		 */
		 
		constructor: function(factory, options) {
			this.dividers = [];
			this.lists = [];
			this.base(options);
			this.factory  = factory;
		},
		
		/**
		 * Build the clock face
		 */
		 
		build: function() {},
		
		/**
		 * Creates a jQuery object used for the digit divider
		 *
		 * @param	mixed 	The divider label text
		 * @param	mixed	Set true to exclude the dots in the divider. 
		 *					If not set, is false.
		 */
		 
		createDivider: function(label, css, excludeDots) {
		
			if(typeof css == "boolean" || !css) {
				excludeDots = css;
				css = label;
			}

			var dots = [
				'<span class="'+this.factory.classes.dot+' top"></span>',
				'<span class="'+this.factory.classes.dot+' bottom"></span>'
			].join('');

			if(excludeDots) {
				dots = '';	
			}

			label = this.factory.localize(label);

			var html = [
				'<span class="'+this.factory.classes.divider+' '+(css ? css : '').toLowerCase()+'">',
					'<span class="'+this.factory.classes.label+'">'+(label ? label : '')+'</span>',
					dots,
				'</span>'
			];	
			
			return $(html.join(''));
		},
		
		/**
		 * Creates a FlipClock.List object and appends it to the DOM
		 *
		 * @param	mixed 	The digit to select in the list
		 * @param	object  An object to override the default properties
		 */
		 
		createList: function(digit, options) {
			if(typeof digit === "object") {
				options = digit;
				digit = 0;
			}

			var obj = new FlipClock.List(this.factory, digit, options);
		
			this.lists.push(obj);

			return obj;
		},
		
		/**
		 * Triggers when the clock is reset
		 */

		reset: function() {
			this.factory.time = new FlipClock.Time(
				this.factor, 
				this.factory.original ? Math.round(this.factory.original) : 0
			);
			this.flip(this.factory.original, false);
		},

		/**
		 * Sets the clock time (deprecated, duplicate method)
		 *

		setTime: function(time) {
			this.flip();		
		},
		*/
		
		/**
		 * Sets the clock time
		 */
		 
		addDigit: function(digit) {
			var obj = this.createList(digit, {
				classes: {
					active: this.factory.classes.active,
					before: this.factory.classes.before,
					flip: this.factory.classes.flip
				}
			});
			
			obj.$el.append(this.factory.lists[this.factory.lists.length - 1].$obj);
							
			//this.factory.lists.unshift(obj);
		},
		
		/**
		 * Triggers when the clock is started
		 */
		 
		start: function() {},
		
		/**
		 * Triggers when the time on the clock stops
		 */
		 
		stop: function() {},
		
		/**
		 * Auto increments/decrements the value of the clock face
		 */
		 
		autoIncrement: function() {
			if (!(this.factory.time.time instanceof Date)) {
				if(!this.factory.countdown) {
					this.increment();
				}
				else {
					this.decrement();
				}
			}
		},

		/**
		 * Increments the value of the clock face
		 */
		 
		increment: function() {
			this.factory.time.addSecond();
		},

		/**
		 * Decrements the value of the clock face
		 */

		decrement: function() {
			if(this.factory.time.getTimeSeconds() == 0) {
	        	this.factory.stop()
			}
			else {
				this.factory.time.subSecond();
			}
		},
			
		/**
		 * Triggers when the numbers on the clock flip
		 */
		 
		flip: function(time, doNotAddPlayClass) {
			var t = this;

			/*
			if (!(this.factory.time.time instanceof Date)) {
				if(!this.factory.countdown) {
					this.increment();
				}
				else {
					this.decrement();
				}
			}
			*/

//			console.log(t.lists);

			$.each(time, function(i, digit) {
				var list = t.lists[i];

				if(list) {
					if(!doNotAddPlayClass && digit != list.digit) {
						list.play();	
					}

					list.select(digit);
				}	
				else {
					t.addDigit(digit);
				}
			});

			/*
			DELETE PENDING - Legacy flip code that was replaced with the
			much more simple logic above.

			var offset = t.factory.lists.length - time.length;

			if(offset < 0) {
				offset = 0;
			}			
			
			$.each(time, function(i, digit) {
				i += offset;
				
				var list = t.factory.lists[i];
				
				console.log()

				if(list) {
					list.select(digit);
					
					if(!doNotAddPlayClass) {
						list.play();	
					}
				}	
				else {
					t.addDigit(digit);
				}
			});

			for(var x = 0; x < time.length; x++) {
				if(x >= offset && t.factory.lists[x].digit != time[x]) {
					t.factory.lists[x].select(time[x]);
				}
			}
			*/
		}
					
	});
	
}(jQuery));

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
	
	/**
	 * The FlipClock Factory class is used to build the clock and manage
	 * all the public methods.
	 *
	 * @param 	object  A jQuery object or CSS selector used to fetch
	 				    the wrapping DOM nodes
	 * @param 	mixed   This is the digit used to set the clock. If an 
	 				    object is passed, 0 will be used.	
	 * @param 	object  An object of properties to override the default	
	 */
	 	
	FlipClock.Factory = FlipClock.Base.extend({
		
		/**
		 * Auto start the clock on page load (True|False)
		 */	
		 
		autoStart: true,
		
		/**
		 * The callback methods
		 */		
		 
		callbacks: {
			destroy: false,
			create: false,
			init: false,
			interval: false,
			start: false,
			stop: false,
			reset: false
		},
		
		/**
		 * The CSS classes
		 */		
		 
		classes: {
			active: 'flip-clock-active',
			before: 'flip-clock-before',
			divider: 'flip-clock-divider',
			dot: 'flip-clock-dot',
			label: 'flip-clock-label',
			flip: 'flip',
			play: 'play',
			wrapper: 'flip-clock-wrapper'
		},
		
		/**
		 * The name of the clock face class in use
		 */	
		 
		clockFace: 'HourlyCounter',
		 
		/**
		 * The name of the clock face class in use
		 */	
		 
		countdown: false,
		 
		/**
		 * The name of the default clock face class to use if the defined
		 * clockFace variable is not a valid FlipClock.Face object
		 */	
		 
		defaultClockFace: 'HourlyCounter',
		 
		/**
		 * The default language
		 */	
		 
		defaultLanguage: 'english',
		 
		/**
		 * The language being used to display labels (string)
		 */	
		 
		language: 'english',
		 
		/**
		 * The language object after it has been loaded
		 */	
		 
		lang: false,
		 
		/**
		 * The original starting value of the clock. Used for the reset method.
		 */		
		 
		original: false,
		
		/**
		 * The FlipClock.Face object
		 */	
		 
		face: true,
		 
		/**
		 * Is the clock running? (True|False)
		 */		
		 
		running: false,
		
		/**
		 * The FlipClock.Time object
		 */		
		 
		time: false,
		
		/**
		 * The FlipClock.Timer object
		 */		
		 
		timer: false,
		
		/**
		 * An array of FlipClock.List objects
		 */		
		 
		lists: [],
		
		/**
		 * The jQuery object
		 */		
		 
		$el: false,

		/**
		 * The jQuery object (depcrecated)
		 */		
		 
		$wrapper: false,
		
		/**
		 * Constructor
		 *
		 * @param   object  The wrapping jQuery object
		 * @param	object  Number of seconds used to start the clock
		 * @param	object 	An object override options
		 */
		 
		constructor: function(obj, digit, options) {

			if(!options) {
				options = {};
			}

			this.lists = [];
			this.running = false;
			this.base(options);	

			this.$el = $(obj).addClass(this.classes.wrapper);

			// Depcrated support of the $wrapper property.
			this.$wrapper = this.$el;

			this.original = (digit instanceof Date) ? digit : (digit ? Math.round(digit) : 0);

			this.time = new FlipClock.Time(this, this.original, {
				minimumDigits: options.minimumDigits ? options.minimumDigits : 0,
				animationRate: options.animationRate ? options.animationRate : 1000 
			});

			this.timer = new FlipClock.Timer(this, options);

			this.lang = this.loadLanguage(this.language);
			
			this.face = this.loadClockFace(this.clockFace, options);

			if(this.autoStart) {
				this.start();
			}
		},
		
		/**
		 * Load the FlipClock.Face object
		 *
		 * @param	object  The name of the FlickClock.Face class
		 * @param	object 	An object override options
		 */
		 
		loadClockFace: function(name, options) {	
			var face, suffix = 'Face';
			
			name = name.ucfirst()+suffix;
			
			if(FlipClock[name]) {
				face = new FlipClock[name](this, options);
			}
			else {
				face = new FlipClock[this.defaultClockFace+suffix](this, options);
			}
			
			face.build();
				
			return face;
		},
			
		
		/**
		 * Load the FlipClock.Lang object
		 *
		 * @param	object  The name of the language to load
		 */
		 
		loadLanguage: function(name) {	
			var lang;
			
			if(FlipClock.Lang[name.ucfirst()]) {
				lang = FlipClock.Lang[name.ucfirst()];
			}
			else if(FlipClock.Lang[name]) {
				lang = FlipClock.Lang[name];
			}
			else {
				lang = FlipClock.Lang[this.defaultLanguage];
			}
			
			return lang;
		},
					
		/**
		 * Localize strings into various languages
		 *
		 * @param	string  The index of the localized string
		 * @param	object  Optionally pass a lang object
		 */

		localize: function(index, obj) {
			var lang = this.lang;

			if(!index) {
				return null;
			}

			var lindex = index.toLowerCase();

			if(typeof obj == "object") {
				lang = obj;
			}

			if(lang && lang[lindex]) {
				return lang[lindex];
			}

			return index;
		},
		 

		/**
		 * Starts the clock
		 */
		 
		start: function(callback) {
			var t = this;

			if(!t.running && (!t.countdown || t.countdown && t.time.time > 0)) {
				
				t.face.start(t.time);
				t.timer.start(function() {
					t.flip();
					
					if(typeof callback === "function") {
						callback();
					}	
				});
			}
			else {
				t.log('Trying to start timer when countdown already at 0');
			}
		},
		
		/**
		 * Stops the clock
		 */
		 
		stop: function(callback) {
			this.face.stop();
			this.timer.stop(callback);
			
			for(var x in this.lists) {
				if (this.lists.hasOwnProperty(x)) {
					this.lists[x].stop();
				}
			}	
		},
		
		/**
		 * Reset the clock
		 */
		 
		reset: function(callback) {
			this.timer.reset(callback);
			this.face.reset();
		},
		
		/**
		 * Sets the clock time
		 */
		 
		setTime: function(time) {
			this.time.time = time;
			this.flip(true);		
		},
		
		/**
		 * Get the clock time
		 *
		 * @return  object  Returns a FlipClock.Time object
		 */
		 
		getTime: function(time) {
			return this.time;		
		},
		
		/**
		 * Changes the increment of time to up or down (add/sub)
		 */
		 
		setCountdown: function(value) {
			var running = this.running;
			
			this.countdown = value ? true : false;
				
			if(running) {
				this.stop();
				this.start();
			}
		},
		
		/**
		 * Flip the digits on the clock
		 *
		 * @param  array  An array of digits	 
		 */
		flip: function(doNotAddPlayClass) {
			this.face.flip(false, doNotAddPlayClass);
		}
		
	});
		
}(jQuery));

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
	
	/**
	 * The FlipClock List class is used to build the list used to create 
	 * the card flip effect. This object fascilates selecting the correct
	 * node by passing a specific digit.
	 *
	 * @param 	object  A FlipClock.Factory object
	 * @param 	mixed   This is the digit used to set the clock. If an 
	 *				    object is passed, 0 will be used.	
	 * @param 	object  An object of properties to override the default	
	 */
	 	
	FlipClock.List = FlipClock.Base.extend({
		
		/**
		 * The digit (0-9)
		 */		
		 
		digit: 0,
		
		/**
		 * The CSS classes
		 */		
		 
		classes: {
			active: 'flip-clock-active',
			before: 'flip-clock-before',
			flip: 'flip'	
		},
				
		/**
		 * The parent FlipClock.Factory object
		 */		
		 
		factory: false,
		
		/**
		 * The jQuery object
		 */		
		 
		$el: false,

		/**
		 * The jQuery object (deprecated)
		 */		
		 
		$obj: false,
		
		/**
		 * The items in the list
		 */		
		 
		items: [],
		
		/**
		 * The last digit
		 */		
		 
		lastDigit: 0,
				 
		/**
		 * Constructor
		 *
		 * @param  object  A FlipClock.Factory object
		 * @param  int     An integer use to select the correct digit
		 * @param  object  An object to override the default properties	 
		 */
		 
		minimumDigits: 0,

		constructor: function(factory, digit, options) {
			this.factory = factory;
			this.digit = digit;
			this.lastDigit = digit;
			this.$el = this.createList();
			
			// Depcrated support of the $obj property.
			this.$wrapper = this.$el;

			if(digit > 0) {
				this.select(digit);
			}

			this.factory.$el.append(this.$el);
		},
		
		/**
		 * Select the digit in the list
		 *
		 * @param  int  A digit 0-9	 
		 */
		 
		select: function(digit) {
			if(typeof digit === "undefined") {
				digit = this.digit;
			}
			else {
				this.digit = digit;
			}

			if(this.digit != this.lastDigit) {
				var $delete = this.$el.find('.'+this.classes.before).removeClass(this.classes.before);

				this.$el.find('.'+this.classes.active).removeClass(this.classes.active)
													  .addClass(this.classes.before);

				this.appendListItem(this.classes.active, this.digit);

				$delete.remove();

				this.lastDigit = this.digit;
			}

			/*
			var prevDigit = this.digit == 0 ? 9 : this.digit - 1;
			var nextDigit = this.digit == 9 ? 0 : this.digit + 1;

			this.setBeforeValue(prevDigit);
			this.setActiveValue(this.digit);

			var target = this.$el.find('[data-digit="'+digit+'"]');
			var active = this.$el.find('.'+this.classes.active).removeClass(this.classes.active);
			var before = this.$el.find('.'+this.classes.before).removeClass(this.classes.before);

			if(!this.factory.countdown) {
				if(target.is(':first-child')) {
					this.$el.find(':last-child').addClass(this.classes.before);
				}
				else {
					target.prev().addClass(this.classes.before);
				}
			}
			else {
				if(target.is(':last-child')) {
					this.$el.find(':first-child').addClass(this.classes.before);
				}
				else {
					target.next().addClass(this.classes.before);
				}
			}
			
			target.addClass(this.classes.active);	
			*/		
		},
		
		/**
		 * Adds the play class to the DOM object
		 */
		 		
		play: function() {
			this.$el.addClass(this.factory.classes.play);
		},
		
		/**
		 * Removes the play class to the DOM object 
		 */
		 
		stop: function() {
			var t = this;

			setTimeout(function() {
				t.$el.removeClass(t.factory.classes.play);
			}, this.factory.timer.interval);
		},
		
		createListItem: function(css, value) {
			return [
				'<li class="'+(css ? css : '')+'">',
					'<a href="#">',
						'<div class="up">',
							'<div class="shadow"></div>',
							'<div class="inn">'+(value ? value : '')+'</div>',
						'</div>',
						'<div class="down">',
							'<div class="shadow"></div>',
							'<div class="inn">'+(value ? value : '')+'</div>',
						'</div>',
					'</a>',
				'</li>'
			].join('');
		},

		appendListItem: function(css, value) {
			var html = this.createListItem(css, value);

			this.$el.append(html);
		},

		/**
		 * Create the list of digits and appends it to the DOM object 
		 */
		 
		createList: function() {

			var lastDigit = this.getPrevDigit() ? this.getPrevDigit() : this.digit;

			var html = $([
				'<ul class="'+this.classes.flip+' '+(this.factory.running ? this.factory.classes.play : '')+'">',
					this.createListItem(this.classes.before, lastDigit),
					this.createListItem(this.classes.active, this.digit),
				'</ul>'
			].join(''));
			
			/*
			DELETE PENDING - Replace with the more simple logic above.
			This should reduce the load on the some GPU's by having
			signifantly fewing DOM nodes in memory.

			for(var x = 0; x < 2; x++) {
				var item = $([
				'<li data-digit="'+x+'">',
					'<a href="#">',
						'<div class="up">',
							'<div class="shadow"></div>',
							'<div class="inn">'+x+'</div>',
						'</div>',
						'<div class="down">',
							'<div class="shadow"></div>',
							'<div class="inn">'+x+'</div>',
						'</div>',
					'</a>',
				'</li>'].join(''));
				
				this.items.push(item);
				
				html.append(item);
			}
			*/
						
			return html;
		},

		getNextDigit: function() {
			return this.digit == 9 ? 0 : this.digit + 1;
		},

		getPrevDigit: function() {
			return this.digit == 0 ? 9 : this.digit - 1;
		},

		/*
		setActiveDigit: function(digit) {
			var $obj = this.$el.find('.'+this.classes.active);

			$obj.find('.inn').html(digit);
			$obj.removeClass(this.classes.active).addClass(this.classes.active);
		},

		setActiveDigit: function(digit) {
			this.$el.find('.'+this.classes.before).find('.inn').html(digit);
		}
		*/

	});
	
	
}(jQuery));

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
	
	/**
	 * Capitalize the first letter in a string
	 *
	 * @return string
	 */
	 
	String.prototype.ucfirst = function() {
		return this.substr(0, 1).toUpperCase() + this.substr(1);
	};
	
	/**
	 * jQuery helper method
	 *
	 * @param  int     An integer used to start the clock (no. seconds)
	 * @param  object  An object of properties to override the default	
	 */
	 
	$.fn.FlipClock = function(digit, options) {
		if(typeof digit == "object") {
			options = digit;
			digit = 0;
		}		
		return new FlipClock($(this), digit, options);
	};
	
	/**
	 * jQuery helper method
	 *
	 * @param  int     An integer used to start the clock (no. seconds)
	 * @param  object  An object of properties to override the default	
	 */
	 
	$.fn.flipClock = function(digit, options) {
		return $.fn.FlipClock(digit, options);
	};
	
}(jQuery));

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
			
	/**
	 * The FlipClock Time class is used to manage all the time 
	 * calculations.
	 *
	 * @param 	object  A FlipClock.Factory object
	 * @param 	mixed   This is the digit used to set the clock. If an 
	 *				    object is passed, 0 will be used.	
	 * @param 	object  An object of properties to override the default	
	 */
	 	
	FlipClock.Time = FlipClock.Base.extend({
		
		/**
		 * The time (in seconds)
		 */		
		 
		time: 0,
		
		/**
		 * The parent FlipClock.Factory object
		 */		
		 
		factory: false,
		
		/**
		 * The minimum number of digits the clock face will have
		 */		
		 
		minimumDigits: 0,

		/**
		 * Constructor
		 *
		 * @param  object  A FlipClock.Factory object
		 * @param  int     An integer use to select the correct digit
		 * @param  object  An object to override the default properties	 
		 */
		 
		constructor: function(factory, time, options) {
			this.base(options);
			this.factory = factory;

			if(time) {
				this.time = time;
			}
		},
		
		/**
		 * Convert a string or integer to an array of digits
		 *
		 * @param   mixed  String or Integer of digits	 
		 * @return  array  An array of digits 
		 */
		 
		convertDigitsToArray: function(str) {
			var data = [];
			
			str = str.toString();
			
			for(var x = 0;x < str.length; x++) {
				if(str[x].match(/^\d*$/g)) {
					data.push(str[x]);	
				}
			}
			
			return data;
		},
		
		/**
		 * Get a specific digit from the time integer
		 *
		 * @param   int    The specific digit to select from the time	 
		 * @return  mixed  Returns FALSE if no digit is found, otherwise
		 *				   the method returns the defined digit	 
		 */
		 
		digit: function(i) {
			var timeStr = this.toString();
			var length  = timeStr.length;
			
			if(timeStr[length - i])	 {
				return timeStr[length - i];
			}
			
			return false;
		},

		/**
		 * Formats any array of digits into a valid array of digits
		 *
		 * @param   mixed  An array of digits	 
		 * @return  array  An array of digits 
		 */
		 
		digitize: function(obj) {
			var data = [];
			
			$.each(obj, function(i, value) {
				value = value.toString();
				
				if(value.length == 1) {
					value = '0'+value;
				}
				
				for(var x = 0; x < value.length; x++) {
					data.push(value.charAt(x));
				}				
			});

			if(data.length > this.minimumDigits) {
				this.minimumDigits = data.length;
			}
			
			if(this.minimumDigits > data.length) {
				for(var x = data.length; x < this.minimumDigits; x++) {
					data.unshift('0');
				}
			}
			
			return data;
		},
		
		/**
		 * Gets a daily breakdown
		 *
		 * @return  object  Returns a digitized object
		 */

		getDayCounter: function(includeSeconds) {
			var digits = [
				this.getDays(),
				this.getHours(true),
				this.getMinutes(true)
			];

			if(includeSeconds) {
				digits.push(this.getSeconds(true));
			}

			return this.digitize(digits);
		},

		/**
		 * Gets number of days
		 *
		 * @param   bool  Should perform a modulus? If not sent, then no.
		 * @return  int   Retuns a floored integer
		 */
		 
		getDays: function(mod) {
			var days = this.getTimeSeconds() / 60 / 60 / 24;
			
			if(mod) {
				days = days % 7;
			}
			
			return Math.floor(days);
		},
		
		/**
		 * Gets an hourly breakdown
		 *
		 * @return  object  Returns a digitized object
		 */
		 
		getHourCounter: function() {
			var obj = this.digitize([
				this.getHours(),
				this.getMinutes(true),
				this.getSeconds(true)
			]);
			
			return obj;
		},
		
		/**
		 * Gets an hourly breakdown
		 *
		 * @return  object  Returns a digitized object
		 */
		 
		getHourly: function() {
			return this.getHourCounter();
		},
		
		/**
		 * Gets number of hours
		 *
		 * @param   bool  Should perform a modulus? If not sent, then no.
		 * @return  int   Retuns a floored integer
		 */
		 
		getHours: function(mod) {
			var hours = this.getTimeSeconds() / 60 / 60;
			
			if(mod) {
				hours = hours % 24;	
			}
			
			return Math.floor(hours);
		},
		
		/**
		 * Gets the twenty-four hour time
		 *
		 * @return  object  returns a digitized object
		 */
		 
		getMilitaryTime: function() {
			var date = new Date(); 
			var obj  = this.digitize([
				date.getHours(),
				date.getMinutes(),
				date.getSeconds()				
			]);

			return obj;
		},
				
		/**
		 * Gets number of minutes
		 *
		 * @param   bool  Should perform a modulus? If not sent, then no.
		 * @return  int   Retuns a floored integer
		 */
		 
		getMinutes: function(mod) {
			var minutes = this.getTimeSeconds() / 60;
			
			if(mod) {
				minutes = minutes % 60;
			}
			
			return Math.floor(minutes);
		},
		
		/**
		 * Gets a minute breakdown
		 */
		 
		getMinuteCounter: function() {
			var obj = this.digitize([
				this.getMinutes(),
				this.getSeconds(true)
			]);

			return obj;
		},
		
		/**
		 * Gets time count in seconds regardless of if targetting date or not.
		 *
		 * @return  int   Returns a floored integer
		 */
		 
		getTimeSeconds: function(mod) {
			if (this.time instanceof Date) {
				if (this.factory.countdown) {
					if ((new Date()).getTime() > this.time.getTime()) {
						this.factory.stop();
					}
					return Math.max(this.time.getTime()/1000 - (new Date()).getTime()/1000,0);
				} else {
					return (new Date()).getTime()/1000 - this.time.getTime()/1000 ;
				}
			} else {
				return this.time;
			}
		},
		
		/**
		 * Gets number of seconds
		 *
		 * @param   bool  Should perform a modulus? If not sent, then no.
		 * @return  int   Retuns a ceiled integer
		 */
		 
		getSeconds: function(mod) {
			var seconds = this.getTimeSeconds();
			
			if(mod) {
				if(seconds == 60) {
					seconds = 0;
				}
				else {
					seconds = seconds % 60;
				}
			}
			
			return Math.ceil(seconds);
		},
		
		/**
		 * Gets the current twelve hour time
		 *
		 * @return  object  Returns a digitized object
		 */
		 
		getTime: function() {
			var date  = new Date(); 
			var hours = date.getHours();
			var merid = hours > 12 ? 'PM' : 'AM';
			var obj   = this.digitize([
				hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours),
				date.getMinutes(),
				date.getSeconds()				
			]);

			return obj;
		},
		
		/**
		 * Gets number of weeks
		 *
		 * @param   bool  Should perform a modulus? If not sent, then no.
		 * @return  int   Retuns a floored integer
		 */
		 
		getWeeks: function() {
			var weeks = this.getTimeSeconds() / 60 / 60 / 24 / 7;
			
			if(mod) {
				weeks = weeks % 52;
			}
			
			return Math.floor(weeks);
		},
		
		/**
		 * Removes a specific number of leading zeros from the array.
		 * This method prevents you from removing too many digits, even
		 * if you try.
		 *
		 * @param   int    Total number of digits to remove 
		 * @return  array  An array of digits 
		 */
		 
		removeLeadingZeros: function(totalDigits, digits) {
			var total    = 0;
			var newArray = [];
			
			$.each(digits, function(i, digit) {
				if(i < totalDigits) {
					total += parseInt(digits[i], 10);
				}
				else {
					newArray.push(digits[i]);
				}
			});
			
			if(total === 0) {
				return newArray;
			}
			
			return digits;
		},

		/**
		 * Adds X second to the current time
		 */

		addSeconds: function(x) {
			this.time += x;
		},

		/**
		 * Adds 1 second to the current time
		 */

		addSecond: function() {
			this.addSeconds(1);
		},

		/**
		 * Substracts X seconds from the current time
		 */

		subSeconds: function(x) {
			this.time -= x;
		},

		/**
		 * Substracts 1 second from the current time
		 */

		subSecond: function() {
			this.subSeconds(1);
		},
		
		/**
		 * Converts the object to a human readable string
		 */
		 
		toString: function() {
			return this.getTimeSeconds().toString();
		}
		
		/*
		getYears: function() {
			return Math.floor(this.time / 60 / 60 / 24 / 7 / 52);
		},
		
		getDecades: function() {
			return Math.floor(this.getWeeks() / 10);
		}*/
	});
	
}(jQuery));

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
	
	/**
	 * The FlipClock.Timer object managers the JS timers
	 *
	 * @param	object  The parent FlipClock.Factory object
	 * @param	object  Override the default options
	 */
	
	FlipClock.Timer = FlipClock.Base.extend({
		
		/**
		 * Callbacks
		 */		
		 
		callbacks: {
			destroy: false,
			create: false,
			init: false,
			interval: false,
			start: false,
			stop: false,
			reset: false
		},
		
		/**
		 * FlipClock timer count (how many intervals have passed)
		 */		
		 
		count: 0,
		
		/**
		 * The parent FlipClock.Factory object
		 */		
		 
		factory: false,
		
		/**
		 * Timer interval (1 second by default)
		 */		
		 
		interval: 1000,

		/**
		 * The rate of the animation in milliseconds
		 */		
		 
		animationRate: 1000,
				
		/**
		 * Constructor
		 *
		 * @return	void
		 */		
		 
		constructor: function(factory, options) {
			this.base(options);
			this.factory = factory;
			this.callback(this.callbacks.init);	
			this.callback(this.callbacks.create);
		},
		
		/**
		 * This method gets the elapsed the time as an interger
		 *
		 * @return	void
		 */		
		 
		getElapsed: function() {
			return this.count * this.interval;
		},
		
		/**
		 * This method gets the elapsed the time as a Date object
		 *
		 * @return	void
		 */		
		 
		getElapsedTime: function() {
			return new Date(this.time + this.getElapsed());
		},
		
		/**
		 * This method is resets the timer
		 *
		 * @param 	callback  This method resets the timer back to 0
		 * @return	void
		 */		
		 
		reset: function(callback) {
			clearInterval(this.timer);
			this.count = 0;
			this._setInterval(callback);			
			this.callback(this.callbacks.reset);
		},
		
		/**
		 * This method is starts the timer
		 *
		 * @param 	callback  A function that is called once the timer is destroyed
		 * @return	void
		 */		
		 
		start: function(callback) {		
			this.factory.running = true;
			this._createTimer(callback);
			this.callback(this.callbacks.start);
		},
		
		/**
		 * This method is stops the timer
		 *
		 * @param 	callback  A function that is called once the timer is destroyed
		 * @return	void
		 */		
		 
		stop: function(callback) {
			this.factory.running = false;
			this._clearInterval(callback);
			this.callback(this.callbacks.stop);
			this.callback(callback);
		},
		
		/**
		 * Clear the timer interval
		 *
		 * @return	void
		 */		
		 
		_clearInterval: function() {
			clearInterval(this.timer);
		},
		
		/**
		 * Create the timer object
		 *
		 * @param 	callback  A function that is called once the timer is created
		 * @return	void
		 */		
		 
		_createTimer: function(callback) {
			this._setInterval(callback);		
		},
		
		/**
		 * Destroy the timer object
		 *
		 * @param 	callback  A function that is called once the timer is destroyed
		 * @return	void
		 */		
		 	
		_destroyTimer: function(callback) {
			this._clearInterval();			
			this.timer = false;
			this.callback(callback);
			this.callback(this.callbacks.destroy);
		},
		
		/**
		 * This method is called each time the timer interval is ran
		 *
		 * @param 	callback  A function that is called once the timer is destroyed
		 * @return	void
		 */		
		 
		_interval: function(callback) {
			this.callback(this.callbacks.interval);
			this.callback(callback);
			this.count++;
		},
		
		/**
		 * This sets the timer interval
		 *
		 * @param 	callback  A function that is called once the timer is destroyed
		 * @return	void
		 */		
		 
		_setInterval: function(callback) {
			var t = this;
	
			t._interval(callback);

			t.timer = setInterval(function() {		
				t._interval(callback);
			}, this.interval);
		}
			
	});
	
}(jQuery));

(function($) {
	
	/**
	 * Twenty-Four Hour Clock Face
	 *
	 * This class will generate a twenty-four our clock for FlipClock.js
	 *
	 * @param  object  The parent FlipClock.Factory object
	 * @param  object  An object of properties to override the default	
	 */
	 
	FlipClock.TwentyFourHourClockFace = FlipClock.Face.extend({

		/**
		 * Constructor
		 *
		 * @param  object  The parent FlipClock.Factory object
		 * @param  object  An object of properties to override the default	
		 */
		 
		constructor: function(factory, options) {
			factory.countdown = false;
			this.base(factory, options);
		},

		/**
		 * Build the clock face
		 *
		 * @param  object  Pass the time that should be used to display on the clock.	
		 */
		 
		build: function(time) {
			var t        = this;
			var children = this.factory.$el.find('ul');

			time = time ? time : (this.factory.time.time || this.factory.time.getMilitaryTime());
			
			if(time.length > children.length) {
				$.each(time, function(i, digit) {
					t.factory.lists.push(t.createList(digit));
				});
			}
			
			this.dividers.push(this.createDivider());
			this.dividers.push(this.createDivider());
			
			$(this.dividers[0]).insertBefore(this.factory.lists[this.factory.lists.length - 2].$el);
			$(this.dividers[1]).insertBefore(this.factory.lists[this.factory.lists.length - 4].$el);
			
			// this._clearExcessDigits();
			
			if(this.autoStart) {
				this.start();
			}
		},
		
		/**
		 * Flip the clock face
		 */
		 
		flip: function(time, doNotAddPlayClass) {
			time = time ? time : this.factory.time.getMilitaryTime();
			
			this.base(time, doNotAddPlayClass);	
		}
		
		/**
		 * Clear the excess digits from the tens columns for sec/min
		 */
		 
		/*
		_clearExcessDigits: function() {
			var tenSeconds = this.factory.lists[this.factory.lists.length - 2];
			var tenMinutes = this.factory.lists[this.factory.lists.length - 4];
			
			for(var x = 6; x < 10; x++) {
				tenSeconds.$el.find('li:last-child').remove();
				tenMinutes.$el.find('li:last-child').remove();
			}
		}
		*/
				
	});
	
}(jQuery));
(function($) {
		
	/**
	 * Counter Clock Face
	 *
	 * This class will generate a generice flip counter. The timer has been
	 * disabled. clock.increment() and clock.decrement() have been added.
	 *
	 * @param  object  The parent FlipClock.Factory object
	 * @param  object  An object of properties to override the default	
	 */
	 
	FlipClock.CounterFace = FlipClock.Face.extend({
		
		// autoStart: false,

		minimumDigits: 2,

		/**
		 * Constructor
		 *
		 * @param  object  The parent FlipClock.Factory object
		 * @param  object  An object of properties to override the default	
		 */
		 
		constructor: function(factory, options) {
			//factory.timer.interval = 0;
			factory.autoStart 	   = options.autoStart ? true : false;
			//factory.running  	   = true;

			factory.increment = function() {
				factory.countdown = false;
				factory.setTime(factory.getTime().getTimeSeconds() + 1);
			};

			factory.decrement = function() {
				factory.countdown = true;
				var time = factory.getTime().getTimeSeconds();
				if(time > 0) {
					factory.setTime(time - 1);
				}
			};

			factory.setValue = function(digits) {
				factory.setTime(digits);
			};

			factory.setCounter = function(digits) {
				factory.setTime(digits);
			};

			this.base(factory, options);
		},

		/**
		 * Build the clock face	
		 */
		 
		build: function() {
			var t        = this;
			var children = this.factory.$el.find('ul');
			var lists    = [];
			var time 	 = this.factory.getTime().digitize([this.factory.getTime().time]);

			if(time.length > children.length) {
				$.each(time, function(i, digit) {
					var list = t.createList(digit, {
						minimumDigits: t.minimumDigits
					});

					list.select(digit);
					lists.push(list);
				});
			
			}

			$.each(lists, function(i, list) {
				list.play();
			});

			this.factory.lists = lists;
		},
		
		/**
		 * Flip the clock face
		 */
		 
		flip: function(time, doNotAddPlayClass) {
			if(!time) {		
				time = this.factory.getTime().digitize([this.factory.getTime().time]);
			}

			if(this.autoStart) {
				this.autoIncrement();
			}
			
			this.base(time, doNotAddPlayClass);
		},

		/**
		 * Reset the clock face
		 */

		reset: function() {
			this.factory.time = new FlipClock.Time(
				this.factor, 
				this.factory.original ? Math.round(this.factory.original) : 0
			);

			this.flip();
		}
	});
	
}(jQuery));
(function($) {

	/**
	 * Daily Counter Clock Face
	 *
	 * This class will generate a daily counter for FlipClock.js. A
	 * daily counter will track days, hours, minutes, and seconds. If
	 * the number of available digits is exceeded in the count, a new
	 * digit will be created.
	 *
	 * @param  object  The parent FlipClock.Factory object
	 * @param  object  An object of properties to override the default
	 */

	FlipClock.DailyCounterFace = FlipClock.Face.extend({

		showSeconds: true,

		/**
		 * Constructor
		 *
		 * @param  object  The parent FlipClock.Factory object
		 * @param  object  An object of properties to override the default
		 */

		constructor: function(factory, options) {
			this.base(factory, options);
		},

		/**
		 * Build the clock face
		 */

		build: function(excludeHours, time) {
			var t        = this;
			var children = this.factory.$el.find('ul');
			var lists    = [];
			var offset   = 0;

			time     = time ? time : this.factory.time.getDayCounter(this.showSeconds);

			if(time.length > children.length) {
				$.each(time, function(i, digit) {
					lists.push(t.createList(digit));
				});
			}

			this.factory.lists = lists;

			if(this.showSeconds) {
				$(this.createDivider('Seconds')).insertBefore(this.factory.lists[this.factory.lists.length - 2].$el);
			}
			else
			{
				offset = 2;
			}

			$(this.createDivider('Minutes')).insertBefore(this.factory.lists[this.factory.lists.length - 4 + offset].$el);
			$(this.createDivider('Hours')).insertBefore(this.factory.lists[this.factory.lists.length - 6 + offset].$el);
			$(this.createDivider('Days', true)).insertBefore(this.factory.lists[0].$el);

			// this._clearExcessDigits();

			if(this.autoStart) {
				this.start();
			}
		},

		/**
		 * Flip the clock face
		 */

		flip: function(time, doNotAddPlayClass) {
			if(!time) {
				time = this.factory.time.getDayCounter(this.showSeconds);
			}

			this.autoIncrement();

			this.base(time, doNotAddPlayClass);
		}

		/**
		 * Clear the excess digits from the tens columns for sec/min
		 */

		 /*
		_clearExcessDigits: function() {
			var tenSeconds = this.factory.lists[this.factory.lists.length - 2];
			var tenMinutes = this.factory.lists[this.factory.lists.length - 4];

			for(var x = 6; x < 10; x++) {
				tenSeconds.$el.find('li:last-child').remove();
				tenMinutes.$el.find('li:last-child').remove();
			}
		}
		*/

	});

}(jQuery));
(function($) {
			
	/**
	 * Hourly Counter Clock Face
	 *
	 * This class will generate an hourly counter for FlipClock.js. An
	 * hour counter will track hours, minutes, and seconds. If number of
	 * available digits is exceeded in the count, a new digit will be 
	 * created.
	 *
	 * @param  object  The parent FlipClock.Factory object
	 * @param  object  An object of properties to override the default	
	 */
	 
	FlipClock.HourlyCounterFace = FlipClock.Face.extend({
			
		// clearExcessDigits: true,

		/**
		 * Constructor
		 *
		 * @param  object  The parent FlipClock.Factory object
		 * @param  object  An object of properties to override the default	
		 */
		 
		constructor: function(factory, options) {
			this.base(factory, options);
		},
		
		/**
		 * Build the clock face
		 */
		
		build: function(excludeHours, time) {
			var t        = this;
			var children = this.factory.$el.find('ul');
			var lists = [];
			
			time     = time ? time : this.factory.time.getHourCounter();
			
			if(time.length > children.length) {
				$.each(time, function(i, digit) {
					lists.push(t.createList(digit));
				});
			}
			
			this.factory.lists = lists;	
			
			$(this.createDivider('Seconds')).insertBefore(this.factory.lists[this.factory.lists.length - 2].$el);
			$(this.createDivider('Minutes')).insertBefore(this.factory.lists[this.factory.lists.length - 4].$el);
			
			if(!excludeHours) {
				$(this.createDivider('Hours', true)).insertBefore(this.factory.lists[0].$el);
			}
			
			/*
			if(this.clearExcessDigits) {
				this._clearExcessDigits();
			}
			*/
			
			if(this.autoStart) {
				this.start();
			}
		},
		
		/**
		 * Flip the clock face
		 */
		 
		flip: function(time, doNotAddPlayClass) {
			if(!time) {
				time = this.factory.time.getHourCounter();
			}	

			this.autoIncrement();
		
			this.base(time, doNotAddPlayClass);
		}
		
		/**
		 * Clear the excess digits from the tens columns for sec/min
		 */
		 
		/*
		_clearExcessDigits: function() {
			var tenSeconds = this.factory.lists[this.factory.lists.length - 2];
			var tenMinutes = this.factory.lists[this.factory.lists.length - 4];
			
			for(var x = 6; x < 10; x++) {
				tenSeconds.$el.find('li:last-child').remove();
				tenMinutes.$el.find('li:last-child').remove();
			}
		}
		*/
		
	});
	
}(jQuery));
(function($) {
		
	/**
	 * Minute Counter Clock Face
	 *
	 * This class will generate a minute counter for FlipClock.js. A
	 * minute counter will track minutes and seconds. If an hour is 
	 * reached, the counter will reset back to 0. (4 digits max)
	 *
	 * @param  object  The parent FlipClock.Factory object
	 * @param  object  An object of properties to override the default	
	 */
	 
	FlipClock.MinuteCounterFace = FlipClock.HourlyCounterFace.extend({
		
		clearExcessDigits: false,

		/**
		 * Constructor
		 *
		 * @param  object  The parent FlipClock.Factory object
		 * @param  object  An object of properties to override the default	
		 */
		 
		constructor: function(factory, options) {
			this.base(factory, options);
		},
		
		/**
		 * Build the clock face	
		 */
		 
		build: function() {
			this.base(true, this.factory.time.getMinuteCounter());
		},
		
		/**
		 * Flip the clock face
		 */
		 
		flip: function(time, doNotAddPlayClass) {
			if(!time) {
				time = this.factory.time.getMinuteCounter();
			}

			this.base(time, doNotAddPlayClass);
		}

	});
	
}(jQuery));
(function($) {
		
	/**
	 * Twelve Hour Clock Face
	 *
	 * This class will generate a twelve hour clock for FlipClock.js
	 *
	 * @param  object  The parent FlipClock.Factory object
	 * @param  object  An object of properties to override the default	
	 */
	 
	FlipClock.TwelveHourClockFace = FlipClock.TwentyFourHourClockFace.extend({
		
		/**
		 * The meridium jQuery DOM object
		 */
		 
		meridium: false,
		
		/**
		 * The meridium text as string for easy access
		 */
		 
		meridiumText: 'AM',
					
		/**
		 * Build the clock face
		 *
		 * @param  object  Pass the time that should be used to display on the clock.	
		 */
		 
		build: function(time) {
			var t        = this;
			
			time = time ? time : (this.factory.time.time ? this.factory.time.time : this.factory.time.getTime());
			
			this.base(time);			
			this.meridiumText = this._isPM() ? 'PM' : 'AM';			
			this.meridium = $([
				'<ul class="flip-clock-meridium">',
					'<li>',
						'<a href="#">'+this.meridiumText+'</a>',
					'</li>',
				'</ul>'
			].join(''));
			
			this.meridium.insertAfter(this.factory.lists[this.factory.lists.length-1].$el);
		},
		
		/**
		 * Flip the clock face
		 */
		 
		flip: function(time, doNotAddPlayClass) {			
			if(this.meridiumText != this._getMeridium()) {
				this.meridiumText = this._getMeridium();
				this.meridium.find('a').html(this.meridiumText);	
			}
			this.base(this.factory.time.getTime(), doNotAddPlayClass);	
		},
		
		/**
		 * Get the current meridium
		 *
		 * @return  string  Returns the meridium (AM|PM)
		 */
		 
		_getMeridium: function() {
			return new Date().getHours() >= 12 ? 'PM' : 'AM';
		},
		
		/**
		 * Is it currently in the post-medirium?
		 *
		 * @return  bool  Returns true or false
		 */
		 
		_isPM: function() {
			return this._getMeridium() == 'PM' ? true : false;
		}
		
		/**
		 * Clear the excess digits from the tens columns for sec/min
		 */
		 
		/*
		_clearExcessDigits: function() {
			var tenSeconds = this.factory.lists[this.factory.lists.length - 2];
			var tenMinutes = this.factory.lists[this.factory.lists.length - 4];
			
			for(var x = 6; x < 10; x++) {
				tenSeconds.$el.find('li:last-child').remove();
				tenMinutes.$el.find('li:last-child').remove();
			}
		}
		*/
				
	});
	
}(jQuery));
(function($) {

    /**
     * FlipClock Arabic Language Pack
     *
     * This class will be used to translate tokens into the Arabic language.
     *
     */

    FlipClock.Lang.Arabic = {

      'years'   : 'سنوات',
      'months'  : 'شهور',
      'days'    : 'أيام',
      'hours'   : 'ساعات',
      'minutes' : 'دقائق',
      'seconds' : 'ثواني'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['ar']      = FlipClock.Lang.Arabic;
    FlipClock.Lang['ar-ar']   = FlipClock.Lang.Arabic;
    FlipClock.Lang['arabic']  = FlipClock.Lang.Arabic;

}(jQuery));
(function($) {
		
	/**
	 * FlipClock Danish Language Pack
	 *
	 * This class will used to translate tokens into the Danish language.
	 *	
	 */
	 
	FlipClock.Lang.Danish = {
		
		'years'   : 'År',
		'months'  : 'Måneder',
		'days'    : 'Dage',
		'hours'   : 'Timer',
		'minutes' : 'Minutter',
		'seconds' : 'Sekunder'	

	};
	
	/* Create various aliases for convenience */

	FlipClock.Lang['da']      = FlipClock.Lang.Danish;
	FlipClock.Lang['da-dk']   = FlipClock.Lang.Danish;
	FlipClock.Lang['danish'] = FlipClock.Lang.Danish;

}(jQuery));
(function($) {
		
	/**
	 * FlipClock German Language Pack
	 *
	 * This class will used to translate tokens into the German language.
	 *	
	 */
	 
	FlipClock.Lang.German = {
		
		'years'   : 'Jahre',
		'months'  : 'Monate',
		'days'    : 'Tage',
		'hours'   : 'Stunden',
		'minutes' : 'Minuten',
		'seconds' : 'Sekunden'	
 
	};
	
	/* Create various aliases for convenience */
 
	FlipClock.Lang['de']     = FlipClock.Lang.German;
	FlipClock.Lang['de-de']  = FlipClock.Lang.German;
	FlipClock.Lang['german'] = FlipClock.Lang.German;
 
}(jQuery));
(function($) {
		
	/**
	 * FlipClock English Language Pack
	 *
	 * This class will used to translate tokens into the English language.
	 *	
	 */
	 
	FlipClock.Lang.English = {
		
		'years'   : 'Years',
		'months'  : 'Months',
		'days'    : 'Days',
		'hours'   : 'Hours',
		'minutes' : 'Minutes',
		'seconds' : 'Seconds'	

	};
	
	/* Create various aliases for convenience */

	FlipClock.Lang['en']      = FlipClock.Lang.English;
	FlipClock.Lang['en-us']   = FlipClock.Lang.English;
	FlipClock.Lang['english'] = FlipClock.Lang.English;

}(jQuery));
(function($) {
		
	/**
	 * FlipClock English Language Pack
	 *
	 * This class will used to translate tokens into the English language.
	 *	
	 */
	 
	FlipClock.Lang.Chinese = {
		
		'years'   : '年',
		'months'  : '月',
		'days'    : '天',
		'hours'   : '小时',
		'minutes' : '分钟',
		'seconds' : '秒'	

	};
	
	/* Create various aliases for convenience */

	FlipClock.Lang['cn']      = FlipClock.Lang.Chinese;
	FlipClock.Lang['Chinese']   = FlipClock.Lang.Chinese;
	FlipClock.Lang['chinese'] = FlipClock.Lang.Chinese;

}(jQuery));
(function($) {
		
	/**
	 * FlipClock Spanish Language Pack
	 *
	 * This class will used to translate tokens into the Spanish language.
	 *	
	 */
	 
	FlipClock.Lang.Spanish = {
		
		'years'   : 'A&#241;os',
		'months'  : 'Meses',
		'days'    : 'D&#205;as',
		'hours'   : 'Horas',
		'minutes' : 'Minutos',
		'seconds' : 'Segundo'	

	};
	
	/* Create various aliases for convenience */

	FlipClock.Lang['es']      = FlipClock.Lang.Spanish;
	FlipClock.Lang['es-es']   = FlipClock.Lang.Spanish;
	FlipClock.Lang['spanish'] = FlipClock.Lang.Spanish;

}(jQuery));
(function($) {
		
	/**
	 * FlipClock Finnish Language Pack
	 *
	 * This class will used to translate tokens into the Finnish language.
	 *	
	 */
	 
	FlipClock.Lang.Finnish = {
		
		'years'   : 'Vuotta',
		'months'  : 'Kuukautta',
		'days'    : 'Päivää',
		'hours'   : 'Tuntia',
		'minutes' : 'Minuuttia',
		'seconds' : 'Sekuntia'	

	};
	
	/* Create various aliases for convenience */

	FlipClock.Lang['fi']      = FlipClock.Lang.Finnish;
	FlipClock.Lang['fi-fi']   = FlipClock.Lang.Finnish;
	FlipClock.Lang['finnish'] = FlipClock.Lang.Finnish;

}(jQuery));

(function($) {

  /**
   * FlipClock Canadian French Language Pack
   *
   * This class will used to translate tokens into the Canadian French language.
   *
   */

  FlipClock.Lang.French = {

    'years'   : 'Ans',
    'months'  : 'Mois',
    'days'    : 'Jours',
    'hours'   : 'Heures',
    'minutes' : 'Minutes',
    'seconds' : 'Secondes'

  };

  /* Create various aliases for convenience */

  FlipClock.Lang['fr']      = FlipClock.Lang.French;
  FlipClock.Lang['fr-ca']   = FlipClock.Lang.French;
  FlipClock.Lang['french']  = FlipClock.Lang.French;

}(jQuery));

(function($) {
		
	/**
	 * FlipClock Italian Language Pack
	 *
	 * This class will used to translate tokens into the Italian language.
	 *	
	 */
	 
	FlipClock.Lang.Italian = {
		
		'years'   : 'Anni',
		'months'  : 'Mesi',
		'days'    : 'Giorni',
		'hours'   : 'Ore',
		'minutes' : 'Minuti',
		'seconds' : 'Secondi'	

	};
	
	/* Create various aliases for convenience */

	FlipClock.Lang['it']      = FlipClock.Lang.Italian;
	FlipClock.Lang['it-it']   = FlipClock.Lang.Italian;
	FlipClock.Lang['italian'] = FlipClock.Lang.Italian;
	
}(jQuery));

(function($) {

  /**
   * FlipClock Latvian Language Pack
   *
   * This class will used to translate tokens into the Latvian language.
   *
   */

  FlipClock.Lang.Latvian = {

    'years'   : 'Gadi',
    'months'  : 'Mēneši',
    'days'    : 'Dienas',
    'hours'   : 'Stundas',
    'minutes' : 'Minūtes',
    'seconds' : 'Sekundes'

  };

  /* Create various aliases for convenience */

  FlipClock.Lang['lv']      = FlipClock.Lang.Latvian;
  FlipClock.Lang['lv-lv']   = FlipClock.Lang.Latvian;
  FlipClock.Lang['latvian'] = FlipClock.Lang.Latvian;

}(jQuery));
(function($) {

    /**
     * FlipClock Dutch Language Pack
     *
     * This class will used to translate tokens into the Dutch language.
     */

    FlipClock.Lang.Dutch = {

        'years'   : 'Jaren',
        'months'  : 'Maanden',
        'days'    : 'Dagen',
        'hours'   : 'Uren',
        'minutes' : 'Minuten',
        'seconds' : 'Seconden'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['nl']      = FlipClock.Lang.Dutch;
    FlipClock.Lang['nl-be']   = FlipClock.Lang.Dutch;
    FlipClock.Lang['dutch']   = FlipClock.Lang.Dutch;

}(jQuery));

(function($) {

	/**
	 * FlipClock Norwegian-Bokmål Language Pack
	 *
	 * This class will used to translate tokens into the Norwegian language.
	 *	
	 */

	FlipClock.Lang.Norwegian = {

		'years'   : 'År',
		'months'  : 'Måneder',
		'days'    : 'Dager',
		'hours'   : 'Timer',
		'minutes' : 'Minutter',
		'seconds' : 'Sekunder'	

	};

	/* Create various aliases for convenience */

	FlipClock.Lang['no']      = FlipClock.Lang.Norwegian;
	FlipClock.Lang['nb']      = FlipClock.Lang.Norwegian;
	FlipClock.Lang['no-nb']   = FlipClock.Lang.Norwegian;
	FlipClock.Lang['norwegian'] = FlipClock.Lang.Norwegian;

}(jQuery));

(function($) {

	/**
	 * FlipClock Portuguese Language Pack
	 *
	 * This class will used to translate tokens into the Portuguese language.
	 *
	 */

	FlipClock.Lang.Portuguese = {

		'years'   : 'Anos',
		'months'  : 'Meses',
		'days'    : 'Dias',
		'hours'   : 'Horas',
		'minutes' : 'Minutos',
		'seconds' : 'Segundos'

	};

	/* Create various aliases for convenience */

	FlipClock.Lang['pt']         = FlipClock.Lang.Portuguese;
	FlipClock.Lang['pt-br']      = FlipClock.Lang.Portuguese;
	FlipClock.Lang['portuguese'] = FlipClock.Lang.Portuguese;

}(jQuery));
(function($) {

  /**
   * FlipClock Russian Language Pack
   *
   * This class will used to translate tokens into the Russian language.
   *
   */

  FlipClock.Lang.Russian = {

    'years'   : 'лет',
    'months'  : 'месяцев',
    'days'    : 'дней',
    'hours'   : 'часов',
    'minutes' : 'минут',
    'seconds' : 'секунд'

  };

  /* Create various aliases for convenience */

  FlipClock.Lang['ru']      = FlipClock.Lang.Russian;
  FlipClock.Lang['ru-ru']   = FlipClock.Lang.Russian;
  FlipClock.Lang['russian']  = FlipClock.Lang.Russian;

}(jQuery));
(function($) {
		
	/**
	 * FlipClock Swedish Language Pack
	 *
	 * This class will used to translate tokens into the Swedish language.
	 *	
	 */
	 
	FlipClock.Lang.Swedish = {
		
		'years'   : 'År',
		'months'  : 'Månader',
		'days'    : 'Dagar',
		'hours'   : 'Timmar',
		'minutes' : 'Minuter',
		'seconds' : 'Sekunder'	

	};
	
	/* Create various aliases for convenience */

	FlipClock.Lang['sv']      = FlipClock.Lang.Swedish;
	FlipClock.Lang['sv-se']   = FlipClock.Lang.Swedish;
	FlipClock.Lang['swedish'] = FlipClock.Lang.Swedish;

}(jQuery));
;/**
 * Created by Administrator on 2014/8/23.
 */
/**
 * Created by Administrator on 2014/8/20.
 */
define(function(require){
    require('jquery');
    $('a').click(function(){
        window.location = $(this).attr('href');
    });
    require.async(['js/tvKey.source.js']);
});

;/**
 * Created by Administrator on 2014/8/20.
 */
define(function(require){
    require('jquery');
    $('a').click(function(){
        window.location = $(this).attr('href');
    });
    require.async(['js/tvKey.source.js']);
    var intDiff = parseInt(16*24*3600 + 12*3600 + 25*60);//倒计时总秒数量 从服务器获取剩余秒数

    function timer(intDiff){
        window.setInterval(function(){
            var day=0,
                hour=0,
                minute=0,
                second=0;//时间默认值
            if(intDiff > 0){
                day = Math.floor(intDiff / (60 * 60 * 24));
                hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            $('#day_show').html(day+"天");
            $('#hour_show').html('<s id="h"></s>'+hour+'时');
            $('#minute_show').html('<s></s>'+minute+'分');
            $('#second_show').html('<s></s>'+second+'秒');
            intDiff--;
        }, 1000);
    }

    $(function(){
        timer(intDiff);
    });
});
;/**
 * Created by Administrator on 2014/8/20.
 */
define(function(require){
    require('zepto');
    $(document).on({
        'ajaxStop':function(){
            setTimeout(function(){
                $('#load-animate').hide();
            },200);
        },
        'ajaxStart':function(){
            $('#load-animate').show();
        }
    });
    require.async('js/canvasGame.js',function(){
        $('#load-animate').hide();
        setTimeout(function(){
            $('#canvas').canvasGame({
                target:'#canvas',
                img:'/images/5-1206010S421-50.jpg',
                percent:0.5,
                loadTarget:'#ajax-load',
                loadLocation:'/mobileLoad.html'
            });
        },20);

    });
});
;$(document).ready(function(e) {
    //is android?
    var AndroidPlatform = true;
    if (navigator.userAgent.indexOf('Android') <= 0) {
        AndroidPlatform = false;
    }

    androidKeyHandler = function() {
        this.target='focusBtn:visible',
            this.focusClass='on';
        this.focusInputState="import";
        this.parent='html';
        this.defaultBtn = 'defaultBtn';
        this.keyBoardChars = ['@','~', '!', '_', '-', '#', '&', '*', '(', ')']; //键盘特殊字符

        this.debug = false;

        if (AndroidPlatform) {
            //ANDORID
            this.KEYS= {
                "ENTER":23,
                "LEFT":21,
                "UP":19,
                "RIGHT":22,
                "DOWN":20,
                "BACK":4,
                "DEL":67
            };
        }else{
            //WINDOWS
            this.KEYS= {
                "ENTER":13,
                "LEFT":37,
                "UP":38,
                "RIGHT":39,
                "DOWN":40,
                "BACK":27,
                "DEL":46
            };
        }
        this.btns='';
        this.currentBtnElement='';
        this.keyboardIsShow = false;
        this.currentInputTarget = ''; //主要用了弹键盘时 要组合到键盘元素组中去
        this.backEvent=false;
    }
    androidKeyHandler.prototype = {
        init:function($start){
            console.log('akh init....')
            var self=this;
            self.btns = $(self.parent+' .'+self.target).add($('.'+self.focusInputState));
            //计算各按钮元素的坐标
            self.btns.each(function(index, element) {
                var o=$(element),offset=o.offset();
                o.data('w',o.outerWidth()).data('h',o.outerHeight()).data('l',offset.left).data('r',offset.left+o.data('w')).data('t',offset.top).data('b',offset.top+o.data('h'));
            });
            //
            var focusBtn='';
            if($start instanceof jQuery){
                $(self.parent+' .'+self.focusClass).removeClass(self.focusClass);
                focusBtn = $start;
            }else{
                if(typeof $start !='undefined' && $start>=0){//存在指定焦点
                    $(self.parent+' .'+self.focusClass).removeClass(self.focusClass);
                    focusBtn = self.btns.eq($start);
                }else{
                    if($(self.parent).find('.'+self.defaultBtn).length>0){
                        focusBtn = $(self.parent).find('.'+self.defaultBtn).eq(0); //存在默认首个焦点
                    }else if($(self.parent+' .'+self.focusClass+':visible').length>0){ //如果没有默认焦点 但已存在可见的高亮焦点
                        focusBtn = $(self.parent+' .'+self.focusClass+':visible').eq(0);
                    }else{
                        focusBtn= self.btns.eq(0);//否则默认为第１个
                    }
                }
            }
            self.currentBtnElement=focusBtn;
            self.currentBtnElement.addClass(self.focusClass);


            if(self.debug){
                var debugBoxHtml = $('<div id="tvKeyDebugBox"></div>');
                debugBoxHtml.css({
                    'position':'absolute',
                    'left':0,
                    'top':0,
                    'padding':'6px',
                    'background':'rgba(0,0,0,0.2)',
                    'color':'#fff',
                    'zIndex':999999
                });
                if($('#tvKeyDebugBox').length==0){
                    $('body').append(debugBoxHtml);
                }
                self.debugMsg.clear();
                self.debugMsg.push('is debug.........');
            }

        },
        keymove:function($key){
            var self=this;

            if(self.debug){
                self.debugMsg.push('按键: '+$key);
            }

            if(self.debug){
                var debugBoxHtml = $('<div id="tvKeyDebugBox">按键'+$key+'</div>');
                $('body').append('');
            }

            if(self.btns.length<1){
                self.init();
            }
            //回车
            if ($key == self.KEYS.ENTER || $key==66) {
                if (self.isInput(self.currentBtnElement) && !self.currentBtnElement.hasClass(self.focusInputState)) {
                    self.keyboardShow(self.currentBtnElement);
                } else {
                    self.currentBtnElement.trigger('click');
                }
                return false;
            }

            //数字键
            if (AndroidPlatform && $key >= 7 && $key <= 16) {
                if (self.currentInputTarget != '') {
                    self.currentInputTarget.val(self.currentInputTarget.val() + ($key - 7))
                }
            };
            //删除
            if ($key ==  self.KEYS.DEL) {
                if (self.currentInputTarget != '') {
                    self.delInputVal(self.currentInputTarget);
                }
            };

            //返回
            if ($key == self.KEYS.BACK) {
                if(self.backEvent){
                    self.backEvent.apply();
                }else{
                    window.history.go(-1);
                }
            }

            //向左
            if ($key == self.KEYS.LEFT) {
                if(self.currentBtnElement.hasClass(self.focusInputState)){
                    var cursorIndex=self.getCursorPosition(self.currentBtnElement);
                    if(cursorIndex>0){
                        self.setCursorPosition(self.currentBtnElement,cursorIndex-1)
                    }
                    return false;
                }
                self.filterBtn(self.btns,'L');
                //触发事件
                $(self.parent).trigger('leftKey');
            }
            //向上
            if ($key == self.KEYS.UP) {
                self.filterBtn(self.btns,'U');
                //触发事件
                $(self.parent).trigger('upKey');
            }
            //向右
            if ($key == self.KEYS.RIGHT) {
                if(self.currentBtnElement.hasClass(self.focusInputState)){
                    var cursorIndex=self.getCursorPosition(self.currentBtnElement);
                    if(cursorIndex<self.currentBtnElement.val().length){
                        self.setCursorPosition(self.currentBtnElement,cursorIndex+1)
                    }
                    return false;
                }
                self.filterBtn(self.btns,'R');
                //触发事件
                $(self.parent).trigger('rightKey');
            }
            //向下
            if ($key == self.KEYS.DOWN) {
                self.filterBtn(self.btns,'D');
                //触发事件
                $(self.parent).trigger('downKey');
            }

            var $vctar = $('.vc-tar'),
                $target = $('.focusBtn.on.vc-tar'),
                tari = $target.index(),
                $vcr = $('#vc-right'),
                $vcl = $('#vc-left');
            if($target.length > 0) {
                $target.show();
                if(tari  > 3) {
                    $vctar.eq(tari - 4).hide();
                }
                if(tari + 1 == $vctar.length) {
                    $vcl.show();
                    $vcr.hide();
                }
                else if(tari == 0) {
                    $vcl.hide();
                    $vcr.show();
                }
                else {
                    $vcl.show();
                    $vcr.show();
                }
            }
//            console.log($vctar.length,$target.length)
        },
        //打开虚拟键盘
        keyboardShow:function($obj) {
            var self=this,offset = $obj.offset(),keyboardName='keyboard_all';
            if($obj.attr('keyboard')){
                keyboardName=$obj.attr('keyboard');
            }
            $('#'+keyboardName).css({
                left: offset.left,
                top: offset.top+$obj.height()+5
            }).show();
            self.parent="#"+keyboardName;
            self.backEvent=function(){
                self.keyboardHide();
            }
            self.keyboardIsShow = true;
            self.currentInputTarget = $obj;
            $obj.removeClass(self.focusClass).addClass(self.focusInputState);
            self.setCursorPosition($obj,$obj.val().length);
            self.init(1);


            //虚拟键盘
            $('.keyBoardTargetFlag li').unbind('click').click(function() {
                var
                    currentBtnElement = $(this),
                    input=self.currentInputTarget,
                    cursorIndex=self.getCursorPosition(input),
                    val=input.val(),
                    val1=val.substr(0,cursorIndex),
                    val2=val.substr(cursorIndex,input.val().length);
                var keyboardBox = currentBtnElement.parent();

                if (currentBtnElement.hasClass('closekeyboard')) {
                    self.keyboardHide()
                } else if (currentBtnElement.hasClass('delinput')) {
                    self.delInputVal(input);
                } else if (currentBtnElement.hasClass('okbtn')) {
                    self.keyboardHide();
                } else if (currentBtnElement.hasClass('lowercase')) {
                    keyboardBox.find('.letter').each(function() {
                        var o = $(this);
                        o.html(o.html().toLowerCase());
                    });
                    currentBtnElement.html('大写');
                    currentBtnElement.removeClass('lowercase');
                    currentBtnElement.addClass('uppercase');
                } else if (currentBtnElement.hasClass('uppercase')) {
                    keyboardBox.find('.letter').each(function() {
                        $(this).html($(this).html().toUpperCase());
                    });
                    currentBtnElement.html('小写');
                    currentBtnElement.removeClass('uppercase');
                    currentBtnElement.addClass('lowercase');
                } else if (currentBtnElement.hasClass('tochar')) {
                    keyboardBox.find('.number').each(function(i) {
                        $(this).html(akh.keyBoardChars[i]);
                    });
                    currentBtnElement.html('123');
                    currentBtnElement.removeClass('tochar');
                    currentBtnElement.addClass('tonumber')
                } else if (currentBtnElement.hasClass('tonumber')) {
                    keyboardBox.find('.number').each(function(i) {
                        $(this).html(i);
                    });
                    currentBtnElement.html('字符');
                    currentBtnElement.removeClass('tonumber');
                    currentBtnElement.addClass('tochar');
                } else {
                    input.val(val1 + currentBtnElement.text() +val2);
                    //apply angular scope
                    if(angular){
                        angular.element(input).triggerHandler("change");
                    }
                    self.setCursorPosition(input,cursorIndex+1);
                };
            });
        },

        //删除当前输入框（必须是焦点状态） 光标处前一位
        delInputVal:function($input){
            var self=this, cursorIndex=self.getCursorPosition($input),
                val=$input.val(),
                val1=val.substr(0,cursorIndex),
                val2=val.substr(cursorIndex,$input.val().length);
            $input.val(val1.substr(0, val1.length - 1) + val2);
            //apply angular scope
            if(angular){
                angular.element($input).triggerHandler("change");
            }
            self.setCursorPosition($input,cursorIndex-1);
        },

        //关闭虚拟键盘
        keyboardHide:function() {
            var self=this;
            triggerOnInput(self.currentInputTarget.attr('name'));
            $('.keyBoardTargetFlag').hide();
            self.keyboardIsShow = false;
            self.parent="body";
            self.backEvent=false;
            self.currentInputTarget.removeClass(self.focusInputState);
            var index = $(self.parent+' .'+self.target).index(self.currentInputTarget);
            self.currentInputTarget.blur();
            self.currentInputTarget = '';
            self.init(index);
        },
        filterBtn:function($btns,$direction){ //计算目标方向的下一个按钮元素
            var self=this,newBtn='',range=0,range2=0,currentBtnElement=self.currentBtnElement;
            var b=[];
            b['l']=currentBtnElement.data('l');
            b['t']=currentBtnElement.data('t');
            b['w']=currentBtnElement.data('w');
            b['h']=currentBtnElement.data('h');
            b['x']=b['l']+b['w']/2;
            b['y']=b['t']+b['h']/2;

            var DTarget = currentBtnElement.attr('direction');
            if(DTarget && DTarget!=''){
                DTarget = DTarget.split(':');
            }

            if(DTarget && DTarget[0]==$direction){
                if($.isNumeric(DTarget[1])){
                    newBtn = $(self.parent+' .'+self.target).eq(+DTarget[1]);
                }else{
                    newBtn = $(DTarget[1]);
                }
            }

            if(newBtn == ''){
                var cbePa = currentBtnElement.parents('.focusLayout');
                //如果在一个layout内
                if(cbePa.length>0 && cbePa.attr('scroll') && !self.isBorderElement(currentBtnElement,$direction)){
                    $btns = cbePa.find('.'+self.target);
                }
            }


            //第一次计算
            if(newBtn==''){
                $btns.each(function(index, element) {
                    var o=$(element),a=[];
                    a['l']=o.data('l');
                    a['t']=o.data('t');
                    a['w']=o.data('w');
                    a['h']=o.data('h');
                    a['x']=a['l']+a['w']/2;
                    a['y']=a['t']+a['h']/2;

                    if($direction=='U'){
                        if((a['l']+a['w'])<b['l'] || a['l']>(b['l']+b['w'])){

                            //非覆盖
                        }else{
                            if((a['t']+a['h']) <= b['t']+1){
                                r=self.distance(b['x'],b['t'],a['x'],a['y']);  //上边中:中心
                                if(newBtn==''){
                                    newBtn=o;
                                    range=r;
                                }else{
                                    if(r<range){
                                        range=r;
                                        newBtn=o;
                                    }
                                }
                            }
                        }
                    }

                    if($direction=='D'){
                        if((a['l']+a['w'])<b['l'] || a['l']>(b['l']+b['w'])){
                            //非覆盖
                        }else{
                            if(a['t'] > b['t']){
                                r=self.distance(b['x'],b['t']+b['h'],a['x'],a['y']);    //下边中:中心
                                if(newBtn==''){
                                    newBtn=o;
                                    range=r;
                                }else{
                                    if(r<range){
                                        range=r;
                                        newBtn=o;
                                    }
                                }
                            }
                        }

                    }

                    if($direction=='L'){
                        if((a['t']+a['h'])<b['t'] || a['t']>(b['t']+b['h'])){
                            //非覆盖
                        }else{
                            if((a['l']+a['w']) <= b['l']){
                                //console.log(o)
                                r=self.distance(b['l'],b['y'],a['x'],a['y']); //左边中:中心点
                                if(newBtn==''){
                                    newBtn=o;
                                    range=r;
                                }else{
                                    if(r<range){
                                        range=r;
                                        newBtn=o;
                                    }
                                }
                            }
                        }
                    }

                    if($direction=='R'){
                        if((a['t']+a['h'])<b['t'] || a['t']>(b['t']+b['h'])){
                            //非覆盖
                        }else{
                            if((a['l']) >= (b['l']+b['w'])){
                                r=self.distance(b['l']+b['w'],b['y'],a['x'],a['y']);   //右边中:中心
                                if(newBtn==''){
                                    newBtn=o;
                                    range=r;
                                }else{
                                    if(r<range){
                                        range=r;
                                        newBtn=o;
                                    }
                                }
                            }
                        }
                    }
                });
            }

            //如果没有对象，进行第二次计算  以向上为例：主要计算焦点元素上方没有元素在 left() 至 (left()+width())的范围内  此情况下 就取上方任意跟他最近的元素为下一目标
            if(newBtn==''){
                $btns.each(function(index, element) {
                    var o=$(element),a=[];
                    a['l']=o.data('l');
                    a['t']=o.data('t');
                    a['w']=o.data('w');
                    a['h']=o.data('h');
                    a['x']=a['l']+a['w']/2;
                    a['y']=a['t']+a['h']/2;

                    if($direction=='U'){
                        if((a['t']+a['h']) < b['t']){  //比当前焦点水平位置高的
                            r=self.distance(b['x'],b['t'],a['x'],a['y']);
                            if(newBtn==''){
                                newBtn=o;
                                range=r;
                            }else{
                                if(r<range){
                                    range=r;
                                    newBtn=o;
                                }
                            }
                        }
                    }

                    if($direction=='D'){  //比当前焦点元素水平位置偏低的
                        if(a['t'] > b['t']){
                            r=self.distance(b['x'],b['t']+b['h'],a['x'],a['y']);
                            if(newBtn==''){
                                newBtn=o;
                                range=r;
                            }else{
                                if(r<range){
                                    range=r;
                                    newBtn=o;
                                }
                            }
                        }
                    }


                    if($direction=='L'){ //比当前焦点元素 偏左的
                        if((a['l']+a['w']) < b['l']){
                            r=self.distance(b['l'],b['y'],a['x'],a['y']);
                            if(newBtn==''){
                                newBtn=o;
                                range=r;
                            }else{
                                if(r<range){
                                    range=r;
                                    newBtn=o;
                                }
                            }
                        }
                    }

                    if($direction=='R'){ //偏右的
                        if(a['l'] > (b['l']+b['w'])){
                            r=self.distance(b['l']+b['w'],b['y'],a['x'],a['y']);
                            if(newBtn==''){
                                newBtn=o;
                                range=r;
                            }else{
                                if(r<range){
                                    range=r;
                                    newBtn=o;
                                }
                            }
                        }
                    }

                });
            }
            if(newBtn!=''){
                self.setCurBtn(newBtn,$direction);
            }else{
                if(self.debug){
                    self.debugMsg.push('tvKey no target!!! ');
                }
            }
        },
        setCurBtn:function($btn,$direction){
            var self=this,
                curLayout = self.currentBtnElement.parents('.focusLayout'), //当前焦点所在的LAYOUT
                targetLayout = $btn.parents('.focusLayout'),//目标焦点所在LAYOUT
                curLayoutBtns = curLayout.find('.'+self.target),//当前焦点所在LAYOUT的BTN集合
                curLayoutIndex = curLayoutBtns.index(self.currentBtnElement);

            curLayout.attr('layoutIndex',curLayoutIndex);

            //console.log(curLayout.attr('direction'))
            //console.log($direction)
            //如果不满足  （当前layout 和目标 layout不是同一个 ，且 当前layout允许 目标layout的方向 移动 ） 则干掉此操作
            if(curLayout.attr('class') != targetLayout.attr('class') && (curLayout.attr('direction') && curLayout.attr('direction').indexOf($direction)<0)){
                return false;
            }

            if(curLayout.attr('class') != targetLayout.attr('class') && !$btn.hasClass(self.focusInputState)){ //排除一下输入状态的情况
                if(self.debug){
                    self.debugMsg.push('layout change...');
                }
                if(targetLayout.attr('layoutIndex')){
                    var index= +targetLayout.attr('layoutIndex');
                    $btn = targetLayout.find('.'+self.target).eq(index);
                }

            }

            if(self.isInput(self.currentBtnElement) && !self.currentBtnElement.hasClass(self.focusInputState)){
                self.currentBtnElement.trigger('blur');
            }
            self.currentBtnElement.removeClass(self.focusClass);
            self.currentBtnElement.trigger('focusOut');
            //debug
            if(self.debug){
                if(self.isInput(self.currentBtnElement)){
                    self.currentBtnElement.attr('debugname',self.currentBtnElement.attr('placeholder'));
                }else{
                    self.currentBtnElement.attr('debugname',self.currentBtnElement.text());
                }
                if(self.isInput($btn)){
                    $btn.attr('debugname',$btn.attr('placeholder'));
                }else{
                    $btn.attr('debugname',$btn.text());
                }
                self.debugMsg.push('焦点： ['+self.currentBtnElement.attr('debugname')+'] 到 ['+$btn.attr('debugname')+']');
            }

            $btn.addClass(self.focusClass);
            self.currentBtnElement=$btn;
            $btn.trigger('focusIn');

            self.needScroll($direction);

            return $btn;
        },
        //计算两点的距离
        distance:function(x1,y1,x2,y2){
            var calX = x2 - x1;
            var calY = y2 - y1;
            return  Math.pow((calX *calX + calY * calY), 0.5);
        },

        //判断是否边界元素
        isBorderElement:function($obj,$direction){
            var self = this, pa = $obj.parents('.focusLayout');
            var isBE=true;
            if($direction == 'L'){ //左边界
                pa.find('.'+self.target).each(function(){
                    var o=$(this);
                    if(o.data('l') < $obj.data('l')){
                        isBE = false;
                    }
                });
            }

            if($direction == 'R'){ //右边界
                pa.find('.'+self.target).each(function(){
                    var o=$(this);
                    if(o.data('r') > $obj.data('r')){
                        isBE = false;
                    }
                });
            }

            if($direction == 'U'){ //上边界
                pa.find('.'+self.target).each(function(){
                    var o=$(this);
                    if(o.data('t') < $obj.data('t')){
                        isBE = false;
                    }
                });
            }

            if($direction == 'D'){ //下边界
                pa.find('.'+self.target).each(function(){
                    var o=$(this);
                    if(o.data('b') > $obj.data('b')){
                        isBE = false;
                    }
                });
            }

            return isBE;

        },

        isInput:function($obj){//
            return $.inArray($obj.attr('type'),['text','password','number','email'])>=0;
        },
        //设定光标位置
        setCursorPosition:function (ctrl, pos){
            ctrl=ctrl[0];
            if(ctrl.setSelectionRange){
                ctrl.focus();
                ctrl.setSelectionRange(pos,pos);
            }
        },
        //获取光标位置
        getCursorPosition:function  (ctrl) {
            ctrl=ctrl[0];
            var CaretPos = 0;
            if (ctrl.selectionStart || ctrl.selectionStart == '0')// Firefox support
                CaretPos = ctrl.selectionStart;
            return (CaretPos);
        },

        needScroll:function($direction){
            var self = this;
            var layout = self.currentBtnElement.parents('.focusLayout');
            if(layout.length<1 || typeof layout.attr('scroll')=='undefined')return ;
            var currentBtn = self.currentBtnElement;
            var pw = layout.width(),ph = layout.height(),pl=layout.offset().left,pt=layout.position().top,
                sw = currentBtn.width(),sh = currentBtn.height(),sl = currentBtn.position().left, st= currentBtn.position().top;
            // 水平方向 当前元素已经到了 layout 边缘 或者已经遮挡
            var result ={};
            result.left = (pl + pw) - (sl + sw);
            result.bottom  = (pt + ph) - (st + sh);
            result.top = pt - st;
            result.right  = pl - sl;
            var distanceFromLeft = layout.scrollLeft();
            var margin = parseInt(currentBtn.css('margin-left'));
            if("R" == $direction && result.left < 0){
                layout.scrollLeft(distanceFromLeft + sl - pl - margin);
                return;
            }
            if("L" == $direction && result.right > 0){
                layout.scrollLeft(distanceFromLeft - (pw - (sl+sw) - margin));
                return;
            }
            akh.init(currentBtn);
        },
        debugMsg:{
            'push':function($msg){
                var self=this, box =$('#tvKeyDebugBox');
                box.fadeIn();
                if(box.find('p').length == 10){//最多十条
                    box.find('p').eq(0).remove();
                }
                box.html(box.html()+'<p>'+$msg+'</p>');
                clearTimeout(self.debugTimeout);
                self.debugTimeout = setTimeout(function(){
                    box.fadeOut();
                },5000);
            },
            'clear':function(){
                $('#tvKeyDebugBox').html('');
            }
        }
    }

    window.akh = new androidKeyHandler();
    //akh.init();


    if (AndroidPlatform) {
        window.keymove=function($key){
            akh.keymove($key);
        }
    }else{
        $(document).keydown(function(e) {
            if(window.closeTvkey)return;
            var windowsKeys = [13,37,38,39,40,27,46];
            if($.inArray(e.keyCode,windowsKeys)>=0){
                akh.keymove(e.keyCode);
                e.preventDefault();
                return false;
            }
        });
    }


    //兼容鼠标
    $('.focusBtn').on('mousedown',function(){
        var o=$(this);
        $('.focusBtn.on').removeClass('on');
        o.addClass('on');
        akh.init();
    });
    //对链接标签的处理 带 href 或绑定 事件
    $('aspan.focusBtn').on('click',function(e){
        var o=$(this),href=o.attr('href');
        if(href && href!='' && href != '' && href.indexOf('javascript')<0){
            location.href = href;
            e.preventDefault();
            return false;
        }
    });

});;/**
 * Created by nuomi on 14-8-1.
 */
seajs.config({
    paths: {
        'js':'/js',
        'ui':'/js/ui',
        'widget':'/widget'
    },
    alias: {
        'jquery':'widget/jquery/jquery.js',
        'bootstrap':'widget/BootStrap/js/bootstrap.min.js',
        'angular':'widget/AngularJS/angular/angular.min.js',
        'hammer':'widget/hammer/hammer.js',
        'zepto':'widget/zepto/zepto.js'
    }
});
