import { 
    SAVEACTIVITY,
    NEWTEMPACTIVITY,
    SAVENEWACTIVITY,
    UPDATEACTIVITIES,
    SELECTACTIVITY,
    DISCARDCURRENTACTIVITY
} from '../actions/constants';

import dataController from '../../services/datacontroller';

let initialState = {
    activities: [],
    tempActivity: null,
    selectedActivity: null
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
        case SELECTACTIVITY: {
            return {...state, selectedActivity: action.item}
        }
        case DISCARDCURRENTACTIVITY: {
            if (state.selectedActivity != null) {
                let index = state.activities.indexOf(state.selectedActivity);
                let temp = [...state.activities]
                temp.splice(index, 1);
                dataController.setActivities(temp);
                return {...state, activities: temp, selectedActivity: null}
            }
            return state;
        }
        default:
            return state;
    }
}
