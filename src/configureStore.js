import {createStore, applyMiddleware} from 'redux';
import {rootReducer} from './reducer';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export default function (initialState) {
    return createStore(rootReducer, initialState, applyMiddleware(logger, thunk));
}