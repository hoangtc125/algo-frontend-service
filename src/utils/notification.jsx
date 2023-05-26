import { notification } from 'antd';


export const openNotification = (message, description, placement) => {
    notification.open({
      message,
      description,
      placement,
    });
  };