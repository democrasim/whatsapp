import type { Member } from "@/types";
import { apiCall } from "@service/apiCall";

const memberApiEndpoint = 'member';

export const get = async (id: string) => {
    return await apiCall<Member>('GET', `${memberApiEndpoint}/by_id/${id}`,{}, true, 'Could not fetch member');
    
}

export const allMembers = async () => {
    return await apiCall<Member[]>('GET', `${memberApiEndpoint}/all/`,{}, true, 'Could not fetch members');
}

export const allMembersRegistered = async () => {
    return await apiCall<Member[]>('GET', `${memberApiEndpoint}/all?registered=true`,{}, true, 'Could not fetch registered members');

}