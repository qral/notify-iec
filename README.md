# 1st node.js app
Just wanted to try it.

## QUICK START
```sh
# emerge nodejs  
$ npm install request  
$ npm install cheerio  
$ node index.js  
```

## What does it do?

Checking if [International Experience Canada](http://www.cic.gc.ca/english/work/iec/index.asp) program is still CLOSED -> you can not 
register.

After IEC will be opened - I will receive mail notification.

It runs on Heroku using Sendgrid (email delivery)

## Sources
https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction  
https://github.com/cheeriojs/cheerio  
http://google.com and others.

Special thanks to [cheerio repl](https://tubes.io/blog/2012/11/30/debugging-cheerio-selectors-made-easy/).  
Try it!  

```sh
$ npm install -g cheerio-repl
$ cheerio "http://tubes.io"
cheerio> $('title').text();
'Home - tubes.io'
cheerio>
```
