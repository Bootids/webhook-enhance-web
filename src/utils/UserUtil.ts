import {AuthorizedAction, AuthorizedActionType} from "../reducer/AuthorizedReducer";
import store from "../store/store"

class UserUtil {
    public static getLoginUser() {
        const action: AuthorizedAction = {
            type: AuthorizedActionType.GET_LOGIN_USER,

        };
        setTimeout(() => {
            store.dispatch(action);
        }, 5000)
    }

    public static test() {
        const action: AuthorizedAction = {
            type: AuthorizedActionType.SET_LOGIN_USER,
            login: true
        };
        store.dispatch(action);
    }
}

export default UserUtil

