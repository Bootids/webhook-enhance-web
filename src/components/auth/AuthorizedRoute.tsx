import React from 'react'
import {Redirect, Route, withRouter} from "react-router";
import store from "../../store/store";
import UserUtil from '../../utils/UserUtil'

interface AuthorizedRouteState {
    login: boolean;
    username: string | null;
    pending: boolean;
}

class AuthorizedRoute extends React.Component<any, AuthorizedRouteState> {
    public static props: {
        login: true;
        test: any;
    };

    constructor(props: any) {
        // const authorizedState = store.getState().authorizedState;
        super(props);
        // this.props.test = 1;
        this.state = {
            login: true,
            username: "",
            pending: false
        }
    }

    public componentWillMount() {
        UserUtil.getLoginUser();
    }

    public componentDidMount(): void {
        store.subscribe(() => {
            const authorizedState = store.getState().authorizedState;
            this.setState({
                login: authorizedState.login,
                username: authorizedState.username,
                pending: authorizedState.pending
            });
        });
        UserUtil.getLoginUser();
    }

    public render() {
        const {component: Component, ...rest} = this.props;
        return (
            <Route {...rest} render={props => {
                return this.state.login
                    ? <Component {...props} />
                    : <Redirect to="/auth/wait"/>
            }}/>
        );
    }

}

export default withRouter(AuthorizedRoute)
