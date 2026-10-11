import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, ArrowRight, Layers } from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../types';
import { ServiceCard } from '../components/common/ServiceCard';

interface ServicesPageProps {
  services: ServiceItem[];
  categories: ServiceCategory[];
  onOpenOrderModal: (service?: ServiceItem) => void;
  initialCategory?: string;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  categories,
  onOpenOrderModal,
  initialCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredServices = services.filter(service => {
    if (!service.isActive) return false;
    if (selectedCategory !== 'all' && service.categoryId !== selectedCategory) return false;
    if (featuredOnly && !service.isFeatured) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = service.name.toLowerCase().includes(q);
      const matchDesc = service.shortDescription.toLowerCase().includes(q);
      const matchFeatures = service.features?.some(f => f.toLowerCase().includes(q));
      return matchName || matchDesc || matchFeatures;
    }

    return true;
  });

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Page Title & Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-500/10 text-cyan-400 border border-blue-500/30">
          FULL-STACK IT CATALOG
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white">
          Our Comprehensive Services
        </h1>
        <p className="text-base text-[#A7B2C8]">
          Explore our complete catalog across Facebook Marketing, Social Media Growth, Custom Web Architecture, and Enterprise Software Systems.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-6">
        {/* Search bar & toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, technology, or feature..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                featuredOnly
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-[#141C2E] border-[#263249] text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Only</span>
            </button>
            <span className="text-xs text-[#A7B2C8]">
              Showing <strong className="text-white">{filteredServices.length}</strong> of {services.length}
            </span>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#4F8CFF] text-white shadow-md shadow-blue-500/20'
                : 'bg-[#141C2E] text-slate-300 hover:text-white border border-[#263249]'
            }`}
          >
            All Categories ({services.length})
          </button>
          {categories.map(cat => {
            const count = services.filter(s => s.categoryId === cat.id && s.isActive).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#4F8CFF] text-white shadow-md shadow-blue-500/20'
                    : 'bg-[#141C2E] text-slate-300 hover:text-white border border-[#263249]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid with both mandatory action buttons */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-3">
          <p className="text-base text-slate-300 font-medium">No services match your criteria.</p>
          <p className="text-xs text-[#A7B2C8]">Try adjusting your search terms or selecting another category.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setFeaturedOnly(false);
            }}
            className="px-4 py-2 rounded-lg bg-[#4F8CFF] text-white text-xs font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onOpenOrder={s => onOpenOrderModal(s)}
            />
          ))}
        </div>
      )}

      {/* Custom request fallback CTA */}
      <div className="p-8 rounded-3xl bg-[#101626] border border-[#263249] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
            Do not see your exact requirement listed?
          </h3>
          <p className="text-xs sm:text-sm text-[#A7B2C8] mt-1">
            We build custom technology solutions tailored specifically for proprietary business models.
          </p>
        </div>
        <a
          href="/custom-service"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 flex items-center gap-2 whitespace-nowrap"
        >
          <span>Configure Custom Project</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
