import { SAVEACTIVITY } from '../actions/constants';

let initialState = {
    activities: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case SAVEACTIVITY:
            let temp = state.activities;
            temp.push(action.item)
            return {activities: temp}
        default:
            return state;
    }
}
