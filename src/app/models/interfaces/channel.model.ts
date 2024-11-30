import { User } from "./user.model";

export interface Channel {
  chanId: string;
  channelName: string;
  channelDescription: string;
  allMembers: User []
  specificPeople: string[];
  createdAt: string;
  createdBy: User[]
}
