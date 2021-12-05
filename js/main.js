window.onload = function () {
  setTimeout(function () {
    document.querySelector(".preloader").style.display = "none";
  }, 1000);
};

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

window.addEventListener("online", () => {
  console.log("En linea");
});

window.addEventListener("offline", () => {
  console.log("Sin conexion");
});

function addDate() {

 
  fetch('https://api-citas-dental.vercel.app/create/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      id: 0,
      name: "Miguel Gutierrez",
      age: 22,
      address: "Ebanos #105",
      numberTel: "7641257458",
      numberCel: "7641025856",
      email: "migue@gmail.com",
      dateLast: "2021-12-04",
      dateNew: "2021-12-05",
      hoursDate: "13:25",
      message: "Dolor de muelas"})
    }) .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));;
   
  

  // let dataForm = {
  //   id: 0,
  //   name: document.querySelector("#name").value,
  //   age: parseInt(document.querySelector("#age").value),
  //   address: document.querySelector("#address").value,
  //   numberTel: document.querySelector("#numberTel").value,
  //   numberCel: document.querySelector("#numberCel").value,
  //   email: document.querySelector("#email").value,
  //   dateLast: document.querySelector("#datePast").value,
  //   dateNew: document.querySelector("#dateNew").value,
  //   hoursDate: document.querySelector("#timeNew").value,
  //   message: document.querySelector("#message").value,
  // };

  // var requestOptions = {
  //   method: "POST",
  //   headers: new Headers({
  //     "Content-Type": "application/json",
  //     "Access-Control-Allow-Origin": "*",
  //   }),
  //   body: JSON.stringify(dataForm),
  //   mode: "no-cors",
  // };
  // fetch("https://api-citas-dental.vercel.app/create", requestOptions)
  //   .then((response) => response.text())
  //   .then((result) => console.log(result))
  //   .catch((error) => console.log("error", error));
}
