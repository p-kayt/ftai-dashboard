import { Grid } from '@mui/material'
import React from 'react'
import UserListChat from './UserListChat'
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from 'api/usersApi';
import UserChatWindow from './UserChatWindow';
import { useState } from 'react';

export default function ChatCustomer() {
    const {
        data: users,
        isSuccess,
    } = useQuery({
        queryKey: ["users"],
        queryFn: getAllUsers
    });

    const listUser = users?.data.filter((user) => user.roleId === 1)

    const [activeUserId, setActiveUserId] = useState(null);

    return (
        <Grid container spacing={2}>
            {isSuccess && <Grid item xs={3}>
                <UserListChat listUser={listUser} activeUserId={activeUserId} setActiveUserId={setActiveUserId} />
            </Grid>}
            <Grid item xs={9}>
                <UserChatWindow listUser={users?.data} activeUserId={activeUserId} />
            </Grid>
        </Grid>
    )
}
