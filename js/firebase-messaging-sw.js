importScripts("https://www.gstatic.com/firebasejs/5.0.3/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.0.3/firebase-messaging.js");
var config = {
apiKey: "AIzaSyBZUz6V1Mkmwxpe781P8X6ZC7fPTUyiBIg",
authDomain: "it-love1.firebaseapp.com",
databaseURL: "https://it-love1.firebaseio.com",
projectId: "it-love1",
storageBucket: "it-love1.appspot.com",
messagingSenderId: "782043275132"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();