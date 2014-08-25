/**
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
