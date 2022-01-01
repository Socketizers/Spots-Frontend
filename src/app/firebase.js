import firebase from 'firebase/compat/app';
// import firebase from "firebase/app";

import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDpxLdKn9h3LaodzETxh9eYTlCaL3kmpqw",
    authDomain: "spots-fe4d4.firebaseapp.com",
    projectId: "spots-fe4d4",
    storageBucket: "spots-fe4d4.appspot.com",
    messagingSenderId: "199201664423",
    appId: "1:199201664423:web:097582a20804dc3fbc1a82",
    measurementId: "G-K1QRRCVS1V"
  };

firebase.initializeApp(firebaseConfig);

// const storage = ()=> getStorage(initializeApp(firebaseConfig));
// export default { storage };


const storage = firebase.storage();

export { storage, firebase as default };