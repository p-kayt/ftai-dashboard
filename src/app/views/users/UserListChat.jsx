import { Avatar } from '@mui/material';
import { db } from 'api/firebaseConfig';
import { getRoomId } from 'app/utils/utils';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function UserListChat({ listUser, setActiveUserId, activeUserId }) {
    const [lastMessages, setLastMessages] = useState({});

    useEffect(() => {
        const unsubscribes = {};

        listUser.forEach((user) => {
            const roomId = getRoomId('StaffIdToChat', user.id);
            const docRef = doc(db, 'rooms', roomId);
            const messageRef = collection(docRef, 'messages');
            const q = query(messageRef, orderBy('createdAt', 'desc'));

            unsubscribes[user.id] = onSnapshot(q, (snapshot) => {
                const allMessages = snapshot.docs.map(doc => doc.data());
                setLastMessages(prevState => ({
                    ...prevState,
                    [user.id]: allMessages[0] || null
                }));
            });
        });

        return () => {
            Object.values(unsubscribes).forEach(unsub => unsub());
        };
    }, [listUser]);

    const renderLastMessage = (userId) => {
        const lastMessage = lastMessages[userId];
        if (!lastMessage) return 'Waiting for customer';
        if (userId === 'StaffIdToChat') return `You: ${lastMessage.text}`;
        return lastMessage.userId === 'StaffIdToChat' ? `You: ${lastMessage.text}` : lastMessage.text;
    };

    const handleShare = (id) => {
        setActiveUserId(id);
    };

    return (
        <div>
            {listUser.map((user) => (
                <div
                    key={user.id}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '60px',
                        padding: '10px',
                        gap: '10px',
                        borderBottom: '1px solid #E0E0E0',
                        ...(user.id === activeUserId && { borderRight: '3px solid #53609D', backgroundColor: '#CCD1E6' }),
                    }}
                    onClick={() => handleShare(user.id)}
                >
                    <Avatar src={user.profilePicture} />
                    <div>
                        <div style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                            <div>{user.fullName}</div>
                            {/* Render last message for each user */}
                            <div style={{ fontFamily: 'Poppins', fontWeight: 400, color: 'gray', fontSize: '13px' }}>
                                {renderLastMessage(user.id)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
