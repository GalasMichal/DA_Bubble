import { Timestamp } from 'firebase/firestore';
import { User } from './user.model';

enum MessageType {
  Channel = 'channel',
  ChannelThread = 'channelThread',
  PrivateMessage = 'privateMessage',
  PrivateThread = 'privateThread'
}

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
      userName?: string; // Optional userName.
      uId?: string; // Optional uId.
    }[];
  }[];
  answers: Message[];
  threadId: string;
  answerCount: number;
  lastAnswer: string;
  editCount: number;
  lastEdit: Timestamp;
  storageData: string;
  taggedUser: string[];
  date?: string;
  time?: string;
}

