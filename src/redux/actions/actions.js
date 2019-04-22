import { 
    SAVEACTIVITY,
    NEWTEMPACTIVITY,
    SAVENEWACTIVITY
} from './constants';

export function saveActivity(val) {
    return {
        type: SAVEACTIVITY,
        item: val,
    }
}

export function newTempActivity(val) {
    return {
        type: NEWTEMPACTIVITY,
        item: val,
    }
}

export function saveNewActivity(val) {
    return {
        type: SAVENEWACTIVITY,
        item: val,
    }
}

export function updateActivities(val) {
    return {
        type: UPDATEACTIVITIES,
        item: val
    }
}
