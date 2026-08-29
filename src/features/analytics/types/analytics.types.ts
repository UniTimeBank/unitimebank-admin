export interface SystemOverviewStats {
  totalUsers: number;
  totalTrustScoreAvg: number;
  pendingReports: number;
  activeGroupRooms: number;
  totalEscrowHeld: number;
  totalCompletedSessions: number;
}

export interface ActiveGroupRoomDto {
  roomId: string;
  mentorId: string;
  title: string;
  category?: string;
  maxParticipants: number;
  currentParticipants: number;
  openedAt: string;
  status: string;
}
