import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const app = firebase.initializeApp({
    apiKey: "AIzaSyAZVzoT976byHHRyW3eJevurqG9jp85uvQ",
    authDomain: "controlacceso-ee1ac.firebaseapp.com",
    projectId: "controlacceso-ee1ac",
    storageBucket: "controlacceso-ee1ac.appspot.com",
    messagingSenderId: "926118710386",
    appId: "1:926118710386:web:87ebc2d08f10dffa9906eb"
})


/**
 * la autenticacion la pueda ultizar en cualquer parte de mi app, la exporto asi para que se importe con el mismo nombre auth
 * 
*/
export const auth = firebase.auth();
export default app;