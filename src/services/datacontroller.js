import localStorage from './localstorage';

class DataController {
    constructor() {
    }

    addActivity(value) {
        return localStorage.merge('activities', value);
    }

    getActivities() {
        return new Promise((resolve, reject) => {
            localStorage.get('activities')
                .then(result => {
                    resolve(result);
                })
                .catch(error => reject(error));
        })
    }

    setActivities(value) {
        return localStorage.set('activities', value);
    }

    changeItem(value) {
        console.log("changeItem in data controller: ", value)
        return new Promise((resolve, reject) => {
            localStorage.add('dataList', value)
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    console.log('error: ', error)
                })
        })
    }

    getItem() {
        return new Promise((resolve, reject) => {
            localStorage.get('dataList')
                .then(result => {
                    resolve(result);
                })
                .catch(error => reject(error))
        })
    }
};

const dataController = new DataController();
export default dataController;
