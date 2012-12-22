self.port.on("printStep", function(msg) {
  let step = document.createElement("div");
  step.textContent = msg[0];
  if(msg[1] == "sub") {
    step.setAttribute("style", "padding-left:25px;");
  }
  document.body.appendChild(step);
});

self.port.on("wipe", function(msg) {
  while(document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});