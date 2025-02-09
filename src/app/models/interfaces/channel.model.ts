import { User } from "./user.model";

export interface Channel {
  chanId: string;
  channelName: string;
  channelDescription: string;
  allMembers: string []
  specificPeople: string[];
  createdAt: string;
  createdBy: User[]
}
