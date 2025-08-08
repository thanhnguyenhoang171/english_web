import { BrowserRouter, useRoutes } from 'react-router-dom';
import routes from './routes';
import './styles/main.css';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import '@ant-design/v5-patch-for-react-19';

const AppRoutes = () => useRoutes(routes);

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </Provider>
    );
}

export default App;
