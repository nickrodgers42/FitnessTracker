import { 
    SAVEACTIVITY,
} from './constants';

export function saveActivity(val) {
    return {
        type: SAVEACTIVITY,
        item: val,
    }
}
