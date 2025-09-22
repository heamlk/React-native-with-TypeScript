import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { jwtDecode } from "jwt-decode";
import { ReactNode, useEffect, useState } from "react";
import { Alert, View } from "react-native";

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

type DescopeProviderProps = {
  children?: ReactNode;
};

export default function DescopeProvider({ children }: DescopeProviderProps) {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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
      )
        return;

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
      Alert.alert(
        "Authentication error",
        (
          response as AuthSession.AuthSessionResult & {
            params?: { error_description?: string };
          }
        ).params?.error_description || "Something went wrong"
      );
    }
  }, [discovery, request, response]);

  useEffect(() => {
    if (authTokens?.access_token) {
      const decoded = jwtDecode<UserInfo>(authTokens.access_token);
      setUserInfo(decoded);
    }
  }, [authTokens]);

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
    } catch (error) {
      console.error("Failed to revoke token:", error);
    }
  };

  // return (
  //   <View style={{ flex: 1 }}>
  //     <Text style={{ color: "white" }}>{redirectUri}</Text>
  //     {authTokens ? (
  //       <Dashboard userInfo={userInfo} onLogout={logout} />
  //     ) : (
  //       <LoginScreen onLogin={() => promptAsync()} request={request} />
  //     )}
  //   </View>
  // );

  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{ height: "auto" }}>
        <Button
          disabled={!request}
          title="Login"
          onPress={() => promptAsync()}
          color="#841584"
        />
      </View>
      {userInfo && (
        <Text style={{ color: "red" }}>{JSON.stringify(userInfo)}</Text>
      )} */}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
