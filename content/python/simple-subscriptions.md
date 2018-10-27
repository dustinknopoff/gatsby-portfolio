---
tag: python
title: Simple Subscriptions
link: https://github.com/dustinknopoff/py-explore/blob/master/subscriptions.py
date: 2018-07-20
---

Inspired by [Bobby](http://www.bobbyapp.co), I wanted to make a very simple subscription tracker in the terminal.

The result is a simple output like so:

```
#     Subscription            Cost             Frequency
# ============================================================
#         Bear               $15.99                1
#        Sketch              $50.00                1
# ============================================================
#        Total:              $65.99            (per year)
```

with an add and delete command.

The data is loaded and saved to a json file on every run.
