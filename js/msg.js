// Initialize Firebase
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
messaging.requestPermission()
.then(function(){
console.log("Have Permission");
return messaging.getToken();
})
.then(function(token){
	console.log(token);
})
.catch(function(err){
console.log('error', err);
});

messaging.onMessage(function(payload){
	console.log('onMessage: ', payload);
});