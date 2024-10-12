import { z } from "zod";
import { fetchData } from "./coreAPI";

const zSessionAPIResponse = z.object({
    sessionId: z.string()
});

export async function createSession(winningScore: number) {
    return await fetchData({
        method: 'POST',
        endpoint: 'session',
        body: {
            winningScore
        }
    }, zSessionAPIResponse.parse);
}

export async function getOpenSession() {
    return await fetchData({
        method: 'GET',
        endpoint: '/openSession',
    }, zSessionAPIResponse.parse);
}
