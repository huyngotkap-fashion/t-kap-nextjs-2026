import React from "react";
import {
  SiteConfig,
  MenuItem,
  BrandNavItem,
  LandingPage,
  HiddenLink,
} from "../../types";

interface NavigationManagerProps {
  config: SiteConfig;
  onUpdate: (newConfig: SiteConfig) => void;
  landingPages?: LandingPage[];
}

const inputBase =
  "w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all";
const labelBase =
  "text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block";

/* ----------------------------- UTILITIES ----------------------------- */

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

/* ===================================================================== */

const NavigationManager: React.FC<NavigationManagerProps> = ({
  config,
  onUpdate,
  landingPages = [],
}) => {
  const hiddenLinks = config.hiddenLinks || [];

  /* ------------------------ GENERIC SAFE UPDATE ------------------------ */

  const updateArrayItem = <T,>(
    key: keyof SiteConfig,
    id: string,
    updater: (item: T) => T
  ) => {
    const updated = (config[key] as T[]).map((item: any) =>
      item.id === id ? updater(item) : item
    );

    onUpdate({ ...config, [key]: updated });
  };

  /* ============================ NAV ITEMS ============================ */

  const addNavItem = () => {
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      label: { en: "New", vi: "Mới" },
      targetCategory: "/",
    };

    onUpdate({
      ...config,
      navItems: [...config.navItems, newItem],
    });
  };

  const removeNavItem = (id: string) => {
    onUpdate({
      ...config,
      navItems: config.navItems.filter((i) => i.id !== id),
    });
  };

  /* ============================ BRAND ITEMS ============================ */

  const addBrandItem = () => {
  const newItem: BrandNavItem = {
    id: crypto.randomUUID(),
    label: { en: "BRAND", vi: "THƯƠNG HIỆU" },
    targetCategory: "/",
  };

  onUpdate({
    ...config,
    brandNavItems: [...config.brandNavItems, newItem],
  });
};

  const removeBrandItem = (id: string) => {
    onUpdate({
      ...config,
      brandNavItems: config.brandNavItems.filter((i) => i.id !== id),
    });
  };

  /* ============================ HIDDEN LINKS ============================ */

  const addHiddenLink = () => {
    const newLink: HiddenLink = {
      id: crypto.randomUUID(), // internal immutable id
      slug: `link-${Date.now()}`, // editable slug
      title: "Trang nhúng mới",
      url: "https://",
      isActive: true,
    };

    onUpdate({
      ...config,
      hiddenLinks: [...hiddenLinks, newLink],
    });
  };

  const removeHiddenLink = (id: string) => {
    onUpdate({
      ...config,
      hiddenLinks: hiddenLinks.filter((l) => l.id !== id),
    });
  };

  const activeLPs = landingPages.filter((lp) => lp.isActive);
  const activeHiddenLinks = hiddenLinks.filter((l) => l.isActive);

  /* ===================================================================== */

  return (
    <div className="space-y-20 pb-40">
      {/* ================= HEADER MENU ================= */}
      <section>
        <div className="flex justify-between items-center mb-10 border-b pb-4">
          <h3 className="text-xl font-black uppercase">
            Thanh điều hướng chính
          </h3>
          <button
            onClick={addNavItem}
            className="bg-black text-white px-6 py-2 text-[10px] font-bold uppercase"
          >
            + Thêm Menu
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.navItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border p-6 shadow-sm space-y-4"
            >
              <div>
                <label className={labelBase}>Tên hiển thị (VI)</label>
                <input
                  value={item.label.vi}
                  onChange={(e) =>
                    updateArrayItem<MenuItem>("navItems", item.id, (i) => ({
                      ...i,
                      label: { ...i.label, vi: e.target.value },
                    }))
                  }
                  className={inputBase}
                />
              </div>

              <div>
                <label className={labelBase}>Đường dẫn</label>
                <input
                  value={item.targetCategory}
                  onChange={(e) =>
                    updateArrayItem<MenuItem>("navItems", item.id, (i) => ({
                      ...i,
                      targetCategory: e.target.value,
                    }))
                  }
                  className={inputBase}
                />
              </div>

              <button
                onClick={() => removeNavItem(item.id)}
                className="text-red-500 text-xs font-bold"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HIDDEN LINKS ================= */}
      <section className="bg-zinc-50 p-10 border">
        <div className="flex justify-between items-center mb-10 border-b pb-4">
          <h3 className="text-xl font-black uppercase">
            Quản lý Link Ẩn
          </h3>
          <button
            onClick={addHiddenLink}
            className="bg-blue-600 text-white px-6 py-2 text-[10px] font-bold uppercase"
          >
            + Tạo Link
          </button>
        </div>

        <div className="space-y-4">
          {hiddenLinks.map((link) => (
            <div
              key={link.id}
              className="bg-white border p-6 shadow-sm space-y-4"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={labelBase}>Tiêu đề</label>
                  <input
                    value={link.title}
                    onChange={(e) =>
                      updateArrayItem<HiddenLink>(
                        "hiddenLinks",
                        link.id,
                        (l) => ({ ...l, title: e.target.value })
                      )
                    }
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={labelBase}>Slug</label>
                  <input
                    value={link.slug}
                    onChange={(e) =>
                      updateArrayItem<HiddenLink>(
                        "hiddenLinks",
                        link.id,
                        (l) => ({
                          ...l,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-"),
                        })
                      )
                    }
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={labelBase}>URL Nhúng</label>
                  <input
                    value={link.url}
                    onChange={(e) =>
                      updateArrayItem<HiddenLink>(
                        "hiddenLinks",
                        link.id,
                        (l) => ({ ...l, url: e.target.value })
                      )
                    }
                    className={`${inputBase} ${
                      !isValidUrl(link.url)
                        ? "border-red-400"
                        : ""
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    updateArrayItem<HiddenLink>(
                      "hiddenLinks",
                      link.id,
                      (l) => ({ ...l, isActive: !l.isActive })
                    )
                  }
                  className={`px-4 py-2 text-xs font-bold ${
                    link.isActive
                      ? "bg-black text-white"
                      : "bg-zinc-200"
                  }`}
                >
                  {link.isActive ? "Bật" : "Tắt"}
                </button>

                <button
                  onClick={() => removeHiddenLink(link.id)}
                  className="text-red-500 text-xs font-bold"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BRAND TABS ================= */}
      <section>
        <div className="flex justify-between items-center mb-10 border-b pb-4">
          <h3 className="text-xl font-black uppercase">
            Danh mục Thương hiệu
          </h3>
          <button
            onClick={addBrandItem}
            className="bg-black text-white px-6 py-2 text-[10px] font-bold uppercase"
          >
            + Thêm
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {config.brandNavItems.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-50 border p-6 w-64 shadow-sm space-y-4 relative"
            >
              <button
                onClick={() => removeBrandItem(item.id)}
                className="absolute top-2 right-2 text-zinc-400"
              >
                ✕
              </button>

              <div>
                <label className={labelBase}>Tên</label>
                <input
  value={item.label.vi}
  onChange={(e) =>
    updateArrayItem<BrandNavItem>(
      "brandNavItems",
      item.id,
      (i) => ({
        ...i,
        label: { ...i.label, vi: e.target.value },
      })
    )
  }
  className={inputBase}
/>
              </div>

              <div>
                <label className={labelBase}>Slug</label>
                <input
                  value={item.targetCategory}
                  onChange={(e) =>
                    updateArrayItem<BrandNavItem>(
                      "brandNavItems",
                      item.id,
                      (i) => ({
                        ...i,
                        targetCategory: e.target.value,
                      })
                    )
                  }
                  className={inputBase}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NavigationManager;