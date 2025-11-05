import { Image } from 'expo-image';

// Pre-cache images for faster loading
export const preloadImages = async (images: any[]) => {
  try {
    await Promise.all(
      images.map((image) => Image.prefetch(image))
    );
  } catch (error) {
    console.warn('Image preload error:', error);
  }
};

// Common blurhash for placeholders
export const BLURHASH = 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH';

// Image cache configuration
export const imageConfig = {
  cachePolicy: 'memory-disk' as const,
  priority: 'high' as const,
  transition: {
    duration: 200,
    timing: 'ease-in-out' as const,
  },
};

