interface Stats {
  today: number;
  pending: number;
  completed: number;
  total: number;
}

interface ApplicantStatsProps {
  stats: Stats;
}

export default function ApplicantStats({ stats }: ApplicantStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-600 font-medium">오늘 신청자</p>
            <p className="text-xl font-bold text-blue-700">{stats.today}명</p>
          </div>
          <span className="text-blue-600 text-lg">📅</span>
        </div>
      </div>

      <div className="bg-orange-50 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-orange-600 font-medium">미확인 신청자</p>
            <p className="text-xl font-bold text-orange-700">
              {stats.pending}명
            </p>
          </div>
          <span className="text-orange-600 text-lg">⏳</span>
        </div>
      </div>

      <div className="bg-green-50 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-green-600 font-medium">총 신청자</p>
            <p className="text-xl font-bold text-green-700">{stats.total}명</p>
          </div>
          <span className="text-green-600 text-lg">📝</span>
        </div>
      </div>
    </div>
  );
}
