import { AccountNumber } from "@open-wa/wa-automate";
import { type } from "os";


export interface Member {
  id: string;
  name: string;
  phone: AccountNumber;
  president: boolean;
  registered: boolean;
  joined: Date;
}

export interface Content {
  type: ContentType;
  description?: string;
  reason?: string;
  member?: Member;
  date?: Date;
  newPresident?: Member;
  location?: {
    x: number;
    y: number;
  };
}

export type DescribedContent = Content & {
  description: string
}

export type AddMemberContent = Content & {
  type: 'ADD_MEMBER'
  member: Member,
  reason: string
}

export type FactContent = DescribedContent & { type: 'FACT' };

export type RequirementContent = DescribedContent & { type: 'REQUIREMENT' };

export type BanContent = DescribedContent & { type: 'BAN' };

export type RemoveContent=DescribedContent & {type:'REMOVE_MEMBER'};

export interface Vote {
  id: string;
  voter: Member;
  vote: VoteType;
  reason: string;
}

export type ContentType = "ADD_MEMBER" | "FACT" | "REQUIREMENT" | "BAN" | "EVENT" | "CHANGE_PRESIDENT"|"REMOVE_MEMBER";
export type VoteType = "FOR" | "AGAINST" | "ABSTAIN";
export type Status = "PASSED" | "UNDER_VOTE" | "FAILED" | "VETOED" | "CANCELED";

export interface Law {
  id: string;
  number: Number;
  title: string;
  legislator: Member;
  content: Content[];
  votes: Vote[];
  status: Status;
  timestamp: Date;
  resolveTime: Date;
  constitutional: boolean;
  anonymousLegislator: boolean;
  fakeName: string;
  contentString: string;
  userVote?: Vote;
}

export interface LawPropostion {
  title: string;
  legislator: string;
  anonymous: boolean;
  fakeName: string;
  content: Content[]
}

export interface LawPropostion {
  legislator: string;
  title: string;
  anonymous: boolean;
  fakeName: string;
  content: Content[];
}