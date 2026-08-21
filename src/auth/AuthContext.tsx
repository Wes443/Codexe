import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { User as ApiUser } from "../../firebase/types";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	// undefined = still loading, null = signed out, ApiUser = loaded
	userDoc: ApiUser | null | undefined;
}

//create auth context
const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	userDoc: undefined,
});

//use auth context
export const useAuth = () => useContext(AuthContext);

//auth wrapper for the app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [userDoc, setUserDoc] = useState<ApiUser | null | undefined>(undefined);

	//subscribe to Firebase auth state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setUser(firebaseUser);
			setLoading(false);
			if (!firebaseUser) {
				setUserDoc(null);
			} else {
				setUserDoc(undefined);
			}
		});
		return () => unsubscribe();
	}, []);

	//subscribe to Firebase user doc changes (live updates w/o refreshing page)
	useEffect(() => {
		if (!user) return;

		const ref = doc(db, "Users", user.uid);
		const unsubscribe = onSnapshot(ref, (snap) => {
			if (!snap.exists()) {
				setUserDoc(null);
				return;
			}
			const d = snap.data();
			setUserDoc(
				new ApiUser(
					snap.id,
					d.firstName,
					d.lastName,
					d.joinDate,
					d.email,
				),
			);
		}, (error) => {
			console.error("Failed to listen to user document:", error);
			setUserDoc(null);
		},
		);

		return () => unsubscribe();
	}, [user]);

	const value = useMemo(() => ({ user, loading, userDoc}), [user, loading, userDoc]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
