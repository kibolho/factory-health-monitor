import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { ErrorBoundary, SplashScreen, Stack } from "expo-router";
import { Try } from "expo-router/build/views/Try";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { ReactQueryProvider } from "../providers/reactQueryProvider";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AuthProvider } from "../providers/authProvider";

export { ErrorBoundary } from "expo-router";

if (__DEV__) {
  require("../infra/ReactotronConfig");
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const colorScheme = useColorScheme();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Try catch={ErrorBoundary}>
      <ReactQueryProvider>
        <KeyboardProvider>
          <AuthProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack>
                <Stack.Screen
                  name="login/index"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="signup/index"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal" }}
                />
              </Stack>
            </ThemeProvider>
          </AuthProvider>
        </KeyboardProvider>
      </ReactQueryProvider>
    </Try>
  );
}
