import React from "react";
import { LandingPage, LPBlock, Language } from "../../types";

interface LandingPageRendererProps {
  page: LandingPage;
  language: Language;
}

const getAnimClass = (anim?: string) => {
  switch (anim) {
    case "fade-up":
      return "animate-reveal";
    case "fade-in":
      return "opacity-0 animate-[fadeIn_1s_ease-out_forwards]";
    case "zoom-in":
      return "scale-110 animate-[zoomOut_1.5s_ease-out_forwards]";
    default:
      return "";
  }
};

const BlockRenderer: React.FC<{ block: LPBlock; language: Language }> = ({
  block,
  language,
}) => {
  if (block.isActive === false) return null;

  const title =
    block.content?.title?.[language] || block.content?.title?.vi || "";

  const subtitle =
    block.content?.subtitle?.[language] || block.content?.subtitle?.vi || "";

  const text =
    block.content?.text?.[language] || block.content?.text?.vi || "";

  const btnText =
    block.content?.buttonText?.[language] || block.content?.buttonText?.vi || "";

  const buttonLink = block.content?.buttonLink || "#";

  const animClass = getAnimClass(block.settings?.animation);

  /* ------------------------------------------------ */
  /* HERO / VIDEO HERO */
  /* ------------------------------------------------ */

  if (block.type === "hero" || block.type === "video") {
    return (
      <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden bg-black">

        <div className="absolute inset-0 z-0">

          {block.type === "video" && block.content?.videoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-60"
            >
              <source src={block.content.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={block.content?.imageUrl}
              className="w-full h-full object-cover opacity-60"
              alt=""
            />
          )}

        </div>

        <div className={`relative z-10 px-6 max-w-5xl ${animClass}`}>

          {title && (
            <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-black text-white uppercase tracking-tight mb-8 vietnamese-fix">
              {title}
            </h1>
          )}

          {text && (
            <p className="text-sm md:text-base text-zinc-300 uppercase tracking-[0.35em] font-bold mb-12 max-w-2xl mx-auto">
              {text}
            </p>
          )}

          {btnText && (
            <a
              href={buttonLink}
              className="inline-block border border-white px-14 py-5 text-[11px] font-black uppercase tracking-[0.4em] text-white hover:bg-white hover:text-black transition-all"
            >
              {btnText}
            </a>
          )}
        </div>
      </section>
    );
  }

  /* ------------------------------------------------ */
  /* IMAGE + TEXT */
  /* ------------------------------------------------ */

  if (block.type === "image-text") {
    const layoutRight = block.settings?.layout === "right";

    return (
      <section className="py-24 md:py-40 px-6 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">

        <div className={layoutRight ? "lg:order-2" : ""}>
          <div className={`overflow-hidden shadow-2xl ${animClass}`}>
            <img
              src={block.content?.imageUrl}
              className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-[2s]"
              alt=""
            />
          </div>
        </div>

        <div className={`space-y-10 ${layoutRight ? "lg:order-1" : ""}`}>

          {title && (
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tight vietnamese-fix">
              {title}
            </h2>
          )}

          {text && (
            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed">
              {text}
            </p>
          )}

          {btnText && (
            <a
              href={buttonLink}
              className="group inline-flex items-center gap-4 border-b-2 border-black pb-2 text-[11px] font-black uppercase tracking-widest hover:text-zinc-500 hover:border-zinc-500 transition-all"
            >
              {btnText}

              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          )}
        </div>
      </section>
    );
  }

  /* ------------------------------------------------ */
  /* FULL IMAGE */
  /* ------------------------------------------------ */

  if (block.type === "image") {
    return (
      <section className="relative w-full overflow-hidden">

        <div className={`w-full aspect-video md:aspect-[21/9] ${animClass}`}>
          <img
            src={block.content?.imageUrl}
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        {(title || text) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 bg-black/40 text-white">

            {title && (
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-4">
                {title}
              </h2>
            )}

            {text && (
              <p className="max-w-2xl text-xs uppercase tracking-[0.4em] font-bold">
                {text}
              </p>
            )}
          </div>
        )}
      </section>
    );
  }

  /* ------------------------------------------------ */
  /* BANNER CTA */
  /* ------------------------------------------------ */

  if (block.type === "banner") {
    return (
      <section className="py-32 md:py-52 bg-zinc-900 text-white text-center px-6">

        <div className={`max-w-4xl mx-auto space-y-12 ${animClass}`}>

          {title && (
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tight">
              {title}
            </h2>
          )}

          {text && (
            <p className="text-zinc-400 text-sm md:text-base uppercase tracking-[0.35em] font-bold">
              {text}
            </p>
          )}

          {btnText && (
            <a
              href={buttonLink}
              className="inline-block border border-white px-16 py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all"
            >
              {btnText}
            </a>
          )}
        </div>
      </section>
    );
  }

  /* ------------------------------------------------ */
  /* TEXT BLOCK */
  /* ------------------------------------------------ */

  if (block.type === "text") {
    return (
      <section className="py-24 md:py-36 px-6 text-center">

        <div className={`max-w-3xl mx-auto space-y-8 ${animClass}`}>

          {title && (
            <h2 className="text-4xl md:text-6xl font-black uppercase">
              {title}
            </h2>
          )}

          {text && (
            <p className="text-zinc-600 text-lg leading-relaxed">
              {text}
            </p>
          )}
        </div>
      </section>
    );
  }

  /* ------------------------------------------------ */
  /* PRODUCT GRID */
  /* ------------------------------------------------ */

  if (block.type === "product-grid") {
    return (
      <section className="py-24 px-6 max-w-7xl mx-auto">

        {title && (
          <h2 className="text-4xl font-black uppercase text-center mb-16">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {block.products?.map((id) => (
            <div key={id} className="text-center">
              <div className="bg-zinc-100 aspect-square mb-4" />
              <p className="text-sm font-bold">Product {id}</p>
            </div>
          ))}

        </div>
      </section>
    );
  }

  /* ------------------------------------------------ */
  /* PRODUCT CAROUSEL */
  /* ------------------------------------------------ */

  if (block.type === "product-carousel") {
    return (
      <section className="py-24 px-6">

        {title && (
          <h2 className="text-4xl font-black uppercase text-center mb-16">
            {title}
          </h2>
        )}

        <div className="flex gap-10 overflow-x-auto pb-6">

          {block.products?.map((id) => (
            <div key={id} className="min-w-[260px]">

              <div className="bg-zinc-100 aspect-square mb-4" />

              <p className="text-sm font-bold text-center">
                Product {id}
              </p>

            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ------------------------------------------------ */
  /* SPACER */
  /* ------------------------------------------------ */

  if (block.type === "spacer") {
    return (
      <div style={{ height: block.settings?.height || "120px" }} />
    );
  }

  return null;
};

/* ------------------------------------------------ */
/* MAIN PAGE RENDERER */
/* ------------------------------------------------ */

const LandingPageRenderer: React.FC<LandingPageRendererProps> = ({
  page,
  language,
}) => {

  if (!page || page.isActive === false) return null;

  const blocks =
    [...(page.blocks || [])]
      .filter((b) => b.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <main className="bg-white min-h-screen">

      {blocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          language={language}
        />
      ))}

    </main>
  );
};

export default LandingPageRenderer;