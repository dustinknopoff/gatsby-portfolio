---
tag: python
title: Splitting PDFs
link: https://github.com/dustinknopoff/py-explore/blob/master/splitpdfs.py
date: 2018-07-07
---

Manipulating PDFs is quite a bit more difficult than I was expecting. Someone posted on the Mac Power Users forum asking if there was a way to programmatically split a pdf into multiple pdfs of differing lengths. In other words, taking a 10 page pdf and splitting it into 4 pdfs with 1,3,4, and 2 pages respectively.

Much of the difficulty I found with this was in conceptualizing how to keep track of the current page and which pdf it becomes a part of. This is what I used.

```python
# For every split option
        for index, split in enumerate(splits):
            new_file = PyPDF2.PdfFileWriter()
            # For every page that adds to
            for count in range(int(split)):
                page = self.original_reader.getPage(count)
                new_file.addPage(page)
            file = open(self.path + '/' + self.out_name + '-page' + str(index) + '.pdf', 'wb')
            new_file.write(file)
            print self.out_name + '-page' + str(index) + '.pdf' + ' has been made.'
            file.close()
```

Where splits is the array generated from user input:

```python
# Get path
path = raw_input("Which PDF would you like to split? (full path)")
# Get name of output files
name = raw_input('What would you like the output files to start with?')
# Get split of pages
# NOTE: Must add up to number of pages in PDF or script will crash.
splits = raw_input('Tell me how to split it up! i.e. (1, 3, 7)')
# Generate list of ints from split
splits = list(splits)
# Convert to list of numbers
numbers = []
for split in splits:
    if str(split).isdigit():
        numbers.append(int(split))
splitter = pdfSplitter(path, name, numbers)
splitter.split()
```
