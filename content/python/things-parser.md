---
tag: python
title: Things 3 Parser
link: https://github.com/dustinknopoff/tparse
date: June 12, 2018
---

This was my attempt at porting [@pdavidsonreiler](https://github.com/pdavisonreiber/Public-Drafts-Scripts/tree/master/Things%20Parser) natural language parser in Drafts 5 for Things 3 to Python. I was curious about how it was done and about bringing that functionality to the Mac.

## Figuring it all

It was never more apparent to me how different JavaScript and Python can be then when attempting to understand [@pdavidsonreiler](https://github.com/pdavisonreiber/Public-Drafts-Scripts/tree/master/Things%20Parser) code. There are so many places where values can be inherited and mutated in JavaScript that simply don't exist in Python. In the end, I decided it would be better to use [@pdavidsonreiler](https://github.com/pdavisonreiber/Public-Drafts-Scripts/tree/master/Things%20Parser)'s parser as a launch point and not as a source of truth. This introduced me to a neat little function where one can split a string and include the delimiter.

```python
@staticmethod
    def __split_before(pattern, text) -> List[str]:
        """
        Found on stack overflow: splits text before delimiter is found
        :param pattern: a valid regex pattern
        :param text: text to compare to.
        """
        prev = 0
        for m in re.finditer(pattern, text):
            yield text[prev:m.start()]
            prev = m.start()
        yield text[prev:]
```

I also discovered the insane number of python modules for parsing dates. I must have gone through 6 different parsers all which fail on certain strings passed in or which didn't return the location of the parsed date (I needed to remove the date from the string).

There were a couple of lines in [@pdavidsonreiler](https://github.com/pdavisonreiber/Public-Drafts-Scripts/tree/master/Things%20Parser)'s parser which were originally very confusing at no fault to [@pdavidsonreiler](https://github.com/pdavisonreiber/Public-Drafts-Scripts/tree/master/Things%20Parser). This was because he used Drafts 5's wrappers for Callback URLs and Things 3 API. It took many google searches to come to this conclusion. These wrappers also seemed to be a good way to separate my 3 main concerns:

1.  Parse information
2.  Make it compatible with Things API
3.  Send it

### Things Wrapper

[ThingsJSONCoder.py](https://github.com/dustinknopoff/tparse/blob/master/tparse/thingsJSONCoder.py) was the first script where I've used `**kwargs`. In the original [ThingsJSONCoder](https://github.com/culturedcode/ThingsJSONCoder) written in Swift, there is a heavy use of optional strings (`String?`), something which I don't believe is possible in Python. So, I allowed any dictionary of data to be passed in, compare to a list of valid keys and only keep the valid ones. This is the main technical difference.

### Callback URL

One of the key aspects I spent hours slaving over was the fact that encoding the result was not accepted by Things as valid JSON. It took days for me to realize that in Python's `urllib`, the ':' and ' ' characters are encoded differently from Swift/Things.

## Make it CLI-ey

It turns out it's pretty simple to make a decent CLI interface for interacting with python tools.

```python
argsparsed = argparse.ArgumentParser(description='Natural Things Parser:')
    argsparsed.add_argument('-f', '--file', help='Next argument needs to be a valid file path', type=str)
    argsparsed.add_argument('-c', '--clip', help='tparse will extract text from clipboard', action='store_true')
    argsparsed.add_argument('-t', '--test', help='tparse will use some sample test strings.', action='store_true')
```

## Setup.py

Another avenue filled with difficulties was figuring out just how to make a module pip-able. Setting the directory just right and the right parameters was a long process of trial and error. [This was invaluable help](https://the-hitchhikers-guide-to-packaging.readthedocs.io/en/latest/quickstart.html)

In the end, I'm not even entirely sure that `tparse` (the name I chose) actually works. Yet, I feel satisfied in what I was able to learn in terms of making a python module distributable and understanding/building on top of another's code.
