export function formatSeconds(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - (hours * 3600)) / 60);
    let secs = seconds - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (secs < 10) {
        secs = '0' + secs;
    }
    return hours + ':' + minutes + ':' + secs;
}

export function coordDistance(lat1, long1, lat2, long2) {
    let degLen = 110.25
    let x = lat2 - lat1;
    let y = (long2 - long1) * Math.cos(lat2);
    return degLen * Math.sqrt(x * x + y * y); 
}

export function toKmph(seconds, distance) {
    if (seconds == 0 || distance == 0) {
        return 0;
    }
    return (distance * 3600) / seconds;
}

export default {
    formatSeconds,
    coordDistance
}
