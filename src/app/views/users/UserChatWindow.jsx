import { Button, TextField } from "@mui/material";
import { db } from "api/firebaseConfig";
import { getRoomId } from "app/utils/utils";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import RenderMessage from "./RenderMessage";

export default function UserChatWindow({ activeUserId, listUser }) {
  console.log("activeUserId", activeUserId);
  const textRef = useRef("");
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    createRoomIfNotExists();

    let roomId = getRoomId("StaffIdToChat", activeUserId);
    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    const q = query(messageRef, orderBy("createdAt", "asc"));

    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setMessages([...allMessages]);
    });
    return unsub;
  }, [activeUserId]);

  const createRoomIfNotExists = async () => {
    let roomId = getRoomId("StaffIdToChat", activeUserId);
    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      createdAt: Timestamp.fromDate(new Date())
    });
  };

  const handleSendMassage = async () => {
    console.log(textRef.current);
    if (textRef.current) {
      let message = textRef.current.value;
      if (!message.trim()) {
        return;
      }
      try {
        let roomId = getRoomId("StaffIdToChat", activeUserId);
        const docRef = doc(db, "rooms", roomId);
        const messagesRef = collection(docRef, "messages");
        textRef.current.value = ""; // Clear the input field
        const newDoc = await addDoc(messagesRef, {
          userId: "StaffIdToChat",
          text: message,
          profileUrl: "none",
          senderName: "Store Staff",
          createdAt: Timestamp.fromDate(new Date())
        });
        console.log("new message id", newDoc.id);
      } catch (error) {
        console.log("Message", error.message);
      }
    }
  };

  return (
    <div>
      <RenderMessage messages={messages} activeUserId={activeUserId} />
      <div
        style={{
          gap: "20px",
          width: "100%",
          padding: "20px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TextField
          inputRef={inputRef}
          onChange={(event) => (textRef.current = event.target)}
          margin="normal"
          required
          sx={{
            width: "80%"
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSendMassage();
              event.preventDefault(); // Prevents the addition of a new line in the TextField after pressing 'Enter'
            }
          }}
        />
        <Button sx={{ width: "10%" }} color="info" variant="contained" onClick={handleSendMassage}>
          Send
        </Button>
      </div>
    </div>
  );
}
