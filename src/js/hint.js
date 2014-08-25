/**
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

