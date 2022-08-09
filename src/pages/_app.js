import { useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import { Toaster } from "react-hot-toast";
import { Provider as ReduxProvider } from "react-redux";
import nProgress from "nprogress";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { RTL } from "../components/rtl";
import { SettingsButton } from "../components/settings-button";
import { SplashScreen } from "../components/splash-screen";
import { SettingsConsumer, SettingsProvider,} from "../contexts/settings-context";
import { AuthConsumer, AuthProvider } from "../contexts/auth-context";
import { gtmConfig } from "../config";
import { gtm } from "../lib/gtm";
import { store } from "../store";
import { createTheme } from "../theme";
import { createEmotionCache } from "../utils/create-emotion-cache";
import "../i18n";
import "@cabineat/ui-react/dist/assets/css/styles.min.css";
import { SITE_NAME } from "../constant";
import { FacebookProvider } from "../contexts/facebook.context";
import "react-datepicker/dist/react-datepicker.css";
import '@9gustin/react-notion-render/dist/index.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css'
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'


Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

	const getLayout = Component.getLayout ?? ((page) => page);

	useEffect(() => {
		gtm.initialize(gtmConfig);
	}, []);

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>{SITE_NAME}</title>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<ReduxProvider store={store}>
				{/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
					{/* <AuthProvider> */}
					<FacebookProvider>
						<SettingsProvider>
							<SettingsConsumer>
								{({ settings }) => (
									<ThemeProvider
										theme={createTheme({
											direction: settings.direction,
											responsiveFontSizes: settings.responsiveFontSizes,
											mode: settings.theme,
										})}
									>
										{/* <RTL direction={settings.direction}> */}
										<CssBaseline />
										<Toaster position="top-center" />
										{/* <SettingsButton /> */}
										{/* <AuthConsumer>
											{(auth) =>
											!auth.isInitialized ? (
												<SplashScreen />
											) : (
												getLayout(<Component {...pageProps} />)
											)
											}
										</AuthConsumer> */}
										{getLayout(<Component {...pageProps} />,pageProps)}
										{/* </RTL> */}
									</ThemeProvider>
								)}
							</SettingsConsumer>
						</SettingsProvider>
					</FacebookProvider>
					{/* </AuthProvider> */}
				{/* </LocalizationProvider> */}
			</ReduxProvider>
		</CacheProvider>
	);
};

export default App;
