"use client";

import React, { useMemo, useCallback } from "react";
import { SiteConfig, BannerConfig } from "../../types";

interface BannerManagerProps {
  config: SiteConfig;
  onUpdate: (newConfig: SiteConfig) => void;
}

const BannerManager: React.FC<BannerManagerProps> = ({
  config,
  onUpdate,
}) => {
  const banners = config?.banners ?? [];

  const inputBase =
    "w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all";

  const labelBase =
    "text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block";

  /* =============================
     HELPERS
  ============================== */

  const safeNumber = (value: string) => {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const updateConfig = useCallback(
    (newBanners: BannerConfig[]) => {
      onUpdate({
        ...config,
        banners: newBanners,
      });
    },
    [config, onUpdate]
  );

  /* =============================
     ADD BANNER
  ============================== */

  const addBanner = useCallback(
    (groupId?: string) => {
      const newBanner: BannerConfig = {
        id: crypto.randomUUID(),
        type: "image",
        url: "",
        title: { en: "", vi: "Tiêu đề Banner Mới" },
        description: { en: "", vi: "Mô tả ngắn cho banner" },
        logoType: "text",
        logoText: "T-KAP",
        bannerLogoRedirect: "All",
        primaryBtnText: { en: "", vi: "XEM NGAY" },
        primaryBtnLink: "/",
        secondaryBtnText: { en: "", vi: "" },
        secondaryBtnLink: "/",
        displayMode: "slider",
        targetMenu: "All",
        sliderGroupId: groupId ?? "slider-1",
        order: banners.length + 1,
      };

      updateConfig([...banners, newBanner]);
    },
    [banners, updateConfig]
  );

  /* =============================
     UPDATE BANNER (SAFE)
  ============================== */

  const updateBanner = useCallback(
    (bannerId: string, field: string, value: unknown) => {
      const updated = banners.map((banner) => {
        if (banner.id !== bannerId) return banner;

        const clone: BannerConfig = { ...banner };

        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          const parentKey = parent as keyof BannerConfig;

          clone[parentKey] = {
            ...(clone[parentKey] as Record<string, unknown>),
            [child]: value,
          } as any;
        } else {
          (clone as any)[field] = value;
        }

        return clone;
      });

      updateConfig(updated);
    },
    [banners, updateConfig]
  );

  /* =============================
     REMOVE
  ============================== */

  const removeBanner = useCallback(
    (id: string) => {
      updateConfig(banners.filter((b) => b.id !== id));
    },
    [banners, updateConfig]
  );

  /* =============================
     GROUPED BANNERS
  ============================== */

  const groupedBanners = useMemo(() => {
    const groups: Record<string, BannerConfig[]> = {};

    banners.forEach((b) => {
      const gid = b.sliderGroupId ?? "unassigned";
      if (!groups[gid]) groups[gid] = [];
      groups[gid].push(b);
    });

    Object.keys(groups).forEach((key) => {
      groups[key].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
    });

    return groups;
  }, [banners]);

  /* =============================
     UI
  ============================== */

  return (
    <div className="animate-reveal pb-20 space-y-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-zinc-100 pb-6">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight">
            Quản lý Banner Slider
          </h3>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2">
            Phân nhóm và sắp xếp thứ tự hiển thị
          </p>
        </div>

        <button
          onClick={() => addBanner()}
          className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg"
        >
          + THÊM BANNER MỚI
        </button>
      </div>

      {/* GROUPS */}
      {Object.entries(groupedBanners).map(([groupId, groupItems]) => (
        <div key={groupId} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 bg-zinc-50 px-4 py-1 rounded-full border border-zinc-200">
              Nhóm: {groupId} ({groupItems.length})
            </h4>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          {groupItems.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-zinc-200 p-8 shadow-md hover:shadow-xl transition-all flex flex-col lg:flex-row gap-8 relative"
            >
              {/* ORDER BADGE */}
              <div className="absolute top-0 left-0 bg-black text-white w-10 h-10 flex items-center justify-center font-black text-sm">
                {b.order ?? "#"}
              </div>

              {/* LEFT */}
              <div className="w-full lg:w-1/4 space-y-4">
                <div className="aspect-video bg-zinc-100 border border-zinc-200 overflow-hidden relative">
                  {b.type === "video" ? (
                    <video
                      src={b.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={b.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div>
                  <label className={labelBase}>Thứ tự</label>
                  <input
                    type="number"
                    value={b.order ?? 0}
                    onChange={(e) =>
                      updateBanner(
                        b.id,
                        "order",
                        safeNumber(e.target.value)
                      )
                    }
                    className={inputBase}
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className={labelBase}>Tiêu đề (VI)</label>
                  <input
                    value={b.title?.vi ?? ""}
                    onChange={(e) =>
                      updateBanner(
                        b.id,
                        "title.vi",
                        e.target.value
                      )
                    }
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className={labelBase}>URL Media</label>
                  <input
                    value={b.url ?? ""}
                    onChange={(e) =>
                      updateBanner(
                        b.id,
                        "url",
                        e.target.value
                      )
                    }
                    className={inputBase}
                  />
                </div>

                <button
                  onClick={() => removeBanner(b.id)}
                  className="w-10 h-10 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => addBanner(groupId)}
            className="w-full py-4 border-2 border-dashed border-zinc-200 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:border-black hover:text-black transition-all bg-white/50"
          >
            + Thêm banner vào nhóm {groupId}
          </button>
        </div>
      ))}

      {banners.length === 0 && (
        <div className="py-24 text-center border-4 border-dashed border-zinc-100 rounded-xl">
          <p className="text-zinc-300 font-bold uppercase tracking-widest">
            Chưa có banner nào được tạo
          </p>
          <button
            onClick={() => addBanner()}
            className="mt-4 bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest"
          >
            Khởi tạo Banner đầu tiên
          </button>
        </div>
      )}
    </div>
  );
};

export default BannerManager;