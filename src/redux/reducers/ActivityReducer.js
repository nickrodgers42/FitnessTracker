import { 
    SAVEACTIVITY,
    NEWTEMPACTIVITY,
    SAVENEWACTIVITY,
    UPDATEACTIVITIES
} from '../actions/constants';

import dataController from '../../services/datacontroller';

let initialState = {
    activities: [],
    tempActivity: null
};

export default function(state = initialState, action) {
    switch(action.type) {
        case SAVEACTIVITY: {
            let temp = state.activities;
            temp.push(action.item)
            return {...state, activities: temp}
        }
        case NEWTEMPACTIVITY: {
            return {...state, tempActivity: action.item}
        }
        case SAVENEWACTIVITY: {
            let temp = [...state.activities];
            temp.push(action.item);
            dataController.setActivities(temp);
            return {...state, activities: temp, tempActivity: null}
        }
        case UPDATEACTIVITIES: {
            dataController.setActivities(action.item);
            return {...state, activities: action.item}
        }
        default:
            return state;
    }
}
