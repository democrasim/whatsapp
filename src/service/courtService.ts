import { Member, Prosecution } from "@/types";
import { apiCall } from "@service/apiCall";
import { access } from "fs";

const courtApiEndpoint = "court";

export const prosecute = async (
  lawId: string,
  prosecutedId: string,
  prosecutorId: string,
  section: number,
  reason: string
) => {
  await apiCall<void>(
    "POST",
    `${courtApiEndpoint}/prosecute`,
    {
      law: lawId,
      section,
      prosecutor: prosecutorId,
      prosecuted: prosecutedId,
      info: reason,
    },
    true,
    "unable to prosecute"
  );
};

export const getJudge = async () => {
  return await apiCall<Member>(
    "GET",
    `${courtApiEndpoint}/judge`,
    {},
    true,
    "unable to fetch judge"
  );
};

export const getProsecutionByGroup = async (groupId: string) => {
  return await apiCall<Prosecution>(
    "GET",
    `${courtApiEndpoint}/get_by_group?groupId=${groupId}`,
    {},
    true,
    "unable to fetch prosecution by id"
  );
};

export const decideProsecution = async (
  prosecution: Prosecution,
  accepted: boolean
) => {
  await apiCall<void>(
    "POST",
    `${courtApiEndpoint}/decide?prosecutionId=${prosecution.id}&accepted=${accepted}`,
    {},
    true,
    "unable to decide prosecution"
  );
};
