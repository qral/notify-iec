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

// check the site every 5 minutes
temporal.loop(60000*5, function() {
  console.log("[+] repeating 5 min");

  request({
     //uri: "http://www.cic.gc.ca/english/work/iec/index.asp",
     uri: "http://kompass-2015-iec-eic.international.gc.ca/IECRegistrationClosed.aspx?regionCode=cz",
     }, function(error, response, body) {
     var $ = cheerio.load(body);

     //toFind = $("div.alert.alert-info >p").html();
     //toFind = $("div.alert.alert-info >pp").html(); // should be null
     toFind = $("span#lblRegClosedMain").html(); //changing uri, this is cardinal one

     console.log("[searched value]: " + toFind )
     // on the end is _space_ 
     //closedText = "The International Experience Canada (IEC) 2015 season will not open before mid-February 2015. ";
     closedText = 'The 2015 International Experience Canada (IEC) initiative with Czech Republic is currently closed, and will re-open shortly.  We encourage you to check the updates on our website regularly.';

    // it's enough to check this - we don't need: if (null == toFind) { console.log("je null") }
    if (toFind != closedText) {
      console.log("DIFF! IEC OPENED?");
      notify();
      opened += 1;
    } else {
      console.log("IEC still CLOSED..");
    }
  })
  // this will not work on Heroku
  if (opened === 5) { // pls no more then 5 notifications
    console.log("STOPPING!");
    this.stop();
    console.log("Loop ran: " + this.called + " times.");
  };

});