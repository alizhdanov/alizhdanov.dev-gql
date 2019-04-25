import fetch from 'node-fetch';

// TODO: move it into env vars
const BASE_URL = 'https://2t2ez876ll.execute-api.us-east-1.amazonaws.com/prod';

export const fetcher = async (url: string, method: string = 'get', body?: object) => {
    const response = await fetch(`${BASE_URL}${url}`, {
        body: JSON.stringify(body),
        method,
    });

    const data = await response.json();

    if (!response.ok) {
        if (data.errors) {
            return { errors: data.errors };
        }

        throw new Error(`${response.status} - ${response.statusText} ${JSON.stringify(data)}`);
    }

    return data;
};
