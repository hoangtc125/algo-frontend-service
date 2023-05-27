import { notification } from 'antd';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';


export const openNotification = (message, description, placement) => {
  notification.open({
    message,
    description,
    placement,
    icon:<NotificationsActiveIcon color='primary'/>
  });
};

export const infoNotification = (message, description, placement) => {
  notification.info({
    message,
    description,
    placement,
  });
};

export const successNotification = (message, description, placement) => {
  notification.success({
    message,
    description,
    placement,
  });
};

export const errorNotification = (message, description, placement) => {
  notification.error({
    message,
    description,
    placement,
  });
};

export const warningNotification = (message, description, placement) => {
  notification.warning({
    message,
    description,
    placement,
  });
};