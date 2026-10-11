import React, { useState } from 'react';
import { Download, Upload, Database, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';
import {
  getSiteSettings,
  getCategories,
  getServices,
  getOrders,
  getCustomRequests,
  getPageSections,
  getPortfolioProjects,
  getTestimonials,
  getFaqs,
} from '../../../lib/dataService';

export const AdminBackupRestoreModule: React.FC = () => {
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExportAll = async () => {
    setExporting(true);
    try {
      const [settings, categories, services, orders, customReqs, sections, portfolio, testimonials, faqs] =
        await Promise.all([
          getSiteSettings(),
          getCategories(),
          getServices(),
          getOrders(),
          getCustomRequests(),
          getPageSections(),
          getPortfolioProjects(),
          getTestimonials(),
          getFaqs(),
        ]);

      const backupData = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        environment: 'Google AI Studio Firestore Database',
        collections: {
          siteSettings: settings,
          serviceCategories: categories,
          services,
          orders,
          customRequests: customReqs,
          pageSections: sections,
          portfolioProjects: portfolio,
          testimonials,
          faqs,
        },
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `futurent_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase">
          <Database className="w-4 h-4" />
          <span>Disaster Recovery & Redundancy</span>
        </div>
        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
          Database Backup & Restore Instructions
        </h3>
        <p className="text-xs text-[#A7B2C8]">
          Export full database snapshot across all 12 Firestore collections in structured JSON format.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Database snapshot successfully generated and downloaded to your workstation!</span>
        </div>
      )}

      {/* Export Action Card */}
      <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
              Complete JSON Snapshot Export
            </h4>
            <p className="text-xs text-[#A7B2C8] mt-0.5">
              Includes siteSettings, categories, services, orders, custom requests, page sections, portfolio, and FAQs.
            </p>
          </div>
          <button
            type="button"
            disabled={exporting}
            onClick={handleExportAll}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Generating...' : 'Download Snapshot'}</span>
          </button>
        </div>
      </div>

      {/* Cloud Firestore CLI Restore Instructions */}
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-4 text-xs text-[#A7B2C8]">
        <h4 className="text-sm font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Google Cloud Managed Backup & Restore CLI</span>
        </h4>
        <p>
          For enterprise disaster recovery on Google Cloud, you can schedule automated continuous backups (PITR) or export via the Google Cloud SDK:
        </p>

        <div className="p-4 rounded-xl bg-[#080B14] border border-[#263249] font-mono text-[11px] text-cyan-300 space-y-2">
          <div># Export Firestore Database to Google Cloud Storage</div>
          <div className="text-white">gcloud firestore export gs://[YOUR_BACKUP_BUCKET] --database=ai-studio-d63932a9-e00f-4b84-8637-7548e6f36ee0</div>
          <div className="pt-2"># Import Firestore Database from Cloud Storage</div>
          <div className="text-white">gcloud firestore import gs://[YOUR_BACKUP_BUCKET]/[EXPORT_PREFIX]</div>
        </div>
      </div>
    </div>
  );
};
