/**
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
