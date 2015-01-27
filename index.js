var request = require("request");
var cheerio = require("cheerio");

function notify() {
  console.log("[+] sending mail");
  //lets try something different - no postmark:
  var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
  sendgrid.send({
    to:       process.env.SEND_TO_EMAIL,  // added via heroku config:add SEND_EMAIL_*..
    from:     process.env.SEND_FROM_EMAIL,
    subject:  '!  IEC - OPEN !?',
    text:     'IEC je pravdepodobne OPEN!'
  }, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });
}

request({
   uri: "http://www.cic.gc.ca/english/work/iec/index.asp",
   }, function(error, response, body) {
   var $ = cheerio.load(body);

   toFind = $("div.alert.alert-info >p").html();
   //toFind = $("div.alert.alert-info >pp").html(); // should be null

   //if (null == toFind) { console.log("je null") }

   console.log("[p tag value]: " + toFind )
   // na konci mají mezeru
   closedText = "The International Experience Canada (IEC) 2015 season will not open before mid-February 2015. ";

//console.log(toFind.length);
//console.log(closedText.length);

  // není třeba čekovat ostatní
  if (toFind != closedText) {
    console.log("ZMENA! IEC OPENED?");
    notify();
  }
  else
    console.log("IEC still CLOSED..")
});



// xpath je no-go pač by se to muselo sanitizovat pač to chce validní xml(xhtml)
/* viz: http://stackoverflow.com/questions/25753368/performant-parsing-of-pages-with-node-js-and-xpath
jinak to bleje tohle:
" missed quot(")!! 
@#[line:162,col:1]
attribute "top" missed quot(")!! 
@#[line:162,col:1]
unclosed xml attribute 
@#[line:162,col:70]
unclosed xml attribute 
@#[line:162,col:127]
unclosed xml attribute 
@#[line:162,col:267]
unclosed xml attribute 
@#[line:162,col:306]

from:

request({
   uri: "http://www.bazos.cz",
   }, function(error, response, body) {
   //var $ = cheerio.load(body);

   //var xml = "<book><title>Harry Potter</title></book>"
   var doc = new dom().parseFromString(body)
   var title = xpath.select("/html/body/div[1]/table[3]/tbody/tr/td/div[3]/text()", doc).toString()
   console.log("AAAAAAA:" + title)
   ....
*/