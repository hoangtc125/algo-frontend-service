import { Typography, Avatar, List, ListItem, ListItemText, Box, Grid, Badge, Chip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useSelector } from 'react-redux';

import { accountSelector } from '../../redux/selectors'
import { getProviderIcon } from '../../utils/kind';

const AccountProfile = () => {
    const account = useSelector(accountSelector)
    console.log("re-render");

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            className="p-0 sm:p-4"
        >
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Box className="flex flex-col items-center space-y-1 sm:space-y-3">
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                account?.verify?.status ? <VerifiedIcon fontSize="large" color="primary" /> : <></>
                            }
                        >
                            <Avatar
                                alt='avatar'
                                src={account?.photo_url}
                                className='!w-24 !h-24 sm:!w-52 sm:!h-52'
                            />
                        </Badge>
                        <Typography variant="h6">{account?.name}</Typography>
                        <Typography variant="subtitle1">{account?.email}</Typography>
                        <Typography variant="subtitle1">{getProviderIcon(account?.provider)}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} className='w-full'>
                    <List className='w-full grid grid-cols-1 sm:grid-cols-2'>
                        <ListItem>
                            <ListItemText primary="School" secondary={account?.verify?.detail?.school} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Major" secondary={account?.verify?.detail?.major} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Full Name" secondary={account?.verify?.detail?.fullname} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Birth" secondary={account?.verify?.detail?.birth} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Expired Card" secondary={account?.verify?.detail?.expired_card} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Student Number" secondary={account?.verify?.detail?.number} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Student Email" secondary={account?.verify?.detail?.email} />
                        </ListItem>
                        <ListItem>
                            {
                                account?.verify?.status
                                    ?
                                    <Chip label="Verified" color="success" variant="outlined" />
                                    :
                                    <Chip label="No verify" color="error" variant="outlined" />
                            }
                        </ListItem>
                    </List>
                </Grid>
            </Grid>

        </Box>
    );
};

export default AccountProfile;
