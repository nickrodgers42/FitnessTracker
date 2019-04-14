import apiService from './api.service';
import Weather from '../models/weather';

let WeatherService = class WeaatherService {
    constructor() {}
    getWeatherByCoords(latitude, longitude) {
        return new Promise((resolve, reject) => {
            fetch(apiService.getWeatherByCoords(latitude, longitude))
                .then((response) => response.json())
                .then((response) => {
                    let r = response;
                    let w = r.weather[0];
                    let weather = new Weather(w.id, w.main, w.description, r.main.temp, w.icon, r.clouds.all);
                    resolve ({
                        weather: weather,
                    })
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }
}
const weatherService = new WeatherService();
export default weatherService;
