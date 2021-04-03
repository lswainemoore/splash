---
layout: post
title: (Missing?) Romney Votes in Philadelphia
date: 2016-08-18
---

## Background

Sean Hannity recently made some news by supporting Donald Trump's suggestions of election fraud. As the Philadelphia Inquirer [reported](http://www.philly.com/philly/blogs/real-time/Philly-elections-official-goes-off-on-Sean-Hannity.html) last Tuesday,

> On his show Friday, Hannity echoed Trump’s claims, and cited a 2012 Philadelphia Inquirer report saying “In 59 separate precincts in inner-city Philadelphia … Mitt Romney did not get a single vote, not one.”

In response to these allegations, an inspector of elections from Philadelphia named [Ryan Godfrey](https://twitter.com/rgodfrey) wrote a [series of tweets](https://twitter.com/rgodfrey/status/762400141366157315) debunking Hannity's argument. Not only would the type of fraud Hannity is describing be very [difficult](https://twitter.com/rgodfrey/status/762401978114682882), Godfrey argued, but also the election results were [plausible](https://twitter.com/rgodfrey/status/762404960395026432) given the demographics of the divisions with no Romney votes.

I read these tweets with interest, and found them fairly persuasive. But the argument that  interested me most was one that Godfrey made in a side conversation with another user [who questioned the likelihood](https://twitter.com/raincoatgirl_/status/763425616540467200) of 59 no-Romney divisions being pure happenstance. Godfrey [wrote](https://twitter.com/rgodfrey/status/763427590199795712):

> No Republicans voted in the 2012 primary in these divisions either. Why would that change in the general?

If true, this is pretty compelling. It would require quite some coordination to arrange general election fraud and primary fraud in concert, particularly given that primary results are, by their nature, released well ahead of the general election.  This sort of sophisticated scheme is particularly unlikely given that it would have been undermined by a rookie mistake: as Godfrey [points out](https://twitter.com/rgodfrey/status/762404107168669696),

> Why would they ever change \*ALL* R votes to D votes, when anybody who voted R could easily refute the results just by saying they had?


A few tweets later, Godfrey walked his claim  about the primary back slightly, [saying](https://twitter.com/rgodfrey/status/763433129872875520) he had "only checked like five". But he also included a link to the [Philadelphia City Commissioners website](http://www.philadelphiavotes.com/), and urged the doubtful user to "go for it." It's not clear that she took him up on the offer, but I decided to, because open data is fun!

## Data

Luckily, Philadelphia is great about providing election results. With very little difficulty, I was able to download vote counts broken down by candidate and division from the both the 2012 primary and general elections (to do so yourself, click the "Raw Data" tab on [this page](http://www.philadelphiavotes.com/en/resources-a-data/ballot-box-app)).

From there, it was as simple as reading the two .csv files into a [Pandas](http://pandas.pydata.org/) dataframe and playing around a bit with the data. If you'd like to see my work, I've attached my iPython notebook [here]({{base}}/ipython/philadelphia_analysis.html). I'd welcome some validation of my results! There are also some details on the analysis that I've skipped here that are included in the notebook.

## Results

#### A
Though neither Hannity nor the Philadelphia Inquirer article he was [drawing from](http://www.philly.com/philly/news/politics/178742021.html) seem to mention this, I don't think it's technically true that no votes for Romney were cast from 59 divisions. When I summed for each division all the votes cast via the three different "vote types" of "Absentee", "Machine", and "Provisional" (A, M, and P in the datasets, for those of you following along at home), I found only 50 divisions without a single Romney vote. It is my impression that the votes reported in these datasets were all counted (for more information on provisional votes, see [here](http://www.philadelphiavotes.com/en/voters/provisional-ballots)).

The 59 divisions figure shows up when counting machine votes alone, which is what I assume the Philadelphia Inquirer did. Ultimately, this may not be very relevant, given that I assume Hannity's point involves tampering with the voting machines, but I still think it's worth mentioning. In any event, I constrained my further analysis to Machine votes. Hereafter, any reference to votes and voters refers to those that used voting machines.

#### B
Godfrey's claim doesn't literally hold up across all 59 divisions. But I can see why it might be true in the first 5 divisions he tried, depending on how he accessed the results. Here's what I found when I matched up those 59 divisions to the machine-counted votes in the 2012 republican primary:

1.  In 30 of the 59 divisions, nobody voted in *any* Republican primary contest. It's a little hard to say how many unique voters voted in the other 29 divisions because votes are aggregated at the candidate level, but a given voter could vote in multiple contests.
2.  In 32 of the 59 divisions, nobody voted in the Republican *presidential* primary. The greatest number of voters in any particular division's Republican presidential primary was 4.
3.  In 52 of the 59 divisions, nobody voted for *Romney* in the Republican presidential primary. The greatest number of voters in any particular division's Republican presidential primary was 2.

I'd argue that Godfrey's statement is best interpreted as referring to any Republican primary contest (that is, the case I looked at in #1). Under this interpretation, I think he was mistaken. But I'd guess that when he was looking into this, he was looking at the Republican presidential primary results, because the [Philadelphia website](http://www.philadelphiavotes.com/en/resources-a-data/ballot-box-app) requires you to specify the contest when looking at results at the division level. The website also doesn't allow you to specify a particular candidate, so I think he was probably looking at #2. If so, his statement is probably still too broad, though 32 divisions is a good portion of 59, and at most 4 voters in the rest is very few.

## Discussion

Despite falling somewhat short of Godfrey's original assertion, the results, as I read them, don't support a rigged election.

Using result #3, it seems plenty plausible to me that in each of seven divisions, one or two Romney voters could have become disenchanted (or moved, or what have you) at some point between the primary and the general election.

Factoring in #2, it also seems plausible that in twenty other divisions where there were Republican presidential primary voters (though not for Romney), those voters could've been attached to their candidate and stayed at home for the general.

It's important to note that the numbers of divisions is about 1,686 or 1,687 (Godfrey [reported](https://twitter.com/rgodfrey/status/763430472764514305) the former in order to put 59 in perspective, while I found the latter, but no matter), so seven or twenty divisions is not so many in the scheme of things. Probably in some of those 1,500+ divisions the opposite phenomenon occurred. That is, I suspect that there are instances where no Republicans voted (for Romney or otherwise) in the presidential primary, but several voted for Romney in the general election. I haven't looked into this, but it might be worth doing so.

All this said, I don't imagine my mini-investigation will convince anyone that the 2012 election wasn't rigged. Nor should it necessarily. I haven't done any true hypothesis testing here. Maybe that's for a future post, although I would need to make some major assumptions about the distributions of voting behavior (as alluded to by user cSchaez [here](https://twitter.com/cSchaez/status/763435717603229696)).

But more importantly, there are plenty of other good reasons  not to suspect rigging (check out Godfrey's whole [series of tweets](https://twitter.com/rgodfrey/status/762400141366157315) for more of them).

Anyway, my objective here was not to convince. I was mainly interested in:

1. Verifying (out of my own personal curiosity more than anything else) Godfrey's claim about the 2012 primaries, which I found to be partially true though probably overstated, and
2. Brushing up on my Pandas skills, which I at least partially accomplished, with much help from Stack Overflow...

Please let me know if my results or analysis seem off, or if you find a mistake in my code!
