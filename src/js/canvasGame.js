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
