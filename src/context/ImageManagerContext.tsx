import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, OCCASIONS, TODAY_MOODS } from '../data/catalog';
import { saveImageToDB, deleteImageFromDB, getAllImagesFromDB, clearAllImagesFromDB } from '../utils/imageStorage';

export interface ImageAssetInfo {
  id: string;
  name: string;
  category: string;
  defaultUrl: string;
  currentUrl: string;
}

interface ImageManagerContextType {
  customImages: Record<string, string>;
  getImage: (id: string, defaultPath: string) => string;
  saveCustomImage: (id: string, urlOrBase64: string) => Promise<boolean>;
  removeCustomImage: (id: string) => Promise<boolean>;
  resetCustomImages: () => Promise<boolean>;
  isManagerOpen: boolean;
  setIsManagerOpen: (open: boolean) => void;
  getAllImageAssets: () => ImageAssetInfo[];
}

const ImageManagerContext = createContext<ImageManagerContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'rentora_custom_image_overrides_v1';

export const ImageManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    // Synchronous initial load from localStorage for fast render
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isManagerOpen, setIsManagerOpen] = useState(false);

  // Asynchronous load from IndexedDB to merge persistent uploaded files
  useEffect(() => {
    let isMounted = true;
    getAllImagesFromDB().then((dbImages) => {
      if (isMounted && Object.keys(dbImages).length > 0) {
        setCustomImages((prev) => {
          const merged = { ...prev, ...dbImages };
          try {
            // Attempt localStorage sync if small enough
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          } catch {
            // Ignore quota errors in localStorage since IndexedDB holds full data
          }
          return merged;
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const getImage = (id: string, defaultPath: string): string => {
    return customImages[id] || defaultPath;
  };

  const saveCustomImage = async (id: string, urlOrBase64: string): Promise<boolean> => {
    if (!id || !urlOrBase64) return false;

    // 1. Save to persistent IndexedDB
    const dbSuccess = await saveImageToDB(id, urlOrBase64);

    // 2. Update React State synchronously so website reflects new image live
    setCustomImages((prev) => {
      const updated = { ...prev, [id]: urlOrBase64 };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Safe fallback to IndexedDB if base64 exceeds localStorage 5MB quota
      }
      return updated;
    });

    return dbSuccess;
  };

  const removeCustomImage = async (id: string): Promise<boolean> => {
    await deleteImageFromDB(id);
    setCustomImages((prev) => {
      const copy = { ...prev };
      delete copy[id];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(copy));
      } catch {}
      return copy;
    });
    return true;
  };

  const resetCustomImages = async (): Promise<boolean> => {
    await clearAllImagesFromDB();
    setCustomImages({});
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
    return true;
  };

  const getAllImageAssets = (): ImageAssetInfo[] => {
    const assets: ImageAssetInfo[] = [];

    // 1. Products (Her, Him, Accessory)
    PRODUCTS.forEach((product) => {
      const defaultImg = product.images[0] || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80';
      const id = `product-${product.id}`;
      assets.push({
        id,
        name: `${product.name} (${product.category.toUpperCase()})`,
        category: `Products (${product.category})`,
        defaultUrl: defaultImg,
        currentUrl: getImage(id, defaultImg),
      });
    });

    // 2. Occasions
    OCCASIONS.forEach((occ) => {
      const id = `occasion-${occ.id}`;
      assets.push({
        id,
        name: `Occasion: ${occ.name}`,
        category: 'Occasions',
        defaultUrl: occ.image,
        currentUrl: getImage(id, occ.image),
      });
    });

    // 3. Moods
    TODAY_MOODS.forEach((mood) => {
      const id = `mood-${mood.id}`;
      const defaultImg = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80';
      assets.push({
        id,
        name: `Mood Aesthetic: ${mood.label}`,
        category: 'Mood Vibe',
        defaultUrl: defaultImg,
        currentUrl: getImage(id, defaultImg),
      });
    });

    // 4. Banners & Special Assets
    assets.push({
      id: 'banner-hero',
      name: 'Hero Main Editorial Banner',
      category: 'Banners & UI',
      defaultUrl: '/src/assets/images/hero_fashion_editorial_lehenga_1793298948653.jpg',
      currentUrl: getImage('banner-hero', '/src/assets/images/hero_fashion_editorial_lehenga_1793298948653.jpg'),
    });
    assets.push({
      id: 'banner-maison',
      name: 'Maison Parisian Section Banner',
      category: 'Banners & UI',
      defaultUrl: '/src/assets/images/maison_editorial_paris_1792952794101.jpg',
      currentUrl: getImage('banner-maison', '/src/assets/images/maison_editorial_paris_1792952794101.jpg'),
    });
    assets.push({
      id: 'logo-brand',
      name: 'RENTORA Brand Logo',
      category: 'Banners & UI',
      defaultUrl: '/assets/aistudio/rentora-logo_359e5dd0.png',
      currentUrl: getImage('logo-brand', '/assets/aistudio/rentora-logo_359e5dd0.png'),
    });

    return assets;
  };

  return (
    <ImageManagerContext.Provider
      value={{
        customImages,
        getImage,
        saveCustomImage,
        removeCustomImage,
        resetCustomImages,
        isManagerOpen,
        setIsManagerOpen,
        getAllImageAssets,
      }}
    >
      {children}
    </ImageManagerContext.Provider>
  );
};

export const useImageManager = () => {
  const context = useContext(ImageManagerContext);
  if (!context) {
    throw new Error('useImageManager must be used within an ImageManagerProvider');
  }
  return context;
};
