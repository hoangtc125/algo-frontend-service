import { BACKEND_URL } from "./constant";
import { env } from "./env";

export const post = async (path, payload, options = {}) => {
    const res = await fetch(`${env()?.backend_url || BACKEND_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `${localStorage.getItem('accessToken')}`,
            ...options,
        },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
};


export const get = async (path, options = {}) => {
    const res = await fetch(`${env()?.backend_url || BACKEND_URL}${path}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `${localStorage.getItem('accessToken')}`,
            ...options,
        },
    });
    const data = await res.json();
    return data;
};

export const get_webcam = async (url, options = {}) => {
    const res = await fetch(`${url}`, {
        method: 'GET',
        headers: {
            ...options,
        },
    });
    return res
};