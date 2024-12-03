## 🌀 pip install unravelsports

I’m thrilled to announce today marks the release date of my very own open-source Python package, supported by PySport!

The 𝐮𝐧𝐫𝐚𝐯𝐞𝐥𝐬𝐩𝐨𝐫𝐭𝐬 package is designed to help researchers, analysts and enthusiasts by providing intermediary steps in the complex process of converting raw sports data into meaningful information and actionable insights.

🌀 Its current functionality helps to convert football tracking data from 6 providers, using 𝐤𝐥𝐨𝐩𝐩𝐲, into graphs specifically designed for training 𝐆𝐫𝐚𝐩𝐡 𝐍𝐞𝐮𝐫𝐚𝐥 𝐍𝐞𝐭𝐰𝐨𝐫𝐤𝐬 with Spektral.

It is my aim to add even more functionality in the future, not only for football!

1️⃣ To get started, simply 𝐥𝐨𝐚𝐝 data and 𝐜𝐨𝐧𝐯𝐞𝐫𝐭 into graphs.

2️⃣ 𝐒𝐩𝐥𝐢𝐭 𝐭𝐫𝐚𝐢𝐧, 𝐭𝐞𝐬𝐭 and 𝐯𝐚𝐥𝐢𝐝𝐚𝐭𝐢𝐨𝐧 datasets along match or period with the built in functionality.

3️⃣ 𝐈𝐦𝐩𝐨𝐫𝐭 and 𝐜𝐨𝐦𝐩𝐢𝐥𝐞 the pre-built 𝐂𝐫𝐲𝐬𝐭𝐚𝐥𝐆𝐫𝐚𝐩𝐡𝐂𝐥𝐚𝐬𝐬𝐢𝐟𝐢𝐞𝐫 (as detailed in the 2023 Sloan Sports Analytics Conference paper by Amod Sahasrabudhe and me), or design your own architecture from scratch.

4️⃣ Now, 𝐥𝐨𝐚𝐝 the Graphs using the Spektral DisjointLoader and 𝐟𝐢𝐭 the model.

5️⃣ Finally, 𝐞𝐯𝐚𝐥𝐮𝐚𝐭𝐞 and 𝐬𝐭𝐨𝐫𝐞 the model and use it to make 𝐩𝐫𝐞𝐝𝐢𝐜𝐭𝐢𝐨𝐧𝐬!

🌀 For complete Jupyter Notebook on how to execute all of the above steps and additional documentation check out the 𝐈𝐧-𝐝𝐞𝐩𝐭𝐡 [𝐖𝐚𝐥𝐤𝐭𝐡𝐫𝐨𝐮𝐠𝐡](https://github.com/UnravelSports/unravelsports/blob/main/examples/1_kloppy_gnn_train.ipynb) on GitHub or the [𝐐𝐮𝐢𝐜𝐤𝐬𝐭𝐚𝐫𝐭 𝐆𝐮𝐢𝐝𝐞](https://github.com/UnravelSports/unravelsports/blob/main/examples/0_quick_start_guide.ipynb).

🌀 𝐮𝐧𝐫𝐚𝐯𝐞𝐥𝐬𝐩𝐨𝐫𝐭𝐬==𝟎.𝟐.𝟎

🏈 This new version includes a converter specifically built for converting hashtag [#BigDataBowl](https://operations.nfl.com/gameday/analytics/big-data-bowl/) American Football positional data.

⚡ The American Football implementation is lightning fast because it runs on a Polars back-end!

🌀 Here is a [𝐁𝐚𝐬𝐢𝐜 𝐖𝐚𝐥𝐤𝐭𝐡𝐫𝐨𝐮𝐠𝐡](https://github.com/UnravelSports/unravelsports/blob/main/examples/2_big_data_bowl_guide.ipynb) of the new `AmericanFootballGraphConverter`. 

