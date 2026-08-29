export type ReportCategory =
  | 'AFK_ABUSE'
  | 'TOXIC_LANGUAGE'
  | 'FRAUD'
  | 'INAPPROPRIATE_CONTENT'
  | 'SPAM'
  | 'OTHER';

export type ReportStatus = 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';

export type ModerationDecisionType =
  | 'WARNING'
  | 'DEDUCT_TRUST_SCORE'
  | 'DEDUCT_CREDIT'
  | 'SUSPEND_TEMPORARY'
  | 'BAN_PERMANENT'
  | 'DISMISS'
  | 'NO_ACTION';

export interface ReportEvidence {
  id: string;
  evidenceKind: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'TEXT' | 'LINK';
  fileUrl: string;
  cloudinaryPublicId?: string;
  sizeBytes?: number;
  uploadedAt: string;
}

export interface ViolationReport {
  id: string;
  reporterId: string;
  reporterName?: string;
  reportedUserId: string;
  reportedUserName?: string;
  bookingId?: string;
  roomId?: string;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  evidences?: ReportEvidence[];
  decision?: {
    id: string;
    moderatorId: string;
    decisionType: ModerationDecisionType;
    adminNotes?: string;
    trustScoreDelta?: number;
    createdAt: string;
  };
}

export interface GetReportsQuery {
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface GetReportsResponse {
  reports: ViolationReport[];
  total: number;
  page: number;
  limit: number;
}

export interface ResolveReportDto {
  reportId: string;
  decision: ModerationDecisionType;
  adminNotes?: string;
  trustScorePenalty?: number;
  creditPenalty?: number;
  suspendDays?: number;
}

export interface TrustScoreHistoryItem {
  id: string;
  userId: string;
  scoreBefore: number;
  scoreAfter: number;
  delta: number;
  reason: string;
  referenceId?: string;
  referenceType?: string;
  createdAt: string;
}
