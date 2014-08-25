/*! touch 25-08-2014 */
var Base=function(){};Base.extend=function(_instance,_static){"use strict";var extend=Base.prototype.extend;Base._prototyping=!0;var proto=new this;extend.call(proto,_instance),proto.base=function(){},delete Base._prototyping;var constructor=proto.constructor,klass=proto.constructor=function(){if(!Base._prototyping)if(this._constructing||this.constructor==klass)this._constructing=!0,constructor.apply(this,arguments),delete this._constructing;else if(null!==arguments[0])return(arguments[0].extend||extend).call(arguments[0],proto)};return klass.ancestor=this,klass.extend=this.extend,klass.forEach=this.forEach,klass.implement=this.implement,klass.prototype=proto,klass.toString=this.toString,klass.valueOf=function(type){return"object"==type?klass:constructor.valueOf()},extend.call(klass,_static),"function"==typeof klass.init&&klass.init(),klass},Base.prototype={extend:function(source,value){if(arguments.length>1){var ancestor=this[source];if(ancestor&&"function"==typeof value&&(!ancestor.valueOf||ancestor.valueOf()!=value.valueOf())&&/\bbase\b/.test(value)){var method=value.valueOf();value=function(){var previous=this.base||Base.prototype.base;this.base=ancestor;var returnValue=method.apply(this,arguments);return this.base=previous,returnValue},value.valueOf=function(type){return"object"==type?value:method},value.toString=Base.toString}this[source]=value}else if(source){var extend=Base.prototype.extend;Base._prototyping||"function"==typeof this||(extend=this.extend||extend);for(var proto={toSource:null},hidden=["constructor","toString","valueOf"],i=Base._prototyping?0:1;key=hidden[i++];)source[key]!=proto[key]&&extend.call(this,key,source[key]);for(var key in source)proto[key]||extend.call(this,key,source[key])}return this}},Base=Base.extend({constructor:function(){this.extend(arguments[0])}},{ancestor:Object,version:"1.1",forEach:function(object,block,context){for(var key in object)void 0===this.prototype[key]&&block.call(context,object[key],key,object)},implement:function(){for(var i=0;i<arguments.length;i++)"function"==typeof arguments[i]?arguments[i](this.prototype):this.prototype.extend(arguments[i]);return this},toString:function(){return String(this.valueOf())}});var FlipClock;!function($){"use strict";FlipClock=function(obj,digit,options){return"object"==typeof digit&&(options=digit,digit=0),new FlipClock.Factory(obj,digit,options)},FlipClock.Lang={},FlipClock.Base=Base.extend({buildDate:"2014-06-03",version:"0.5.5",constructor:function(_default,options){"object"!=typeof _default&&(_default={}),"object"!=typeof options&&(options={}),this.setOptions($.extend(!0,{},_default,options))},callback:function(method){if("function"==typeof method){for(var args=[],x=1;x<=arguments.length;x++)arguments[x]&&args.push(arguments[x]);method.apply(this,args)}},log:function(){},getOption:function(index){return this[index]?this[index]:!1},getOptions:function(){return this},setOption:function(index,value){this[index]=value},setOptions:function(options){for(var key in options)"undefined"!=typeof options[key]&&this.setOption(key,options[key])}})}(jQuery),function($){"use strict";FlipClock.Face=FlipClock.Base.extend({dividers:[],factory:!1,lists:[],constructor:function(factory,options){this.dividers=[],this.lists=[],this.base(options),this.factory=factory},build:function(){},createDivider:function(label,css,excludeDots){"boolean"!=typeof css&&css||(excludeDots=css,css=label);var dots=['<span class="'+this.factory.classes.dot+' top"></span>','<span class="'+this.factory.classes.dot+' bottom"></span>'].join("");excludeDots&&(dots=""),label=this.factory.localize(label);var html=['<span class="'+this.factory.classes.divider+" "+(css?css:"").toLowerCase()+'">','<span class="'+this.factory.classes.label+'">'+(label?label:"")+"</span>",dots,"</span>"];return $(html.join(""))},createList:function(digit,options){"object"==typeof digit&&(options=digit,digit=0);var obj=new FlipClock.List(this.factory,digit,options);return this.lists.push(obj),obj},reset:function(){this.factory.time=new FlipClock.Time(this.factor,this.factory.original?Math.round(this.factory.original):0),this.flip(this.factory.original,!1)},addDigit:function(digit){var obj=this.createList(digit,{classes:{active:this.factory.classes.active,before:this.factory.classes.before,flip:this.factory.classes.flip}});obj.$el.append(this.factory.lists[this.factory.lists.length-1].$obj)},start:function(){},stop:function(){},autoIncrement:function(){this.factory.time.time instanceof Date||(this.factory.countdown?this.decrement():this.increment())},increment:function(){this.factory.time.addSecond()},decrement:function(){0==this.factory.time.getTimeSeconds()?this.factory.stop():this.factory.time.subSecond()},flip:function(time,doNotAddPlayClass){var t=this;$.each(time,function(i,digit){var list=t.lists[i];list?(doNotAddPlayClass||digit==list.digit||list.play(),list.select(digit)):t.addDigit(digit)})}})}(jQuery),function($){"use strict";FlipClock.Factory=FlipClock.Base.extend({autoStart:!0,callbacks:{destroy:!1,create:!1,init:!1,interval:!1,start:!1,stop:!1,reset:!1},classes:{active:"flip-clock-active",before:"flip-clock-before",divider:"flip-clock-divider",dot:"flip-clock-dot",label:"flip-clock-label",flip:"flip",play:"play",wrapper:"flip-clock-wrapper"},clockFace:"HourlyCounter",countdown:!1,defaultClockFace:"HourlyCounter",defaultLanguage:"english",language:"english",lang:!1,original:!1,face:!0,running:!1,time:!1,timer:!1,lists:[],$el:!1,$wrapper:!1,constructor:function(obj,digit,options){options||(options={}),this.lists=[],this.running=!1,this.base(options),this.$el=$(obj).addClass(this.classes.wrapper),this.$wrapper=this.$el,this.original=digit instanceof Date?digit:digit?Math.round(digit):0,this.time=new FlipClock.Time(this,this.original,{minimumDigits:options.minimumDigits?options.minimumDigits:0,animationRate:options.animationRate?options.animationRate:1e3}),this.timer=new FlipClock.Timer(this,options),this.lang=this.loadLanguage(this.language),this.face=this.loadClockFace(this.clockFace,options),this.autoStart&&this.start()},loadClockFace:function(name,options){var face,suffix="Face";return name=name.ucfirst()+suffix,face=FlipClock[name]?new FlipClock[name](this,options):new FlipClock[this.defaultClockFace+suffix](this,options),face.build(),face},loadLanguage:function(name){var lang;return lang=FlipClock.Lang[name.ucfirst()]?FlipClock.Lang[name.ucfirst()]:FlipClock.Lang[name]?FlipClock.Lang[name]:FlipClock.Lang[this.defaultLanguage]},localize:function(index,obj){var lang=this.lang;if(!index)return null;var lindex=index.toLowerCase();return"object"==typeof obj&&(lang=obj),lang&&lang[lindex]?lang[lindex]:index},start:function(callback){var t=this;t.running||t.countdown&&!(t.countdown&&t.time.time>0)?t.log("Trying to start timer when countdown already at 0"):(t.face.start(t.time),t.timer.start(function(){t.flip(),"function"==typeof callback&&callback()}))},stop:function(callback){this.face.stop(),this.timer.stop(callback);for(var x in this.lists)this.lists.hasOwnProperty(x)&&this.lists[x].stop()},reset:function(callback){this.timer.reset(callback),this.face.reset()},setTime:function(time){this.time.time=time,this.flip(!0)},getTime:function(){return this.time},setCountdown:function(value){var running=this.running;this.countdown=value?!0:!1,running&&(this.stop(),this.start())},flip:function(doNotAddPlayClass){this.face.flip(!1,doNotAddPlayClass)}})}(jQuery),function($){"use strict";FlipClock.List=FlipClock.Base.extend({digit:0,classes:{active:"flip-clock-active",before:"flip-clock-before",flip:"flip"},factory:!1,$el:!1,$obj:!1,items:[],lastDigit:0,minimumDigits:0,constructor:function(factory,digit){this.factory=factory,this.digit=digit,this.lastDigit=digit,this.$el=this.createList(),this.$wrapper=this.$el,digit>0&&this.select(digit),this.factory.$el.append(this.$el)},select:function(digit){if("undefined"==typeof digit?digit=this.digit:this.digit=digit,this.digit!=this.lastDigit){var $delete=this.$el.find("."+this.classes.before).removeClass(this.classes.before);this.$el.find("."+this.classes.active).removeClass(this.classes.active).addClass(this.classes.before),this.appendListItem(this.classes.active,this.digit),$delete.remove(),this.lastDigit=this.digit}},play:function(){this.$el.addClass(this.factory.classes.play)},stop:function(){var t=this;setTimeout(function(){t.$el.removeClass(t.factory.classes.play)},this.factory.timer.interval)},createListItem:function(css,value){return['<li class="'+(css?css:"")+'">','<a href="#">','<div class="up">','<div class="shadow"></div>','<div class="inn">'+(value?value:"")+"</div>","</div>",'<div class="down">','<div class="shadow"></div>','<div class="inn">'+(value?value:"")+"</div>","</div>","</a>","</li>"].join("")},appendListItem:function(css,value){var html=this.createListItem(css,value);this.$el.append(html)},createList:function(){var lastDigit=this.getPrevDigit()?this.getPrevDigit():this.digit,html=$(['<ul class="'+this.classes.flip+" "+(this.factory.running?this.factory.classes.play:"")+'">',this.createListItem(this.classes.before,lastDigit),this.createListItem(this.classes.active,this.digit),"</ul>"].join(""));return html},getNextDigit:function(){return 9==this.digit?0:this.digit+1},getPrevDigit:function(){return 0==this.digit?9:this.digit-1}})}(jQuery),function($){"use strict";String.prototype.ucfirst=function(){return this.substr(0,1).toUpperCase()+this.substr(1)},$.fn.FlipClock=function(digit,options){return"object"==typeof digit&&(options=digit,digit=0),new FlipClock($(this),digit,options)},$.fn.flipClock=function(digit,options){return $.fn.FlipClock(digit,options)}}(jQuery),function($){"use strict";FlipClock.Time=FlipClock.Base.extend({time:0,factory:!1,minimumDigits:0,constructor:function(factory,time,options){this.base(options),this.factory=factory,time&&(this.time=time)},convertDigitsToArray:function(str){var data=[];str=str.toString();for(var x=0;x<str.length;x++)str[x].match(/^\d*$/g)&&data.push(str[x]);return data},digit:function(i){var timeStr=this.toString(),length=timeStr.length;return timeStr[length-i]?timeStr[length-i]:!1},digitize:function(obj){var data=[];if($.each(obj,function(i,value){value=value.toString(),1==value.length&&(value="0"+value);for(var x=0;x<value.length;x++)data.push(value.charAt(x))}),data.length>this.minimumDigits&&(this.minimumDigits=data.length),this.minimumDigits>data.length)for(var x=data.length;x<this.minimumDigits;x++)data.unshift("0");return data},getDayCounter:function(includeSeconds){var digits=[this.getDays(),this.getHours(!0),this.getMinutes(!0)];return includeSeconds&&digits.push(this.getSeconds(!0)),this.digitize(digits)},getDays:function(mod){var days=this.getTimeSeconds()/60/60/24;return mod&&(days%=7),Math.floor(days)},getHourCounter:function(){var obj=this.digitize([this.getHours(),this.getMinutes(!0),this.getSeconds(!0)]);return obj},getHourly:function(){return this.getHourCounter()},getHours:function(mod){var hours=this.getTimeSeconds()/60/60;return mod&&(hours%=24),Math.floor(hours)},getMilitaryTime:function(){var date=new Date,obj=this.digitize([date.getHours(),date.getMinutes(),date.getSeconds()]);return obj},getMinutes:function(mod){var minutes=this.getTimeSeconds()/60;return mod&&(minutes%=60),Math.floor(minutes)},getMinuteCounter:function(){var obj=this.digitize([this.getMinutes(),this.getSeconds(!0)]);return obj},getTimeSeconds:function(){return this.time instanceof Date?this.factory.countdown?((new Date).getTime()>this.time.getTime()&&this.factory.stop(),Math.max(this.time.getTime()/1e3-(new Date).getTime()/1e3,0)):(new Date).getTime()/1e3-this.time.getTime()/1e3:this.time},getSeconds:function(mod){var seconds=this.getTimeSeconds();return mod&&(60==seconds?seconds=0:seconds%=60),Math.ceil(seconds)},getTime:function(){var date=new Date,hours=date.getHours(),obj=this.digitize([hours>12?hours-12:0===hours?12:hours,date.getMinutes(),date.getSeconds()]);return obj},getWeeks:function(){var weeks=this.getTimeSeconds()/60/60/24/7;return mod&&(weeks%=52),Math.floor(weeks)},removeLeadingZeros:function(totalDigits,digits){var total=0,newArray=[];return $.each(digits,function(i){totalDigits>i?total+=parseInt(digits[i],10):newArray.push(digits[i])}),0===total?newArray:digits},addSeconds:function(x){this.time+=x},addSecond:function(){this.addSeconds(1)},subSeconds:function(x){this.time-=x},subSecond:function(){this.subSeconds(1)},toString:function(){return this.getTimeSeconds().toString()}})}(jQuery),function(){"use strict";FlipClock.Timer=FlipClock.Base.extend({callbacks:{destroy:!1,create:!1,init:!1,interval:!1,start:!1,stop:!1,reset:!1},count:0,factory:!1,interval:1e3,animationRate:1e3,constructor:function(factory,options){this.base(options),this.factory=factory,this.callback(this.callbacks.init),this.callback(this.callbacks.create)},getElapsed:function(){return this.count*this.interval},getElapsedTime:function(){return new Date(this.time+this.getElapsed())},reset:function(callback){clearInterval(this.timer),this.count=0,this._setInterval(callback),this.callback(this.callbacks.reset)},start:function(callback){this.factory.running=!0,this._createTimer(callback),this.callback(this.callbacks.start)},stop:function(callback){this.factory.running=!1,this._clearInterval(callback),this.callback(this.callbacks.stop),this.callback(callback)},_clearInterval:function(){clearInterval(this.timer)},_createTimer:function(callback){this._setInterval(callback)},_destroyTimer:function(callback){this._clearInterval(),this.timer=!1,this.callback(callback),this.callback(this.callbacks.destroy)},_interval:function(callback){this.callback(this.callbacks.interval),this.callback(callback),this.count++},_setInterval:function(callback){var t=this;t._interval(callback),t.timer=setInterval(function(){t._interval(callback)},this.interval)}})}(jQuery),function($){FlipClock.TwentyFourHourClockFace=FlipClock.Face.extend({constructor:function(factory,options){factory.countdown=!1,this.base(factory,options)},build:function(time){var t=this,children=this.factory.$el.find("ul");time=time?time:this.factory.time.time||this.factory.time.getMilitaryTime(),time.length>children.length&&$.each(time,function(i,digit){t.factory.lists.push(t.createList(digit))}),this.dividers.push(this.createDivider()),this.dividers.push(this.createDivider()),$(this.dividers[0]).insertBefore(this.factory.lists[this.factory.lists.length-2].$el),$(this.dividers[1]).insertBefore(this.factory.lists[this.factory.lists.length-4].$el),this.autoStart&&this.start()},flip:function(time,doNotAddPlayClass){time=time?time:this.factory.time.getMilitaryTime(),this.base(time,doNotAddPlayClass)}})}(jQuery),function($){FlipClock.CounterFace=FlipClock.Face.extend({minimumDigits:2,constructor:function(factory,options){factory.autoStart=options.autoStart?!0:!1,factory.increment=function(){factory.countdown=!1,factory.setTime(factory.getTime().getTimeSeconds()+1)},factory.decrement=function(){factory.countdown=!0;var time=factory.getTime().getTimeSeconds();time>0&&factory.setTime(time-1)},factory.setValue=function(digits){factory.setTime(digits)},factory.setCounter=function(digits){factory.setTime(digits)},this.base(factory,options)},build:function(){var t=this,children=this.factory.$el.find("ul"),lists=[],time=this.factory.getTime().digitize([this.factory.getTime().time]);time.length>children.length&&$.each(time,function(i,digit){var list=t.createList(digit,{minimumDigits:t.minimumDigits});list.select(digit),lists.push(list)}),$.each(lists,function(i,list){list.play()}),this.factory.lists=lists},flip:function(time,doNotAddPlayClass){time||(time=this.factory.getTime().digitize([this.factory.getTime().time])),this.autoStart&&this.autoIncrement(),this.base(time,doNotAddPlayClass)},reset:function(){this.factory.time=new FlipClock.Time(this.factor,this.factory.original?Math.round(this.factory.original):0),this.flip()}})}(jQuery),function($){FlipClock.DailyCounterFace=FlipClock.Face.extend({showSeconds:!0,constructor:function(factory,options){this.base(factory,options)},build:function(excludeHours,time){var t=this,children=this.factory.$el.find("ul"),lists=[],offset=0;time=time?time:this.factory.time.getDayCounter(this.showSeconds),time.length>children.length&&$.each(time,function(i,digit){lists.push(t.createList(digit))}),this.factory.lists=lists,this.showSeconds?$(this.createDivider("Seconds")).insertBefore(this.factory.lists[this.factory.lists.length-2].$el):offset=2,$(this.createDivider("Minutes")).insertBefore(this.factory.lists[this.factory.lists.length-4+offset].$el),$(this.createDivider("Hours")).insertBefore(this.factory.lists[this.factory.lists.length-6+offset].$el),$(this.createDivider("Days",!0)).insertBefore(this.factory.lists[0].$el),this.autoStart&&this.start()},flip:function(time,doNotAddPlayClass){time||(time=this.factory.time.getDayCounter(this.showSeconds)),this.autoIncrement(),this.base(time,doNotAddPlayClass)}})}(jQuery),function($){FlipClock.HourlyCounterFace=FlipClock.Face.extend({constructor:function(factory,options){this.base(factory,options)},build:function(excludeHours,time){var t=this,children=this.factory.$el.find("ul"),lists=[];time=time?time:this.factory.time.getHourCounter(),time.length>children.length&&$.each(time,function(i,digit){lists.push(t.createList(digit))}),this.factory.lists=lists,$(this.createDivider("Seconds")).insertBefore(this.factory.lists[this.factory.lists.length-2].$el),$(this.createDivider("Minutes")).insertBefore(this.factory.lists[this.factory.lists.length-4].$el),excludeHours||$(this.createDivider("Hours",!0)).insertBefore(this.factory.lists[0].$el),this.autoStart&&this.start()},flip:function(time,doNotAddPlayClass){time||(time=this.factory.time.getHourCounter()),this.autoIncrement(),this.base(time,doNotAddPlayClass)}})}(jQuery),function(){FlipClock.MinuteCounterFace=FlipClock.HourlyCounterFace.extend({clearExcessDigits:!1,constructor:function(factory,options){this.base(factory,options)},build:function(){this.base(!0,this.factory.time.getMinuteCounter())},flip:function(time,doNotAddPlayClass){time||(time=this.factory.time.getMinuteCounter()),this.base(time,doNotAddPlayClass)}})}(jQuery),function($){FlipClock.TwelveHourClockFace=FlipClock.TwentyFourHourClockFace.extend({meridium:!1,meridiumText:"AM",build:function(time){time=time?time:this.factory.time.time?this.factory.time.time:this.factory.time.getTime(),this.base(time),this.meridiumText=this._isPM()?"PM":"AM",this.meridium=$(['<ul class="flip-clock-meridium">',"<li>",'<a href="#">'+this.meridiumText+"</a>","</li>","</ul>"].join("")),this.meridium.insertAfter(this.factory.lists[this.factory.lists.length-1].$el)},flip:function(time,doNotAddPlayClass){this.meridiumText!=this._getMeridium()&&(this.meridiumText=this._getMeridium(),this.meridium.find("a").html(this.meridiumText)),this.base(this.factory.time.getTime(),doNotAddPlayClass)},_getMeridium:function(){return(new Date).getHours()>=12?"PM":"AM"},_isPM:function(){return"PM"==this._getMeridium()?!0:!1}})}(jQuery),function(){FlipClock.Lang.Arabic={years:"سنوات",months:"شهور",days:"أيام",hours:"ساعات",minutes:"دقائق",seconds:"ثواني"},FlipClock.Lang.ar=FlipClock.Lang.Arabic,FlipClock.Lang["ar-ar"]=FlipClock.Lang.Arabic,FlipClock.Lang.arabic=FlipClock.Lang.Arabic}(jQuery),function(){FlipClock.Lang.Danish={years:"År",months:"Måneder",days:"Dage",hours:"Timer",minutes:"Minutter",seconds:"Sekunder"},FlipClock.Lang.da=FlipClock.Lang.Danish,FlipClock.Lang["da-dk"]=FlipClock.Lang.Danish,FlipClock.Lang.danish=FlipClock.Lang.Danish}(jQuery),function(){FlipClock.Lang.German={years:"Jahre",months:"Monate",days:"Tage",hours:"Stunden",minutes:"Minuten",seconds:"Sekunden"},FlipClock.Lang.de=FlipClock.Lang.German,FlipClock.Lang["de-de"]=FlipClock.Lang.German,FlipClock.Lang.german=FlipClock.Lang.German}(jQuery),function(){FlipClock.Lang.English={years:"Years",months:"Months",days:"Days",hours:"Hours",minutes:"Minutes",seconds:"Seconds"},FlipClock.Lang.en=FlipClock.Lang.English,FlipClock.Lang["en-us"]=FlipClock.Lang.English,FlipClock.Lang.english=FlipClock.Lang.English}(jQuery),function(){FlipClock.Lang.Chinese={years:"年",months:"月",days:"天",hours:"小时",minutes:"分钟",seconds:"秒"},FlipClock.Lang.cn=FlipClock.Lang.Chinese,FlipClock.Lang.Chinese=FlipClock.Lang.Chinese,FlipClock.Lang.chinese=FlipClock.Lang.Chinese}(jQuery),function(){FlipClock.Lang.Spanish={years:"A&#241;os",months:"Meses",days:"D&#205;as",hours:"Horas",minutes:"Minutos",seconds:"Segundo"},FlipClock.Lang.es=FlipClock.Lang.Spanish,FlipClock.Lang["es-es"]=FlipClock.Lang.Spanish,FlipClock.Lang.spanish=FlipClock.Lang.Spanish}(jQuery),function(){FlipClock.Lang.Finnish={years:"Vuotta",months:"Kuukautta",days:"Päivää",hours:"Tuntia",minutes:"Minuuttia",seconds:"Sekuntia"},FlipClock.Lang.fi=FlipClock.Lang.Finnish,FlipClock.Lang["fi-fi"]=FlipClock.Lang.Finnish,FlipClock.Lang.finnish=FlipClock.Lang.Finnish}(jQuery),function(){FlipClock.Lang.French={years:"Ans",months:"Mois",days:"Jours",hours:"Heures",minutes:"Minutes",seconds:"Secondes"},FlipClock.Lang.fr=FlipClock.Lang.French,FlipClock.Lang["fr-ca"]=FlipClock.Lang.French,FlipClock.Lang.french=FlipClock.Lang.French}(jQuery),function(){FlipClock.Lang.Italian={years:"Anni",months:"Mesi",days:"Giorni",hours:"Ore",minutes:"Minuti",seconds:"Secondi"},FlipClock.Lang.it=FlipClock.Lang.Italian,FlipClock.Lang["it-it"]=FlipClock.Lang.Italian,FlipClock.Lang.italian=FlipClock.Lang.Italian}(jQuery),function(){FlipClock.Lang.Latvian={years:"Gadi",months:"Mēneši",days:"Dienas",hours:"Stundas",minutes:"Minūtes",seconds:"Sekundes"},FlipClock.Lang.lv=FlipClock.Lang.Latvian,FlipClock.Lang["lv-lv"]=FlipClock.Lang.Latvian,FlipClock.Lang.latvian=FlipClock.Lang.Latvian}(jQuery),function(){FlipClock.Lang.Dutch={years:"Jaren",months:"Maanden",days:"Dagen",hours:"Uren",minutes:"Minuten",seconds:"Seconden"},FlipClock.Lang.nl=FlipClock.Lang.Dutch,FlipClock.Lang["nl-be"]=FlipClock.Lang.Dutch,FlipClock.Lang.dutch=FlipClock.Lang.Dutch}(jQuery),function(){FlipClock.Lang.Norwegian={years:"År",months:"Måneder",days:"Dager",hours:"Timer",minutes:"Minutter",seconds:"Sekunder"},FlipClock.Lang.no=FlipClock.Lang.Norwegian,FlipClock.Lang.nb=FlipClock.Lang.Norwegian,FlipClock.Lang["no-nb"]=FlipClock.Lang.Norwegian,FlipClock.Lang.norwegian=FlipClock.Lang.Norwegian}(jQuery),function(){FlipClock.Lang.Portuguese={years:"Anos",months:"Meses",days:"Dias",hours:"Horas",minutes:"Minutos",seconds:"Segundos"},FlipClock.Lang.pt=FlipClock.Lang.Portuguese,FlipClock.Lang["pt-br"]=FlipClock.Lang.Portuguese,FlipClock.Lang.portuguese=FlipClock.Lang.Portuguese}(jQuery),function(){FlipClock.Lang.Russian={years:"лет",months:"месяцев",days:"дней",hours:"часов",minutes:"минут",seconds:"секунд"},FlipClock.Lang.ru=FlipClock.Lang.Russian,FlipClock.Lang["ru-ru"]=FlipClock.Lang.Russian,FlipClock.Lang.russian=FlipClock.Lang.Russian}(jQuery),function(){FlipClock.Lang.Swedish={years:"År",months:"Månader",days:"Dagar",hours:"Timmar",minutes:"Minuter",seconds:"Sekunder"},FlipClock.Lang.sv=FlipClock.Lang.Swedish,FlipClock.Lang["sv-se"]=FlipClock.Lang.Swedish,FlipClock.Lang.swedish=FlipClock.Lang.Swedish}(jQuery);