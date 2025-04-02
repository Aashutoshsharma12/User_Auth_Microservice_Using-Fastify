"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api_call_post_method = exports.Api_call_get_method = void 0;
const opossum_1 = __importDefault(require("opossum"));
const axiosInstance_1 = __importDefault(require("./axiosInstance"));
const options = {
    timeout: 3000, // Fail if no response in 5 seconds
    errorThresholdPercentage: 50, // If 50% requests fail, stop calling the service
    resetTimeout: 10000, // Try again after 10 seconds
};
const Api_call_get_method = async (serviceName, api_endPoint, token) => {
    try {
        const circuitBreaker = new opossum_1.default(async () => {
            const response = await axiosInstance_1.default.get(api_endPoint, {
                headers: {
                    Authorization: token,
                }
            });
            return response.data.data;
        }, options);
        circuitBreaker.fallback(() => {
            console.log(`⚠️ ${serviceName} Service is unavailable. Please try later.`);
            return { message: `⚠️ ${serviceName} Service is unavailable. Please try later.` };
        });
        return await circuitBreaker.fire();
    }
    catch (err) {
        console.log(err, "err");
    }
};
exports.Api_call_get_method = Api_call_get_method;
const Api_call_post_method = async (serviceName, api_endPoint, body, token) => {
    try {
        const circuitBreaker = new opossum_1.default(async () => {
            const response = await axiosInstance_1.default.post(api_endPoint, body, {
                headers: {
                    Authorization: token,
                }
            });
            return response.data.data;
        }, options);
        circuitBreaker.fallback(() => {
            console.log(`⚠️ ${serviceName} Service is unavailable. Please try later.`);
            return { message: `⚠️ ${serviceName} Service is unavailable. Please try later.` };
        });
        return await circuitBreaker.fire();
    }
    catch (err) {
        console.log(err);
    }
};
exports.Api_call_post_method = Api_call_post_method;
