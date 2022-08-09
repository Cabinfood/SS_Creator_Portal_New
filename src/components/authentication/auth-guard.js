import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/use-auth";

export const AuthGuard = (props) => {
	const { children } = props;
	const auth = useAuth();
	const router = useRouter();
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		if (!router.isReady || !auth.isInitialized) {
			return;
		}

		if (!auth.isAuthenticated) {
			router.push({
				pathname: "/auth/access", 
				query: { returnUrl: router.asPath },
			});
		} else {
			setChecked(true);
		}
	},[auth, router.isReady]);

	if (!checked) {
		return null;
	}

	// If got here, it means that the redirect did not occur, and that tells us that the user is
	// authenticated / authorized.

	return <>{children}</>;
};

AuthGuard.propTypes = {
  	children: PropTypes.node,
};
