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
    if (seconds == 0 || distance == 0 || (distance * 3600) / seconds == NaN) {
        return 0;
    }
    return (distance * 3600) / seconds;
}

export function formatDate(date) {
    let d = new Date(date);
    let str = '';
    str += (d.getMonth() + 1) + '/';
    str += d.getDate() + '/';
    str += d.getFullYear();
    return str;
}

export function consecutiveDays(day1, day2) {
    var d1 = new Date(day1);
    var d2 = new Date(day2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    if (Math.abs(d1 - d2) === 86400000) {
        return true;
    }
    return false;
}

export function sameDay(day1, day2) {
    var d1 = new Date(day1);
    var d2 = new Date(day2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    if (Math.abs(d1 - d2) < 86400000) {
        return true;
    }
    return false;
}

export default {
    formatSeconds,
    coordDistance,
    toKmph,
    formatDate,
    consecutiveDays,
    sameDay
}
