import React from 'react';
import { useGetActiveRoomsQuery } from '@/core/api/analytics/analyticsApi';
import { Badge } from '@/shared/components/Badge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { EmptyState } from '@/shared/components/EmptyState';
import { Video, RefreshCw, Radio, Users, Clock, Shield } from 'lucide-react';

export const SessionsMonitorPage: React.FC = () => {
  const { data, isLoading, isFetching, refetch } = useGetActiveRoomsQuery();
  const rooms = data?.rooms || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Video className="w-6 h-6 text-teal-600" />
            <span>Giám Sát Phòng Học WebRTC & LiveKit</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi trạng thái phòng học trực tuyến, số lượng người tham gia và luồng heartbeat thời gian thực
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

      {/* Active Rooms Grid */}
      {isLoading ? (
        <LoadingSpinner text="Đang tải danh sách phòng học trực tuyến..." />
      ) : rooms.length === 0 ? (
        <EmptyState
          icon={Radio}
          title="Không có phòng học nào đang mở"
          description="Hiện tại không có phòng học 1:1 hoặc phòng học nhóm nào đang diễn ra trên hệ thống."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room) => (
            <div
              key={room.roomId}
              className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="success" pulse>
                    Trực Tuyến (Live)
                  </Badge>
                  {room.category && <Badge variant="primary">{room.category}</Badge>}
                </div>

                <h3 className="text-base font-bold text-slate-900 tracking-tight">{room.title}</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">ID: {room.roomId}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-4 h-4 text-teal-600" />
                      Người tham gia:
                    </span>
                    <span className="font-bold text-slate-900">
                      {room.currentParticipants} / {room.maxParticipants || 20}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-4 h-4 text-teal-600" />
                      Bắt đầu lúc:
                    </span>
                    <span>{new Date(room.openedAt).toLocaleTimeString('vi-VN')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Shield className="w-4 h-4 text-teal-600" />
                      Chủ phòng (Mentor):
                    </span>
                    <span className="font-mono text-slate-700">
                      {room.mentorId.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-teal-700 font-semibold">
                <span>Heartbeat: Hoạt động bình thường</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
