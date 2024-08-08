"use client";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "@/lib/firebase/auth.js";
import Button from '@mui/material/Button';
import { useRouter } from "next/navigation";
import { firebaseConfig } from "@/lib/firebase/config";

function useUserSession(initialUser) {
	// The initialUser comes from the server via a server component
	const [user, setUser] = useState(initialUser);
	const router = useRouter();

	// Register the service worker that sends auth state back to server
	// The service worker is built with npm run build-service-worker
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			const serializedFirebaseConfig = encodeURIComponent(
				JSON.stringify(firebaseConfig)
			);
			const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;

			navigator.serviceWorker
				.register(serviceWorkerUrl)
				.then((registration) => console.log("scope is: ", registration.scope));
		}
	}, []);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged((authUser) => {
			setUser(authUser);
		});

		return () => unsubscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		onAuthStateChanged((authUser) => {
			if (user === undefined) return;

			// refresh when user changed to ease testing
			if (user?.email !== authUser?.email) {
				router.refresh();
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return user;
}

// export { useUserSession };


export default function Header({ initialUser }) {

	const user = useUserSession(initialUser);

	const handleSignOut = event => {
		event.preventDefault();
		signOut();
	};

	const handleSignIn = event => {
		event.preventDefault();
		signInWithGoogle();
	};

	return (
		<header>
			{user ? (
				<>
					<div className="profile">
						<p>
							<img className="profileImage" src={user.photoURL || "/profile.svg"} alt={user.email} />
							{user.displayName}
						</p>

						<div className="menu">
							...
							<ul>
								<li>{user.displayName}</li>

								<li>
									<a
										href="#"
									>
										Add sample restaurants
									</a>
								</li>

								<li>
									<Button variant="contained" color="primary" onClick={handleSignOut}>
										Sign out
									</Button>
								</li>
							</ul>
						</div>
					</div>
				</>
			) : (
				<Button variant="contained" color="primary" onClick={handleSignIn}>
					Sign In with Google
				</Button>

			)}
		</header>
	);
}
