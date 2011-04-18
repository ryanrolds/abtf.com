{{#fact}}
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html"/>
  <meta name="keywords" content="intersting,amazing,facts,true"/>
  <link rel="stylesheet" href="/css/main.css?v=0.2" type="text/css"/>
  <script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
  <script src="http://connect.facebook.net/en_US/all.js#xfbml=1"></script>
  <title>Amazing, but true facts</title>
  <script type="text/javascript">
    function nextFact() { window.location = "/"; }
  </script>
  <meta property="og:title" content="Fact #{{id}}: {{short}}"/>
  <meta property="og:type" content="article"/>
  <meta property="og:url" content="{{domain}}/fact?hash={{hash}}"/>
  <meta property="og:image" content="" />
  <meta property="og:site_name" content="Amazing, but true facts"/>
  <meta property="fb:admins" content="615705590"/>
</head>
<body>
<div class="center head">
  <div class="left">Fact #{{id}}</div>
  <div class="right next clickable" onclick="javascript:nextFact();">
    <span>Show me another<img src="/images/right.gif" style="margin-left:5px;"></span>
  </div>
  <div style="clear:both;"></div>
</div>
<div class="center fact">
   <div>
     <p>{{fact}}</p>
   </div>
</div>
<div class="center foot">
  <div class="social left">
    <fb:like href="{{domain}}/fact?hash={{hash}}" layout="button_count" show_faces="true" width="100%" font=""></fb:like>
  </div>
  <div class="social right">
    <a href="http://twitter.com/share" class="twitter-share-button" data-text="{{short}} {{tweet_hash}}" data-url="{{domain}}/fact?hash={{hash}}"  data-count="horizontal">Tweet</a>
  </div>
  <div style="clear:both;"/> 
  <a href="mailto:factarian@amazingbuttruefacts.com">Send/report facts</a>
</div>
{{/fact}}
<script type="text/javascript">
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-22720506-1']);
_gaq.push(['_trackPageview']);
(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
</script>
</body>
</html>
