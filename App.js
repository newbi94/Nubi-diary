import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import Navigator from "./Navigator";
import Realm from "realm";
import AppLoading from "expo-app-loading";
import { DBContext } from "./context";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int",
    emotion: "string",
    message: "string",
  },
  primaryKey: "_id",
};

export default function App() {
  const [ready, setReady] = useState(false);
  const [realm, setRealm] = useState(null);

  async function startLoading() {
    try {
      const connection = await Realm.open({
        path: "diaryDB",
        schema: [FeelingSchema],
      });
      setRealm(connection);
      await setTestDeviceIDAsync("EMULATOR");
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    startLoading();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      await SplashScreen.hideAsync();
      console.log("Ready to hide");
    }
  }, [ready]);

  if (!ready) return console.log("ready...");

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <DBContext.Provider value={realm}>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </DBContext.Provider>
    </View>
  );
}
