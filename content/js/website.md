---
tag: javascript
title: Website
link: https://github.com/dustinknopoff/gatsby-portfolio
date: July 28, 2018
---

This website has been an idea for a long, long time. It started out as HTML written in Python using [yattag](http://www.yattag.org) which became quickly unusable. It was then migrated to using [pystache](https://github.com/defunkt/pystache) and injected JavaScript.

![Old Website](https://res.cloudinary.com/dknopoff/image/upload/f_auto/v1534892818/portfolio/old-website.png)

> The previous iteration

Along the way, I attempted to push the contents to Airtable such that updating the contents would solely require editing a field in the table.

## Enter React, Gatsby, and Netlify

Around the time where utilizing Airtable as a backend was not working well, [@teoboley](https://github.com/teoboley) introduced me to the simplicity that is React Components. I'd known and attempted to learn React multiple times prior, but Teo managed to inspire me to really make an attempt. After doing Wes Bos' [React Course](https://reactforbeginners.com/), I finally had the requisite knowledge to actually use React as a tool.

Discovering Gatsby meant that I could continue to have the speed I had from static web pages with the cleanliness of React Components. Netlify allowed me to have an only slightly more complex process for editing content on my website (pushing to Github instead of editing a column in a spreadsheet).

I'd also found NetlifyCMS, essentially a GUI backend for markdown based posts for a website. I'd attempted to use it but kept getting errors. In the end, I couldn't figure it out and decided just adding files was sufficient.

![Current Website](https://res.cloudinary.com/dknopoff/image/upload/f_auto/v1536024150/portfolio/curr-website.png)

> Current iteration

Most importantly, my website is now for my projects and not a glorified resume. It allows me to present a more verbose representation of the contents I make public on Github.
