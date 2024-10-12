const SERVER_BASE_URL = 'localhost:8080'

const FETCH_DELAY_MS = 550;

export function createEndPointUrl(
    postfix: string,
    options: {useSocket?: boolean} | undefined = undefined
){
    const prefix = options?.useSocket ? 'ws' : 'http';
    return `${prefix}://${SERVER_BASE_URL}/${postfix}`;
}

export const createSessionSocketURI =
    (sessionId: string) => createEndPointUrl(sessionId);

export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export type FetchDataHttpMethod = 'GET' | 'POST';

export type FetchWrapperArgs = {
    endpoint: string,
    method: FetchDataHttpMethod,
    body?: any,
}

function fetchWrapper({
    endpoint,
    method,
    body
}: FetchWrapperArgs): Promise<Response> {
    return fetch(
        createEndPointUrl(endpoint),
        {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: (
                method === "POST" ? 
                    JSON.stringify(body)
                    : 
                    undefined
            )
        }
    );
}

export class FetchDataResponseError extends Error {
    typeCode?: string;

    constructor(message: string, typeCode?: string) {
        let msg;
        if (typeCode) {
            msg = `FETCH ERROR - TYPE CODE: ${typeCode} - MESSAGE: ${message}`;
        } else {
            msg = `FETCH ERROR: ${message}`;
        }
        console.error(msg);
        super(msg);
        this.typeCode = typeCode;
    }
    override toString() {
        return this.message;
    }
}

export async function fetchData<T>(
    args: FetchWrapperArgs,
    validator: (body: unknown) => T,
): Promise<T> {

    await wait(FETCH_DELAY_MS);    
    try {
        const res = await fetchWrapper(args);
        if (res.ok) {
            try {
                const content = await res.json();
                try {
                    const validContent = validator(content);
                    console.log(validContent);
                    return validContent
                } catch (e) {
                    throw new FetchDataResponseError(
                        `Validation Error: ${String(e)}`
                    );
                }
            } catch (err) {
                throw new FetchDataResponseError(
                    `FETCH ERROR: Cannot parse response as JSON: ${err}`
                );
            }
        }
        else {
            try {
                const content = await res.json();
                throw new FetchDataResponseError(
                    content?.message ?? `<No message found>`,
                    content?.errorType ?? `<No error type found>`
                )
            } catch (error) {}
            throw new FetchDataResponseError(
                `Server returned error response: ${res.status}`
            );
        }
    } catch (e) {
        throw new FetchDataResponseError(
            `Error while invoking 'fetch': ${String(e)}`
        );
    }
}
