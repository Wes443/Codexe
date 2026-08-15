import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/firebase.js";
import * as Api from "../../firebase/types.js";

/**
 * add a session doc to the "Sessions" collection
 *
 * @param session - the session object to be added
 *
 * @returns true if the session was successfully added, otherwise false
 */
export async function addSession(session : Api.Session) {
    try{
        await addDoc(collection(db, "Sessions"), session);
        return true;

    }catch(error){
        console.log("error adding session to Firestore db");
        return false;
    }
}