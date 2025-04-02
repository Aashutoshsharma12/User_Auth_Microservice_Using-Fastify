import CircuitBreaker from "opossum";
import axiosInstance from "./axiosInstance";
import axios from "axios";

const options = {
    timeout: 3000, // Fail if no response in 5 seconds
    errorThresholdPercentage: 50, // If 50% requests fail, stop calling the service
    resetTimeout: 10000, // Try again after 10 seconds
};

export const Api_call_get_method = async (serviceName: any, api_endPoint: any, token: any) => {
    try {
        const circuitBreaker = new CircuitBreaker(async () => {
            const response = await axiosInstance.get(api_endPoint, {
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
    } catch (err) {
        console.log(err, "err");
    }
};
export const Api_call_post_method = async (serviceName: any, api_endPoint: any, body: any, token: any) => {
    try {
        const circuitBreaker = new CircuitBreaker(async () => {
            const response = await axiosInstance.post(api_endPoint, body, {
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
    } catch (err) {
        console.log(err)
    }
};