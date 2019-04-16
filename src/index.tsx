import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.scss';
import {Provider} from 'react-redux'
import store from "./store/store"
import registerServiceWorker from './registerServiceWorker';
import {browserHistory} from "./components/base/History";
import AuthorizedRoute from "./components/auth/AuthorizedRoute";
import Wait from "./views/auth/Wait";
import Login from "./views/auth/Login";
import {Route, Router} from "react-router";

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <div>
                <AuthorizedRoute path="/" component={App}/>
                <Route path={"/auth/wait"} component={Wait}/>
                <Route path={"/auth/login"} component={Login}/>
            </div>
        </Router>
    </Provider>,

    document.getElementById('root') as HTMLElement
);
registerServiceWorker();

