self.port.on("movies", function(movies) {
  let movieInfo = document.getElementById("movieInfo");

  for(i in movies.theaters) {
    let theater = document.createElement("section");
    movieInfo.appendChild(theater);
    
    let theaterName = document.createElement("header");
    theaterName.textContent = i;
    
    let theaterAddress = document.createElement("address");
    theaterAddress.textContent = movies.theaters[i].address; 
    
    let spacer = document.createTextNode(" - ")
    theaterAddress.appendChild(spacer);
    
    let theaterPhone = document.createElement("a");
    theaterPhone.textContent = movies.theaters[i].phone; 
    theaterPhone.href = "tel:" + movies.theaters[i].phone; 
    
    theater.appendChild(theaterName);
    theater.appendChild(theaterAddress);
    theaterAddress.appendChild(theaterPhone);
    
    for(j in movies.theaters[i].movies) {
      let movie = document.createElement("div");
      movie.className = "movie";
      movie.textContent = j;
      
      let timesEl = document.createElement("div");
      timesEl.className = "times";
      let times = movies.theaters[i].movies[j].times.split(", ");
      for(k in times) {
        let time = document.createElement("span");
        time.textContent = times[k];
        time.className = "time";
        timesEl.appendChild(time);    
        let space = document.createTextNode(k == times.length-1 ? "" : " - ")
        timesEl.appendChild(space);
      }
      movie.appendChild(timesEl);
      theater.appendChild(movie);
    }
  }

  let spans = document.getElementsByTagName("span");
  for(i in spans) {
    if(spans[i].className == "time") {
      spans[i].addEventListener("click", clickSpan, false);
    }
  }
});

function clickSpan(el) {
  let date = new Date();
  let time = this.textContent.split("pm")[0].split("am")[0].split(":");
  if(this.textContent.split("am")[1] == undefined && this.textContent != "12:00pm") {
    time[0] = parseInt(time[0]) + 12;
  }

  let offset = date.getTimezoneOffset()/60;
  time[0] = parseInt(time[0]) + parseInt(offset);
  if(time[0] > 23) {
    time[0] = parseInt(time[0]) - 24;
    date.setDate(parseInt(date.getDate()) + 1);
  }
  let seconds = (date.getTime()/1000).toString().split(".")[0];
  let address = this.parentNode.parentNode.parentNode
                    .getElementsByTagName("address")[0]
                    .textContent.split(" - ")[0];
  self.port.emit("findRoute", [seconds, address]);
}

//maps.googleapis.com/maps/api/directions/json?origin=1000 Villa Avenue, San Jose, CA 95126&destination=201 South Second Street, San Jose, CA&sensor=false&mode=transit&arrival_time=1356236133