import React from "react";
import TopBar from "./TopBar";

function Layout(props) {
  return (
    <div>
      <TopBar />
      {props.children}
    </div>
  );
}
export default Layout;
