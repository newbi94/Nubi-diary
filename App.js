import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import Navigator from "./Navigator";
import Realm from "realm";
import AppLoading from "expo-app-loading";
import { DBContext } from "./context";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { AdMobBanner } from "react-native-admob";
import { setTestDeviceIDAsync } from "expo-ads-admob";

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
//onLayout을 onReady로 대체해야 할 수도 있다.
//오히려 이번 경우엔 onLayout이 아니면 로딩화면을 벗어나지 않는다.
//나의 에러노트를 참조하자면, navigation에 onLayoutRootView를 넣을 때에만
//onReady로 써준다. onReady는 navigation 한정이다.
