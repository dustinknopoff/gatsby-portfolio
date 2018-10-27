---
tag: rust
title: Documenting User Bash Functions - Round 2
link: https://github.com/dustinknopoff/bashdoc
date: Oct 26, 2018
---

When I make something like [bashdoc](../../rust/bashdoc/), once the idea and way to make it happen is in my head, I work on it over and over again until it's done. And when it's something like bashdoc which outputs

```
Help: .zshrc
sourcez: re-initialize .zshrc file
zshconfig: open .zshrc in VSCode
vimconfig: open .vimrc in vim
docs: shortcut to ~/Documents folder
svenv: activate virtual python environment
update: update Operating System, Brew, NPM, Applications, and Pip
cleanup: remove .DS_Store files from current directory
emptytrash: clean the trash
helpme: access cht.sh for help with commands and languages
cloud: shortcut to iCloud documents
notes: shortcut to exported Notes
gits: Shortcut to ~/Documents/Gits
csh: Shortcut to CCIS Servers
bip: Fuzzy search brew
allgits - msg: Git add, commit, and push
fs: Fuzzy file and directory search
	CTRL-C to copy file path to clipboard
	CTRL-N to make a new markdown file.
	CTRL-O to open with `open` command,
	CTRL-E or Enter key to open with the $EDITOR
	CTRL-S to search inside files
	CTRL-D to cd to directory of file
2mp4 - type: Convert from gif or webm to mp4 for all in current directory
gitrm - filename: Remove an unwanted watched folder
pygnore: Generate a .gitignore file for python projects
fbr: Fuzzy search git branches
fshow: Preview git tree
fstat: Show uncommitted files
gi - list: .gitignore file generator
setgit - giturl: Initialize a git directory
psman - cli: Open man page in Preview.app
fop: Fuzzy search 1Password
```

it sometimes feels like that you've put an almost excessive amount of effort in to something incredibly insignificant. Especially since this project was also a way to learn some Rust and it's always harder to get results when learning at the same time.

So, it becomes a question of how can I make this broader, more helpful either for a similar problem I have or for other people to use.

## Starting Simple

The original `bashdoc` was hardcoded to work with a `.zshrc` file in the root directory. So an easy transition is, "why not any file? Passed in as an argument maybe?" But because this was partially an excuse to learn Rust, the question also became "Can I somehow make this do stuff in parallel?" And the answer is _yes_. Pull in the crate `glob` and you get a list of files. Call `par_iter` from `rayon` and suddenly it's concurrent.

And more ideas come in:

- "Let me expand this into a `mod`, play around with that stuff."
- "Maybe I should make this more generic, exporting in json maybe?"
- "Why hardcode the delimiters? Make it like a config thing."
- "Play around with `clap`? Make it a genuine CLI."

you get the gist. It goes from a quick little script to a potentially monolithic project.

## What's New

```
.
├── Cargo.lock
├── Cargo.toml
├── README.md
├── cli.yml
├── example.sh
├── src
│   ├── doc_structure.rs
│   └── main.rs
```

`doc_structure.rs` now contains `Doc` and `AllDocs` renamed as `DocFile`s. Additionally, `colorize` and `printer` have been detached from `DocFile`s and instead taken in a reference `&DocFile`s.

## Make it Clappy!

`clap` is a crate for Rust for making building command line interfaces incredibly easy. You essentially define commands and arguments and it generates the help command, functions for checking the existence, flags, even shell completions. I made the decision to use the `load_yaml!` macro to keep things separate.

It looks something like this:

```yaml
about: 'Creates a "javadoc" like structure for bash. See github repo github.com/dustinknopoff/bashdoc for information on formatting.'
args:
  - color:
      help: "toggles color"
      long: color
      short: c
  - INPUT:
      help: "Sets the input file to use"
      index: 1
      required: true
  - directory:
      help: "pass a glob pattern to run on."
      long: directory
      short: d
  - json:
      help: "print result as JSON"
      long: json
      short: j
      takes_value: true
      value_name: FILE
author: "Dustin Knopoff"
name: bashdoc
version: "1.0"
```

_stored in a file cli.yml_

Pretty much self-explanatory. The key being there are args, with names, short and long, whether they are required and more.

## But Where's the Rust!?

