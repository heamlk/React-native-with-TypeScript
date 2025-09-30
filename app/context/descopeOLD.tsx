import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "../shared/components/reusable";
import storage from "../shared/storage/storage";
import vars from "../styles/vars";

WebBrowser.maybeCompleteAuthSession();

const descopeProjectId = process.env.EXPO_PUBLIC_DESCOPE_PROJECT_ID!;
const descopeUrl = `https://api.descope.com/${descopeProjectId}`;

const redirectUri = AuthSession.makeRedirectUri({
  scheme: "bfflai",
  path: "auth",
});

type AuthTokens = {
  access_token: string;
  refresh_token?: string;
  [key: string]: any;
};

type UserInfo = {
  [key: string]: any;
};

export type DescopeContextType = {
  ready: boolean;
  errorMessage: string | null;
  signupButton: () => React.JSX.Element;
  authTokens: AuthTokens | null;
  userInfo: UserInfo | null;
  login: (
    options?: AuthSession.AuthRequestPromptOptions | undefined
  ) => Promise<AuthSession.AuthSessionResult>;
  logout: () => Promise<void>;
};
export type DescopeProviderProps = { children: ReactNode };

const DescopeContext = createContext<DescopeContextType | null>(null);

export default function DescopeProvider({ children }: DescopeProviderProps) {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const discovery = AuthSession.useAutoDiscovery(descopeUrl);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: descopeProjectId,
      responseType: AuthSession.ResponseType.Code,
      redirectUri,
      usePKCE: true,
      scopes: ["openid", "profile", "email"],
      extraParams: {
        flow: "sign-up-or-in",
      },
    },
    discovery
  );

  useEffect(() => {
    const exchangeFn = async () => {
      if (
        !response ||
        response.type !== "success" ||
        !response.params?.code ||
        !request?.codeVerifier ||
        !discovery?.tokenEndpoint
      ) {
        setErrorMessage(null);
        return;
      }

      try {
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: descopeProjectId,
            code: response.params.code,
            redirectUri,
            extraParams: {
              code_verifier: request.codeVerifier,
            },
          },
          discovery || null
        );

        const tokens: AuthTokens = {
          access_token: tokenResponse.accessToken,
          refresh_token: tokenResponse.refreshToken,
          ...tokenResponse,
        };
        setAuthTokens(tokens);
      } catch (error) {
        console.error("Token exchange failed:", error);
      }
    };

    if (response?.type === "success") {
      exchangeFn();
    } else if (response?.type === "error") {
      const responseErrorMessage =
        (
          response as AuthSession.AuthSessionResult & {
            params?: { error_description?: string };
          }
        ).params?.error_description || "Something went wrong";
      setErrorMessage(responseErrorMessage);
    }
  }, [discovery, request, response]);

  useEffect(() => {
    if (authTokens?.access_token) {
      const decoded = jwtDecode<UserInfo>(authTokens.access_token);
      setUserInfo(decoded);
      storage.set("userInfo", JSON.stringify(decoded));
    }
  }, [authTokens]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storageUserInfo = await storage.getString("userInfo");

        if (storageUserInfo) {
          try {
            const parsedUserInfo = JSON.parse(storageUserInfo);
            setUserInfo(parsedUserInfo);
          } catch (err) {
            console.error("Invalid JSON for userInfo:", storageUserInfo, err);
          }
        }
      } catch (error) {
        console.error("Failed to load data from storage:", error);
      }
    };

    loadUserData();
  }, []);

  const logout = async () => {
    if (!authTokens?.refresh_token || !discovery?.revocationEndpoint) return;

    try {
      await AuthSession.revokeAsync(
        {
          clientId: descopeProjectId,
          token: authTokens.refresh_token,
        },
        discovery || null
      );
      setAuthTokens(null);
      setUserInfo(null);
      storage.delete("userInfo");
    } catch (error) {
      console.error("Failed to revoke token:", error);
    }
  };

  const signupButton = () => {
    const styles = StyleSheet.create({
      container: {
        width: 120,
        height: 50,
        borderRadius: vars.borderSm,
        backgroundColor: vars.purple1,
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      },
      text: {
        fontSize: 18,
        fontWeight: 600,
        color: vars.white,
      },
    });

    return (
      <Pressable>
        <Text>Login</Text>
      </Pressable>
    );
  };

  const value = {
    ready: !!request,
    errorMessage,
    signupButton,
    authTokens,
    userInfo,
    login: promptAsync,
    logout,
  };

  return (
    <DescopeContext.Provider value={value}>{children}</DescopeContext.Provider>
  );
}

export const useDescope = () => {
  const context = useContext(DescopeContext);
  if (!context) throw new Error("useDescope can't be null");
  return context;
};
