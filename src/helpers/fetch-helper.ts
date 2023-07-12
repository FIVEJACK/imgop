import nodeFetch, { RequestInit } from 'node-fetch';

export const nodeFetchWithRetry = async (url: string, retry: number = 3, init?: RequestInit) => {
    while (retry > 0) {
        try {
            return await nodeFetch(url, init);
        } catch(e) {
            retry = retry - 1
            if (retry === 0) {
                console.log(e)
            }
        }
    }
};