import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
          apiKey: "AIzaSyBjYmJU2nu8nzuSbEU5kQzqbjRyrB1maRE",
          authDomain: "hs-iot-aa7d2.firebaseapp.com",
          databaseURL: "https://hs-iot-aa7d2-default-rtdb.firebaseio.com",
          projectId: "hs-iot-aa7d2",
          storageBucket: "hs-iot-aa7d2.appspot.com",
          messagingSenderId: "934470738974",
          appId: "1:934470738974:web:875984b856372be93bfa0f",
          measurementId: "G-7DFE9GC9NV"
        };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbFs = getFirestore(app);

export { db, dbFs };