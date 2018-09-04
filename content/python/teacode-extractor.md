---
tag: python
title: TeaCode Previewer
link: https://github.com/dustinknopoff/teacodebundles
date: Jul 28, 2018
---

In the slack channel for TeaCode, there is a channel `#expanders` where people can share there expanders. These come in `.tcbundle` files which look something like this:

```js
  "expanders" : [
    {
      "name" : "Function",
      "is_enabled" : true,
      "description" : "Creates default function statement.\n> fn do arr\n\n\n> fn do",
      "supported_languages" : [
        "Python"
      ],
      "pattern" : "fn ${name:word}| ${params:text?}|",
      "output_template" : "def ${name.snakecase}(|${params.snakecase}|):\n\t#",
      "identifier" : "fn"
    },
```

It’s quite portable and easy to read and understand. It is however, not as easy to understand what the expander will actually do when used. This is where the idea create a Markdown version of the descriptions of TeaCode expanders came to mind. In TeaCode entering `> {expander}` will show the expander and it’s output.

## Figuring it out

Originally, the plan was to write a simple regex/delimiter parser for the `pattern` and `output_template` but would have been incredibly complex and definitely seemed beyond what was necessary. On a whim, I’d decided to see how the developer had made the Sublime Text plugin (which is also in Python), it turned out that the returned output is received through an Applescript call.

## Organization

Following the design of TeaCode bundles, my code is split into Bundles and Expanders.

The `Bundle` class takes in a `.tcbundle` file and creates a string with a title of the extracted name, subtitle of the description and then passes all expanders to be represented by the `Expander` class.

```python
class Bundle:
    def __init__(self, file):
        self._content = json.load(file)
        self._name: str = self._content['name']
        self._description: str = self._content['description']
        self._expanders = self._content['expanders']

    def to_md(self) -> str:
        out = ''
        # H1 Header for Bundle name
        out += f'# {self._name}\n\n'
        # H2 header for description
        out += f'## {self._description}\n\n'
        # For every expander in this bundle
        for expander in self.__render_expanders():
            # If the expander is not empty, add formatted too
            if expander is not None:
                out += expander + '\n\n'
        return out

    def __render_expanders(self):
        result = []
        for expander in self._expanders:
            expand = Expander(expander)
            result.append(expand.to_md())
        return result
```

The `Expander` class then creates another string formatted for markdown including the name. The description is then checked for `> {expander}` and runs the Applescript call adding both to the output string as code snippets. The final string is then sent back and added to the Bundle’s output string.

````python
class Expander:
    def __init__(self, dictionary):
        self.name: str = dictionary['name']
        self.description: str = dictionary['description']
        self.langs = dictionary['supported_languages']
        self.pattern = dictionary['pattern']
        self.output = dictionary['output_template']
        self.id = dictionary['identifier']

    def __render(self):
        # Split description on newline
        possibles = self.description.split('\n')
        # Get the first language this Expander works with
        try:
            typer = self.langs[0]
        except IndexError:
            typer = ''
        usable = []
        # For all lines in description
        for string in possibles:
            try:
                # Check that it would show output in TeaCode
                if string[0] is '>':
                    # Remove '>' (means something different in md)
                    string = string[1:]
                    # Run TeaCode Expander and add output to string
                    script = "Application('TeaCode').expandAsJson('{text}', {{ 'extension': '{extension}' }})".format(
                        text=string,
                        extension=typer)
                    command = ["osascript", "-l", "JavaScript", "-e", script]
                    session = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                               universal_newlines=True)
                    stdout, stderr = session.communicate()
                    # print(stdout)
                    try:
                        temp = json.loads(stdout)
                    except json.JSONDecodeError:
                        continue
                    # Format as code and code blocks
                    usable.append(f'`{string}`\n\nwill render:\n')
                    usable.append(f'```{typer}\n{temp["text"]}\n```')
                else:
                    # If the line is not a expander example, make it a blockquote
                    if string is not '':
                        usable.append(f'> {string}')
            except IndexError:
                continue
        return usable

    def to_md(self):
        result = ''
        values = self.__render()
        print(f"\t{self.name} expander.")
        result += f"### {self.name}\n\nDescription:\n\n"
        for string in values:
            result += string + '\n\n'
        if len(self.langs) > 0:
            result += f'Languages: {self.langs}\n\n'
        return result
````

## Do ‘em all

~~Using the `glob` module, this is run on every `.tcbundle` in the directory.~~

All bundles are stored in a file called `bundles.tcbundle` in the Application Support folder for TeaCode. Therefore, instead of exporting all Bundles and running this script, I decided to pull the bundles from that file.

```python
if __name__ == '__main__':
    try:
        path = os.path.expanduser('~/Library/Application Support/com.apptorium.TeaCode-dm/bundles.tcbundles')
    except FileNotFoundError:
        path = os.path.expanduser('~/Library/Application Support/com.apptorium.TeaCode-setapp/bundles.tcbundles')
    with open(path, 'r') as f:
        stuff = json.load(f)
        for bund in stuff['bundles']:
            bundle = Bundle(bund)
            with open(f'./{bund["name"]}.tcbundle', 'w+') as tcout:
                json.dump(bund, tcout, indent=4)
            with open(f'./{bund["name"]}.md', 'w+') as mdout:
                mdout.write(bundle.to_md())
    print("Success!")
```

#### Update

After using this script every couple new expanders I've made, I realized it was incredibly unnecessary to recreate every single file. Instead, if there is a change detected, only that Bundle is re-rendered in Markdown. Additionally, with more and more expanders in a single Bundle, I realized a Table of Contents would be very convenient. So, it's there now. The link below will always have the most current version.
