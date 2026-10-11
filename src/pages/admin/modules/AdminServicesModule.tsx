import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Sparkles,
  Check,
  X,
  Save,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../../../types';
import { saveService, deleteService } from '../../../lib/dataService';

interface ServicesModuleProps {
  services: ServiceItem[];
  categories: ServiceCategory[];
  onServicesUpdated: (services: ServiceItem[]) => void;
}

export const AdminServicesModule: React.FC<ServicesModuleProps> = ({
  services,
  categories,
  onServicesUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formIcon, setFormIcon] = useState('Sparkles');
  const [formPrice, setFormPrice] = useState<number | ''>('');
  const [formStartingPriceLabel, setFormStartingPriceLabel] = useState('');
  const [formDeliveryEstimate, setFormDeliveryEstimate] = useState('');
  const [formFeatures, setFormFeatures] = useState<string>('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);
  const [formSeoTitle, setFormSeoTitle] = useState('');
  const [formSeoDesc, setFormSeoDesc] = useState('');

  const openNewServiceModal = () => {
    setIsNew(true);
    setFormName('');
    setFormSlug('');
    setFormCategoryId(categories[0]?.id || 'website-development');
    setFormShortDesc('');
    setFormFullDesc('');
    setFormIcon('Sparkles');
    setFormPrice(950);
    setFormStartingPriceLabel('From $950');
    setFormDeliveryEstimate('7-10 business days');
    setFormFeatures('Complete Architecture\nQA Testing\nSupport Warranty');
    setFormIsActive(true);
    setFormIsFeatured(false);
    setFormDisplayOrder(services.length + 1);
    setFormSeoTitle('');
    setFormSeoDesc('');
    setEditingService({} as ServiceItem);
  };

  const openEditModal = (service: ServiceItem) => {
    setIsNew(false);
    setEditingService(service);
    setFormName(service.name);
    setFormSlug(service.slug);
    setFormCategoryId(service.categoryId);
    setFormShortDesc(service.shortDescription);
    setFormFullDesc(service.fullDescription);
    setFormIcon(service.icon || 'Sparkles');
    setFormPrice(service.price ?? '');
    setFormStartingPriceLabel(service.startingPriceLabel || '');
    setFormDeliveryEstimate(service.deliveryEstimate || '');
    setFormFeatures((service.features || []).join('\n'));
    setFormIsActive(service.isActive);
    setFormIsFeatured(service.isFeatured);
    setFormDisplayOrder(service.displayOrder || 1);
    setFormSeoTitle(service.seoTitle || '');
    setFormSeoDesc(service.seoDescription || '');
  };

  const handleDuplicate = async (service: ServiceItem) => {
    const duplicated: ServiceItem = {
      ...service,
      id: `svc_${Date.now()}`,
      slug: `${service.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      name: `${service.name} (Copy)`,
      displayOrder: services.length + 1,
    };
    await saveService(duplicated);
    onServicesUpdated([...services, duplicated]);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service? This action will persist in Firestore.')) {
      await deleteService(id);
      onServicesUpdated(services.filter(s => s.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) return;

    setIsSaving(true);
    const category = categories.find(c => c.id === formCategoryId);

    const serviceData: ServiceItem = {
      id: isNew ? `svc_${Date.now()}` : editingService!.id,
      name: formName.trim(),
      slug: formSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      categoryId: formCategoryId,
      categoryName: category?.name || 'Custom Solutions',
      shortDescription: formShortDesc.trim(),
      fullDescription: formFullDesc.trim() || formShortDesc.trim(),
      icon: formIcon,
      price: formPrice !== '' ? Number(formPrice) : undefined,
      startingPriceLabel: formStartingPriceLabel.trim() || undefined,
      deliveryEstimate: formDeliveryEstimate.trim() || undefined,
      features: formFeatures.split('\n').map(f => f.trim()).filter(Boolean),
      packages: editingService?.packages || [],
      isActive: formIsActive,
      isFeatured: formIsFeatured,
      displayOrder: Number(formDisplayOrder),
      seoTitle: formSeoTitle.trim() || undefined,
      seoDescription: formSeoDesc.trim() || undefined,
    };

    try {
      const saved = await saveService(serviceData);
      if (isNew) {
        onServicesUpdated([...services, saved]);
      } else {
        onServicesUpdated(services.map(s => (s.id === saved.id ? saved : s)));
      }
      setEditingService(null);
    } catch (err) {
      console.error('Error saving service:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = services.filter(s => {
    if (categoryFilter !== 'all' && s.categoryId !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Filter and Add Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#101626] border border-[#263249]">
        <div className="flex items-center gap-3 w-full sm:max-w-lg">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search services by keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Categories ({services.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={openNewServiceModal}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List Grid */}
      <div className="rounded-2xl bg-[#101626] border border-[#263249] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080B14] border-b border-[#263249] text-[#A7B2C8] uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Service Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Starting Price</th>
                <th className="py-3.5 px-4">Turnaround</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263249]/60">
              {filtered.map(service => (
                <tr key={service.id} className="hover:bg-[#141C2E]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{service.name}</div>
                    <div className="text-[11px] text-[#A7B2C8] font-mono">/services/{service.slug}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[10px]">
                      {service.categoryName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-cyan-400 font-semibold">
                    {service.startingPriceLabel || (service.price ? `$${service.price}` : 'Custom')}
                  </td>
                  <td className="py-3.5 px-4 text-violet-300 font-medium">
                    {service.deliveryEstimate || 'Scope-Based'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        service.isActive
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-500/20 text-slate-300'
                      }`}
                    >
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {service.isFeatured ? (
                      <span className="text-cyan-400 font-bold text-[10px] uppercase">Yes</span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">No</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      type="button"
                      title="Edit Service"
                      onClick={() => openEditModal(service)}
                      className="p-1.5 rounded-lg bg-[#141C2E] border border-[#263249] hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Duplicate Service"
                      onClick={() => handleDuplicate(service)}
                      className="p-1.5 rounded-lg bg-[#141C2E] border border-[#263249] hover:border-violet-400 text-slate-300 hover:text-violet-300 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Delete Service"
                      onClick={() => handleDelete(service.id)}
                      className="p-1.5 rounded-lg bg-[#141C2E] border border-[#263249] hover:border-rose-400 text-slate-300 hover:text-rose-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#101626] border border-[#263249] rounded-3xl p-6 sm:p-8 space-y-6 text-[#F8FAFC] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#263249] pb-4">
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                {isNew ? 'Create New Service' : `Edit: ${formName}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#141C2E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => {
                      setFormName(e.target.value);
                      if (isNew) {
                        setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Unique Slug *</label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={e => setFormSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Service Category *</label>
                  <select
                    value={formCategoryId}
                    onChange={e => setFormCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Icon Identifier</label>
                  <select
                    value={formIcon}
                    onChange={e => setFormIcon(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Sparkles">Sparkles</option>
                    <option value="Code2">Code2</option>
                    <option value="Cpu">Cpu</option>
                    <option value="Briefcase">Briefcase</option>
                    <option value="Layers">Layers</option>
                    <option value="Zap">Zap</option>
                    <option value="TrendingUp">TrendingUp</option>
                    <option value="Megaphone">Megaphone</option>
                    <option value="Terminal">Terminal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Starting Price Label</label>
                  <input
                    type="text"
                    value={formStartingPriceLabel}
                    onChange={e => setFormStartingPriceLabel(e.target.value)}
                    placeholder="e.g. From $950 / mo"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Delivery Estimate</label>
                  <input
                    type="text"
                    value={formDeliveryEstimate}
                    onChange={e => setFormDeliveryEstimate(e.target.value)}
                    placeholder="e.g. 5-7 business days"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Short Description (Cards) *</label>
                <textarea
                  required
                  rows={2}
                  value={formShortDesc}
                  onChange={e => setFormShortDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formFullDesc}
                  onChange={e => setFormFullDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Features (One per line)</label>
                <textarea
                  rows={3}
                  value={formFeatures}
                  onChange={e => setFormFeatures(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={e => setFormIsActive(e.target.checked)}
                    className="rounded border-[#263249] text-cyan-400 focus:ring-0"
                  />
                  <span>Service Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={e => setFormIsFeatured(e.target.checked)}
                    className="rounded border-[#263249] text-cyan-400 focus:ring-0"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formDisplayOrder}
                    onChange={e => setFormDisplayOrder(Number(e.target.value))}
                    className="w-20 px-2 py-1 rounded bg-[#080B14] border border-[#263249] text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#263249]">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl border border-[#263249] text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold shadow-lg shadow-blue-500/20"
                >
                  {isSaving ? 'Saving to Firestore...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
