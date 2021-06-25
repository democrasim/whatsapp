import { isEmpty } from "lodash";
import fetch from "node-fetch";
const apiEndpoint = "http://localhost:8080";

export function parseWithDate(jsonString: string): any {
    var reDateDetect = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/; // startswith: 2015-04-29T22:06:55
    var resultObject = JSON.parse(jsonString, (key: any, value: any) => {
        if (typeof value == "string" && reDateDetect.exec(value)) {
            return new Date(value);
        }
        return value;
    });
    return resultObject;
}

export async function apiCall<T>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    path: string,
    payload: any,
    authenticated: boolean = true,
    errorMessage: string = "Request failed."
): Promise<T | undefined> {
    const response = await fetch(`${apiEndpoint}/${path}`, {
        method,
        ...(!isEmpty(payload) && { body: JSON.stringify(payload) }),
        headers: {
            "x-api-key": process.env.API_KEY!,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(errorMessage);
    } else {
        const text = response.text();
        if (isEmpty(text)) return undefined;
        return parseWithDate(await text) as T;
    }
}
