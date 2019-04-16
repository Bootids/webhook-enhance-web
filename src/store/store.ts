import {combineReducers, createStore} from 'redux'
import AuthorizedReducer, {AuthorizedState} from '../reducer/AuthorizedReducer'

export interface StoreStates {
    authorizedState: AuthorizedState;
}

const reducers = combineReducers<StoreStates>({
    authorizedState: AuthorizedReducer
});

const store = createStore<StoreStates>(reducers);

export default store
