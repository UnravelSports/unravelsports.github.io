## 💻 Real Time Pitch Control Multi-Platform App

Today was the release day of my proof-of-concept multi-platform phone & tablet app (iOS/[Android](https://play.google.com/store/apps/details?id=com.unravelsports.base_app)) 
to showcase the use of synchronized tracking data from a live streamed feed using a game of [Metrica Sports](https://github.com/metrica-sports/sample-data) 
open source data. 

This app was built in [Flutter](https://flutter.dev/) - an open source framework for building multi-platform apps from a single codebase developed by Google - by me after completing [Angela Yu](https://twitter.com/yu_angela?lang=en)'s fantastic [Flutter Development Bootcamp](https://www.udemy.com/course/flutter-bootcamp-with-dart/).

The main aim of the app is to showcase my real time Pitch Control implementation modeled after [Fernández & Bornn (2018)](https://www.researchgate.net/publication/324942294_Wide_Open_Spaces_A_statistical_technique_for_measuring_space_creation_in_professional_soccer), 
meaning that the computation time of a single frame is less than `1/fps`. In our case this means each frame is calculated within `1/25 = 0.04 seconds`.

Because computing and rendering this within the app natively using Flutter was way too slow I decided to do the Pitch Control calculations server-side in [NumPy](https://numpy.org/) and 
serve them to the app using a [FastAPI](https://fastapi.tiangolo.com/) WebSocket.


