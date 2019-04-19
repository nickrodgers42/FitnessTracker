export default class Activity {
    constructor(type, seconds, path, distance, startWeather) {
        this.type = type;
        this.seconds = seconds;
        this.path = path;
        this.distance = distance;
        this.startWeather = startWeather;
        this.endWeather = null;
        this.mood = null;
        this.photo = null;
        this.date = null;
    }
}
