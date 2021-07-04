import firebase from "firebase/app";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAzpnkmJ5G3yF0wx25Rgjqdq7GDMomuxNk",
  authDomain: "tanabata-5380a.firebaseapp.com",
  databaseURL: "https://tanabata-5380a.firebaseio.com",
  projectId: "tanabata-5380a",
  storageBucket: "tanabata-5380a.appspot.com",
  messagingSenderId: "532544675239",
  appId: "1:532544675239:web:710da3967111eb99ecaa82",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default firebase;
