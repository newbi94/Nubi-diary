import React, { useContext } from "react";

export const DBContext = React.createContext();

export const useDB = () => {
  return useContext(DBContext);
};
//const realm = useContext(DBContext);를 매 컴포넌트마다 해주는 것 대신,
//useDB를 만들면 const realm = useDB(); 이렇게 줄이고, import할 것도
//useDB하나로 줄게 된다.

//Context를 따로 만들지 않으면
//App.js -> navigator.js -> screens/Write.js -> App.js
//이렇게 import가 이루어져 오류가 난다.
//import { DBContext } from "../App"; 따로 만들지 않으면 이렇게
//Write.js에서 /App을 import하는 것을 확인할 수 있다.
