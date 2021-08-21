const { BlueToken, BlueCredentials } = require('./BlueToken.js');

var apigClientFactory = require('aws-api-gateway-client').default;
const AWS_REGION = "eu-west-1"
//const AWS_SERVICE = "execute-api"
const BASE_HEADERS = {
    "User-Agent": "BlueConnect/3.2.1",
    "Accept-Language": "en-DK;q=1.0, da-DK;q=0.9",
    "Accept": "**",
}
const BASE_URL = "https://api.riiotlabs.com/prod/"

class BlueriiotAPI {
    token;
    user;

    constructor() {
        this.token = '';
    }

    async init(email, password) {
        this.email = email;
        this.password = password;
        await this.getToken();
    }

    getToken = async () => {
        const config = { invokeUrl: BASE_URL }
        var apigClient = apigClientFactory.newClient(config);
        var pathParams = {};
        var pathTemplate = 'user/login'
        var method = 'POST';
        var additionalParams = {
            headers: BASE_HEADERS,
        };
        var body = {
            email: this.email,
            password: this.password
        };
        //login
        try {
            var result = await apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body);
            var data = result.data;
            var cred = data.credentials;

            var blueCred = new BlueCredentials(cred.access_key, cred.secret_key, cred.session_token, cred.expiration)
            this.token = new BlueToken(data.identity_id, data.token, blueCred);

        } catch (result) {
            this.token = '';
            throw new Error(result.response.data.errorMessage);
        }
    }

    getData = async(pathParams, pathTemplate, queryParams) => {
        var cred = this.token.credentials;
        // Check if expired and refresh if needed
        var now = new Date();
        var expire = Date.parse(this.token.credentials.expiration);
        if (expire > now){
            await this.getToken();
        }

        const apigClient = apigClientFactory.newClient({
            invokeUrl: BASE_URL,
            region: AWS_REGION,
            accessKey: cred.access_key,
            secretKey: cred.secret_key,
            sessionToken: cred.session_token,
        });

        const method = 'GET';
        const additionalParams = {
            headers: BASE_HEADERS,
            queryParams: queryParams
        };
        const body = {
        };

        var result = '';
        try {
            var response = await apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body);
            var data = response.data;
            var result = await JSON.stringify(data);
        } catch (result) {
            //console.log(result);
            throw new Error(result);
        }

        return result;
    }

    isAuthenticated = () => {
        if (this.token === '') {
            return false;
        } else {
            return true;
        }
    }

    getUser = async () => {
        if (this.isAuthenticated()) {
            var pathParams = {};
            var pathTemplate = 'user/'
            try {
                var data = await this.getData(pathParams, pathTemplate,'');
                //console.log(userData);
                return data;
            } catch (err) {
                throw new Error(err);
                //console.error("Error, Can't get userdata");
            }
        } else {
            throw new Error("You need to init api first!");
        }
    }

    getBlueDevice = async (blue_device_serial) => {
        if (this.isAuthenticated()) {
            var pathParams = {
                blue_device_serial: blue_device_serial
            };
            var pathTemplate = 'blue/{blue_device_serial}/'
            try {
                var data = await this.getData(pathParams, pathTemplate,'');
                //console.log(userData);
                return data;
            } catch (err) {
                throw new Error(err);
                //console.error("Error, Can't get userdata");
            }
        } else {
            throw new Error("You need to init api first!");
        }
    }

    getSwimmingPools = async () => {
        if (this.isAuthenticated()) {
            var pathParams = {};
            var pathTemplate = 'swimming_pool/'
            try {
                var data = await this.getData(pathParams, pathTemplate, '');
                //console.log(userData);
                return data;
            } catch (err) {
                throw new Error(err);
                //console.error("Error, Can't get userdata");
            }
        } else {
            throw new Error("You need to init api first!");
        }
    }

    getSwimmingPool = async (swimming_pool_id) => {
        if (this.isAuthenticated()) {
            var pathParams = {
                swimming_pool_id: swimming_pool_id
            };
            var pathTemplate = 'swimming_pool/{swimming_pool_id}/'
            try {
                var data = await this.getData(pathParams, pathTemplate, '');
                //console.log(userData);
                return data;
            } catch (err) {
                throw new Error(err);
                //console.error("Error, Can't get userdata");
            }
        } else {
            throw new Error("You need to init api first!");
        }
    }

    getSwimmingPoolStatus = async (swimming_pool_id) => {
        if (this.isAuthenticated()) {
            var pathParams = {
                swimming_pool_id: swimming_pool_id
            };
            var pathTemplate = 'swimming_pool/{swimming_pool_id}/status/'
            try {
                var data = await this.getData(pathParams, pathTemplate, '');
                //console.log(userData);
                return data;
            } catch (err) {
                throw new Error(err);
                //console.error("Error, Can't get userdata");
            }
        } else {
            throw new Error("You need to init api first!");
        }
    }

    getSwimmingPoolBlueDevices = async (swimming_pool_id) => {
        if (this.isAuthenticated()) {
            var pathParams = {
                swimming_pool_id: swimming_pool_id
            };
            var pathTemplate = 'swimming_pool/{swimming_pool_id}/blue/'
            try {
                var data = await this.getData(pathParams, pathTemplate, '');
                //console.log(userData);
                return data;
            } catch (err) {
                throw new Error(err);
                //console.error("Error, Can't get userdata");
            }
        } else {
            throw new Error("You need to init api first!");
        }
    }

    getSwimmingPoolFeed = async (swimming_pool_id, language) => {
        if (this.isAuthenticated()) {
            var pathParams = {
                swimming_pool_id: swimming_pool_id
            };
            var queryParams = {
                language: language
            }
            var pathTemplate = 'swimming_pool/{swimming_pool_id}/feed'
            try {
                var data = await this.getData(pathParams, pathTemplate, queryParams);
                //console.log(userData);
                return data;
            } catch (err) {
                throw new Error(err);
                //console.error("Error, Can't get userdata");
            }
        } else {
            throw new Error("You need to init api first!");
        }
    }

    getLastMeasurements = async (swimming_pool_id, blue_device_serial) => {
        if (this.isAuthenticated()) {
            var pathParams = {
                swimming_pool_id: swimming_pool_id,
                blue_device_serial: blue_device_serial
            };
            var queryParams = {
                mode: 'blue_and_strip'
            }
            var pathTemplate = 'swimming_pool/{swimming_pool_id}/blue/{blue_device_serial}/lastMeasurements'
            try {
                var data = await this.getData(pathParams, pathTemplate, queryParams);
                //console.log(userData);
                return data;
            } catch (err) {
                throw new Error(err);
                //console.error("Error, Can't get userdata");
            }
        } else {
            throw new Error("You need to init api first!");
        }
    }

    getGuidance = async (swimming_pool_id, language) => {
        if (this.isAuthenticated()) {
            var pathParams = {
                swimming_pool_id: swimming_pool_id
            };
            var queryParams = {
                language: language,
                mode: 'interactive_v03'
            }
            var pathTemplate = 'swimming_pool/{swimming_pool_id}/guidance'
            try {
                var data = await this.getData(pathParams, pathTemplate, queryParams);
                //console.log(userData);
                return data;
            } catch (err) {
                throw new Error(err);
                //console.error("Error, Can't get userdata");
            }
        } else {
            throw new Error("You need to init api first!");
        }
    }

    getGuidanceHistory = async (swimming_pool_id, language) => {
        if (this.isAuthenticated()) {
            var pathParams = {
                swimming_pool_id: swimming_pool_id
            };
            var queryParams = {
                language: language
            }
            var pathTemplate = 'swimming_pool/{swimming_pool_id}/guidance/history'
            try {
                var data = await this.getData(pathParams, pathTemplate, queryParams);
                //console.log(userData);
                return data;
            } catch (err) {
                throw new Error(err);
                //console.error("Error, Can't get userdata");
            }
        } else {
            throw new Error("You need to init api first!");
        }
    }

    getChemistry = async (swimming_pool_id) => {
        if (this.isAuthenticated()) {
            var pathParams = {
                swimming_pool_id: swimming_pool_id
            };
            var queryParams = {
            }
            var pathTemplate = 'swimming_pool/{swimming_pool_id}/chemistry'
            try {
                var data = await this.getData(pathParams, pathTemplate, queryParams);
                //console.log(userData);
                return data;
            } catch (err) {
                throw new Error(err);
                //console.error("Error, Can't get userdata");
            }
        } else {
            throw new Error("You need to init api first!");
        }
    }

    getWeather = async (swimming_pool_id, language) => {
        if (this.isAuthenticated()) {
            var pathParams = {
                swimming_pool_id: swimming_pool_id
            };
            var queryParams = {
                language: language
            }
            var pathTemplate = 'swimming_pool/{swimming_pool_id}/weather'
            try {
                var data = await this.getData(pathParams, pathTemplate, queryParams);
                //console.log(userData);
                return data;
            } catch (err) {
                throw new Error(err);
                //console.error("Error, Can't get userdata");
            }
        } else {
            throw new Error("You need to init api first!");
        }
    }

    getBlueDeviceCompatibility = async (blue_device_serial) => {
        if (this.isAuthenticated()) {
            var pathParams = {
                blue_device_serial: blue_device_serial
            };
            var pathTemplate = 'blue/{blue_device_serial}/compatibility'
            try {
                var data = await this.getData(pathParams, pathTemplate,'');
                //console.log(userData);
                return data;
            } catch (err) {
                throw new Error(err);
                //console.error("Error, Can't get userdata");
            }
        } else {
            throw new Error("You need to init api first!");
        }
    }

}

