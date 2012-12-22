let movieresults = document.getElementById("movie_results");
let theaterElements = document.querySelectorAll("div.theater");
let showtimeElements = document.querySelectorAll("div.showtimes");

let movieObject = {}

for(i = 0; i < showtimeElements.length;i++) {
  let movieElements = showtimeElements[i].querySelectorAll("div.movie");
  let theaterName = theaterElements[i].querySelector("a").textContent;
  let theaterAddress = theaterElements[i].querySelector("div.info").textContent.split(" - ")[0];
  let theaterPhone = theaterElements[i].querySelector("div.info").textContent.split(" - ")[1];
  
  for(j = 0; j < movieElements.length;j++) {
    let movieName = movieElements[j].querySelector("a").textContent;
    let movieTimesElements = movieElements[j].querySelectorAll("div.times > span");
    let timeString = "";
    for(k = 0; k < movieTimesElements.length; k++) {
      movieTimesElements[k].removeChild(movieTimesElements[k].firstChild);
      let thisString = movieTimesElements[k].textContent;
      timeString = timeString + (timeString.length > 0 ? ", " : "") + 
        thisString.replace(thisString.charAt(thisString.length-1), "");
    }
    
    addMovieData(theaterName, theaterAddress, theaterPhone, movieName, timeString);
  }
}
self.port.emit("movies", movieObject);

function addMovieData(theater, address, phone, movie, times) {
 // console.log(theater + "\n  " + movie + "\n    " + times);
  
  if(!movieObject.theaters) {
    movieObject.theaters = {}
  }
  
  if(!movieObject.theaters[theater]) {
    movieObject.theaters[theater] = { "address": address, "phone": phone, "movies": {} }
  }
  
  if(!movieObject.theaters[theater].movies[movie]) {
    movieObject.theaters[theater].movies[movie] = { "times": times };
  }
}
