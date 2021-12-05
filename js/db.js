var db;

var openRequest = indexedDB.open('test_db', 1);

openRequest.onupgradeneeded = function(e) {
  var db = e.target.result;
  console.log('running onupgradeneeded');
  if (!db.objectStoreNames.contains('dbDates')) {
    var storeOS = db.createObjectStore('dates', {autoIncrement: true});
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



function addItem() {

  var transaction = db.transaction(['dates'], 'readwrite');
  var store = transaction.objectStore('dates');
  var item = {
    name: document.querySelector('#name').value,
    lastName: document.querySelector('#lastName').value,
    adress: document.querySelector('#address').value,
    numberTel: document.querySelector('#numberTel').value,
    numberCel: document.querySelector('#numberCel').value,
    email: document.querySelector('#email').value,
    dateLast: document.querySelector('#datePast').value,
    dateNew: document.querySelector('#dateNew').value,
    hourDate: document.querySelector('#timeNew').value,
    message: document.querySelector('#message').value,
    created: new Date().getTime()
  };

 var request = store.add(item);

 request.onerror = function(e) {
    console.log('Error', e.target.error.name);
  };
  request.onsuccess = function(e) {
    console.log('Woot! Did it');
  };
}