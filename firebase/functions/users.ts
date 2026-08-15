import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.js";
import * as Api from "../../firebase/types.js";

/**
 * Get the user doc and return it as a User object
 *
 * @param uid - The unique user ID used as the Firestore document ID.
 *
 * @returns An User object if the user exists, otherwise null.
 */
export async function getUser(uid: string): Promise<Api.User | null> {
	const user = doc(db, "Users", uid);
	const userData = await getDoc(user);

	try {
		if (userData.exists()) {
			const d = userData.data();
			return new Api.User(
				userData.id,
				d.firstname,
				d.lastname,
				d.email,
				d.joinDate,
			);
		} else {
			console.error(`No such user exists`);
			return null;
		}
	} catch (error) {
		console.error("Firebase getUser failed completely:", error);
		return null;
	}
}

/**
 * Updates a user document in the "Users" collection in Firestore.
 *
 * @param uid - The unique user ID used as the Firestore document ID.
 * @param data - Partial user object containing only the fields to update.
 *
 * @returns true if the update succeeds, false otherwise.
 */
export async function updateUser(uid: string, data: Partial<Api.User>): Promise<boolean> {
	const user = doc(db, "Users", uid);
	try {
		const sanitized = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined && typeof v !== "function"));
		await setDoc(user, sanitized, { merge: true });
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}