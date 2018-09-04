import { combineReducers } from 'redux';
import mapReducer from './reducers/map';
import pointsReducer from './reducers/points';

export const rootReducer = combineReducers({
        map: mapReducer,
        points: pointsReducer
    });