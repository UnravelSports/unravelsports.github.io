## 📱 Interactive Digital Tactics Board

Directly interacting with advanced analytics tools such as Pitch Control or Expected Pass and Expected Receiver models would allow coaches, technical and analytics staff (not only in soccer but in virtually any sport) to get a better understanding of the novel tactical insights these and other models have to offer.<br>
To facilitate direct interfacing with such advanced models, and to aid in tactical analysis, improved player development and game model design, I developed the <b>Interactive Digital Tactics Board App</b>, a multiplatform (iOS/Android/Web) application built in [Flutter](https://flutter.dev/).

In its current state users can interact with a real time implementation of [William Spearman's](https://www.researchgate.net/publication/334849056_Quantifying_Pitch_Control) Pitch Control model, use drawing tools to supplement analysis and store and load pre-defined tactical setups locally on the device. And it's not difficult to envision the app being further enhanced with other models and/or the ability to load specific in-game situations from tracking data.

In this blog I'll showcase the app and its features and in a subsequent blog I'll provide a high level overview on how to optimize [Laurie Shaw's](https://github.com/Friends-of-Tracking-Data-FoTD/LaurieOnTracking) implementation of Spearman's model for speed - reducing compute times by at least 15x - and turn it into a fully functional near real time Python implementation that leverages the power of NumPy vectorization without any loss of accuracy.

Unfortunately this project has not (yet) made it's way to an app store. So, we'll have to make due with some screen recorded videos of it running on an iPad emulator.


#### Real-time interactive Pitch Control
<figure>    
    <p>
      <video src="https://user-images.githubusercontent.com/64530306/156655256-ef853757-dcfd-42cd-8582-7b00b63d1365.mov" class="center-vid" controls="controls" style="max-width: 70%;"></video>
    </p>  
    <figcaption>Interactive Pitch Control</figcaption>  
</figure>

The first video displays the main interface with players in an arbitrary tactical setup up. It shows how interacting with a player, either by simply moving it or adding a velocity vector to it via its individual player menu, instantly updates the underlying pitch control model. <br>The velocity vectors are scaled to represent the players new location after 1 second.

#### Custom drawing tools and cover shadows
<figure>    
    <p>
      <video src="https://user-images.githubusercontent.com/64530306/156880559-6d58d01f-44a8-4c42-8045-4a4acc3f7890.mov" class="center-vid" controls="controls" style="max-width: 70%;"></video>
    </p>  
    <figcaption>Drawing tools and auto-updating cover shadows</figcaption>
</figure>

To further enhance the interactivity the app comes with custom built drawing tools, such as arrows, lines, rectangles and polygons. At the end of the video we also show the "cover shadow" option, a feature that gives all players (or individual players via their own respective menus) a auto-updating cover shadow relative to the location of the ball.


#### Different sports
<figure>    
    <p>
      <video src="https://user-images.githubusercontent.com/64530306/156880560-0af7b687-66f2-4d6c-9331-0f8273251ec1.mov" class="center-vid" controls="controls" style="max-width: 70%;"></video>
    </p>  
    <figcaption>Additional pitch surfaces</figcaption>
</figure>

The third video shows some of the other pitch surfaces, attacking/defending third (soccer), field hockey, tennis and volleyball, that can be accessed via the settings menu. Currently, these are the only pitches included, but is quite straightforward to included surface markings for American football, hockey, basketball etc.

#### Additional options
<figure>    
    <p>
      <video src="https://user-images.githubusercontent.com/64530306/156880561-cb12f588-3933-4214-8a33-8828085c3de2.mov" class="center-vid" controls="controls" style="max-width: 70%;"></video>
    </p>  
    <figcaption>Settings menu</figcaption>
</figure>

And finally the last video highlights some basic features, such as increasing player sizes and changing team colors.

The app also has some other features not shown in the video. There is an option to change each players jersey number, or change their jersey number to initials or full name, the ability to measure distances between (multiple) players, an option to highlight individual players and the ability to change the attacking team and assign a different player the role of goalkeeper.

<div class="text-paperclip"> 📎 In <a class="post_navi-item nav_prev" href="/2021/03/14/live-pitch-control.html">this</a> blog you'll find a description of my first proof-of-concept multi-platform phone & tablet app (iOS/<a href="https://play.google.com/store/apps/details?id=com.unravelsports.base_app" class="paperclip-link">Android</a>) built in <a href="https://flutter.dev/" class="paperclip-link">Flutter</a> which show cased a dummy live streamed feed of <a href="https://github.com/metrica-sports/sample-data" class="paperclip-link">Metrica Sports</a> open source data.</div>
