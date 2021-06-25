import type { Law, Member } from "@/types";
import { encode } from "querystring";
import { apiCall } from "@service/apiCall";

const memberApiEndpoint = "member";

export const fetchMemberById = async (id: string) => {
    return await apiCall<Member>(
        "GET",
        `${memberApiEndpoint}/by_id/${id}`,
        {},
        true,
        "Could not fetch member"
    );
};

export const fetchMemberByPhone = async (phone: string) => {
    return await apiCall<Member>(
        "GET",
        `${memberApiEndpoint}/by_phone/${phone}`,
        {},
        true,
        "Could not fetch member"
    );
};

export const allMembers = async () => {
    return await apiCall<Member[]>(
        "GET",
        `${memberApiEndpoint}/all/`,
        {},
        true,
        "Could not fetch members"
    );
};

export const allMembersRegistered = async () => {
    return await apiCall<Member[]>(
        "GET",
        `${memberApiEndpoint}/all?${encode({ registered: true })}`,
        {},
        true,
        "Could not fetch registered members"
    );
};

export const register = async (name: string, phone: string, reason: string) => {
    return await apiCall<Law>(
        "POST",
        `${memberApiEndpoint}/request_register?${encode({
            name,
            phone,
            reason,
        })}`,
        {},
        true,
        "Could not register"
    );
};
