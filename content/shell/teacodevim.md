---
tag: shell
title: Making a Vim Extension for TeaCode
link: https://github.com/dustinknopoff/TeaCode-Vim-Extension
date: 2018-09-13
---

[TeaCode](https://www.apptorium.com/teacode) is this really awesome code expander that has a key detail which puts it above all others for me. It recognizes filetypes as distinct. This means you can have some expander for a function in Python and Swift that are both called with `-f ...` but output very different results. It's been absolutely fantastic jumping between Python, React, and Rust in the past few months and stuff having access to tons of little boilerplate avoiders.

Recently, I started taking a class requiring the use of C in a terminal based editor. I decided to use vim and unfortunately, there existed no TeaCode extension for it or any other terminal based editor.

![Example of Extension in Action](https://github.com/dustinknopoff/TeaCode-Vim-Extension/raw/master/example.gif)

[Andreas](https://github.com/didair) was the one who actually began this extension but with the motivation of wanting it to use it for a class, I spent a day discovering `VimScript`.

Although I'd prefer this to be a genuine vim extension that can be installed with something like [Pathogen](https://github.com/tpope/vim-pathogen) or [Vundle](https://github.com/VundleVim/Vundle.vim), it's currently just a vim function.

```vim
function! TeaCodeExpand()
    " Collect data
	let trigger  = getline( '.' )
	let line     = line( '.' )
	let filetype = expand( '%:e' )

	" Gets the current line and column
	let cursor = getpos('.')
endfunction
```

`getLine, line, and getpos` are builtin vim functions for accessing varying parts of a users current location. Things like line number, column number, etc. `expand('%:e')` is the command for getting the filetype of the current file.

Then we call `execute "normal! dd"`, this deletes the current line from vim.

```vim
let ob = system( "sh ./expand.sh -e ". filetype ." -t '". trigger ."'" )
```

Another one of the weird parts of this script is it's reliance on a file `expand.sh` which is in the root. The way TeaCode interacts with it's extensions is by receiving JSON through an applescript call. It receives the line it was called on and the file extension. But, for some reason it was very difficult to just call the applescript from Vim.

```vim
	" Convert command response to an object by running eval function
	let object = js_decode( ob )
	let s:result = object.text

	" Report install TeaCode if error.
	if s:result ==? 'null'
		echo "Could not run TeaCode. Please make sure it's installed. You can download the app from https://www.apptorium.com/teacode"
	endif

	" write to screen
	execute "normal! i". s:result
```

We get the payload back and parse it. If there was nothing, we print the TeaCode message for missing the app. Otherwise, we write the result to vim.

## Getting a good position is hard

Since TeaCode has the functionality to specify where the cursor should go after an expansion has occurred, we have figure out the position. It ended up being so complicated, I just pushed it into python

```python
python << EOF
import vim
string = vim.eval("s:result")
line = 0
column = 0
vim.command("let l=%d"% line)
vim.command("let c=%d"% column)
for i in string:
	if i is '\n':
		line+=1
		column = 0
	else:
		column += 1
EOF
```

Essentially, we determine the exact column and line bassed on characters and the existence of `\n` characters.

We then call

```vim
let newline = line + l + 1 " add offset
let newcol = cursor[2] + c - 1
call setpos( '.', [0, newline, newcol, 0] )
```

Which sets the actual position to move to, including some offsets that sometimes work and sometimes don't.

Then we just add outside of the function

```vim
imap <C-e> <C-O>:call TeaCodeExpand()<CR>
```

Which says in insert mode, on key press CMD+e+o, call our function.

## Wrap Up

As TeaCode gets more users, more and more people are using this extension. It's my hope that between us, we can figure out the small issues and make it into an extension instead of a function to be added to a `.vimrc`.