module.exports = { BlueriiotAPI };

/**
EndPoints

get_user user/
get_blue_device blue/{blue_device_serial}/
get_swimming_pools swimming_pool/
get_swimming_pool swimming_pool/{swimming_pool_id}/
get_swimming_pool_status swimming_pool/{swimming_pool_id}/status/
get_swimming_pool_blue_devices swimming_pool/{swimming_pool_id}/blue/
get_swimming_pool_feed swimming_pool/{swimming_pool_id}/feed?lang={language}
get_last_measurements swimming_pool/{swimming_pool_id}/blue/{blue_device_serial}/lastMeasurements?mode=blue_and_strip

New 2021-06-12
swimming_pool/{swimming_pool_id}/guidance?lang={language}&mode=interactive_v03
swimming_pool/{swimming_pool_id}/guidance/history?lang={language}
swimming_pool/{swimming_pool_id}/chemistry
swimming_pool/{swimming_pool_id}/weather?lang={language}
blue/{blue_device_serial}/compatibility


Maybe Comming
blue/{blue_device_serial}/releaseLastUnprocessedEvent
swimming_pool?deleted=true/false
swimming_pool/{swimming_pool_id}/status/{taskId}}
swimming_pool/{swimming_pool_id}/weather/forecast?startDate={startDate}&lang={language}

*/
