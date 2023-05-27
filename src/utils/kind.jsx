import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ReportIcon from '@mui/icons-material/Report';
import InfoIcon from '@mui/icons-material/Info';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import WindowSharpIcon from '@mui/icons-material/WindowSharp';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Chip } from '@mui/material';

export const getIconInfo = (kind) => {
    if (kind == "INFO") {
        return <InfoIcon fontSize='medium' color='info' />
    } else if (kind == "SUCCESS") {
        return <CheckBoxIcon fontSize='medium' color='success' />
    } else if (kind == "ERROR") {
        return <NewReleasesIcon fontSize='medium' color='error' />
    } else {
        return <ReportIcon fontSize='medium' color='warning' />
    }
}


export const getProviderIcon = (kind) => {
    if (kind == "microsoft.com") {
        return <Chip icon={<WindowSharpIcon fontSize='medium' color='info' />} label="Microsoft" />
    } else if (kind == "facebook.com") {
        return <Chip icon={<FacebookIcon fontSize='medium' color='info' />} label="Facebook" />
    } else if (kind == "github.com") {
        return <Chip icon={<GitHubIcon fontSize='medium' color='info' />} label="Github" />
    } else if (kind == "google.com") {
        return <Chip icon={<GoogleIcon fontSize='medium' color='info' />} label="Google" />
    } else {
        return <Chip label="ALGO HUST" />
    }
}

