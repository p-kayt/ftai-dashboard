import { LoadingButton } from '@mui/lab';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewUser } from 'api/usersApi';
import Loading from 'app/components/MatxLoading';
import React from 'react';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '5px',
    border: '1px solid #E0E0E0',
    p: 4,
};

export default function UserPage({ data, columns, isSuccess, refetch }) {
    const queryClient = useQueryClient();

    const addNewUser = useMutation({
        mutationKey: ["createUser"],
        mutationFn: (data) => createNewUser(data),
        onSuccess: () => {
            refetch()
            queryClient.invalidateQueries("users");
            handleClose();
        },
        onError: (error) => { }
    });
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        profilePicture: '',
        roleId: 2,
        gender: 1,
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleGenderChange = (event) => {
        console.log(event.target.value)
        setFormData({ ...formData, gender: event.target.value });
    };
    const handleRoleChange = (event) => {
        console.log(event.target.value)
        setFormData({ ...formData, roleId: event.target.value });
    };

    const handleSubmit = async () => {
        await addNewUser.mutate(formData)
    };
    if (!data) {
        return <Loading />
    }
    const UserStatusCounts = [
        { title: 'All Users', count: data?.length || 0 },
        { title: 'Active Users', count: data?.filter((user) => user.isActive === true).length || 0 },
        { title: 'Inactive Users', count: data?.filter((order) => order.isActive === false).length || 0 },
    ];
    const UserStatusCard = ({ title, count, icon }) => (
        <Box
            sx={{
                width: '150px',
                borderRadius: '5px',
                border: '1px solid #E0E0E0',
                display: 'flex',
                flexDirection: 'row',
                height: '80px',
                alignItems: 'center',
                padding: '10px',
                gap: '10px',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '12px', fontFamily: 'Poppins', fontWeight: 500, color: '#9BA4B5' }}>{title}</div>
                <div style={{ fontSize: '20px', fontFamily: 'Poppins', fontWeight: 700, color: title === 'Inactive Users' ? 'red' : 'inherit' }}>{count}</div>
            </div>
        </Box>)
    return (
        <div style={{ marginLeft: "20px", marginRight: "20px", marginTop: "20px" }}>

            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px' }}>
                {UserStatusCounts.map((status) => (
                    <UserStatusCard key={status.title} {...status} />
                ))}
            </Box>
            <Box>
                <Button onClick={handleOpen} color='inherit' sx={{ marginBottom: '20px', fontWeight: 600, fontFamily: 'Poppins', backgroundColor: '#3D4674', color: 'white', ":hover": { backgroundColor: '#53609D' } }}>Add new Employee</Button>
                <Modal
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <Box sx={style}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="fullName"
                            label="Full Name"
                            name="fullName"
                            autoComplete="fullName"
                            autoFocus
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="phone"
                            label="Phone Number"
                            name="phone"
                            autoComplete="tel"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="profilePicture"
                            label="Profile picture"
                            name="profilePicture"
                            autoComplete="tel"
                            value={formData.profilePicture}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth sx={{ marginTop: '15px' }}>
                            <InputLabel id="demo-simple-select-label">Permission</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="roleId"
                                label="Permission"
                                onChange={handleRoleChange}
                                placeholder='Your Permissions'
                                value={formData.roleId}
                            >
                                <MenuItem value={2}>Staff</MenuItem>
                                <MenuItem value={3}>Manager</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ marginTop: '25px' }}>
                            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="gender"
                                label="Gender"
                                onChange={handleGenderChange}
                                placeholder='Your gender'
                                value={formData.gender}
                            >
                                <MenuItem value={1}>Male</MenuItem>
                                <MenuItem value={2}>Female</MenuItem>
                            </Select>
                        </FormControl>
                        <LoadingButton loading={addNewUser.isPending} onClick={handleSubmit} variant="contained" sx={{ mt: 2, width: '100%' }}>
                            Register
                        </LoadingButton>
                    </Box>
                </Modal>
            </Box>
            {isSuccess && <DataGrid
                rows={data}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 }
                    }
                }}
                pageSizeOptions={[10, 20]}
            />}
        </div>
    )
}
