let db;
let succuesSend = false;
let openRequest = indexedDB.open("test_db", 1);

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
///////////////////////////////ENVIAR DATOS A LA INDEXBD////////////////////////////
function addItem() {
  var transaction = db.transaction(["dates"], "readwrite");
  var store = transaction.objectStore("dates");
  var item = {
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
    created: new Date().getTime(),
  };

  var request = store.add(item);
  //redData();

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
  };
}
////////////////////////////////////////////////////////////////////////////////////

//////////////////////////LEER DATOS DE LA INDEXDB//////////////////////////////////
const redData = () => {
  var dates = [];
  var transaction = db.transaction(["dates"], "readonly");
  var store = transaction.objectStore("dates");
  const request = store.openCursor();

  request.onsuccess = function (e) {
    const cursor = e.target.result;
    if (cursor) {
       let dataForm = {
         id: cursor.value.id,
         name: cursor.value.name,
         age: parseInt(cursor.value.age),
         address: cursor.value.address,
         numberTel: cursor.value.numberTel,
         numberCel: cursor.value.numberCel,
         email: cursor.value.email,
         dateLast: cursor.value.dateLast,
         dateNew: cursor.value.dateNew,
         hoursDate: cursor.value.hoursDate,
         message: cursor.value.message,
     };
     let key = cursor.key;
        enviarDatos(dataForm, key);
        cursor.continue();
    } else {
      console.log("No more data");
    }
  };
};
////////////////////////////////////////////////////////////////////////////////////

///////////////////////////BORRAR DATOS DE LA INDEXDB///////////////////////////////
function deleteDat(key) {
  var transaction = db.transaction(["dates"], "readwrite");
  var store = transaction.objectStore("dates");
  const request = store.delete(key);

  request.onsuccess = () => {
    console.log("Cita borrada");
  };
}


//////////////////////////ENVIAR DATOS DE LA INDEXDB AL SERVIDOR////////////////////
function enviarDatos(dataForm, key) {
    form = JSON.stringify(dataForm);
  
    fetch("https://api-citas-dental.vercel.app/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForm),
    }).then((response) => response.json())
    .then((result) => {if(result.status == 200) {deleteDat(key); console.log('Cita enviada y eliminada')};
        }).catch((error) => {console.error('Error al enviar')});
  }
  ////////////////////////////////////////////////////////////////////////////////////
  