```rust
extern crate clap;
use clap::{load_yaml, App};

fn main() {
    let yaml = load_yaml!("../cli.yml");
    let matches = App::from_yaml(yaml).get_matches();
}
```

**NOTE: Using `Rust v1.30` which allows importing of macros without using `#[macro_use]`**

Now you have a variable you can check for the existence of flags, etc.

## Implementing Globbed/Parallel generation of `DocFile`s

`clap` has the method `is_present()` which takes in the name of a flag. This makes it easy check for the presence of the `directory` flag from our `cli.yml`.

Utilizing the `if let` functionality in Rust, we can do something like this:

```rust
let all_em = if matches.is_present("directory") {
        start(
            matches.value_of("INPUT").expect("directory glob not found"),
            true,
        )
    } else {
        start(matches.value_of("INPUT").expect("no file found."), false)
    };
```

The function `start()` which returns a list of `DocFile`s contains the real meat of implementing our use of glob. The second argument for `start()` denotes whether to recognize INPUT as a glob pattern or as a file. It's important to understand the `yaml` of INPUT from before, let's look at it again:

```yaml
- INPUT:
    help: "Sets the input file to use"
    index: 1
    required: true
```

This means INPUT is required and is always the first argument passed in.

Knowing that, in `start()` if it's a directory we can call something like this:

```rust
extern crate rayon;
use rayon::prelude::*;

let files: Vec<_> = glob(&dir).unwrap().filter_map(|x| x.ok()).collect();
let every_doc: Vec<DocFile> = files
    .par_iter()
    .map(|entry| {
        let docs = get_info(&entry);
        generate_doc_file(
            &docs,
            entry.file_name().unwrap().to_str().unwrap().to_string(),
        )
	}).collect();
```

`generate_doc_file` is just a renamed version of the `generate_docs` function from before. It is the function that parses files into `DocFile`s of every `Doc` in a file.

## Interesting tidbit

Something that took a long time figure out was that you can't `extern crate ..` in a mod. You have to declare it in the main file and then can call the `use` statements within the mod.

## Gimme JSON

Implementing the return of json is pretty simple as well. It's effectively just importing `serde, serde_json, serde_derive` and adding `Serialize, Deserialize` to the `#[derive()]` above `Doc` and `DocFile`s. Then we create a function, `export_json()` that will look like this:

```rust
pub fn export_json(docstrings: &[DocFile], file_name: &str) {
    let json = serde_json::to_string_pretty(&docstrings).expect("Could not convert to JSON");
    let path_as_str = file_name.replace("~", home_dir().unwrap().to_str().unwrap());
    let path = Path::new(&path_as_str);
    let mut file = File::create(Path::new(&path)).expect("Invalid file path.");
    file.write_all(&json.as_bytes())
        .expect("Could not write to file.");
}
```

and `main()` gets:

```rust
if matches.is_present("json") {
    export_json(&all_em, matches.value_of("json").unwrap());
}
```

## Do Something Configging

The last piece I wanted to add was having some static delimiters that could be adjusted before running (aka a configuration file). With heavy inspiration from [ripgrep](https://github.com/BurntSushi/ripgrep), this function is called whenever delimiters are needed:

```rust
fn get_delims() -> Delimiters {
    let mut contents = String::new();
    match env::var_os("BASHDOC_CONFIG_PATH") {
        Some(val) => {
            let mut config = File::open(Path::new(&val)).expect("Invalid path");
            config
                .read_to_string(&mut contents)
                .expect("could not read from file.");
            let mut to_convert = String::new();
            to_convert.push_str(&contents);
            let sorted: Delimiters = toml::from_str(&to_convert.as_str()).unwrap();
            sorted
        }
        None => {
            let mut delimiters = Delimiters::default();
            let content =
                toml::to_string_pretty(&delimiters).expect("Could not be converted to TOML");
            let mut path = home_dir().unwrap();
            path.push(".bashdocrc");
            fs::write(path.to_str().unwrap(), content).unwrap();
            delimiters
        }
    }
}
```

with a new file called `.bashdocrc` looking something like:

```toml
start = "#;"
end = "#\""
params = "@param"
ret = "@return"
opt = "# -"
comm = "# "
```

and `export BASHDOC_CONFIG_PATH="${HOME}/.bashdocrc` being in a user's `.zshrc` or `.bashrc`.

## Wrapping it up

It was a fun project and I feel like I can actually use Rust to some degree now.
