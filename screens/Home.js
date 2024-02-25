import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Platform, UIManager, LayoutAnimation } from "react-native";
import { useDB } from "../context";
import { deleteFile } from "realm";

const View = styled.View`
  flex: 1;
  padding-top: 100px;
  padding: 0px 30px;
  background-color: ${colors.bgColor};
`;
const Title = styled.Text`
  color: ${colors.textColor};
  font-size: 38px;
  font-weight: 500;
  margin-bottom: 100px;
  margin-top: 20px;
`;
const Btn = styled.TouchableOpacity`
  position: absolute;
  bottom: 50px;
  right: 50px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.btnColor};
  elevation: 5;
  //box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
`;
//elevation은 버튼에 그림자 효과를 줘서 입체감을 살린다.
//ios는 box-shadow를 사용한다.
const Record = styled.View`
  background-color: ${colors.cardColor};
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  border-radius: 10px;
`;

const Emotion = styled.Text`
  font-size: 24px;
  margin-right: 10px;
`;
const Message = styled.Text`
  font-size: 18px;
`;
const Separator = styled.View`
  height: 10px;
`;
const DeleteBtn = styled.TouchableOpacity``;
const DeleteBtnBox = styled.View`
  flex-direction: row;
  justify-content: left;
`;

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
//android개발자는 LayoutAnimate구현을 위해 위 코드를 작성해야 하며,
//Platform, UIManager 또한 import해줘야 한다.
//해석하자면, OS가 안드로이드인지 확인하고, UIManager가 이러한 function을
//가지고 있는 지도 확인한 후, 이 function을 호출(true)하는 것.
//이렇게 작성하고 아래 useEffect부분에서 setStating보다 먼저
//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)를 적는다.

const Home = ({ navigation: { navigate } }) => {
  const realm = useDB();
  const [feelings, setFeelings] = useState([]);

  /* useEffect(() => {
    const feelings = realm.objects("Feeling");
    setFeelings(feelings);
    feelings.addListener(() => {
      const feelings = realm.objects("Feeling");
      setFeelings(feelings);
    });
    return () => {
      feelings.removeAllListeners();
    };
  }, []); */
  //feelings에 addListener를 달아 feeling에 변화가 생기면
  //setState하여 업데이트 해준다.
  //return부분은 언마운트시 Listeners를 없애주는 기능이다.

  useEffect(() => {
    const feelings = realm?.objects("Feeling");
    //realm에 저장되어 있는 데이터 중 name이 Feeling인 객체들을 꺼냈다.
    //parse나 stringify, 등등 해야하는 일이 많은 asyncStorage에 비해
    //쉽고 편하다.
    if (feelings) {
      feelings.addListener((feelings, changes) => {
        LayoutAnimation.spring();
        //LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);를
        //위처럼 줄여서 쓸 수도 있다. 공식문서를 참조하자.
        setFeelings(feelings.sorted("_id", true));
        //변화에 따라 업데이트 된 feelings의 _id 크기가 큰 순서대로 정렬하여
        //setStating한다 (true => 큰 순서, false => 작은 순서)
      });
      return () => {
        feelings.removeAllListeners();
      };
    }
  }, []);

  //addListener를 통해 변화가 생길 때마다(그 어떤 변화라도) 새롭게 setStating한다.
  //그에 따라 당연히 re-rendering 되기 때문에 실시간으로 업데이트 되는 것을
  //눈으로 확인할 수 있다.
  //LayoutAnimation은 state가 변경될 때 나타날 layout변화를 animate해준다.
  //setStating해주는 코드 보다 위에 써준다.
  const deleteFeeling = (id) => {
    realm.write(() => {
      const feeling = realm.objectForPrimaryKey("Feeling", id);
      //name이 Feeling인 realm 데이터를 id를 통해 찾아 feeling에 담는다.
      //즉, deleteBtn을 클릭하면 해당 데이터를 타겟한다.
      realm.delete(feeling);
      //그리고 그 데이터를 삭제한다.
    });
  };
  //realm의 삭제나 추가, 수정 등의 모든 modify는 realm.write를 통해 이뤄진다.

  return (
    <View>
      <Title>My journal</Title>
      <FlatList
        data={feelings}
        contentContainerStyle={{
          paddingVertical: 10,
        }}
        keyExtractor={(feeling) => feeling._id + ""}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => (
          <Record>
            <Emotion>{item.emotion}</Emotion>
            <Message>{item.message}</Message>
            <DeleteBtn onPress={() => deleteFeeling(item._id)}>
              <Ionicons name="logo-xbox" color="red" size={20} />
            </DeleteBtn>
          </Record>
        )} // => { ~ }식으로 쓰면 에러도 안뜨고 render도 되지 않는다.
        //return ( ~ )을 추가하던지, 애초에 소괄호로 감싸주던지 해야한다.
      />
      <Btn onPress={() => navigate("Write")}>
        <Ionicons name="add" colors="white" size={40} />
      </Btn>
    </View>
  );
};

export default Home;
