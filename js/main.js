window.onload = function(){ 
  setTimeout(function(){
    document.querySelector(".preloader").style.display = "none"; 
},3000);
  
}
let newServiceWorker;
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./serviceWorker.js")
      .then((registerEvent) => {
        registerEvent.addEventListener("updatefound", () => {
          newServiceWorker = registerEvent.installing;
          newServiceWorker.addEventListener("statechange", () => {
            switch (newServiceWorker.state) {
              case "installed":
                showSnackbarUpdate();
                break;
            }
          });
        });
      });
  });
}
function showSnackbarUpdate() {
  let x = document.getElementById("snackbar");
  x.className = "show";
}
let lauchUpdate = document.getElementById("lauchUpdate");
lauchUpdate.addEventListener("click", () => {
  newServiceWorker.postMessage({
    action: "skipWaiting",
  });
  window.location.reload();
});

