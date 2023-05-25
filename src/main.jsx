import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';
import router from './router';
import { Container } from '@mui/system';
import './firebase/config';
// import './firebase/emulator';
import store from './redux/store';
import { Provider } from 'react-redux';
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Container maxWidth='xl' sx={{ textAlign: 'center', marginTop: '50px' }}>
      <RouterProvider router={router} />
    </Container>
  </Provider>,
);
