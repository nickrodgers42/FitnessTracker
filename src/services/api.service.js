let ApiService = class ApiService {
    constructor() {
        this.apiProtocol = 'https:';
        this.apiKey = '17e7fdd57ad233466f13b116e1ea2df9';
        this.apiHost = 'api.openweathermap.org/data/2.5/weather?'
    }

    get apiLocation() {
        return `${this.apiProtocol}//${this.apiHost}apiKey=${this.apiKey}`;
    }

    getWeatherByCoords(latitude, longitude) {
        return `${this.apiLocation}&lat=${latitude}&lon=${longitude}&units=Metric`
    }
}

const apiService = new ApiService();
export default apiService;
