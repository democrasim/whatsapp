import { Member } from "@/types";
import { apiCall } from "@service/apiCall";

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
