var request  = require("request");
var cheerio  = require("cheerio");
var temporal = require("temporal");

function notify() {
  console.log("[+] sending mail");
  //lets try something different - no postmark:
  var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
  sendgrid.send({
    to:       process.env.SEND_TO_EMAIL,  // added via heroku config:add SEND_EMAIL_*..
    from:     process.env.SEND_FROM_EMAIL,
    subject:  '!  IEC - OPEN !?',
    text:     'IEC is probably OPEN!'
  }, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });
}
opened = 0;
temporal.loop(5000, function() { //60000*5
  console.log("[+] repeating 5 min");

  request({
     uri: "http://www.cic.gc.ca/english/work/iec/index.asp",
     }, function(error, response, body) {
     var $ = cheerio.load(body);

     toFind = $("div.alert.alert-info >p").html();
     //toFind = $("div.alert.alert-info >pp").html(); // should be null

     console.log("[p tag value]: " + toFind )
     // on the end is _space_ 
     closedText = "The International Experience Canada (IEC) 2015 season will not open before mid-February 2015. ";

    // it's enough to check this - we don't need: if (null == toFind) { console.log("je null") }
    if (toFind != closedText) {
      console.log("DIFF! IEC OPENED?");
      notify();
    } else {
      console.log("IEC still CLOSED..");
      opened += 1;
    }
  })
  console.log(opened);
 
  if (opened===2) {
    console.log("STOPPING!");
    console.log(this.called);
    this.stop();
  };

});