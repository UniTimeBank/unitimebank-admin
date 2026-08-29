export interface FinanceStats {
  totalEscrowHeld: number;
  totalCompletedTransfers: number;
  totalRefunded: number;
  systemCirculation: number;
}

export type LedgerEntryType =
  | 'ONBOARDING_REWARD'
  | 'DAILY_CHECKIN_REWARD'
  | 'ESCROW_HOLD'
  | 'ESCROW_RELEASE'
  | 'CANCELLATION_REFUND'
  | 'METERING_CHARGE'
  | 'TRUST_SCORE_BONUS'
  | 'ADMIN_ADJUSTMENT';

export type LedgerDirection = 'CREDIT' | 'DEBIT';

export interface LedgerEntry {
  id: string;
  userId: string;
  walletId: string;
  direction: LedgerDirection;
  entryType: LedgerEntryType;
  amount: number;
  balanceAfter: number;
  referenceId?: string;
  referenceKind?: string;
  createdAt: string;
}

export interface FinanceLedgerResponse {
  entries: LedgerEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
