---
tag: bash
title: Save Emails as PDFs
link: https://github.com/dustinknopoff/py-explore/tree/master/save-emails
date: July 7, 2018
---

Someone posed the question of how to preserve emails on the Mac as PDFs [here](https://talk.macpowerusers.com/t/preserving-emails/4277). It was a question I was curious about and had no idea how to answer. So, I started to do my research.

## Mail Rules

It turns out, in `Mail.app`, there are rules that can be created sending emails to particular locations. More importantly and interesting is that you can run Applescripts within these rules. I also found this script and slightly modified it. It essentially saves any email called on this script to the specified folder.

```applescript
using terms from application "Mail"
	on perform mail action with messages theMessages for rule theRule
		tell application "Mail"
			set msgs to selection

			if length of msgs is not 0 then

				set theFolder to (system attribute "HOME") & "/Downloads/"

				repeat with msg in msgs
					set msgContent to source of msg
					-- determine date received of msg and put into YYYY-MM-DD format
					set msgDate to date received of msg
					-- parse date SEMversion below using proc pad2()
					set {year:y, month:m, day:d, hours:h, minutes:min} to (msgDate)
					set msgDate to ("" & y & "-" & my pad2(m as integer) & "-" & my pad2(d))

					-- assign subject of msg
					set msgSubject to (subject of msg)

					-- create filename.eml to be use as title saved
					set newFile to (msgDate & "-" & msgSubject & ".eml") as rich text
					set newFilePath to theFolder & newFile as rich text

					set referenceNumber to open for access newFilePath with write permission
					try
						write msgContent to referenceNumber
						delete msg
					on error
						close access referenceNumber
					end try
					close access referenceNumber

				end repeat

			end if -- msgs > 0
		end tell
	end perform mail action with messages
end using terms from

on pad2(n)
	return text -2 thru -1 of ("00" & n)
end pad2
```

## To PDF!

It runs out there are tons and tons of different ways to convert a file into a pdf and equally as many to convert `.eml` to `.html`. Some are easy and some are difficult. In the end I found `wkhtmltopdf` and `mailparser` to work the best.

That left me with a quick bash script to run it on every file in location where the emails are saved to from the rule.

```bash
location=~/Downloads
for file in $location/*.eml;
do
    echo $file
    name=${file##*/}
    noeml=${name%.eml}
    echo "$noml"
    mailparser -f $file -b > $location/$noeml.html
    x=$noeml.html
    wkhtmltopdf $location/$x $location/$noeml.pdf
done
```

The person posing the question ended up using [CloudPull](https://www.goldenhillsoftware.com/cloudpull/) but the exploration and the fact that I figured it out for myself was sufficient for me to consider this project a success.
