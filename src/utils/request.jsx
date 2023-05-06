import { BACKEND_URL } from "./constant";

export const AlgoPostRequest = async (path, payload, options = {}) => {
    if (localStorage.getItem('accessToken')) {
        const res = await fetch(`${BACKEND_URL}/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                ...options,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            console.log({res});
            return null
        }

        const data = await res.json();
        console.log({data});
        return data;
    }

    return null;
};