import React from "react";
import MessageItem from "./MessageItem";

export default function RenderMessage({ messages, activeUserId }) {
  console.log(messages);

  return (
    <div style={{ height: "70vh", margin: "20px" }}>
      {messages.map((mess, index) => (
        <MessageItem message={mess} activeUserId={activeUserId} key={index} />
      ))}
    </div>
  );
}
