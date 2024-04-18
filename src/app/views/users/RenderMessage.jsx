import { Typography } from "@mui/material";
import MessageItem from "./MessageItem";

export default function RenderMessage({ messages, activeUserId }) {
  if (messages.length > 0) {
    return (
      <div style={containerStyle}>
        <Typography align="center">Đây là khởi đầu của cuộc trò chuyện</Typography>
        {messages.map((mess, index) => (
          <div key={index}>
            <MessageItem message={mess} activeUserId={activeUserId} />
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div
        style={{
          ...containerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Typography>Hãy nhắn gì đó với khách hàng</Typography>
      </div>
    );
  }
}

const containerStyle = {
  height: "70vh",
  margin: "20px",
  overflowY: "auto",
  scrollbarWidth: "none",
  "-ms-overflow-style": "none",
  border: "1px solid #C0C0C0",
  borderRadius: "10px",
  padding: "10px"
};
