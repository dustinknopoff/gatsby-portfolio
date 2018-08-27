---
tag: python
title: Best Apps Ever MPU
link: https://github.com/dustinknopoff/py-explore/blob/master/bestappsever-talk.py
date: Jun 21, 2018
---

Someone posted [this](https://talk.macpowerusers.com/t/what-is-your-favorite-app-ever/) wonderful question on Mac Power Users Forum asking what everyone’s favorite apps ever are. There was an incredible response of over 300 people. While it was interesting scrolling through reading each person’s explanations and lists of favorite apps, I wanted a broader, faster to digest version to understand. So, I figured it wouldn’t be hard to scrape all of the posts and then find the most frequently used words.

Unsurprisingly, it was a little more complicated than that.

## The Scraping Part

Discourse is one of many websites that has a different layout when JavaScript is not permitted. Most important was figuring out when to stop scraping pages for use but in such way that if more posts were added it would grab those as well. Luckily when there are no more posts, the html is very sparse and includes the statement:

> Oops! That page doesn’t exist or is private.

Even easier, all of the posts are contained within a `div` with the class “post”.

That leaves us with a pretty simple starting function:

```python
def get_all():
    allposts = []
    base = "https://talk.macpowerusers.com/t/what-is-your-favorite-app-ever/478?page="
    count = 1
    while 1:
        r = requests.get(base + str(count)).content
        soup = BeautifulSoup(r, 'html.parser')
        if 'Oops! That page doesn’t exist or is private.' in soup.h1.get_text():
            break
        else:
            soup = BeautifulSoup(r, 'html.parser')
            for post in soup.find_all("div", class_="post"):
                allposts.append(post.get_text())
        count += 1
    return allposts
```

## Tokenizing

Finding the most repeated words would have been very easy if there aren’t so many words that are repeatedly used in the English language. This means I had to use a Natural Language Parsing module to filter out what’s called stop words (“a”, “the”, etc.).

```python
def tokenize(alltext):
    all_words = nltk.tokenize.word_tokenize(alltext)
    all_word_dist = nltk.FreqDist(w.lower() for w in all_words)
    stopwords = nltk.corpus.stopwords.words('english')
    counter = Counter(w.lower() for w in alltext.replace('.', '').replace(',', '').replace("'", "").split()
                      if w not in stopwords and len(w) > 5)
    all_word_except_stop_dist = nltk.FreqDist(
        w.lower() for w in all_word_dist if w not in stopwords and len(w) > 5)
    most_common = all_word_except_stop_dist.most_common(40)
    return counter.most_common(100)
```

Even after all of that, the output is somewhat of a mess and doesn’t care whether the post was actually talking about their favorite app or if a poster repeated the use of an app name.

Output:

```
[('favorite', 47), ('1password', 40), ('really', 31), ('alfred', 30), ('drafts', 30), ('omnifocus', 27), ('things', 24), ('windows', 20), ('without', 19), ('workflow',19), ('always', 19), ('probably', 17), ('evernote', 16), ('second', 16), ('keyboard', 15), ('onenote', 15), ('program', 15), ('powerful', 15), ('overcast', 14), ('filemaker', 14), ('computer', 13), ('favourite', 13), ('system', 13), ('useful', 13), ('software', 12), ('textexpander', 12), ('devonthink', 12), ('writing', 11), ('there’s', 11), ('features', 11), ('that’s', 10), ('better', 10), ('maestro', 10), ('machine', 10), ('remember', 10), ('everything', 10), ('doesn’t', 10), ('however', 9), ('screen', 9), ('changed', 9), ('environment', 9), ('ulysses', 9), ('scrivener', 9), ('simple', 9), ('around', 9), ('terminal', 9), etc.
```

After finishing this, I grabbed the top 10 apps from the output and posted it to the forum like so:
    
| |App|Votes|
|---|---|---|
|1| 1Password | 37|
|2| Alfred | 28|
|3| Drafts | 26 |
|4|Omnifocus|23|
|5| Workflow | 17|
|6|Things|16|
|7|Evernote|14|
|8|Keyboard Maestro | 13|
|9| OneNote | 12|
|9| FileMaker | 12|
|9| Devonthink | 12|
|9| Overcast | 12|
|10|TextExpander|11|
