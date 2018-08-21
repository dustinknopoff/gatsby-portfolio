---
tag: python
title: Shoe Scraper
link: https://github.com/dustinknopoff/py-explore/blob/master/vivo.py
date: Jan 6, 2018
---

I am a huge fan of minimal, very small sole shoes. All of [Vivo Barefoot](https://www.vivobarefoot.com/us)'s shoes fit this desire. Except that they're way out of my price range. So, why not try and learn to scrape the web?

This script looks through every men's shoe with size 10 in stock (my size) to see if there are any on sale and specifically below $60.

```py
def main():
    clear = 'https://www.vivobarefoot.com/us/shop/sale#q=size.43~gender.Mens'
    reg = 'https://www.vivobarefoot.com/us/mens#q=size.43'
    results = [getcontent(clear), getcontent(reg)]
    flag = False
    for result in results:
        for elem in result:
            if int(elem['Price'].replace('$', '')) <= 60:
                webbrowser.open('things:///add?title=Vivo%20Shoes%20On%20Sale!&'
                                'notes=https://www.vivobarefoot.com/us/shop/sale#q=size.43~gender.Mens&when=Today')
                flag = True
    if flag is False:
        print('Nothing below $60 in size 10 today')
```

where `getcontent()` is a very simple webscraper:

```py
def getcontent(site):
    r = requests.get(site).content
    soup = BeautifulSoup(r, 'html.parser')
    products = soup.find('ul', attrs={'class': 'products'})
    lists = products.find_all('li')
    results = []
    for li in lists:
        d = {}
        names = li.strong.get_text()
        if 'Men' in names:
            if 'Women' not in names:
                d['Product'] = names
                d['Link'] = 'https://www.vivobarefoot.com' + li.a.get('href')
                try:
                    price = li.find('span', attrs={'class', 'sale'}).get_text()
                except AttributeError:
                    price = li.find('span', attrs={'class', 'price'}).get_text()
                d['Price'] = price
                results.append(d)
    return results
```
