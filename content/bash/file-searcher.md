---
tag: bash
title: Directory and File Searcher
link: https://gist.github.com/dustinknopoff/d01011beaf8b4248e5f39abd2396d040
date: Aug 21, 2018
---

Since my discovery of [fzf](https://github.com/junegunn/fzf) and [ripgrep](https://github.com/BurntSushi/ripgrep), I've been searching for a way to have a single place to search files and their contents easily. Over 3 months later, I found this snippet as an example in the README for `fzf`.

```bash
# Modified version where you can press
#   - CTRL-O to open with `open` command,
#   - CTRL-E or Enter key to open with the $EDITOR
fo() {
  local out file key
  IFS=$'\n' out=($(fzf-tmux --query="$1" --exit-0 --expect=ctrl-o,ctrl-e))
  key=$(head -1 <<< "$out")
  file=$(head -2 <<< "$out" | tail -1)
  if [ -n "$file" ]; then
    [ "$key" = ctrl-o ] && open "$file" || ${EDITOR:-vim} "$file"
  fi
}
```

This acheived one aspect I was looking for which was opening into an editor on selection. This inspired me to push to make the last part. I have a feeling it isn't the most elegant solution, but it works.

```bash
infile() {
  # rg "$1" | fzf --height 40% | xargs -0 python -c "import re;import sys;arr=sys.argv;string=' '.join(arr);print(re.findall(r'(?<=-c ).*(?=:)',string)[0].replace(' ', '\ ').replace('&', '\&'))" | xargs -0 -I {} /bin/zsh -c "echo '$(pwd | sed -e 's/ /\\ /g')/{}'" | xargs -0 -I {} /bin/zsh -c 'code {}' - Old version
  rg "$1" | fzf --height 40% | sed 's/:.*$//g' | sed 's/ /\\ /g' | sed 's/&/\\&/g' | xargs -0 -I {} /bin/zsh -c 'code {}' # Much cleaner version
}
```

`notes()` runs ripgrep on the input and pipes it through fzf. Upon selection, the selection is parsed for it's file path and sent to my preferred markdown editor.

I then modified `fs` to recognize `ctrl-w` as a command to send to `infile()` and `ctrl-p` as a command to copy the file path to the clipboard.

```bash
# Modified version where you can press
# - CTRL-O to open with `open` command,
# - CTRL-E or Enter key to open with the $EDITOR
# - CTRL-W to search inside files
# - CTRL-P to copy file path to clipboard
# - CTRL-D to cd to directory of file
fs() {
  local out file key
  IFS=$'\n' out=($(fzf -i --preview="pygmentize -g {}" --query="$1" --exit-0 --expect=ctrl-o,ctrl-e,ctrl-w,ctrl-m,ctrl-p,ctrl-d,ctrl-x --bind '?:toggle-preview'))
  key=$(head -1 <<< "$out")
  file=$(head -2 <<< "$out" | tail -1)
  esfile=$(printf %q "$file")
  if [ -n "$file" ]; then
    [ "$key" = ctrl-o ] && open "$file" ||
    [ "$key" = ctrl-w ] && infile "$1" ||
    [ "$key" = ctrl-p ] && echo "$file" | pbcopy ||
    [ "$key" = ctrl-d ] && cd $(dirname "$file") ||
    ${EDITOR:-code} "$file"
  fi
}
```

Here's a short video showing it in action. This is searching all of my notes exported from Bear (339 to be exact).

<video height="350" controls>
  <source src="https://res.cloudinary.com/dknopoff/video/upload/f_auto/v1534890712/portfolio/fo.mov" type="video/mp4">
  Your browser does not support HTML5 video.
</video>
