import { createContext, useCallback, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import cookieLib from "../lib/cookie.lib";
import AuthApiClient from "../api-clients/auth.api-client";
import { useRouter } from 'next/router';

const initialState = {
	isAuthenticated: false,
	isInitialized: false,
	user: null,
};

const handlers = {
	INITIALIZE: (state, action) => {
		const { isAuthenticated, user } = action.payload;

		return {
			...state,
			isAuthenticated,
			isInitialized: true,
			user,
		};
	},
	ACCESS: (state, action) => {
		const { user } = action.payload;
		return {
			...state,
			isAuthenticated: true,
			user,
		};
	},

	LOGOUT: (state) => ({
		...state,
		isAuthenticated: false,
		user: null,
	}),

	REGISTER: (state, action) => {
		const { user } = action.payload;

		return {
			...state,
			isAuthenticated: true,
			user,
		};
	},
};

const reducer = (state, action) =>
handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
	// ...initialState,
	// platform: "JWT",
	// access: () => Promise.resolve(),
	// logout: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
	const router = useRouter();
	const { children } = props;
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		initialize();
	}, []);

	const initialize = useCallback(async () => {
		const token = cookieLib.getCookie("token");		
		if (token) {
			const apiRet = await AuthApiClient.getProfileFromToken(token);
			console.log("user: ",apiRet)
			if (apiRet?.success) {
				if (apiRet?.data) {
					dispatch({
						type: "INITIALIZE",
						payload: {
							isAuthenticated: true,
							user: {
								fullname: apiRet?.data?.fullname,
								phone: apiRet?.data?.phone,
								email: apiRet?.data?.email,
								cabin_id: apiRet?.data?.id,
								tier: apiRet?.data?.tier,
								avatar: apiRet?.data?.avatar,
								id_front_image: apiRet?.data?.id_front_image,
								id_back_image: apiRet?.data?.id_back_image,
								isKYC: (apiRet?.data?.id_front_image && apiRet?.data?.id_back_image) ? true : false,
								notion_id: apiRet?.data?.notion_id
							},
						},
					});
					return;
				}
			}
		}

		dispatch({
			type: "INITIALIZE",
			payload: {
				isAuthenticated: false,
				user: null
			},
		});
	}, []);	

	const access = async (atk, profile) => {		
		const apiRet = await AuthApiClient.accessViaCabinID(atk, profile)

		if(apiRet?.success) {			
			dispatch({
				type: "ACCESS",
				payload: {
					user: {
						fullname: apiRet?.data?.user?.fullname?.title?.[0]?.plain_text,
						phone: apiRet?.data?.phone?.rich_text?.[0]?.plain_text,
						email: apiRet?.data?.email?.rich_text?.[0]?.plain_text,
						cabin_id: apiRet?.data?.user?.cabin_id?.rich_text?.[0]?.plain_text,
						tier: apiRet?.data?.tier?.select?.name,
						avatar: apiRet?.data?.avatar?.files?.[0]?.external?.url || null,
						isKYC: (apiRet?.data?.kyc_id_image_back?.files?.length > 0 && apiRet?.data?.kyc_id_image_front?.files?.length > 0) ? true : false,
						notion_id: apiRet?.data?.notion_id
					}
				},
			});		

			cookieLib.updateCookie('token', apiRet?.data?.token)
			router.push('/');
			
		} else {
			console.log(data?.error)
		}
	};

	const logout = useCallback(async () => {
		cookieLib.deleteCookie("token");
		dispatch({ type: "LOGOUT" });
	}, [dispatch]);

	return (
		<AuthContext.Provider
			value={{
				...state,
				platform: "cabin-id",
				access,
				logout,
			}}
		>
		{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;
