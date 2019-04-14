export default class Weather {
    constructor(id, main, description, temp, icon, clouds) {
        this.id = id;
        this.main = main;
        this.description = description;
        this.temp = temp;
        this.icon = icon;
        this.clouds = clouds;
    }
}
