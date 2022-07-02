import { combineReducers } from 'redux';

import posts from './posts';
import auth from './auth';

export const reducers = combineReducers({ posts, auth });
//combines auth and post reducers and exports at once