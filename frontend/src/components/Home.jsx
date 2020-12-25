import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//axios Instance ????, Redirect ??????
function Home() {
  const [userList, setUserList] = useState([]);
  
  return (
    <div>
      <h1>This is Home Page</h1>
    </div>
  );
}
export default Home;
