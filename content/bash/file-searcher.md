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
notes() {
  rg "$1" | fzf --height 40% | xargs -0 python -c "import re;import sys;arr=sys.argv;string=' '.join(arr);print(re.findall(r'(?<=-c ).*(?=:)',string)[0].replace(' ', '\ ').replace('&', '\&'))" | xargs -0 -I {} /bin/zsh -c "echo '$(pwd | sed -e 's/ /\\ /g')/{}'" | xargs -0 -I {} /bin/zsh -c 'macdown {}'
}
```

`notes()` runs ripgrep on the input and pipes it through fzf. Upon selection, the selection is parsed for it's file path and sent to my preferred markdown editor.

I then modified `fo` to recognize `ctrl-w` as a command to send to `notes()`.

```bash
fo() {
  local out file key
  IFS=$'\n' out=($(fzf --preview="pygmentize -g {}" --query="$1" --exit-0 --expect=ctrl-o,ctrl-e,ctrl-w,ctrl-m --bind '?:toggle-preview'))
  key=$(head -1 <<< "$out")
  file=$(head -2 <<< "$out" | tail -1)
  if [ -n "$file" ]; then
    [ "$key" = ctrl-o ] && open "$file" || [ "$key" = ctrl-w ] && notes "$1" || ${EDITOR:-code} "$file"
  fi
}
```
