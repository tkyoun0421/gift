export default function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-4">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
