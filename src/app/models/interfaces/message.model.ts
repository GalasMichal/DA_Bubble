import { Timestamp } from 'firebase/firestore';
import { User } from './user.model';

enum MessageType {
  ChannelMessage = 'channelMessage',
  ChannelThreadMessage = 'channelThreadMessage',
  PrivateMessage = 'privateMessage',
  PrivateThreadMessage = 'privateThreadMessage'
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

export interface ChannelMessage extends Message {
  type: MessageType.ChannelMessage
}

export interface ChannelThreadMessage extends Message {
  type: MessageType.ChannelThreadMessage
}

export interface PrivateMessage extends Message {
  type: MessageType.PrivateMessage
}

export interface PrivateThreadMessage extends Message {
  type: MessageType.PrivateThreadMessage
}