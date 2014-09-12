/*! touch 26-08-2014 */
define(function(require){require("jquery"),$("a").click(function(){window.location=$(this).attr("href")}),require.async(["js/tvKey.source.js"])});