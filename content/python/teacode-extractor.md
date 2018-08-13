---
tag: python
title: TeaCode Previewer
link: https://github.com/dustinknopoff/teacodebundles
date: Jul 28, 2018
---

This was an attempt to allow previewing of TeaCode bundles/snippets outside of the app.

Within TeaCode using the syntax `> {expander}` one can see examples of using an expander. Likewise, a raw `.tcbundle` file looks something like this
```JSON
{
  "description" : "Commonly Used Python Expansions\n\nMade by [twitter] @dustinknopoff",
  "name" : "Python",
  "expanders" : [
    {
      "name" : "Function",
      "is_enabled" : true,
      "description" : "Creates default function statement.\n> fn do arr\n\n\n> fn do",
      "supported_languages" : [
        "python"
      ],
      "pattern" : "fn ${name:word}| ${params:text?}|",
      "output_template" : "def ${name.snakecase}(|${params.snakecase}|):\n\t#",
      "identifier" : "fn"
    },
    // etc.
```

Very portable but necessarily easily human readable.

In attempting to create a previewer, I contemplated creating a parser and or regex engine to read patterns. By looking at TeaCode’s Sublime plugin I was able to figure out it uses an AppleScript to invoke expanders. 

```py
 # Run TeaCode Expander and add output to string
script = "Application('TeaCode').expandAsJson('{text}', {{ 'extension': '{extension}' }})".format(
                        text=string,
                        extension=typer)
                    command = ["osascript", "-l", "JavaScript", "-e", script]
session = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
stdout, stderr = session.communicate()
```

This was also one of the few Python scripts I’ve written using the `glob` module. This ensures a preview generated for all `tcbundles`.
