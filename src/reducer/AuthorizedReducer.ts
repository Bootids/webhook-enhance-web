import {Action, Reducer} from "redux";

export interface AuthorizedState {
    pending: boolean;
    login: boolean
    username: string | null;
}

const initialState: AuthorizedState = {
    pending: false,
    login: true,
    username: null
};

export interface AuthorizedAction extends Action {
    type: AuthorizedActionType;
    login?: boolean;
    username?: string;
}

export enum AuthorizedActionType {
    GET_LOGIN_USER,
    SET_LOGIN_USER,
    LOGINING
}

const AuthorizedReducer: Reducer<AuthorizedState> =
    (state = initialState, action: AuthorizedAction): AuthorizedState => {
        if (action.type === AuthorizedActionType.GET_LOGIN_USER) {
            return Object.assign({}, state, {
                pending: true
            })
        }
        if (action.type === AuthorizedActionType.SET_LOGIN_USER) {
            return Object.assign({}, state, {
                pending: false,
                login: action.login,
                username: action.username
            })
        }
        if (action.type === AuthorizedActionType.LOGINING) {
            return Object.assign({}, state, {
                pending: true
            })
        }
        return state;
    };

export default AuthorizedReducer;
