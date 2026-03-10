"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Language, SiteConfig, User, Product, LandingPage, MenuItem } from "../types";
import { getCollection } from "../services/firebaseService";
import { Search, Clock, Heart, ShoppingBag } from "lucide-react";


interface NavbarProps {
  onNavigate: (path: string) => void;
  activeCategory: string;
  cartCount: number;
  wishlistCount?: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  config: SiteConfig;
  user: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  products: Product[];
  landingPages?: LandingPage[];
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

const createSlug = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalize = (s: string) => s.toLowerCase().replace(/^\//, "");

const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  activeCategory,
  cartCount,
  wishlistCount = 0,
  language,
  onLanguageChange,
  config,
  user,
  onLogout,
  onOpenAuth,
  products,
  landingPages = [],
  onOpenCart,
  onOpenWishlist,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCollection("categories").then(setCategories);
  }, []);

  const poloCategories = useMemo(
  () => categories.filter((cat) => cat.parentId === "polo-sport"),
  [categories]
);

  const baseCategory = useMemo(() => {
    if (activeCategory.includes(":")) return activeCategory.split(":")[0];
    return activeCategory;
  }, [activeCategory]);

  const getUrlPath = (category: string) => {
    const cat = normalize(category);

    if (!cat || cat === "all") return "/";
    if (cat === "blog" || cat === "journal") return "/journal";
    if (cat === "stores") return "/stores";
    if (cat === "admin") return "/admin";
    if (cat === "quotation") return "/quotation";
    if (cat === "history") return "/history";

    if (category.startsWith("/")) return category;

    return `/${createSlug(category)}`;
  };

  const isLinkActive = (item: MenuItem) =>
    pathname.toLowerCase().startsWith(
      getUrlPath(item.targetCategory).toLowerCase()
    );

  const isBrandActive = (target: string) => {
  const path = getUrlPath(target);
  return pathname.startsWith(path);
};

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(path);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  const filteredNavItems = useMemo(() => {
    let items = [...(config.navItems || [])];

    landingPages.forEach((lp) => {
      if (lp.isActive && lp.showInMenu) {
        items.push({
          id: `lp-${lp.id}`,
          label: { en: lp.title.toUpperCase(), vi: lp.title.toUpperCase() },
          targetCategory: `/${lp.id.toLowerCase()}`,
        });
      }
    });

    if (!items.some((i) => normalize(i.targetCategory) === "quotation")) {
      items.push({
        id: "quotation",
        label: { en: "QUOTATION", vi: "BÁO GIÁ" },
        targetCategory: "quotation",
      });
    }

    if (user?.role === "admin") {
      if (!items.some((i) => normalize(i.targetCategory) === "admin")) {
        items.push({
          id: "admin",
          label: { en: "ADMIN", vi: "QUẢN TRỊ" },
          targetCategory: "admin",
        });
      }
    }

    return items;
  }, [config.navItems, landingPages, user]);

  const removeAccents = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();

  const searchResults = useMemo(() => {
  if (!searchQuery.trim()) return [];

  const q = removeAccents(searchQuery);

  return products
    .filter((p) =>
      [(p.name?.[language] ?? p.name?.vi ?? ""), p.brand ?? ""].some((v) =>
        removeAccents(v).includes(q)
      )
    )
    .slice(0, 8);
}, [searchQuery, products, language]);

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  return (
    <header className="fixed top-0 w-full z-[100] font-heading">

      {/* TOP BAR */}
      <div className="hidden md:block bg-white text-black py-2 text-center text-[9px] font-bold uppercase tracking-[0.25em]">
        {language === "vi"
          ? "T-KAP – CHUYÊN SẢN XUẤT ÁO POLO & ĐỒNG PHỤC DOANH NGHIỆP"
          : "T-KAP – PREMIUM POLO & CORPORATE UNIFORM MANUFACTURER"}
      </div>

      {/* NAV */}
      <nav className="bg-black text-white h-[64px] md:h-[90px] flex items-center justify-between px-4 md:px-6 border-b border-white/5">

        {/* LEFT */}
        <div className="flex items-center gap-4 xl:gap-8 w-full xl:w-auto">

          <button
className="xl:hidden text-white text-2xl"
onClick={() => setIsMobileMenuOpen(true)}
>
☰
</button>

          <a
href="/"
onClick={(e) => handleLinkClick(e, "/")}
className="absolute left-1/2 -translate-x-1/2 xl:relative xl:left-0 xl:translate-x-0"
>
<img src={config.logoImageUrl} alt="T-KAP Logo" className="h-8 md:h-12" />
</a>
        {isMobileMenuOpen && (

<div className="fixed inset-0 bg-black z-[200] text-white px-6 py-8 overflow-y-auto">

{/* CLOSE BUTTON */}
<button
onClick={() => setIsMobileMenuOpen(false)}
className="text-3xl mb-10"
>
✕
</button>


{/* BRAND TABS (GIỐNG DESKTOP) */}
<div className="flex border border-zinc-700 mb-10">

{config.brandNavItems.map((brand) => {

const path = getUrlPath(brand.targetCategory);
const active = isBrandActive(brand.targetCategory);

return (

<a
key={brand.id}
href={path}
onClick={(e) => handleLinkClick(e, path)}
className={`flex-1 text-center py-3 text-[11px] tracking-[0.25em] font-bold uppercase ${
active
? "bg-white text-black"
: "text-zinc-400 hover:text-white"
}`}
>

{brand.label?.[language] || brand.label?.vi}

</a>

);

})}

</div>


{/* MAIN MENU */}
<div className="flex flex-col gap-8 text-3xl font-bold uppercase">

{filteredNavItems.map((link) => {

const path = getUrlPath(link.targetCategory);
const active = isLinkActive(link);
const isPolo =
normalize(link.targetCategory) === "polo-sport" ||
normalize(link.targetCategory) === "polo-the-thao";

return (

<div key={link.id}>

<a
href={path}
onClick={(e) => handleLinkClick(e, path)}
className={`${
active
? "text-white"
: "text-zinc-400 hover:text-white"
}`}
>

{link.label[language]}

</a>


{/* SUBMENU POLO */}
{isPolo && poloCategories.length > 0 && (

<div className="mt-4 pl-4 flex flex-col gap-3">

{poloCategories.map((cat) => (

<a
key={cat.id}
href={`/${cat.fullSlug}`}
onClick={(e) =>
handleLinkClick(e, `/${cat.fullSlug}`)
}
className={`text-lg uppercase ${
pathname.startsWith(`/${cat.fullSlug}`)
? "text-white"
: "text-zinc-500 hover:text-white"
}`}
>

{cat.name}

</a>

))}

</div>

)}

</div>

);

})}

</div>


{/* HISTORY */}
<div className="mt-14 text-sm tracking-[0.25em] text-zinc-500">

<a
href="/history"
onClick={(e) => handleLinkClick(e, "/history")}
>
{language === "vi" ? "LỊCH SỬ CỦA TÔI" : "MY HISTORY"}
</a>

</div>


{/* LANGUAGE */}
<div className="mt-10 flex gap-6 text-sm tracking-[0.25em]">

<button
onClick={() => onLanguageChange("en")}
className={language === "en" ? "text-white" : "text-zinc-500 hover:text-white"}
>
ENGLISH
</button>

<button
onClick={() => onLanguageChange("vi")}
className={language === "vi" ? "text-white" : "text-zinc-500 hover:text-white"}
>
TIẾNG VIỆT
</button>

</div>

</div>

)}
          {/* BRAND TABS */}
          <div className="hidden lg:flex border border-zinc-800 xl:ml-10">
            {config.brandNavItems.map((brand) => {
              const active = isBrandActive(brand.targetCategory);
              const path = getUrlPath(brand.targetCategory);

              return (
                <a
                  key={brand.id}
                  href={path}
                  onClick={(e) => handleLinkClick(e, path)}
                  className={`px-5 py-2 text-[9px] font-bold uppercase tracking-widest ${
                    active
                      ? "bg-white text-black"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {brand.label?.[language] || brand.label?.vi}
                </a>
              );
            })}
          </div>
        </div>

        {/* MENU */}
        <div className="hidden xl:flex items-center gap-12 text-[11px] tracking-[0.25em] uppercase font-semibold">

          {filteredNavItems.map((link) => {

const path = getUrlPath(link.targetCategory);
const active = isLinkActive(link);   // thêm dòng này

const isPolo =
normalize(link.targetCategory) === "polo-sport" ||
normalize(link.targetCategory) === "polo-the-thao";

return (

<div key={link.id} className="relative group">

<a
href={path}
onClick={(e) => handleLinkClick(e, path)}
className={`relative pb-1 ${
active
? "text-white"
: "text-zinc-400 hover:text-white"
}`}
>

{(link.label?.[language] ?? link.label?.vi ?? "").toUpperCase()}

<span
className={`absolute left-0 -bottom-1 h-[2px] bg-white transition-all ${
active ? "w-full" : "w-0 group-hover:w-full"
}`}
 />

</a>

                {isPolo && poloCategories.length > 0 && (
                  <div className="absolute top-full pt-3 left-0 hidden group-hover:block">
  <div className="bg-black border border-zinc-800 min-w-[200px]">
    {poloCategories.map((cat) => (
      <a
        key={cat.id}
        href={`/${cat.fullSlug}`}
        onClick={(e) => handleLinkClick(e, `/${cat.fullSlug}`)}
        className="block px-4 py-3 text-[10px] uppercase text-zinc-400 hover:text-white"
      >
        {cat.name}
      </a>
    ))}
  </div>
</div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex xl:hidden items-center gap-4">

<button onClick={() => setIsSearchOpen(true)}>
<Search size={18} strokeWidth={1.4}/>
</button>

<button
onClick={onOpenWishlist}
className="relative"
>
<Heart size={18} strokeWidth={1.4}/>
{wishlistCount > 0 && (
<span className="absolute -top-2 -right-2 text-[9px]">
{wishlistCount}
</span>
)}
</button>

<button
onClick={onOpenCart}
className="relative"
>
<ShoppingBag size={18} strokeWidth={1.4}/>
{cartCount > 0 && (
<span className="absolute -top-2 -right-2 text-[9px]">
{cartCount}
</span>
)}
</button>

</div>

        {/* RIGHT ACTIONS */}
        <div className="hidden xl:flex items-center gap-5 text-[11px] tracking-[0.22em] text-zinc-400">

  <button
    onClick={() => setIsSearchOpen(true)}
    className="hover:text-white transition"
  >
    <Search size={15} strokeWidth={1.4}/>
  </button>

  <button className="hover:text-white transition">
    <Clock size={15} strokeWidth={1.4}/>
  </button>

  {user ? (
    <button
      onClick={onLogout}
      className="uppercase font-light hover:text-white transition"
    >
      {language === "vi" ? "ĐĂNG XUẤT" : "LOGOUT"}
    </button>
  ) : (
    <button
      onClick={onOpenAuth}
      className="uppercase font-light hover:text-white transition"
    >
      LOGIN
    </button>
  )}

  <span className="text-zinc-700 text-[10px]">|</span>

  <button
    onClick={() => onLanguageChange("en")}
    className={language === "en" ? "text-white" : "hover:text-white"}
  >
    EN
  </button>

  <button
    onClick={() => onLanguageChange("vi")}
    className={language === "vi" ? "text-white" : "hover:text-white"}
  >
    VI
  </button>

  <button
  onClick={onOpenWishlist}
  className="relative hover:text-white transition"
>
  <Heart size={16} strokeWidth={1.4}/>

  {wishlistCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] w-[16px] h-[16px] flex items-center justify-center rounded-full font-bold">
      {wishlistCount}
    </span>
  )}
</button>

  <button
  onClick={onOpenCart}
  className="relative hover:text-white transition"
>
  <ShoppingBag size={16} strokeWidth={1.4}/>

  {cartCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] w-[16px] h-[16px] flex items-center justify-center rounded-full font-bold">
      {cartCount}
    </span>
  )}
</button>

</div>
</nav>
      {/* SEARCH */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black z-[200] p-20">
          <input
            ref={searchRef}
            className="text-white bg-transparent border-b border-zinc-700 text-4xl w-full"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="grid grid-cols-4 gap-6 mt-10">
            {searchResults.map((p) => (
              <a
                key={p.id}
                href={`/product/${createSlug(p.name?.[language] ?? p.name?.vi ?? "")}-${p.id}`}
                onClick={(e) =>
                  handleLinkClick(
                    e,
                    `/product/${createSlug(p.name?.[language] ?? p.name?.vi ?? "")}-${p.id}`
                  )
                }
              >
                <img src={p.imageUrl} alt={p.name[language]} />
<p>{p.name[language]}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;