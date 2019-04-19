import { 
    SAVEACTIVITY,
    NEWTEMPACTIVITY,
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
