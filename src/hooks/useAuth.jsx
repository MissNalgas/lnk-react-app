import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const authContext = createContext({});

export default function useUser() {
	return useContext(authContext);
}

export function AuthProvider({children}) {

	const [user, setUser] = useState();

	useEffect(() => {

		const auth = getAuth();
		const subs = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
			} else {
				setUser(null);
			}
		});

		return () => {
			subs();
		}

	}, []);

	return (
		<authContext.Provider value={{user}}>
			{children}
		</authContext.Provider>
	);
}

AuthProvider.propTypes = {
	children: PropTypes.node
}
