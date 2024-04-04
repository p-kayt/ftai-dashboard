import React from "react";
import Categories from "./others/Categories";
import Promotion from "./others/Promotion";
import Colors from "./others/Colors";
import Sizes from "./others/Sizes";

const Others = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          minHeight: "300px",
          margin: "20px 0px 0px 0px"
        }}
      >
        <div style={{ flex: "2" }}>
          <Promotion />
        </div>
        <div style={{ flex: "1" }}>
          <Categories />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          minHeight: "300px",
          margin: "20px 0px 0px 0px"
        }}
      >
        <div style={{ flex: "1" }}>
          <Colors />
        </div>
        <div style={{ flex: "1" }}>
          <Sizes />
        </div>
      </div>
    </div>
  );
};

export default Others;
