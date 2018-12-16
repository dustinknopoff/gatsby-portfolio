---
tag: rust
title: Bashdoc - Round 1
link: https://github.com/dustinknopoff/bashdoc/tree/v0.0.5
date: 2018-10-24
---

I believe there is a moment where all developers discover how powerful and efficient mastering the command line is. When using Finder or actually clicking on things or moving the mouse seems like so much extra work. Vim is an excellent example of this. Once you immerse yourself in the syntax of vim, if you go back to a GUI editor it feels like immense effort to actually click to go to the end of a line or the end of a document.

Along the way, you start to discover different tools and perhaps find some bash functions that you think will be incredibly useful. Eventually you have a `.bashrc` or `.zshrc` that has so much stuff you can't even remember what's what. I reached this point a couple months ago and manually created my own help function

```bash
myhelp() {
  help="
  \e[92m\e[4mAliases\e[0m
  ------
  \e[94m\e[1msourcez\e[0m: re-initialize .zshrc
  \e[94m\e[1mzshconfig\e[0m: open .zshrc in VSCode
  \e[94m\e[1mserve\e[0m: serve current directory from a port
  \e[94m\e[1mdocs\e[0m: shortcut to ~/Documents folder
  \e[94m\e[1msvenv\e[0m: activate virtual python environment
  \e[94m\e[1mupdate\e[0m: update Operating System, Brew, NPM, Applications, and Pip
  # etc.
```

This was tedious especially since I wanted it to be wonderfully colorful.

Eventually I decided that I needed to have some way of making this process automatic. I loved being able to type `$ myhelp` and getting quick understanding of all of my available aliases and functions but if I ever changed them or added a new one this wasn't reflected in the actual function.

# Brainstorming

The first thought I always have when potentially creating a new tool for myself is to check and see if someone has already done it. Searching `bash docstrings` or something similar yields a couple results none of which were what I was looking for.

Eventually, I sat down with [Durwasa](https://durwasa-chakraborty.github.io) and we were able to clearly define a way to make this work.

## Key Parts

The final program is essentially a homegrown `javadoc`/`docstring` type functionality for bash scripts. An essential part was defining what would start and end a _doc-string_. Since, we have no access to the actual evaluation/parsing of the bash script, these _doc-strings_ would need to still be a valid document. We landed on using `#;` as a starting delimiter and `#"` to end. This then allows us to search through every line in a file and recognize the exact lines that makeup a _doc-string_. We decided to utilize the syntax from `javadocs` for return and parameters: `@param`, `@return`.

This leaves us with _doc-strings_ that look something like this

```bash
#;
# cd()
# moves to given directory
# @param directory: folder to move to
# @return void
#"
cd() {
    cd $1
}
```

Inspired by [this](https://stackoverflow.com/questions/22212470/parsing-function-docstring-in-sphinx-autodoc-format) stack overflow post, I was keen to have return and parameter values be a map of their `name:description`.

## The Code

These _doc-strings_ are represented by the struct `Doc`

```rust
pub struct Doc {
    short_description: String,
    long_description: String,
    descriptors: HashMap<String, String>,
    params: HashMap<String, String>,
    returns: HashMap<String, String>,
}
```

and for readability, all of the _doc-strings_ in a file are represented by the struct `AllDocs`

```rust
pub struct AllDocs {
    thedocs: Vec<Doc>,
}
```

### The Flow

Starting with a function `get_info()`, the program gets the file (at this point a static path of `.zshrc`) and loops through all of it's lines.

```rust
pub fn get_info() -> Vec<Vec<String>> {
    let mut p = dirs::home_dir().unwrap();
    p.push(".zshrc");
    let f = File::open(&p).unwrap();
    let f = BufReader::new(f);
    let mut result: Vec<Vec<String>> = Vec::new();
    result.push(Vec::new());
    let mut can_add = false;
    let mut index = 0;
    for line in f.lines() {
        let curr_line = line.unwrap();
        if curr_line.contains(START_DELIM) {
            can_add = true;
            continue;
        } else if curr_line.contains(END_DELIM) {
            can_add = false;
            index += 1;
            result.push(Vec::new());
        }
        if can_add {
            if curr_line.contains(OPT_DELIM) {
                result[index].push(curr_line);
            } else {
                result[index].push(curr_line.replace(COMM_DELIM, ""));
            }
        }
    }
    result
}
```

A pretty simple flow, essentially checking to see if the line contains the delimiters we're looking for. The `can_add` boolean stems from the start and end delimiters acting as _sentinels_ for the data we actually want to collect.

To convert these lines into usable data, we have a method `Doc::make_doc()` which will build a Doc from the default (new, empty Strings and HashMaps). Essentially, using whitespace and delimiters for parameters and returns to place them in their corresponding fields.

```rust
impl Doc {
    pub fn make_doc(vector: &[String]) -> Doc {
        let mut result: Doc = Default::default();
        for line in vector.iter() {
            if line == &vector[0] {
                result.short_description.push_str(line);
            } else if line.contains(PAR_DELIM) {
                let splitted: Vec<_> = line.split_whitespace().map(|x| x.to_string()).collect();
                let rest: String = splitted[2..].join(" ");
                result.params.insert(splitted[1].replace(":", ""), rest);
            } else if line.contains(RET_DELIM) {
                let splitted: Vec<_> = line.split_whitespace().map(|x| x.to_string()).collect();
                let rest: String = splitted[2..].join(" ");
                result.returns.insert(splitted[1].replace(":", ""), rest);
            } else if line.contains(OPT_DELIM) {
                let splitted: Vec<_> = line.split_whitespace().map(|x| x.to_string()).collect();
                let rest: String = splitted[3..].join(" ");
                result
                    .descriptors
                    .insert(splitted[2].replace(":", ""), rest);
            } else {
                result.long_description.push_str(line);
            }
        }
        result
    }
}
```

We essentially have the data structure we need. With our previous example,

```bash
#;
# cd()
# moves to given directory
# @param directory: folder to move to
# @return void
#"
cd() {
    cd $1
}
```

we would receive a `Doc`:

```js
Doc {
    short_description: "cd()",
    long_description: "moves to given directory",
    descriptors: {},
    params: {
        "directory": "folder to move to"
    },
    returns: {
        "void": ""
    }
}
```

## The Final Step

Make it pretty! Using the [colorize](https://crates.io/crates/colorize), we can organize our data structure into a colorful, helpful _help_ command for our bash functions.

```rust
impl AllDocs {
      pub fn colorize(&self) -> () {
        println!("{}", "Help".green().underline());
        for doc in &self.thedocs {
            let mut params: Vec<_> = doc.params.keys().map(|x| x.to_string()).collect();
            let as_string = params.join(", ");
            print!("{}", doc.short_description.replace("()", "").blue().bold());
            if doc.params.is_empty() {
                println!(": {}", doc.long_description);
            } else {
                println!(" - {}: {}", as_string.cyan(), doc.long_description);
            }
            if !doc.descriptors.is_empty() {
                for sub in doc.descriptors.keys() {
                    println!("\t{} {}", sub.yellow().bold(), &doc.descriptors[sub])
                }
            }
        }
    }
}
```

> Read the [part 2](../bashdoc2).
