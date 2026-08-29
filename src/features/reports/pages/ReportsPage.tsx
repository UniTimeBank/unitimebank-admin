import React, { useState } from 'react';
import { useGetReportsQuery } from '@/core/api/moderation/moderationApi';
import type { ViolationReport } from '@/features/reports/types';
import {
  REPORT_STATUS_TABS,
  REPORT_CATEGORY_OPTIONS,
  REPORT_CATEGORY_LABELS,
} from '../constants';
import { Badge } from '@/shared/components/Badge';
import { Select } from '@/shared/components/Select';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { EmptyState } from '@/shared/components/EmptyState';
import { ReportDetailModal } from '../components/ReportDetailModal';
import { ResolveReportModal } from '../components/ResolveReportModal';
import {
  ShieldAlert,
  Search,
  Eye,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('PENDING');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [detailReport, setDetailReport] = useState<ViolationReport | null>(null);
  const [resolveReport, setResolveReport] = useState<ViolationReport | null>(null);

  const {
    data: reportsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetReportsQuery({
    status: selectedStatus || undefined,
    category: selectedCategory || undefined,
    page: 1,
    limit: 50,
  });

  const reports = reportsData?.reports || [];

  const filteredReports = reports.filter((r) => {
    if (!searchKeyword.trim()) return true;
    const kw = searchKeyword.toLowerCase();
    return (
      r.id.toLowerCase().includes(kw) ||
      (r.description && r.description.toLowerCase().includes(kw)) ||
      (r.reportedUserName && r.reportedUserName.toLowerCase().includes(kw)) ||
      (r.reporterName && r.reporterName.toLowerCase().includes(kw))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-teal-600" />
            <span>Trung Tâm Xử Lý Báo Cáo Vi Phạm</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Xem xét khiếu nại, đối soát video bằng chứng và thực thi kỷ luật điểm uy tín
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200 shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {REPORT_STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === tab.key
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
          {/* Custom Category Dropdown */}
          <div className="w-48">
            <Select
              options={REPORT_CATEGORY_OPTIONS}
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
              size="sm"
            />
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tên, mô tả, ID..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
        {isLoading ? (
          <LoadingSpinner text="Đang tải danh sách báo cáo vi phạm..." />
        ) : filteredReports.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="Không tìm thấy báo cáo nào"
            description="Hiện không có báo cáo vi phạm nào phù hợp với bộ lọc đã chọn."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Mã Báo Cáo</th>
                  <th className="py-3.5 px-4">Phân Loại</th>
                  <th className="py-3.5 px-4">Người Bị Tố Cáo</th>
                  <th className="py-3.5 px-4">Người Gửi</th>
                  <th className="py-3.5 px-4">Mô Tả Vi Phạm</th>
                  <th className="py-3.5 px-4">Thời Gian</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredReports.map((r) => {
                  const cat = REPORT_CATEGORY_LABELS[r.category] || { label: r.category, variant: 'slate' };
                  const isPending = r.status === 'PENDING';

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono text-slate-500 font-semibold">
                        #{r.id.substring(0, 8)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={cat.variant}>{cat.label}</Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-rose-700">
                          {r.reportedUserName || r.reportedUserId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {r.reporterName || r.reporterId}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="truncate text-slate-600" title={r.description}>
                          {r.description}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge
                          variant={
                            r.status === 'RESOLVED'
                              ? 'success'
                              : r.status === 'PENDING'
                              ? 'warning'
                              : 'slate'
                          }
                          pulse={isPending}
                        >
                          {r.status === 'RESOLVED'
                            ? 'Đã xử lý'
                            : r.status === 'PENDING'
                            ? 'Chờ xử lý'
                            : r.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setDetailReport(r)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                            title="Xem chi tiết & Bằng chứng"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => setResolveReport(r)}
                              className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                              title="Xử lý báo cáo"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Xử lý</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <ReportDetailModal
        isOpen={!!detailReport}
        onClose={() => setDetailReport(null)}
        report={detailReport}
        onOpenResolve={(rep) => setResolveReport(rep)}
      />

      {/* Resolve Action Modal */}
      <ResolveReportModal
        isOpen={!!resolveReport}
        onClose={() => setResolveReport(null)}
        report={resolveReport}
      />
    </div>
  );
};
