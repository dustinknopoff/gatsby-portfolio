---
tag: web
title: Money Buddy
link: https://github.com/dustinknopoff/moneybuddy
date: 2018-06-26
---

This was Jessica Holoschutz Berger and I's final project for 5D Fundamentals at Northeastern University. The concept was to emphasize the common issue in the US where customers will buy more than they can afford.

This is done in an intentionally evocative manner.

## Getting it to work

Only barely knowing JavaScript at the time, figuring out how to create a Chrome Extension was incredible difficult. The repo includes multiple files that ended up never being used and I went in circles attempting to initialize and update a value in Local Storage.

In the end, the code is relatively simple. It's designed specifically for Amazon search. It finds `li` elements on the page, finds the price element, checks against local storage, and replaces with "You Can't Afford This!" if it's greater than stored value.

```javascript
function execute() {
  const lis = document.getElementsByTagName("LI");
  var bool = false;
  //max = localStorage["maxValue"];
  max = localStorage["maxValue"];
  Array.from(lis).forEach(li => {
    const nums = li.getElementsByClassName("sx-price-whole");
    Array.from(nums).forEach(num => {
      res = num.innerText.replace(/^[, ]+|[, ]+$|[, ]+/g, "").trim();
      if (parseFloat(res) >= parseFloat(max)) {
        li.innerHTML =
          '<div class="injected">' +
          "<div><h1>You Can't Afford This!</h1></div></div>";
      }
      bool = true;
    });
    if (!bool) {
      const othernums = li.getElementsByClassName("a-size-medium");
      Array.from(othernums).forEach(num => {
        var re = new RegExp(/[0-9,.]+/g);
        re.exec(num.innerText).forEach(n => {
          if (parseFloat(n) > parseFloat(max)) {
            li.innerHTML =
              '<div class="injected">' +
              "<div><h1>You Can't Afford This!</h1></div></div>";
          }
        });
      });
    }
  });
  var loc = document.getElementsByClassName("nav-right");
  loc[0].innerHTML = "";
  document.getElementById("nav-belt").style.height = "39px";
}
```

Here's a quick video of it in action:

<video width="400" controls>

  <source src="https://res.cloudinary.com/dknopoff/video/upload/f_auto/v1534896474/portfolio/moneybuddy.mov" type="video/mp4">
  Your browser does not support HTML5 video.
</video>
