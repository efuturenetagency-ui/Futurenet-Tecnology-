import React, { useState } from 'react';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Copy,
  Plus,
  Save,
  Monitor,
  Tablet,
  Smartphone,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { PageSectionItem } from '../../../types';
import { savePageSection, deletePageSection } from '../../../lib/dataService';

interface SectionsModuleProps {
  sections: PageSectionItem[];
  onSectionsUpdated: (sections: PageSectionItem[]) => void;
}

export const AdminSectionsModule: React.FC<SectionsModuleProps> = ({
  sections,
  onSectionsUpdated,
}) => {
  const [editingSection, setEditingSection] = useState<PageSectionItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editIsEnabled, setEditIsEnabled] = useState(true);
  const [editDesktop, setEditDesktop] = useState(true);
  const [editTablet, setEditTablet] = useState(true);
  const [editMobile, setEditMobile] = useState(true);
  const [editBadge, setEditBadge] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const openEdit = (sec: PageSectionItem) => {
    setEditingSection(sec);
    setEditTitle(sec.title);
    setEditSubtitle(sec.subtitle || '');
    setEditIsEnabled(sec.isEnabled);
    setEditDesktop(sec.visibility?.desktop ?? true);
    setEditTablet(sec.visibility?.tablet ?? true);
    setEditMobile(sec.visibility?.mobile ?? true);
    setEditBadge(sec.content?.badge || '');
  };

  const handleToggleEnable = async (sec: PageSectionItem) => {
    const updated = { ...sec, isEnabled: !sec.isEnabled };
    await savePageSection(updated);
    onSectionsUpdated(sections.map(s => (s.id === sec.id ? updated : s)));
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // re-assign order numbers
    for (let i = 0; i < newSections.length; i++) {
      newSections[i].order = i + 1;
      await savePageSection(newSections[i]);
    }

    onSectionsUpdated(newSections);
  };

  const handleSaveModal = async (publishNow: boolean) => {
    if (!editingSection) return;
    setIsSaving(true);
    const updated: PageSectionItem = {
      ...editingSection,
      title: editTitle.trim(),
      subtitle: editSubtitle.trim() || undefined,
      isEnabled: editIsEnabled,
      visibility: {
        desktop: editDesktop,
        tablet: editTablet,
        mobile: editMobile,
      },
      content: {
        ...editingSection.content,
        badge: editBadge.trim() || undefined,
      },
      isPublished: publishNow,
    };

    try {
      await savePageSection(updated);
      onSectionsUpdated(sections.map(s => (s.id === updated.id ? updated : s)));
      setFeedbackMsg(publishNow ? 'Section published live!' : 'Draft saved.');
      setTimeout(() => setFeedbackMsg(null), 3000);
      setEditingSection(null);
    } catch (e) {
      console.error('Error saving section:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
            Homepage Section Builder & Manager
          </h3>
          <p className="text-xs text-[#A7B2C8]">
            Enable, disable, reorder, edit headlines, and control responsive visibility across all homepage sections.
          </p>
        </div>

        {feedbackMsg && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              sec.isEnabled
                ? 'bg-[#141C2E] border-[#263249]'
                : 'bg-[#080B14] border-[#263249]/50 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-slate-400 w-6 text-center">
                0{sec.order}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-['Space_Grotesk']">
                    {sec.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-cyan-300 border border-blue-500/30">
                    {sec.sectionType}
                  </span>
                </div>
                {sec.subtitle && (
                  <p className="text-[11px] text-[#A7B2C8] line-clamp-1 max-w-lg mt-0.5">
                    {sec.subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Responsive indicators */}
              <div className="flex items-center gap-1 text-slate-400 mr-2">
                <Monitor className={`w-3.5 h-3.5 ${sec.visibility?.desktop ? 'text-cyan-400' : 'opacity-30'}`} />
                <Tablet className={`w-3.5 h-3.5 ${sec.visibility?.tablet ? 'text-cyan-400' : 'opacity-30'}`} />
                <Smartphone className={`w-3.5 h-3.5 ${sec.visibility?.mobile ? 'text-cyan-400' : 'opacity-30'}`} />
              </div>

              {/* Move buttons */}
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => handleMove(idx, 'up')}
                className="p-1.5 rounded-lg bg-[#080B14] border border-[#263249] hover:border-cyan-400 text-slate-300 disabled:opacity-30"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={idx === sections.length - 1}
                onClick={() => handleMove(idx, 'down')}
                className="p-1.5 rounded-lg bg-[#080B14] border border-[#263249] hover:border-cyan-400 text-slate-300 disabled:opacity-30"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              {/* Enable toggle */}
              <button
                type="button"
                onClick={() => handleToggleEnable(sec)}
                className={`p-1.5 rounded-lg border text-xs ${
                  sec.isEnabled
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-500/10 border-slate-500/30 text-slate-400'
                }`}
              >
                {sec.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>

              {/* Edit button */}
              <button
                type="button"
                onClick={() => openEdit(sec)}
                className="px-3 py-1.5 rounded-lg bg-[#080B14] border border-[#263249] hover:border-cyan-400 text-white text-xs font-medium flex items-center gap-1.5"
              >
                <Edit className="w-3 h-3" />
                <span>Configure</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#101626] border border-[#263249] rounded-3xl p-6 sm:p-8 space-y-6 text-[#F8FAFC] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#263249] pb-4">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Configure Section: {editingSection.sectionType}
                </span>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                  Edit Section Content
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#141C2E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Section Headline *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Section Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={editSubtitle}
                  onChange={e => setEditSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {editingSection.sectionType === 'Hero' && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Futuristic Badge Text</label>
                  <input
                    type="text"
                    value={editBadge}
                    onChange={e => setEditBadge(e.target.value)}
                    placeholder="e.g. NEXT-GENERATION IT AGENCY • 2026"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              {/* Visibility & Responsive toggles */}
              <div className="p-4 rounded-xl bg-[#080B14] border border-[#263249] space-y-3">
                <span className="font-semibold text-slate-300 block">Device Display Visibility</span>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editDesktop}
                      onChange={e => setEditDesktop(e.target.checked)}
                      className="rounded border-[#263249] text-cyan-400"
                    />
                    <span>Desktop</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editTablet}
                      onChange={e => setEditTablet(e.target.checked)}
                      className="rounded border-[#263249] text-cyan-400"
                    />
                    <span>Tablet</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editMobile}
                      onChange={e => setEditMobile(e.target.checked)}
                      className="rounded border-[#263249] text-cyan-400"
                    />
                    <span>Mobile</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#263249]">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-xl border border-[#263249] text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/10"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold shadow-lg shadow-blue-500/20"
                >
                  Publish Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
