import React, { useState } from 'react';
import { Shield, UserCheck, ShieldAlert, Check, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { UserRole } from '../../../types';

export const AdminUserRolesModule: React.FC = () => {
  const { role, isSuperAdmin, loginAsDemoAdmin } = useAuth();
  const [activeRoleFilter, setActiveRoleFilter] = useState<UserRole>('super_admin');

  const permissionsMatrix = [
    { module: 'Website Design & Colors', super: true, manager: false, order: false, editor: false },
    { module: 'General System Settings', super: true, manager: false, order: false, editor: false },
    { module: 'User Role Assignments', super: true, manager: false, order: false, editor: false },
    { module: 'Manage Service Catalog', super: true, manager: true, order: false, editor: true },
    { module: 'Manage Homepage Sections', super: true, manager: true, order: false, editor: true },
    { module: 'Order Status & Workflows', super: true, manager: true, order: true, editor: false },
    { module: 'Custom Request Conversion', super: true, manager: true, order: true, editor: false },
    { module: 'Financial Quotes & Budgets', super: true, manager: true, order: true, editor: false },
    { module: 'Media Library Assets', super: true, manager: true, order: false, editor: true },
    { module: 'Security Audit Logs', super: true, manager: false, order: false, editor: false },
  ];

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase">
          <Shield className="w-4 h-4" />
          <span>Role-Based Access Control (RBAC)</span>
        </div>
        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
          User & Role Permissions
        </h3>
        <p className="text-xs text-[#A7B2C8]">
          Four distinct administrative tiers enforced by server-side verification and Firestore Security Rules.
        </p>
      </div>

      {/* Role Switcher for Testing in UI */}
      <div className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-3">
        <span className="text-xs font-bold text-white block">
          Current Active Session Role: <strong className="text-cyan-400 uppercase font-mono">{role || 'super_admin'}</strong>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['super_admin', 'manager', 'order_manager', 'content_editor'] as UserRole[]).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => loginAsDemoAdmin(r)}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                role === r
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300'
                  : 'bg-[#080B14] border-[#263249] text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold font-['Space_Grotesk'] capitalize">
                {r.replace('_', ' ')}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Switch & Test</div>
            </button>
          ))}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="rounded-2xl bg-[#101626] border border-[#263249] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080B14] border-b border-[#263249] text-[#A7B2C8] uppercase font-mono">
            <tr>
              <th className="py-3 px-4">Capability Module</th>
              <th className="py-3 px-4 text-center">Super Admin</th>
              <th className="py-3 px-4 text-center">Manager</th>
              <th className="py-3 px-4 text-center">Order Manager</th>
              <th className="py-3 px-4 text-center">Content Editor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#263249]/60">
            {permissionsMatrix.map((item, i) => (
              <tr key={i} className="hover:bg-[#141C2E]/60">
                <td className="py-3 px-4 font-semibold text-white">{item.module}</td>
                <td className="py-3 px-4 text-center">
                  <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                </td>
                <td className="py-3 px-4 text-center">
                  {item.manager ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                </td>
                <td className="py-3 px-4 text-center">
                  {item.order ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                </td>
                <td className="py-3 px-4 text-center">
                  {item.editor ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
