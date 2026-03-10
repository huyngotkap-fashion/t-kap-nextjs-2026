"use client";

import React, { useMemo, useCallback, useState } from "react";
import { SiteConfig, BannerConfig } from "../../types";

interface BannerManagerProps {
  config: SiteConfig;
  onUpdate: (newConfig: SiteConfig) => void;
}

const BannerManager: React.FC<BannerManagerProps> = ({
  config,
  onUpdate,
}) => {

  const banners = useMemo(
    () => config?.banners ?? [],
    [config?.banners]
  );

  const [openSection, setOpenSection] = useState<string | null>("content");

  const input =
    "w-full border border-zinc-200 px-3 py-2 text-xs focus:border-black outline-none";

  const label =
    "text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1 block";

  /* ====================== */
  /* UPDATE CONFIG */
  /* ====================== */

  const updateConfig = useCallback(
    (newBanners: BannerConfig[]) => {
      onUpdate({
        ...config,
        banners: newBanners,
      });
    },
    [config, onUpdate]
  );

  /* ====================== */
  /* ADD BANNER (TOP) */
  /* ====================== */

  const addBanner = (groupId?: string) => {

    const newBanner: BannerConfig = {
      id: crypto.randomUUID(),
      type: "image",
      url: "",
      title: { en: "", vi: "Banner mới" },
      description: { en: "", vi: "" },
      primaryBtnText: { en: "", vi: "Xem ngay" },
      primaryBtnLink: "/",
      secondaryBtnText: { en: "", vi: "" },
      secondaryBtnLink: "/",
      displayMode: "slider",
      targetMenu: "home",
      sliderGroupId: groupId ?? "main-slider",
      order: 0
    };

    const newList = [newBanner, ...banners];

    updateConfig(newList);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ====================== */
  /* UPDATE FIELD */
  /* ====================== */

  const updateBanner = (
    id: string,
    field: string,
    value: any
  ) => {

    const updated = banners.map((b) => {

      if (b.id !== id) return b;

      const clone: any = { ...b };

      if (field.includes(".")) {

        const [parent, child] = field.split(".");

        clone[parent] = {
          ...clone[parent],
          [child]: value
        };

      } else {
        clone[field] = value;
      }

      return clone;
    });

    updateConfig(updated);
  };

  /* ====================== */
  /* REMOVE */
  /* ====================== */

  const removeBanner = (id: string) => {
    updateConfig(banners.filter((b) => b.id !== id));
  };

  /* ====================== */
  /* GROUP */
  /* ====================== */

  const grouped = useMemo(() => {

    const groups: Record<string, BannerConfig[]> = {};

    banners.forEach((b) => {

      const gid = b.sliderGroupId ?? "main-slider";

      if (!groups[gid]) groups[gid] = [];

      groups[gid].push(b);
    });

    return groups;

  }, [banners]);

  /* ====================== */
  /* UI */
  /* ====================== */

  return (

    <div className="space-y-12 pb-20">

      {/* HEADER */}

      <div className="flex justify-between items-center border-b pb-4">

        <h2 className="text-xl font-black uppercase">
          Banner Manager
        </h2>

        <button
          onClick={() => addBanner()}
          className="bg-black text-white px-6 py-3 text-xs font-bold hover:bg-zinc-800"
        >
          + Thêm banner
        </button>

      </div>

      {Object.entries(grouped).map(([groupId, items]) => (

        <div key={groupId} className="space-y-6">

          <h3 className="text-xs uppercase font-black text-zinc-500">
            Nhóm: {groupId}
          </h3>

          {items.map((b) => (

            <div
              key={b.id}
              className="border bg-white p-6 flex flex-col lg:flex-row gap-8 shadow-sm"
            >

              {/* PREVIEW */}

              <div className="lg:w-1/3 space-y-3">

                <div className="aspect-video bg-zinc-100 overflow-hidden">

                  {b.type === "video" ? (

                    <video
                      src={b.url}
                      controls
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <img
  src={b.url}
  alt=""
  className="w-full h-full object-cover"
/>

                  )}

                </div>

              </div>

              {/* SETTINGS */}

              <div className="flex-1 space-y-6">

                {/* CONTENT */}

                <div>

                  <button
                    onClick={() =>
                      setOpenSection(
                        openSection === "content"
                          ? null
                          : "content"
                      )
                    }
                    className="font-bold text-xs uppercase"
                  >
                    Nội dung
                  </button>

                  {openSection === "content" && (

                    <div className="grid grid-cols-2 gap-4 mt-3">

                      <div>
                        <label className={label}>
                          Tiêu đề
                        </label>
                        <input
                          className={input}
                          value={b.title?.vi ?? ""}
                          onChange={(e) =>
                            updateBanner(
                              b.id,
                              "title.vi",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div>
                        <label className={label}>
                          Text nhỏ
                        </label>
                        <input
                          className={input}
                          value={b.description?.vi ?? ""}
                          onChange={(e) =>
                            updateBanner(
                              b.id,
                              "description.vi",
                              e.target.value
                            )
                          }
                        />
                      </div>

                    </div>

                  )}

                </div>

                {/* BUTTONS */}

                <div>

                  <button
                    onClick={() =>
                      setOpenSection(
                        openSection === "buttons"
                          ? null
                          : "buttons"
                      )
                    }
                    className="font-bold text-xs uppercase"
                  >
                    Buttons
                  </button>

                  {openSection === "buttons" && (

                    <div className="grid grid-cols-2 gap-4 mt-3">

                      <input
                        className={input}
                        placeholder="Text nút chính"
                        value={b.primaryBtnText?.vi ?? ""}
                        onChange={(e) =>
                          updateBanner(
                            b.id,
                            "primaryBtnText.vi",
                            e.target.value
                          )
                        }
                      />

                      <input
                        className={input}
                        placeholder="Link nút chính"
                        value={b.primaryBtnLink ?? ""}
                        onChange={(e) =>
                          updateBanner(
                            b.id,
                            "primaryBtnLink",
                            e.target.value
                          )
                        }
                      />

                      <input
                        className={input}
                        placeholder="Text nút phụ"
                        value={b.secondaryBtnText?.vi ?? ""}
                        onChange={(e) =>
                          updateBanner(
                            b.id,
                            "secondaryBtnText.vi",
                            e.target.value
                          )
                        }
                      />

                      <input
                        className={input}
                        placeholder="Link nút phụ"
                        value={b.secondaryBtnLink ?? ""}
                        onChange={(e) =>
                          updateBanner(
                            b.id,
                            "secondaryBtnLink",
                            e.target.value
                          )
                        }
                      />

                    </div>

                  )}

                </div>

                {/* MEDIA */}

                <div>

                  <button
                    onClick={() =>
                      setOpenSection(
                        openSection === "media"
                          ? null
                          : "media"
                      )
                    }
                    className="font-bold text-xs uppercase"
                  >
                    Media
                  </button>

                  {openSection === "media" && (

                    <div className="grid grid-cols-2 gap-4 mt-3">

                      <select
                        className={input}
                        value={b.type}
                        onChange={(e) =>
                          updateBanner(
                            b.id,
                            "type",
                            e.target.value
                          )
                        }
                      >
                        <option value="image">Ảnh</option>
                        <option value="video">Video</option>
                      </select>

                      <input
                        className={input}
                        placeholder="URL media"
                        value={b.url}
                        onChange={(e) =>
                          updateBanner(
                            b.id,
                            "url",
                            e.target.value
                          )
                        }
                      />

                    </div>

                  )}

                </div>

                {/* DISPLAY */}

                <div>

                  <button
                    onClick={() =>
                      setOpenSection(
                        openSection === "display"
                          ? null
                          : "display"
                      )
                    }
                    className="font-bold text-xs uppercase"
                  >
                    Display
                  </button>

                  {openSection === "display" && (

                    <div className="grid grid-cols-2 gap-4 mt-3">

                      <select
                        className={input}
                        value={b.targetMenu}
                        onChange={(e) =>
                          updateBanner(
                            b.id,
                            "targetMenu",
                            e.target.value
                          )
                        }
                      >
                        <option value="home">Trang chủ</option>
                        <option value="men">Nam</option>
                        <option value="journal">Tin tức</option>
                        <option value="uniform">Đồng phục</option>
                      </select>

                      <input
                        type="number"
                        className={input}
                        value={b.order ?? 0}
                        onChange={(e) =>
                          updateBanner(
                            b.id,
                            "order",
                            Number(e.target.value)
                          )
                        }
                      />

                    </div>

                  )}

                </div>

                {/* DELETE */}

                <button
                  onClick={() => removeBanner(b.id)}
                  className="text-red-500 text-xs font-bold"
                >
                  Xóa banner
                </button>

              </div>

            </div>

          ))}

          <button
            onClick={() => addBanner(groupId)}
            className="w-full border-2 border-dashed py-3 text-xs uppercase text-zinc-400 hover:border-black hover:text-black"
          >
            + Thêm banner vào nhóm {groupId}
          </button>

        </div>

      ))}

    </div>

  );
};

export default BannerManager;