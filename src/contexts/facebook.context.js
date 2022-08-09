import { createContext, useCallback, useContext } from "react";
import FacebookApiClient from "../api-clients/fb.api-client";
import { FB_APP } from "../config";

export const FacebookContext = createContext({});

export function useFacebook() {
  return useContext(FacebookContext);
}

export function FacebookProvider({ children }) {
  
  const initializeSdkOnClient = useCallback(() => {
    console.log("Init SDK",FB_APP);
    return FacebookApiClient.initializeSdkOnClient({
      appId: FB_APP.ID,
      version: FB_APP.SDK_VERSION,
    });
  }, []);

  const loginOnClient = useCallback(async () => {
    console.log("LOGIN");
    return FacebookApiClient.loginOnClient({
      scope: FB_APP.FANPAGE_CONN_SCOPE,
    }).then(({ data, error }) => {
      if (error) {
        console.error(error);
      }

      return data || null;
    });
  }, []);

  const getPagesManagedByUserOnClient = useCallback(() => {
    return FacebookApiClient.getAllPagesManagedByUserOnClient().then(
      ({ data, error }) => {
        if (error) {
          console.error(error);
        }

        return data?.pages || null;
      }
    );
  }, []);

  return (
    <FacebookContext.Provider
      value={{
        initializedSdk: FacebookApiClient.initializedSdk,
        initializeSdkOnClient,
        loginOnClient,
        getPagesManagedByUserOnClient,
      }}
    >
      {children || null}
    </FacebookContext.Provider>
  );
}
