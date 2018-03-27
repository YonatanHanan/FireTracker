import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyD7U5AyZiU34m0OSNG_bkXhhsAJWF8zMEE",
    authDomain: "bt-fire-tracker.firebaseapp.com",
    databaseURL: "https://bt-fire-tracker.firebaseio.com",
    storageBucket: "bt-fire-tracker.appspot.com"
};

export const fire = firebase.initializeApp(config);
export const ref = firebase.database().ref();