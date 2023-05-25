import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';
import router from './router';
import './firebase/config';
// import './firebase/emulator';
import store from './redux/store';
import { Provider } from 'react-redux';
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
