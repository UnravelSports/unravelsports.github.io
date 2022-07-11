## 🔬 Designing a Player ID Matching System

This blog came about as a reaction to a Twitter thread (see below) started by [@FC_rstats](https://twitter.com/FC_rstats). One of the ideas brought up in that thread and the discussion that followed (by [Sam Gregory](https://twitter.com/GregorydSam/status/1542109972791808000) and [Koen Vossen](https://twitter.com/mr_le_fox/status/1542112502489747456) was the creation of an (open-source) approach to Player ID matching across multiple data providers.

<blockquote class="twitter-tweet tw-align-center" data-theme="dark"><p lang="en" dir="ltr">Football analytics 💡:<br><br>People are building great open source packages but there is little to no coordination and therefore no interoperability<br><br>There needs to be a broader plan so these little lego peices naturally fit together <br><br>A broader plan can attract funding <br><br>Who&#39;s in?</p>&mdash; FC rSTATS (@FC_rstats) <a href="https://twitter.com/FC_rstats/status/1542106006209134592?ref_src=twsrc%5Etfw">June 29, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The initial intent of this blog was to discuss an implementation of a Player ID matching system (PMS) that I built a couple years ago that could hopefully help inspire the creation of an open-source approach for Player ID matching. While writing this blog I had some new ideas on how to improve my approach. So, as a result, this blog has become a hybrid of implementation ideas and actual implemented design. 

To build a robust PMS we need the player name (preferably first name & last name) or nickname (ie. Hulk or Ronaldinho) and date of birth (although this is not strictly necessary).
Because the ultimate goal is to do as little manual work as possible, and to improve the robustness of the PMS it's important to start by building systems for matching Team IDs (TMS), Game IDs (GMS) and Competition IDs (CMS) accross datasets.
These systems will help decrease the search space per player from several thousands to between 1 and 30 at most.

We'll first go over the basics of string similarity matching using [Cosine Similarity](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html) [(Wiki)](https://en.wikipedia.org/wiki/Cosine_similarity). Then I will discuss some design ideas for the CMS, GMS and TMS, followed by an explanation of the PMS.


### Basics of Similarity Matching
To do any kind of similarity matching we're going to make use of an approximate string matching technique. I propose the use of the Cosine Similarity to measure the similarity between sets of words (ie. the player or team names). I've also experimented briefly with a fuzzy matching algorithm [FuzzyWuzzy](https://pypi.org/project/fuzzywuzzy/), but I found the cosine similarity to give better results.

To properly use `cosine_similarity()`, and to ensure better matching, we're first going to standardize our set of names by:
1. [Removing any accents and using only letters from the Latin alphabet](https://stackoverflow.com/questions/45497312/how-to-apply-a-function-with-argument-to-a-pandas-dataframe)
2. [Removing any non-alphanumeric charaters, like dashes, using regex](https://stackoverflow.com/questions/1276764/stripping-everything-but-alphanumeric-chars-from-a-string-in-python)
3. [Removing double spaces using regex](https://stackoverflow.com/questions/43071415/remove-multiple-blanks-in-dataframe)
4. Lower case all characters

Then, we'll initialize a [Term Frequency–Inverse Document Frequency (or TF-IDF for short)](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) vectorizer and fit it to the complete set of names (for example all player names, or all team names). Because these TF-IDFs are normally used to describe amounts of text greater than two or three words, we'll initialize `TfidfVectorizer()` with a custom `analyzer` that will split the names up into _n_ letter "words". This will ensure we increase the "surface area" of our matching algorithm, by giving it more (partial) words to compare to. In my implementation _n_ = 3, thus turning names into 3 letter parts. We do this simply to weight frequently occuring (parts of) names lower. For example, when fitting the vectorizor on team names this means that "FC" will have a lower importance (due to its relatively high occurance frequency within a dataset of team names) compared to a "word" like "liv", "erp" and "ool" or "bar", "cel" and "ona" - the 3 letter _ngrams_ from Liverpool and Barcelona respectively.

```python
def ngrams(string, n=3):
	"""
	Chop names into 3 letter 'words' to try and make better fits
	"""
	string = re.sub(r'[,-./]|\s', r'', str(string))
	ngrams = zip(*[string[i:] for i in range(n)])
	return [''.join(ngram) for ngram in ngrams]
	
# initialize the vectorizer with a function ngrams that splits data into words of 3 letters
vectorizer = TfidfVectorizer(min_df=1, analyzer=ngrams)  
# fit on the whole dataset of standardized names available
vectorizer.fit(players) 
```

After fitting this vectorizer on the whole standardized name dataset, we use the fitted vectorizer to transform a subset of standardized names (we'll discuss what this subset is later) and finally we'll get our cosine similarity matrix for that subset. 

```python
# transform subset using vectorizer fit to whole dataset
tf_idf_subset_matrix = vectorizer.transform(subset)
# get cosine similarity vector
cosine_sim_matrix = cosine_similarity(tf_idf_subset_matrix, tf_idf_subset_matrix)
```

### Matching Competitions, Teams and Games
With this bit of similarity matching information out of the way we can start building our matching system. The matching system consists of four parts (competition, team, game and player). We'll build these parts in this order, because each new system depends on the previous system.

#### 1. Competition Matching
We start by matching competition names across datasets, depending on the amount of competitions available. This can be done either:
- Manually (with just a couple competitions it's overkill to build an algorithm for it)
- Semi-automatically, here we automatically match on a cosine similarity greater than a certain threshold\* and automatically disregard all matching options when the maximum cosine similarity doesn't go over a certain threshold.

_\*The threshold depends on the n in the ngrams function, becuase lower n results in higher cosine similarity overall_

Because it's important to have an accurate set of matches on the top level (in this case competitions) it's good to keep the automatic matching threshold low, or just do this step manually once or twice every season. 

##### 1.1 Season Matching
To get the correct amount of teams, and the correct team names per season we should also match the season IDs, but this can easily just be done by hand, or by some date range.

#### 2. Team Matching
Now that we have matched the competitions and seasons we can use the cosine similarity approach for team matching. Here we have the added benefit of filtering by competition name and season. This gives us a significantly reduced search space, going from thousands of options to approximately 20 per competition per season. In turn this means we can decrease the similarity threshold for automatic matching, or we can try some other approach where we assign each team in one dataset a team in another dataset via the Hungarian algorithm, maximizing the total cosine similarity in the cosine similarity matrix.

Below is some example code showing how to match two lists of Portuguese team names from the '21/22 season using the Hungarian algorithm (`linear_sum_assignment` in Scipy). These particular names come from [Clubelo.com](http://clubelo.com/POR) and [Transfermarkt.com](https://www.transfermarkt.com/liga-portugal/startseite/wettbewerb/PO1/plus/?saison_id=2021). 

```python
from scipy.optimize import linear_sum_assignment
import numpy as np

ce_teams = ['porto', 'sporting', 'benfica', 'braga', 'guimaraes', 'gil vicente', 'santa clara', 'famalicao', 'boavista', 'pacos ferreira', 'maritimo', 'portimonense', 'moreirense', 'estoril', 'belenenses', 'vizela', 'tondela', 'arouca']
tm_teams = ['fc porto', 'sporting cp', 'sl benfica', 'sc braga', 'vitoria guimaraes sc', 'fc famalicao', 'boavista fc', 'portimonense sc', 'gd estoril praia', 'cd santa clara', 'gil vicente fc', 'fc pacos de ferreira', 'cd tondela', 'belenenses sad', 'moreirense fc', 'fc vizela', 'fc arouca', 'cs maritimo']

vectorizer = TfidfVectorizer(min_df=1, analyzer=ngrams)  
vectorizer.fit(teams)  # fit the vectorizer on all teams

tfidf_clubelo = vectorizer.transform(ce_teams)
tfidf_tm = vectorizer.transform(tm_teams)

cosine_sim_matrix = cosine_similarity(tfidf_clubelo, tfidf_tm)

row_idx, col_idx = linear_sum_assignment(
    cost_matrix=cosine_sim_matrix,
    maximize=True
)
```

Here are the results in a cleaned up table with the matched names side-by-side and the and their cosine similarity values.

<div class="table>
	<table>
		<div class="table-header">
			<tr>
				<td>ce_teams</td>
				<td>tm_teams</td>
				<td>cosine_similarity </td>
			</tr>
		</div>
		<tr>
			<td>arouca</td>
			<td>fc arouca</td>
			<td>0.86 </td>
		</tr>
		<tr>
			<td>belenenses</td>
			<td>belenenses sad</td>
			<td>0.826 </td>
		</tr>
		<tr>
			<td>benfica</td>
			<td>sl benfica</td>
			<td>0.805 </td>
		</tr>
		<tr>
			<td>boavista</td>
			<td>boavista fc</td>
			<td>0.882 </td>
		</tr>
		<tr>
			<td>braga</td>
			<td>sc braga</td>
			<td>0.719 </td>
		</tr>
		<tr>
			<td>estoril</td>
			<td>gd estoril praia</td>
			<td>0.533 </td>
		</tr>
		<tr>
			<td>famalicao</td>
			<td>fc famalicao</td>
			<td>0.847 </td>
		</tr>
		<tr>
			<td>gil vicente</td>
			<td>gil vicente fc</td>
			<td>0.892 </td>
		</tr>
		<tr>
			<td>guimaraes</td>
			<td>vitoria guimaraes sc</td>
			<td>0.678 </td>
		</tr>
	</table>
</div>

The small caveat to this approach is matching team names across more than two datasets can be a bit more involved.

#### 3. Game Matching
With the team names matched up it now becomes really easy to match fixtures. We can do this by creating a new Game ID (GMS ID) that is a combination of the Home Team TMS ID (the newly created team ID we assigned to every matched set of teams), the Away Team ID TMS ID and the timezone adjusted date of the match. If we do not have the timezone date, but only the date, it's still possible to do this, if we work under the assumption that no two teams will play each other more than once per 48 hours. 

### Matching Players
Now that we've discussed the prerequisit systems that will help us reduce the search space, we can finally discuss the design of the actual Player Matching System.
The main objective should be to leverage the TMS (and potentially the GMS) to drastically reduce the search space, increase accuracy, and decrease false positive matches for each player by creating a matching funnel. This matching funnel will match players by a set of rules decreasing in strictness. 

Using the Hungarian algorithm in the PMS was not in my initial design (neither was it for the TMS), and because of possible differences in number of players given per data source (ie. some source might have 32 players for a squad whereas others might only have 25 for the same team) I don't see a straightforward way to use it in the PMS.

Before describing how we're going to levarege everything discussed before to build our matching funnel we need to take note of two potential data issues, and one idea I have not implemented in my design that might prove be helpful.

##### Wrong Birthdays
One important issue, that is easy to overlook in a name matching system, is wrong birthdays. From debugging my own implemenation I've noticed erros in birthdays can be simple typos, a translation error from MM-DD-YY to DD-MM-YY or they might just be a day of, for whatever reason.
This means that we will need to handle cases where birthdays are approximately correct by specifying a date of birth range. From some trial and error I've found that adding the following dates to the date of birth range will help improve matching:
- The original birth date
- The date with +1 or -1 for the month, but within the same year
- The date within +10 and -10 for the day, but within the same month
- The inverted date format if it exists (MM-DD-YY, if all our dates are assumed to be DD-MM-YY)

We will not adjust the year, for fear of matching too many false positives.

##### Nicknames
The second issue worth discussing is how every data provider uses their own judgement for using nicknames, full names or a combination of both. (It's highly adviced to add both nickname and full name to the matching system when both are provided). 

In my initial implementation this issue was resolved by using a Python package called `gsearch` which let me search Google via Python with a query like `f"{player_name} (footballer) wiki (date_of_birth)"`. This google search would almost always - 99% of the time, even for obscure players - give us the Wikipedia article for the player. Using the Wikidata Q-code of the article - which we could obtain with a simple web request -  could then match up search queries like "Ronaldo de Assis Moreira (footballer) wiki 03-21-1980" and "Ronaldinho (footballer) wiki 03-21-1980", because they both link to the same Wikidata page with Q-code [Q39444](https://www.wikidata.org/wiki/Q39444). Eventhough this seems quite cumbersome - and it probably was - while trying to replicate this for this blog I found that the `gsearch` package doesn't quite work anymore. To get similar results you'd need to get a paid Google Search API Key. As an aside, you can find the Wikidata page for any Wikipedia article in the left menu on Wikipedia under "Tools".

Luckily, I think there is an easier and faster way now that either wasn't available, or I probably just didn't find it back then, using a combination of `search` and `page` from the [Wikipedia Python package](https://pypi.org/project/wikipedia/). This combination will give us a Wikipedia page's `pageid` that we can use to identify identical players that came about from different search terms.

Unfortunately, I have not done thorough testing on this and simply grabbing only the first result might not work for more obscure players.

Below is some sample code trying to find the `pageid` for Ronaldinho, Hulk and Yago Pikachu. It works, even with wrong date of birth values.

```python
import wikipedia

def search_footballer(player_name, date_of_birth):
    query = f"{player_name} (footballer) {date_of_birth}"
	
    term = wikipedia.search(query, results=1, suggestion=False)[0]
    page = wikipedia.page(term, preload=False)  # set preload to False to improve speed
    return page.pageid

search_footballer(player_name="Ronaldinho", date_of_birth="03-21-1980")
search_footballer(player_name="Ronaldo de Assis Moreira", date_of_birth="03-21-1980")

search_footballer(player_name="Hulk", date_of_birth="07-25-1986")
search_footballer(player_name="Givanildo Vieira de Sousa", date_of_birth="07-24-1986")  # wrong date of birth

search_footballer(player_name="Yago Pikachu", date_of_birth="06-05-1992")
search_footballer(player_name="Glaybson Yago Souza Lisboa", date_of_birth="05-06-1992")  # wrong date of birth
```

It's safe to say that finding nickname and regular name matches this way can be time consuming (it takes about 700ms to get a result back from Wikipedia with the above code), so this approach should be used when we have players in the same team with the same data of birth (range) that are no simple match.

##### Hypocoristics
An idea that I have not implemented is using hypocoristics. Hypocoristics are - and this comes straight from Google - "a pet name, nickname, or term of endearment — often a shortened form of a word or name". For example, Micheal might be called Mike or Robert might be called Bob. This happens in a lot of languages and our PMS should probably incorporate this. For now, I've only found lists of hypocoristics in English, Spanish and Portuguese, though I have no way of knowing if they are actually correct and/or useful.

#### The PMS Funnel
Using combinations of the ideas discussed above we can construct a search funnel that will help us match players to one another with minimal risk of false positives.
Below is a list of some of the options we have for matching player names. I've also highlighted some potential matching mechanisms that might more easily result in false positive matches, because we use too much incomplete information.

1. Match on exact name, exact date of birth and TMS ID of a team this player played for in both datasets.
2. Match on exact name & exact date of birth (maybe we don't have data from the same seasons for a particular player)
	- This can introduce some errors when two different players exists with same name and date of birth
3. Match on exact name & TMS ID when no date of birth is available
	- This can introduce some errors when two players with the same name on the same team have no date of birth, but we can try to resolve this using an exclusive GMS search.
4. Match on approximate name (cosine similarity above certain threshold), exact date of birth and TMS ID
5. Match on approximate name (cosine similarity above certain threshold - higher than in point 4), date of birth range and TMS ID
6. Match on approximate name (cosine similarity above certain threshold - higher than in point 5) and date of birth range 
	- This can introduce some errors when two players exists with same name and date of birth
7. Match on approximate name (cosine similarity above certain threshold - higher than in point 6) and TMS ID
8. Match on Wikipedia search for name and date of birth when two players with same TMS ID have the same date of birth range
	- This can introduce some errors because we are "blindly" following the Wikipedia API results

### Conclusions
It's safe to say that building the actual code capable of doing all of this in a correct, effective and efficient way - all while juggling different sets of matched and unmatched player IDs, new incoming providers and new IDs - is a huge undertaking. I can only hope this blog has provided some clarity, some ideas and some insights into how to design a Player ID Matching System.











