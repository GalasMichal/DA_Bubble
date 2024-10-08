import { Reaction } from "./reactions.model";

export interface Message {
  messageId?: string;
  text: string;
  chatId: string;
  date: string;
  time: string;
  messageSendBy: string;
  reactions: Reaction[];
  threadId: string;
  answerCount: number;
  lastAnswer: string;
  editCount: number;
  lastEdit: string;
  storageData: string;
  taggedUser: string[];
}
