import React, { useEffect, useState } from 'react';
import { Shield, Clock, Search, RefreshCw } from 'lucide-react';
import { ActivityLogItem } from '../../../types';
import { getActivityLogs } from '../../../lib/dataService';

export const AdminActivityLogsModule: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await getActivityLogs();
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase">
            <Shield className="w-4 h-4" />
            <span>Audit Trail</span>
          </div>
          <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
            Security & Activity Logs
          </h3>
          <p className="text-xs text-[#A7B2C8]">
            Immutable record of administrative operations, catalog modifications, and order status transitions.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="p-2 rounded-xl bg-[#141C2E] border border-[#263249] text-slate-300 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-2xl bg-[#101626] border border-[#263249] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080B14] border-b border-[#263249] text-[#A7B2C8] uppercase font-mono">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Operator</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Resource</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#263249]/60">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#A7B2C8]">
                  System initialized. Administrative mutations will log here automatically.
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="hover:bg-[#141C2E]/60">
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-cyan-300 font-medium">
                    {log.adminEmail}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {log.target} {log.details ? `(${log.details})` : ''}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
