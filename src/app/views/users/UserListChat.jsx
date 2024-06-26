import { Avatar, IconButton } from "@mui/material";
import { db } from "api/firebaseConfig";
import { getRoomId } from "app/utils/utils";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UserListChat({ listUser, setActiveUserId, activeUserId }) {
  const [lastMessages, setLastMessages] = useState({});
  useEffect(() => {
    const unsubscribes = {};

    listUser.forEach((user) => {
      const roomId = getRoomId("StaffIdToChat", user.id);
      const docRef = doc(db, "rooms", roomId);
      const messageRef = collection(docRef, "messages");
      const q = query(messageRef, orderBy("createdAt", "desc"));

      unsubscribes[user.id] = onSnapshot(q, (snapshot) => {
        const allMessages = snapshot.docs.map((doc) => doc.data());
        // Check if there are any messages for this user
        if (allMessages.length > 0) {
          setLastMessages((prevState) => ({
            ...prevState,
            [user.id]: allMessages[0]
          }));
        } else {
          setLastMessages((prevState) => ({
            ...prevState,
            [user.id]: null
          }));
        }
      });
    });

    return () => {
      Object.values(unsubscribes).forEach((unsub) => unsub());
    };
  }, [listUser]);


  const renderLastMessage = (userId) => {
    const lastMessage = lastMessages[userId];
    if (!lastMessage) return "...";
    if (userId === "StaffIdToChat") return `You: ${lastMessage.text}`;
    return lastMessage.userId === "StaffIdToChat" ? `You: ${lastMessage.text}` : lastMessage.text;
  };

  const handleShare = (id) => {
    setActiveUserId(id);
  };
  const handleDeleteUser = async (userId) => {
    try {
      // Delete the document corresponding to the user
      const roomId = getRoomId("StaffIdToChat", userId);
      await deleteDoc(doc(db, "rooms", roomId));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };
  return (
    <div>
      {listUser
        .filter(user => lastMessages[user.id] !== null)
        .sort((a, b) => {
          const lastMessageA = lastMessages[a.id]?.createdAt;
          const lastMessageB = lastMessages[b.id]?.createdAt;
          return lastMessageB - lastMessageA;
        })
        .map((user) => (
          <div
            key={user.id}
            style={{
              display: "flex",
              flexDirection: "row",
              height: "60px",
              width: "350px",
              padding: "10px",
              gap: "10px",
              borderBottom: "1px solid #E0E0E0",
              ...(user.id === activeUserId && {
                borderRight: "3px solid #53609D",
                backgroundColor: "#CCD1E6"
              })
            }}
            onClick={() => handleShare(user.id)}
          >
            <Avatar src={user.profilePicture} />
            <div
              style={{
                display: "flex",
                width: "90%",
                flexDirection: "row",
                gap: "10px",
                justifyContent: "space-between"
              }}
            >
              <div
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  width: "100%",
                  overflowX: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  scrollbarWidth: "none", /* For Firefox */
                  msOverflowStyle: "none", /* For Internet Explorer and Edge */
                  "&::-webkit-scrollbar": {
                    display: "none"
                  },
                  cursor: "default"
                }}
              >
                <div>{user.fullName}</div>
                {/* Render last message for each user */}
                <div
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    color: "gray",
                    fontSize: "13px",
                    width: "220px"
                  }}
                >
                  {renderLastMessage(user.id)}
                </div>
              </div>
              <IconButton onClick={() => handleDeleteUser(user.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        ))}
    </div>
  );

}
