let flagConection = true;
let db;
let openRequest = indexedDB.open("test_db", 1);
const nameU = document.querySelector("#name"),
  age = document.querySelector("#age"),
  address = document.querySelector("#address"),
  numberTel = document.querySelector("#numberTel"),
  numberCel = document.querySelector("#numberCel"),
  email = document.querySelector("#email"),
  dateLast = document.querySelector("#datePast"),
  dateNew = document.querySelector("#dateNew"),
  hoursDate = document.querySelector("#timeNew"),
  message = document.querySelector("#message");

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

openRequest.onupgradeneeded = function (e) {
  let db = e.target.result;
  console.log("running onupgradeneeded");
  if (!db.objectStoreNames.contains("dbDates")) {
    let storeOS = db.createObjectStore("dates", { autoIncrement: true });
  }
};
openRequest.onsuccess = function (e) {
  console.log("running onsuccess");
  db = e.target.result;
};
openRequest.onerror = function (e) {
  console.log("onerror!");
  console.dir(e);
};
function showSnackbarUpdate() {
  let x = document.getElementById("snackbar");
  x.classList.remove("d-none");
  x.classList.add("show");
}

let lauchUpdate = document.getElementById("lauchUpdate");
lauchUpdate.addEventListener("click", () => {
  newServiceWorker.postMessage({
    action: "skipWaiting",
  });
  window.location.reload();
});

window.addEventListener("online", () => {
  let toast = document.querySelector(".warning");
  flagConection = true;
  iziToast.destroy();
  ({ transitionOut: "fadeOutUp" }, toast);
  iziToast.info({
    title: "Conexion restablecida",
    position: "topLeft",
  });
});

window.addEventListener("offline", () => {
  iziToast.warning({
    id: "warning",
    class: "warning",
    title: "Error de Conexion",
    message: "Esta en modo offline",
    timeout: false,
    position: "topLeft",
  });
  flagConection = false;
});

function addDate() {
  if (flagConection) {
    let dataForm = {
      id: 0,
      name: nameU.value,
      age: parseInt(age.value),
      address: address.value,
      numberTel: numberTel.value,
      numberCel: numberCel.value,
      email: email.value,
      dateLast: dateLast.value,
      dateNew: dateNew.value,
      hoursDate: hoursDate.value,
      message: message.value,
    };

    fetch("https://api-citas-dental.vercel.app/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForm),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          iziToast.success({
            title: "Exito",
            message: "Su cita fue agendada",
            position: "topRight",
          });
          nameU.value = "";
          age.value = "";
          address.value = "";
          numberTel.value = "";
          numberCel.value = "";
          email.value = "";
          dateLast.value = "";
          dateNew.value = "";
          hoursDate.value = "";
          message.value = "";
        }
      })
      .catch((error) => {
        if (error) {
          iziToast.error({
            title: "Error",
            message: "Ocurrio un problema al agendar su cita",
            position: "topRight",
          });
        }
      });
  } else {
    addItem();
  }
}

function addItem() {
  var transaction = db.transaction(["dates"], "readwrite");
  var store = transaction.objectStore("dates");
  var item = {
    id: 0,
    name: nameU.value,
    age: parseInt(age.value),
    address: address.value,
    numberTel: numberTel.value,
    numberCel: numberCel.value,
    email: email.value,
    dateLast: dateLast.value,
    dateNew: dateNew.value,
    hoursDate: hoursDate.value,
    message: message.value,
    created: new Date().getTime(),
  };

  var request = store.add(item);

  request.onerror = function (e) {
    console.log("Error", e.target.error.name);
    iziToast.error({
      title: "Error",
      message: "Ocurrio un problema al agendar su cita",
      position: "topRight",
    });
  };
  request.onsuccess = function (e) {
    iziToast.success({
      title: "Exito",
      message: "Su cita fue agendada",
      position: "topRight",
    });
    nameU.value = "";
    age.value = "";
    address.value = "";
    numberTel.value = "";
    numberCel.value = "";
    email.value = "";
    dateLast.value = "";
    dateNew.value = "";
    hoursDate.value = "";
    message.value = "";
  };
}
