import { Time } from "@angular/common";
import { Reaction } from "./reactions.model";
import { Timestamp } from "firebase/firestore";

export interface Message {
  messageId?: string;
  text: string;
  chatId: string;
  timestamp: Timestamp;
  messageSendBy: string;
  reactions: Reaction[];
  threadId: string;
  answerCount: number;
  lastAnswer: string;
  editCount: number;
  lastEdit: string;
  storageData: string;
  taggedUser: string[];
  date?: string;
  time?: string;
}
