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

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	userDoc: undefined,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [userDoc, setUserDoc] = useState<ApiUser | null | undefined>(undefined);

	// Subscribe to Firebase auth state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setUser(firebaseUser);
			setLoading(false);
			if (!firebaseUser) {
				setUserDoc(null);
			} 
		});
		return () => unsubscribe();
	}, []);

	// Subscribe to the Firestore user document in real time so userDoc reflects
	// writes made during the session (e.g. completing setup) without a reload.
	useEffect(() => {
		if (!user) return;

		const ref = doc(db, "Users", user.uid);
		const unsubscribe = onSnapshot(
			ref,
			(snap) => {
				if (!snap.exists()) {
					setUserDoc(null);
					return;
				}
				const d = snap.data();
				setUserDoc(
					new ApiUser(
						snap.id,
						d.firstname,
						d.lastname,
						d.email,
						d.joinDate,
						d.profileImage ?? "",
					),
				);
			},
			(error) => {
				console.error("Failed to listen to user document:", error);
				setUserDoc(null);
			},
		);

		return () => unsubscribe();
	}, [user]);

	const value = useMemo(() => ({ user, loading, userDoc }), [user, loading, userDoc]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
