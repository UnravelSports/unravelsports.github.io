## 💻 Real Time Pitch Control Multi-Platform App

<a href='https://play.google.com/store/apps/details?id=com.unravelsports.base_app&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
<img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' style="width:200px"/></a>

Today was the release day of my proof-of-concept multi-platform phone & tablet app (iOS/[Android](https://play.google.com/store/apps/details?id=com.unravelsports.base_app)) 
to showcase the use of synchronized tracking data from a live streamed feed using a game of [Metrica Sports](https://github.com/metrica-sports/sample-data) 
open source data. 

This app was built in [Flutter](https://flutter.dev/) - an open source framework for building multi-platform apps from a single codebase developed by Google - by me after completing [Angela Yu](https://twitter.com/yu_angela?lang=en)'s fantastic [Flutter Development Bootcamp](https://www.udemy.com/course/flutter-bootcamp-with-dart/).

The main aim of the app is to showcase my real time Pitch Control implementation modeled after [Fernández & Bornn (2018)](https://www.researchgate.net/publication/324942294_Wide_Open_Spaces_A_statistical_technique_for_measuring_space_creation_in_professional_soccer), 
meaning that the computation time of a single frame is less than `1/fps`. In our case this means each frame is calculated and served within `1/25 = 0.04 seconds`.

Because computing and rendering this within the app natively using Flutter was way too slow I decided to do the Pitch Control calculations server-side in [NumPy](https://numpy.org/) and 
serve them to the app using a [FastAPI](https://fastapi.tiangolo.com/) WebSocket.

Download the app, or read the twitter thread below for more information.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">➡️ Live tracking data on the bench? Yes! <br><br>In my latest personal project I&#39;ve combined my knowledge of football (tracking) data and mobile app development to build a proof-of-concept multi-platform app for live tracking data.<br><br>🔗Android: <a href="https://t.co/3E5L6F7nFF">https://t.co/3E5L6F7nFF</a><br>🔗iOS: tdb <a href="https://t.co/cJmIB67gf2">pic.twitter.com/cJmIB67gf2</a></p>&mdash; Joris Bekkers (@unravelsports) <a href="https://twitter.com/unravelsports/status/1371084163823075334?ref_src=twsrc%5Etfw">March 14, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
