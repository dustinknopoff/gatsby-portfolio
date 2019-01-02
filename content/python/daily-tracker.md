---
tag: python
title: Daily Tracker
link: https://gist.github.com/dustinknopoff/e63363836aedf54ffc50c71c0b57c73e
date: 2019-1-01
---

There are so many areas in the world where we are inefficient. It's something that increasingly bugs me with the growth of my knowledge and understanding. Specifically that there are so many places where I realize I could write something that would stop the repetition of a tedious task. This is what makes programming so powerful. But, there is another side, one which I had the opportunity to realize recently.

Programming is also incredibly capable of enriching aspects that were previously not. In this instance, I'm referring to a common practice of writing down daily ~10 questions and giving them a 1-10 or yes/no answer. This is often done on pen and paper. Unfortunately, there is no simple way to recognize any trends in this valuable data.

## The Daily Tracker

So, I decided to write something that would need to work on an iPhone, be simple, and not even necessarily require an internet connection. I originally tried using the Shortcuts app, which while excellent for asking and requesting answers to questions, iOS's sandboxing makes it difficult to pass it to some sort of visualization app. Additionally, I've always found the way they handle JSON/dictionaries unintuitive. Upon realizing Pythonista comes with `matplotlib` preinstalled, Python became the ideal choice.

It's a relatively simple program. Repeatedly asking for user input and saving to json files. The complex part was figuring out how to use `matplotlib` and how to offer multiple time ranges.

```python
def show_graph(freq, kv):
    plt.title('Scores')
    lst = []
    ln = 0
    for key in kv.keys():
        plt.subplot(111)
        if freq != 1000:
            ln = len(kv[key][:freq])
            mx = len(kv[key][:freq])
            rng = range(0, len(kv[key][:freq]))
            most = list(reversed(kv[key][:freq]))
        else:
            ln = len(kv[key])
            rng = range(0, len(kv[key]))
            mx = len(kv[key])
            most = list(reversed(kv[key]))
        for i in rng:
            lst.append((datetime.now() - timedelta(days=i)).strftime('%b, %d %Y'))
        x = np.arange(0, mx)
        y = np.array(most)
        plt.plot(x, y, label=key.replace("?", ""))
    plt.legend()
    plt.xticks(range(0, ln), list(reversed(lst)), rotation=45)
    plt.xlabel('Day')
    plt.subplots_adjust(bottom=0.23)
    plt.show()
    should_save = input("Would you like to save this graph?\n1) yes\n2) no\n")
    if should_save is '1':
        plt.savefig('latest.png')
```

## Limitations

At the moment, the program does not permit adding a new entry on the same day. However, there is no logging of the date an entry was added either. This means that the graph sees every day as contiguous regardless of whether that is true
