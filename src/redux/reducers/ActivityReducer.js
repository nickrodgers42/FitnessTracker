import { 
    SAVEACTIVITY,
    NEWTEMPACTIVITY
} from '../actions/constants';

let initialState = {
    activities: [],
    tempActivity: null
};

export default function(state = initialState, action) {
    switch(action.type) {
        case SAVEACTIVITY:
            let temp = state.activities;
            temp.push(action.item)
            return {...state, activities: temp}
        case NEWTEMPACTIVITY:
            return {...state, tempActivity: action.item}
        default:
            return state;
    }
}
