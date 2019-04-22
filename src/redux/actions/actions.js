import { 
    SAVEACTIVITY,
    NEWTEMPACTIVITY,
    SAVENEWACTIVITY,
    UPDATEACTIVITIES,
    SELECTACTIVITY,
    DISCARDCURRENTACTIVITY
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

export function selectActivity(val) {
    return {
        type: SELECTACTIVITY,
        item: val
    }
}

export function discardCurrentActivity() {
    return {
        type: DISCARDCURRENTACTIVITY
    }
}
