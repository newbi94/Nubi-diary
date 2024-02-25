import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import Navigator from "./Navigator";
import Realm from "realm";
import AppLoading from "expo-app-loading";
import { DBContext } from "./context";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int", //int -> 정수(integer)
    emotion: "string?", //물음표를 붙이면 선택사항이 된다.
    message: "string",
  },
  primaryKey: "_id", //id
};
//데이터의 형태를 설정
//properties부분에 우리가 가질 데이터의 항목과 그 type을 작성한다.
//Schema는 여러개를 가질 수 있는데, 여러개를 만들었다면
//아래 const connection~ 부분에서 schema: [Schema1, Schema2, ...]
//이런식으로 등록할 수 있다. 각 Schema의 key역할을 하는 것이 name 부분이다.

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
    } finally {
      setReady(true);
    }
  }
  //데이터베이스를 Realm.open을 통해 열어 다른 컴포넌트와 연결을 구성할 준비를 마쳤다.
  //setRealm에 이러한 "연결"을 담아준 것.
  useEffect(() => {
    startLoading();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      await SplashScreen.hideAsync();
      console.log("Ready to hide");
    }
  }, [ready]);

  if (!ready) return null;
  //appLoading은 사용할 수 없다. SplashScreen을 설치하여 사용하자.
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
//onLayout을 onReady로 대체해야 할 수도 있다. 나의 에러노트 참조.
//우리의 어플을 Context로 감싸 모든 컴포넌트에서 realm에 접근할 수 있게 한다.
//Context는 박스라고 생각하면 되는데 React API라고 한다.
//우리가 원하는 것을 넣을 수 있는 박스를 제공한다
