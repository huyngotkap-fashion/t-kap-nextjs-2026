import React from 'react';
import { SiteConfig } from '../../types';

interface SystemSettingsManagerProps {
  config: SiteConfig;
  onUpdate: (newConfig: SiteConfig) => void;
}

const SystemSettingsManager: React.FC<SystemSettingsManagerProps> = ({ config, onUpdate }) => {

  const inputBase =
    "w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all";

  const labelBase =
    "text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block";

  const promoPopup = config.promoPopup ?? {
    isActive: false,
    title: { vi: "", en: "" },
    message: { vi: "", en: "" },
    imageUrl: "",
    buttonText: { vi: "", en: "" },
    buttonLink: ""
  };

  const togglePromo = (field: string) => {
    onUpdate({
      ...config,
      promoPopup: {
        ...promoPopup,
        [field]: !promoPopup[field as keyof typeof promoPopup]
      }
    });
  };

  const updatePromo = (field: string, value: any) => {
    onUpdate({
      ...config,
      promoPopup: {
        ...promoPopup,
        [field]: value
      }
    });
  };

  const updatePromoText = (field: string, lang: "vi" | "en", value: string) => {
    const current = promoPopup[field as keyof typeof promoPopup] as any || {};
    onUpdate({
      ...config,
      promoPopup: {
        ...promoPopup,
        [field]: {
          ...current,
          [lang]: value
        }
      }
    });
  };

  return (
    <div className="animate-reveal pb-20 space-y-12">

      {/* BRAND */}
      <section className="bg-white border border-zinc-200 p-10 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-10">

        <div>
          <h3 className="text-xl font-black uppercase mb-8 border-b border-zinc-100 pb-4">
            Thương hiệu & Logo
          </h3>

          <div className="space-y-6">

            <div>
              <label className={labelBase}>Link Logo Image (URL)</label>
              <input
                value={config.logoImageUrl || ""}
                onChange={e =>
                  onUpdate({ ...config, logoImageUrl: e.target.value })
                }
                className={inputBase}
              />
            </div>

            <div className="h-32 bg-zinc-900 flex items-center justify-center p-4 border border-zinc-800">
              {config.logoImageUrl && (
                <img
                  src={config.logoImageUrl}
                  className="h-full object-contain"
                  alt="Logo Preview"
                />
              )}
            </div>

            <div>
              <label className={labelBase}>Màu chủ đạo thương hiệu</label>
              <input
                type="color"
                value={config.brandPrimaryColor || "#000000"}
                onChange={e =>
                  onUpdate({ ...config, brandPrimaryColor: e.target.value })
                }
                className="w-full h-12 cursor-pointer border-zinc-200"
              />
            </div>

          </div>
        </div>

        {/* PROMO POPUP */}

        <div>
          <h3 className="text-xl font-black uppercase mb-8 border-b border-zinc-100 pb-4">
            Promo Popup
          </h3>

          <div className="space-y-6">

            {/* TOGGLE */}
            <div className="flex items-center gap-6">

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Kích hoạt
                </span>

                <button
                  onClick={() => togglePromo("isActive")}
                  className={`w-12 h-6 rounded-full relative transition-all ${
                    promoPopup.isActive ? "bg-black" : "bg-zinc-200"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      promoPopup.isActive ? "right-1" : "left-1"
                    }`}
                  />
                </button>

              </div>
            </div>

            {/* TITLE */}

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className={labelBase}>Tiêu đề (VI)</label>
                <input
                  value={promoPopup.title?.vi || ""}
                  onChange={e =>
                    updatePromoText("title", "vi", e.target.value)
                  }
                  className={inputBase}
                />
              </div>

              <div>
                <label className={labelBase}>Tiêu đề (EN)</label>
                <input
                  value={promoPopup.title?.en || ""}
                  onChange={e =>
                    updatePromoText("title", "en", e.target.value)
                  }
                  className={inputBase}
                />
              </div>

            </div>

            {/* IMAGE */}

            <div>
              <label className={labelBase}>Link ảnh Popup</label>
              <input
                value={promoPopup.imageUrl || ""}
                onChange={e => updatePromo("imageUrl", e.target.value)}
                className={inputBase}
              />
            </div>

            {/* BUTTON */}

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className={labelBase}>Text Button (VI)</label>
                <input
                  value={promoPopup.buttonText?.vi || ""}
                  onChange={e =>
                    updatePromoText("buttonText", "vi", e.target.value)
                  }
                  className={inputBase}
                />
              </div>

              <div>
                <label className={labelBase}>Link Button</label>
                <input
                  value={promoPopup.buttonLink || ""}
                  onChange={e => updatePromo("buttonLink", e.target.value)}
                  className={inputBase}
                />
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* SOCIAL */}

      <section className="bg-black text-white p-10 shadow-2xl">

        <h3 className="text-xl font-black uppercase mb-8 border-b border-zinc-800 pb-4">
          Kết nối Mạng xã hội
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="space-y-4">
            <input
              value={config.contactFacebook || ""}
              onChange={e =>
                onUpdate({ ...config, contactFacebook: e.target.value })
              }
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-xs text-white"
              placeholder="Facebook link"
            />
          </div>

          <div className="space-y-4">
            <input
              value={config.contactZalo || ""}
              onChange={e =>
                onUpdate({ ...config, contactZalo: e.target.value })
              }
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-xs text-white"
              placeholder="Zalo link"
            />
          </div>

          <div className="space-y-4">
            <input
              value={config.contactYoutube || ""}
              onChange={e =>
                onUpdate({ ...config, contactYoutube: e.target.value })
              }
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 text-xs text-white"
              placeholder="Youtube link"
            />
          </div>

        </div>

      </section>

    </div>
  );
};

export default SystemSettingsManager;