let request = require("request");
let addontab = require("addon-page");
let tabs = require("tabs");
let panel = require("panel");
let data = require("self").data;

let movieWorker = require("page-worker").Page({
  contentURL: "http://www.google.com/movies",
  contentScriptFile: data.url("movieworker.js")
});

movieWorker.port.on("movies", function(movies) {
  //console.log(JSON.stringify(movies, undefined, 4));
  tabs.open({
    url: data.url("index.html"),
    onReady: function onOpen(tab) {
      worker = tab.attach({
        contentScriptFile: data.url("tabscript.js")
      });
      worker.port.emit("movies", movies);
      worker.port.on("findRoute", function(msg) {
        sendRequest(msg[0], msg[1]);
      });

    }
  });
});

let transitPanel = panel.Panel({
  contentURL: data.url("panel.html"),
  contentScriptFile: data.url("panel.js"),
  width: 600,
  height:500
});

function sendRequest(seconds, address) {
  let URL = "http://maps.googleapis.com/maps/api/directions/json?origin=1000 Villa Avenue, San Jose, CA 95126&destination=" +address+"&sensor=false&mode=transit&arrival_time=" + seconds + "&alternatives=true";
  var movieRequest = request.Request({
    url: URL,
    onComplete: function(response) {
      let responseJSON = JSON.parse(response.text);
      console.log(responseJSON.routes.length);
      
      transitPanel.port.emit("wipe", "");

      for(i in responseJSON.routes) {
        let theRoute = JSON.parse(response.text).routes[i].legs[0];
        let duration = theRoute.duration.text;
        let steps = theRoute.steps;
        
        transitPanel.port.emit("printStep", ["(" + steps[0].duration.text + ") - " + steps[0].html_instructions]);
        
        transitPanel.port.emit("printStep", ["(" + steps[1].duration.text + ") - " + steps[1].html_instructions]);
        
        transitPanel.port.emit("printStep", ["Catch " + steps[1].transit_details.line.agencies[0].name + " " + steps[1].transit_details.headsign + " at " + steps[1].transit_details.departure_stop.name + " at " + steps[1].transit_details.departure_time.text, "sub"]);
        transitPanel.port.emit("printStep", ["Ride " + steps[1].transit_details.headsign + " for " + steps[1].transit_details.num_stops + " stops", "sub"]);
        transitPanel.port.emit("printStep", ["Depart " + steps[1].transit_details.line.agencies[0].name + " " + steps[1].transit_details.headsign + " at " + steps[1].transit_details.arrival_stop.name + " at " + steps[1].transit_details.arrival_time.text, "sub"]);
        
        transitPanel.port.emit("printStep", ["(" + steps[2].duration.text + ") - " + steps[2].html_instructions]);
        
        transitPanel.port.emit("printStep", ["..."]);
        transitPanel.port.emit("printStep", [JSON.parse(response.text).routes[i].warnings[0]]);
        
        transitPanel.show();
      }
    }
  }).get();
  tabs.open(URL);
}
