import { Time } from "@angular/common";
import { Reaction } from "./reactions.model";
import { Timestamp } from "firebase/firestore";
import { User } from "./user.model";

export interface Message {
  messageId?: string;
  text: string;
  chatId: string;
  timestamp: Timestamp;
  messageSendBy: User;
  reactions: {
    symbol: string;
    count: number;
    users: {
      userName?: string;  // Optional userName.
      uId?: string;       // Optional uId.
    }[];
  }[];
  threadId: string;
  answerCount: number;
  lastAnswer: string;
  editCount: number;
  lastEdit: Timestamp ;
  storageData: string;
  taggedUser: string[];
  date?: string;
  time?: string;
}
