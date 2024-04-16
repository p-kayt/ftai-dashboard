import React from 'react';

export default function MessageItem({ message, activeUserId }) {
    const isCurrentUser = 'StaffIdToChat' === message.userId;
    const messageStyle = isCurrentUser ? {
        alignSelf: 'flex-end',
        backgroundColor: 'lightblue',
        color: 'black'
    } : {
        alignSelf: 'flex-start',
        backgroundColor: 'lightgray',
        color: 'black'
    };

    return (
        <div key={message.userId} style={{ display: 'flex', justifyContent: isCurrentUser ? 'flex-end' : 'flex-start', marginBottom: '20px' }}>
            <div style={{ maxWidth: '80%' }}>
                <div style={{ display: 'flex', padding: '10px', borderRadius: '10px', ...messageStyle }}>
                    <div>{message.text}</div>
                </div>
            </div>
        </div>
    );
}
