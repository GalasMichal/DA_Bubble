export interface Channel {
  chanId: string;
  channelName: string;
  channelDescription: string;
  allMembers: string
  specificPeople: { userName: string; uId: string }[];
  createdAt: string;
  createdBy: string | undefined;
}
