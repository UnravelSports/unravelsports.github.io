## 📱 Interactive Digital Tactical Magnet Board

Directly interacting with advanced analytics tools such as Pitch Control or Expected Pass and Expected Receiver models would allow coaches, technical and analytics staff, not only in soccer but in virtually any sport, to get a better understanding of the underlying tactical insights these models offer to improve player development and game model design.
To accomplish this I created an <b>"Interactive Digital Tactical Magnet Board"</b> that allows its users to directly interface with such custom built models.

In its current state users can interact with a real time implementation of [William Spearman's](https://www.researchgate.net/publication/334849056_Quantifying_Pitch_Control) Pitch Control model, but it's not difficult to imagine that the app can be further enhanced with the implementation of other models and/or the ability to load specific in-game situations from tracking data.

In this blog I'll showcase the app and it's features and touch a little on how to go from [Laurie Shaw's](https://github.com/Friends-of-Tracking-Data-FoTD/LaurieOnTracking) implementation of Spearmans model, to a fully functional real time implementation in Python by leveraging the power of NumPy and vectorization.

Unfortunately this project has not (yet) made it's way to an app store. So, we'll have to make due with some screen capped videos.


#### Real-time interactive Pitch Control
<figure>    
    <p>
      <video src="https://user-images.githubusercontent.com/64530306/156655256-ef853757-dcfd-42cd-8582-7b00b63d1365.mov" class="center-vid" controls="controls" style="max-width: 500px;"></video>
    </p>  
</figure>

Video 1. displays the main interface with players in an arbitrary tactical setup up. It also shows how interacting with the players, either by simply moving players or adding a velocity vector to them instantly updates the underlying pitch control model. The velocity vectors are scaled to represent the players new location after 1 second.

#### Custom drawing tools and cover shadows
<figure>    
    <p>
      <video src="https://user-images.githubusercontent.com/64530306/156880559-6d58d01f-44a8-4c42-8045-4a4acc3f7890.mov" class="center-vid" controls="controls" style="max-width: 500px;"></video>
    </p>  
</figure>

To further enhance the interactivity the app comes with custom built drawing tools, such as arrows, lines, rectangles and polygons. At the end of the video we also show the "cover shadow" option, a feature that gives each player (or individual players, via each players individual menu) a cover shadow relative to the location of the ball.


#### Different sports
<figure>    
    <p>
      <video src="https://user-images.githubusercontent.com/64530306/156880560-0af7b687-66f2-4d6c-9331-0f8273251ec1.mov" class="center-vid" controls="controls" style="max-width: 500px;"></video>
    </p>  
</figure>

The third video shows some other surfaces that can be accessed via the settings menu. For example attacking/defending third (soccer), field hockey, tennis and volleyball. It's safe to say that the sky is the limit here when it comes to implementing playing surfaces and player number restrictions.

#### Further options
<figure>    
    <p>
      <video src="https://user-images.githubusercontent.com/64530306/156880561-cb12f588-3933-4214-8a33-8828085c3de2.mov" class="center-vid" controls="controls" style="max-width: 500px;"></video>
    </p>  
</figure>

And finally the last video highlights some basic features, such as increasing player sizes and changing team colors.

The app also has some other features not shown in the video, such as local storage of tactical setups, an option to change each players jersey number, or change their jersey number to initials or full name, the ability to measure distances between (multiple) players, an option to highlight individual players and options to change the attacking team and assign a different player the role of goalkeeper.

<div class="text-paperclip"> 📎<a class="post_navi-item nav_prev" href="/2021/03/14/live-pitch-control.html">Last year</a> I released my first proof-of-concept multi-platform phone & tablet app (iOS/<a href="https://play.google.com/store/apps/details?id=com.unravelsports.base_app" class="paperclip-link">Android</a>) built in <a href="https://flutter.dev/" class="paperclip-link">Flutter</a> which show cased a dummy live streamed feed of <a href="https://github.com/metrica-sports/sample-data" class="paperclip-link">Metrica Sports</a> open source data.</div>
