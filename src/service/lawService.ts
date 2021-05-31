import type { Law, Status, VoteType } from "@/types";
import { apiCall } from "@service/apiCall";

const lawsApiEndpoint = 'laws';

export const getLawsByStatus = async (status: string) => {
    return await apiCall<Law[]>('GET', `${lawsApiEndpoint}/with_status/${status}/`, {}, true, 'Could not retreive laws');
}


export const getLawsUnvoted = async (memberId: string) => {
    return await apiCall<Law[]>('GET', `${lawsApiEndpoint}/not_voted?userId=${memberId}`, {}, true, 'Could not retreive laws');
}

export const vote = async (member: string, law: string, type: VoteType, reason: string) => {
    return await apiCall<Law>('PUT', `${lawsApiEndpoint}/vote`, {
        member,
        law,
        type,
        reason
    }, true, 'Could not vote');
}

export const lawsByStatus = async (status: Status, page?: number, limit?: number) => {
    if (!page && limit) page = 1;
    if (!limit && page) limit = 50;

    return await apiCall<Law[]>('GET',
     `${lawsApiEndpoint}/with_status/${status}/${(page && limit) ? `?page=${page}&limit=${limit}` : ''}`,
      {},
       true, 'Could not retreive laws');

}
