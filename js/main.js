let flagConection = true;
let db;
let openRequest = indexedDB.open('test_db', 1);



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

openRequest.onupgradeneeded = function(e) {
  let db = e.target.result;
  console.log('running onupgradeneeded');
  if (!db.objectStoreNames.contains('dbDates')) {
    let storeOS = db.createObjectStore('dates', {autoIncrement: true});
  }
};
openRequest.onsuccess = function(e) {
  console.log('running onsuccess');
  db = e.target.result;
};
openRequest.onerror = function(e) {
  console.log('onerror!');
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
  let  toast = document.querySelector('.warning');
  flagConection = true;
  iziToast.destroy();({transitionOut: 'fadeOutUp'}, toast);
  iziToast.info({
    title: 'Conexion restablecida',
    position: 'topLeft'
});
});

window.addEventListener("offline", () => {
  iziToast.warning({
    id: 'warning',
    class: 'warning',
    title: 'Error de Conexion',
    message: 'Esta en modo offline',
    timeout: false,
    position: 'topLeft'
});
  flagConection = false;
});

function addDate() {

  if(flagConection) {
    let dataForm = {
      id: 0,
      name: document.querySelector("#name").value,
      age: parseInt(document.querySelector("#age").value),
      address: document.querySelector("#address").value,
      numberTel: document.querySelector("#numberTel").value,
      numberCel: document.querySelector("#numberCel").value,
      email: document.querySelector("#email").value,
      dateLast: document.querySelector("#datePast").value,
      dateNew: document.querySelector("#dateNew").value,
      hoursDate: document.querySelector("#timeNew").value,
      message: document.querySelector("#message").value,
    };
   
  
    fetch('https://api-citas-dental.vercel.app/create', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForm)
      }) .then((response) => response.json())
      .then((result) => 
        console.log(re)
        )
      .catch((error) => {
       console.log(error);
      });
     
    
  }else{
    addItem();
  }
 
}


function addItem() {

  var transaction = db.transaction(['dates'], 'readwrite');
  var store = transaction.objectStore('dates');
  var item = {
      id: 0,
      name: document.querySelector("#name").value,
      age: parseInt(document.querySelector("#age").value),
      address: document.querySelector("#address").value,
      numberTel: document.querySelector("#numberTel").value,
      numberCel: document.querySelector("#numberCel").value,
      email: document.querySelector("#email").value,
      dateLast: document.querySelector("#datePast").value,
      dateNew: document.querySelector("#dateNew").value,
      hoursDate: document.querySelector("#timeNew").value,
      message: document.querySelector("#message").value,
      created: new Date().getTime()
  };

 var request = store.add(item);

 request.onerror = function(e) {
    console.log('Error', e.target.error.name);
    iziToast.error({
      title: 'Error',
      message: 'Ocurrio un problema al agendar su cita',
      position: 'topRight'
  });
  };
  request.onsuccess = function(e) {
    iziToast.success({
      title: 'Exito',
      message: 'Su cita fue agendada',
      position: 'topRight'
  });
  };
}