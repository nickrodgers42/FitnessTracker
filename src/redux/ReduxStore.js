import { createStore } from 'redux';

import activityReducer from './reducers/ActivityReducer';

const store = createStore(activityReducer);

export default store;
