
import { useEffect } from 'react';

interface SeoProps {
  title?: string;
  description?: string;
  ogImage?: string;
  lang?: string;
}

/**
 * useSeo Hook: Quản lý SEO Meta động cho React SPA (Vite)
 */
export const useSeo = ({ title, description, ogImage, lang = 'vi' }: SeoProps) => {
  useEffect(() => {
    // Giá trị mặc định
    const siteName = "T-kap Fashion";
    const defaultTitle = lang === 'vi' 
      ? "T-kap Fashion | Thời Trang May Đo Cao Cấp" 
      : "T-kap Fashion | Luxury Tailoring Specialist";
    
    const defaultDesc = lang === 'vi'
      ? "Khám phá bộ sưu tập thời trang may đo cao cấp TKAP. Tinh hoa di sản kết hợp cùng phong cách lãnh đạo hiện đại."
      : "Discover TKAP luxury tailoring collection. Heritage excellence meets modern executive style.";

    const finalTitle = title ? `${title} | ${siteName}` : defaultTitle;
    const finalDesc = description || defaultDesc;

    // 1. Cập nhật Title
    document.title = finalTitle;

    // 2. Cập nhật Meta Tags
    const updateMeta = (nameOrProperty: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', nameOrProperty);
        } else {
          element.setAttribute('name', nameOrProperty);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
      return element;
    };

    const tags: HTMLMetaElement[] = [];

    tags.push(updateMeta('description', finalDesc));
    tags.push(updateMeta('og:title', finalTitle, true));
    tags.push(updateMeta('og:description', finalDesc, true));
    tags.push(updateMeta('og:url', window.location.href, true));
    tags.push(updateMeta('og:type', 'website', true));

    if (ogImage) {
      tags.push(updateMeta('og:image', ogImage, true));
    }

    // Cleanup khi unmount (Tùy chọn - trong SPA thường chỉ ghi đè)
    return () => {
      // Không xóa tags để tránh mất SEO khi chuyển trang nhanh, 
      // chỉ để lại để lần render tiếp theo ghi đè
    };
  }, [title, description, ogImage, lang]);
};
