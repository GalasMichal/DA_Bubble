import { Timestamp } from 'firebase/firestore';

export interface User {
  uId: string;
  email: string;
  status: boolean;
  displayName: string;
  avatarUrl?: string;
  birthdate?: Date;
  channels: string[];
  /** Anonymous „Als Gast fortfahren“ — wird per Cloud Function nach 24h gelöscht */
  isGuest?: boolean;
  /** Serverzeit bei Anlage (TTL für Gastkonten) */
  createdAt?: Timestamp;
}


