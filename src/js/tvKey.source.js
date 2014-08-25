$(document).ready(function(e) {
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

});