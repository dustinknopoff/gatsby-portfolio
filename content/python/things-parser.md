---
tag: python
title: Things 3 Parser
link: https://github.com/dustinknopoff/tparse
date: 7-12-2018
---

[@pdavidsonreiler](https://github.com/pdavisonreiber/Public-Drafts-Scripts/tree/master/Things%20Parser) created a natural language parser in Drafts 5 for Things 3. I was curious about how it was done and about bringing that functionality to the Mac.

The first, and hardest step in porting another person's code to another place is understanding what they're doing and the organization of their code. This is especially confusing with things like

```js
var myTJSContainer = TJSContainer.create(items);
```

or

```js
var callback = CallbackURL.create();
```

sprinkled throughout the codebase. It turns out these are Drafts 5 wrappers for the Things API and Callback URLs. I decided it was easier to port these to Python as well.

## Things Wrapper

[ThingsJSONCoder.py](https://github.com/dustinknopoff/tparse/blob/master/tparse/thingsJSONCoder.py) was the first script where I've used `**kwargs`. In the original [ThingsJSONCoder](https://github.com/culturedcode/ThingsJSONCoder) written in Swift, there is a heavy use of optional strings (`String?`), something which I don't believe is possible in Python. So, I allowed any dictionary of data to be passed in, compare to a list of valid keys and only keep the valid ones. This is the main technical difference.

## Callback URL

One of the key aspects I spent hours slaving over was the fact that encoding the result was not accepted by Things as valid JSON. It took days for me to realize that in Python's `urllib`, the ':' and ' ' characters are encoded differently from Swift/Things.
