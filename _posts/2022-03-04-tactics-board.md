## 📱 Interactive Digital Tactical Magnet Board

<div class="text-paperclip"> 📎<a class="post_navi-item nav_prev" href="/2021/03/14/live-pitch-control.html">Last year</a> I released my first proof-of-concept multi-platform phone & tablet app (iOS/<a href="https://play.google.com/store/apps/details?id=com.unravelsports.base_app" class="paperclip-link">Android</a>) built in <a href="https://flutter.dev/" class="paperclip-link">Flutter</a> which showed a dummy live streamed feed of <a href="https://github.com/metrica-sports/sample-data" class="paperclip-link">Metrica Sports</a> open source data.</div>

Two part blog:
- app
- speed up pitch control (use timebudget for comparison)

Directly interacting with advanced analytics tools such as Pitch Control or Expected Pass and Expected Receiver models would allow coaches, technical and analytics staff, not only in soccer but in virtually any sport, to get a better understanding of the underlying tactical insights these models offer to improve player development and game model design.
To accomplish this I created an <b>"Interactive Digital Tactical Magnet Board"</b> that allows its users to directly interface with such custom built models.

In the current version users can interact with a real time implementation of [William Spearman's](https://www.researchgate.net/publication/334849056_Quantifying_Pitch_Control) Pitch Control model. It's not difficult to imagine that any other type of model can be built into the backend to create a wider variety of possible model interactions.

In this blog I'll showcase the app and it's features and touch a little on how to go from [Laurie Shaw's](https://github.com/Friends-of-Tracking-Data-FoTD/LaurieOnTracking) implementation of Spearmans model, to a fully functional real time implementation in Python by leveraging the power of NumPy and vectorization.

Unfortunately this project has not (yet) made it's way to an app store. So, we'll have to make due with some screen capped videos.

<figure>    
    <p>
      <video src="https://user-images.githubusercontent.com/64530306/156655256-ef853757-dcfd-42cd-8582-7b00b63d1365.mov" class="center-vid" controls="controls" style="max-width: 500px;"></video>
    </p>  
    <figcaption>
        Video 1. Real-time interactive Pitch Control
    </figcaption>
</figure>
