
let flagConection = true;


const nameUsuario = document.querySelector("#name"),
  age = document.querySelector("#age"),
  address = document.querySelector("#address"),
  numberTel = document.querySelector("#numberTel"),
  numberCel = document.querySelector("#numberCel"),
  email = document.querySelector("#email"),
  dateLast = document.querySelector("#datePast"),
  dateNew = document.querySelector("#dateNew"),
  hoursDate = document.querySelector("#timeNew"),
  message = document.querySelector("#message");

let lauchUpdate = document.getElementById("lauchUpdate");

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
  x.classList.remove("d-none");
  x.classList.add("show");
}

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
  navigator.serviceWorker.ready.then(function (swRegistration) {
    return swRegistration.sync.register("myFirstSync");
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
//////////////////////////////ENVIAR DATOS AL SERVIDOR//////////////////////////////
function addDate() {
  if (flagConection === true) {
    let dataForm = {
      id: 0,
      name: nameUsuario.value,
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
          nameUsuario.value = "";
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
////////////////////////////////////////////////////////////////////////////////////