import React, { useState } from 'react';
import { useImageManager, ImageAssetInfo } from '../context/ImageManagerContext';
import { 
  X, 
  Upload, 
  Link, 
  RotateCcw, 
  Image as ImageIcon, 
  Check, 
  Search, 
  Save, 
  Trash2, 
  AlertCircle, 
  Sparkles,
  Undo2
} from 'lucide-react';

interface ImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageManagerModal: React.FC<ImageManagerModalProps> = ({ isOpen, onClose }) => {
  const { 
    getAllImageAssets, 
    getImage, 
    saveCustomImage, 
    removeCustomImage, 
    resetCustomImages 
  } = useImageManager();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Staging state for edits before saving: assetId -> staged URL or base64
  const [stagedImages, setStagedImages] = useState<Record<string, string>>({});
  const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});

  // Status feedback state
  const [statusMap, setStatusMap] = useState<Record<string, { type: 'success' | 'error'; message: string }>>({});
  const [globalMessage, setGlobalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingMap, setIsSavingMap] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const allAssets = getAllImageAssets();
  const categories = ['All', ...Array.from(new Set(allAssets.map((a) => a.category)))];

  const filteredAssets = allAssets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || asset.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUrlInputChange = (id: string, val: string) => {
    setUrlInputs((prev) => ({ ...prev, [id]: val }));
  };

  // Stage a URL for preview before clicking Save
  const handleStageUrl = (id: string) => {
    const url = (urlInputs[id] || '').trim();
    if (!url) {
      setStatusMap((prev) => ({
        ...prev,
        [id]: { type: 'error', message: 'Please enter a valid image URL.' },
      }));
      return;
    }

    // Simple URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image/')) {
      setStatusMap((prev) => ({
        ...prev,
        [id]: { type: 'error', message: 'URL must start with http:// or https://' },
      }));
      return;
    }

    setStagedImages((prev) => ({ ...prev, [id]: url }));
    setStatusMap((prev) => ({
      ...prev,
      [id]: { type: 'success', message: 'New image staged for preview! Click "Save Changes" to apply.' },
    }));
  };

  // Stage a File for preview before clicking Save
  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format (JPG, JPEG, PNG, WebP)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setStatusMap((prev) => ({
        ...prev,
        [id]: { type: 'error', message: 'Invalid file format. Please upload JPG, PNG, or WebP.' },
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64String = uploadEvent.target?.result as string;
      if (base64String) {
        setStagedImages((prev) => ({ ...prev, [id]: base64String }));
        setStatusMap((prev) => ({
          ...prev,
          [id]: { type: 'success', message: 'File uploaded and staged! Click "Save Changes" to apply.' },
        }));
      } else {
        setStatusMap((prev) => ({
          ...prev,
          [id]: { type: 'error', message: 'Failed to read file.' },
        }));
      }
    };
    reader.onerror = () => {
      setStatusMap((prev) => ({
        ...prev,
        [id]: { type: 'error', message: 'File read error.' },
      }));
    };
    reader.readAsDataURL(file);
  };

  // Commit Save Changes for a specific asset
  const handleSaveChanges = async (asset: ImageAssetInfo) => {
    const staged = stagedImages[asset.id];
    if (!staged) return;

    setIsSavingMap((prev) => ({ ...prev, [asset.id]: true }));
    try {
      const success = await saveCustomImage(asset.id, staged);
      if (success) {
        // Clear staged state & show success
        setStagedImages((prev) => {
          const copy = { ...prev };
          delete copy[asset.id];
          return copy;
        });
        setUrlInputs((prev) => ({ ...prev, [asset.id]: '' }));
        setStatusMap((prev) => ({
          ...prev,
          [asset.id]: { type: 'success', message: `Saved! Live website image for "${asset.name}" updated successfully.` },
        }));
        setGlobalMessage({ type: 'success', text: `Saved custom image for "${asset.name}"!` });
        setTimeout(() => setGlobalMessage(null), 3000);
      } else {
        setStatusMap((prev) => ({
          ...prev,
          [asset.id]: { type: 'error', message: 'Failed to save image to persistent storage.' },
        }));
      }
    } catch (e) {
      setStatusMap((prev) => ({
        ...prev,
        [asset.id]: { type: 'error', message: 'An unexpected error occurred while saving.' },
      }));
    } finally {
      setIsSavingMap((prev) => ({ ...prev, [asset.id]: false }));
    }
  };

  // Cancel staged edit
  const handleCancelStaged = (id: string) => {
    setStagedImages((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setUrlInputs((prev) => ({ ...prev, [id]: '' }));
    setStatusMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Restore Previous / Default Image
  const handleRestoreDefault = async (asset: ImageAssetInfo) => {
    if (window.confirm(`Restore default original image for "${asset.name}"?`)) {
      await removeCustomImage(asset.id);
      handleCancelStaged(asset.id);
      setStatusMap((prev) => ({
        ...prev,
        [asset.id]: { type: 'success', message: 'Restored original default image.' },
      }));
      setGlobalMessage({ type: 'success', text: `Restored default image for "${asset.name}".` });
      setTimeout(() => setGlobalMessage(null), 3000);
    }
  };

  const handleResetAll = async () => {
    if (window.confirm('Reset ALL custom images back to original defaults across the entire website?')) {
      await resetCustomImages();
      setStagedImages({});
      setUrlInputs({});
      setStatusMap({});
      setGlobalMessage({ type: 'success', text: 'All website images reset to defaults!' });
      setTimeout(() => setGlobalMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 animate-fadeIn">
      <div className="bg-[#FFF6F0] rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#C6A77D]/40 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#6D3546] text-[#F5EFE7] px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-[#C6A77D]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-[#C6A77D]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#C6A77D]">
                <span>🖼️ RENTORA Central Image Manager</span>
              </div>
              <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-white">
                Live Website Image Control Panel
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
              title="Reset All Images to Default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Close Manager"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {globalMessage && (
          <div className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 animate-bounceIn shrink-0 ${
            globalMessage.type === 'success' ? 'bg-emerald-700 text-white' : 'bg-red-700 text-white'
          }`}>
            {globalMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{globalMessage.text}</span>
          </div>
        )}

        {/* Filters & Search Bar */}
        <div className="p-4 bg-white border-b border-[#C6A77D]/20 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#6D3546] text-white shadow-xs'
                    : 'bg-[#F5EFE7] text-[#292727] hover:bg-[#EAE0D0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets by product name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFF6F0] border border-[#C6A77D]/30 text-xs text-[#292727] focus:outline-none focus:ring-2 focus:ring-[#6D3546]"
            />
          </div>
        </div>

        {/* Asset List Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAssets.map((asset) => {
              const currentSavedImg = asset.currentUrl;
              const stagedImg = stagedImages[asset.id];
              const isStaged = Boolean(stagedImg);
              const inputUrlVal = urlInputs[asset.id] || '';
              const status = statusMap[asset.id];
              const isSaving = isSavingMap[asset.id] || false;

              return (
                <div
                  key={asset.id}
                  className={`bg-white rounded-2xl p-4 border transition-all shadow-xs flex flex-col justify-between ${
                    isStaged ? 'border-[#6D3546] ring-1 ring-[#6D3546]/30 bg-[#FFFBF8]' : 'border-[#C6A77D]/30'
                  }`}
                >
                  <div>
                    {/* Header: Title & Category */}
                    <div className="flex items-center justify-between gap-2 mb-3 border-b border-gray-100 pb-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D3546] bg-[#6D3546]/10 px-2 py-0.5 rounded-full inline-block mb-1">
                          {asset.category}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-[#292727] truncate" title={asset.name}>
                          {asset.name}
                        </h4>
                      </div>

                      <span className="text-[10px] text-gray-400 font-mono shrink-0">
                        ID: {asset.id}
                      </span>
                    </div>

                    {/* Image Previews Box: Current Saved vs New Staged Preview */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      
                      {/* Current Saved Image Preview */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-gray-500 block">
                          Current Saved Image
                        </span>
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group">
                          <img
                            src={currentSavedImg}
                            alt={`${asset.name} current`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-xs">
                            Active Live
                          </span>
                        </div>
                      </div>

                      {/* New Staged Preview Box */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-[#6D3546] flex items-center justify-between">
                          <span>New Staged Preview</span>
                          {isStaged && <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">Pending Save</span>}
                        </span>
                        <div className={`w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border flex items-center justify-center relative ${
                          isStaged ? 'border-[#6D3546] ring-2 ring-[#6D3546]/20' : 'border-dashed border-gray-300'
                        }`}>
                          {isStaged ? (
                            <img
                              src={stagedImg}
                              alt={`${asset.name} staged`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-2 text-gray-400">
                              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                              <span className="text-[10px] block leading-tight">No new image staged</span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Upload / Replace Option Inputs */}
                    <div className="space-y-2 mb-3">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        
                        {/* File Upload Option */}
                        <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5EFE7] hover:bg-[#EAE0D0] text-[#6D3546] text-xs font-semibold border border-[#C6A77D]/40 transition-all cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File (JPG/PNG/WebP)</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={(e) => handleFileUpload(asset.id, e)}
                          />
                        </label>

                        {/* Restore Previous / Default Button */}
                        <button
                          type="button"
                          onClick={() => handleRestoreDefault(asset)}
                          className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium border border-gray-300 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                          title="Restore original default image"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          <span>Restore Original</span>
                        </button>
                      </div>

                      {/* Image URL Input Option */}
                      <div className="flex items-center gap-1.5">
                        <div className="relative flex-1">
                          <Link className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="url"
                            placeholder="Or paste image URL (https://...)"
                            value={inputUrlVal}
                            onChange={(e) => handleUrlInputChange(asset.id, e.target.value)}
                            className="w-full pl-8 pr-2 py-1.5 rounded-xl bg-[#FFF6F0] border border-[#C6A77D]/30 text-xs text-[#292727] focus:outline-none focus:ring-1 focus:ring-[#6D3546]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleStageUrl(asset.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#6D3546] hover:bg-[#522533] text-white text-xs font-semibold transition-all cursor-pointer shrink-0"
                        >
                          Stage URL
                        </button>
                      </div>
                    </div>

                    {/* Status Feedback Banner */}
                    {status && (
                      <div className={`p-2 rounded-xl text-xs flex items-center gap-2 mb-3 ${
                        status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {status.type === 'success' ? <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />}
                        <span className="leading-tight">{status.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Save Changes & Cancel Buttons */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    {isStaged && (
                      <button
                        type="button"
                        onClick={() => handleCancelStaged(asset.id)}
                        disabled={isSaving}
                        className="px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSaveChanges(asset)}
                      disabled={!isStaged || isSaving}
                      className={`inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                        isStaged
                          ? 'bg-[#6D3546] hover:bg-[#522533] text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      }`}
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No image assets found matching "{searchQuery}".</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-5 sm:px-6 py-4 border-t border-[#C6A77D]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 shrink-0">
          <p className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C6A77D]" />
            <span>Saved images persist in browser IndexedDB storage and update live across all RENTORA components.</span>
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6D3546] text-white font-bold hover:bg-[#522533] transition-all cursor-pointer shadow-xs"
          >
            Done Managing Images
          </button>
        </div>

      </div>
    </div>
  );
};
