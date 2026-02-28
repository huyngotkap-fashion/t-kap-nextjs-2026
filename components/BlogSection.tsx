
import React, { useEffect, useMemo } from 'react';
import { Blog, Language } from '../types';

// Helper tạo slug SEO
const createSlug = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

interface BlogSectionProps {
  language: Language;
  blogs: Blog[];
  activeBlogId: string | null;
}

const BlogSection: React.FC<BlogSectionProps> = ({ language, blogs, activeBlogId }) => {
  // Sắp xếp bài viết theo ngày mới nhất lên đầu
  const sortedBlogs = useMemo(() => {
    return [...blogs].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [blogs]);

  const selectedBlog = blogs.find(b => b.id === activeBlogId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeBlogId]);

  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
    return url;
  };

  const otherBlogs = useMemo(() => {
    if (!activeBlogId) return [];
    return sortedBlogs.filter(b => b.id !== activeBlogId).slice(0, 3);
  }, [sortedBlogs, activeBlogId]);

  if (selectedBlog) {
    const embedUrl = getEmbedUrl(selectedBlog.videoUrl);
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 md:py-24 animate-reveal">
        <a href="/journal" className="mb-8 md:mb-12 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {language === 'vi' ? 'QUAY LẠI DANH SÁCH' : 'BACK TO JOURNAL'}
        </a>
        <article className="space-y-8 md:space-y-12">
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
               <span className="bg-black text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
                 {selectedBlog.category?.[language] || selectedBlog.category?.['vi'] || 'NEWS'}
               </span>
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{selectedBlog.date} — BY {selectedBlog.author}</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-normal text-zinc-900 leading-[1.3] vietnamese-fix">
              {selectedBlog.title?.[language] || selectedBlog.title?.['vi'] || ''}
            </h1>
          </div>
          <div className="aspect-video overflow-hidden shadow-2xl bg-zinc-100">
            {embedUrl ? <iframe src={embedUrl} className="w-full h-full" frameBorder="0" allowFullScreen title={selectedBlog.title?.[language] || 'Video'} /> : <img src={selectedBlog.imageUrl} alt={selectedBlog.title?.[language] || 'Blog Image'} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />}
          </div>
          <div className="prose prose-lg max-w-none text-zinc-800 leading-relaxed font-normal blog-content vietnamese-fix" 
            dangerouslySetInnerHTML={{ __html: selectedBlog.content?.[language] || selectedBlog.content?.['vi'] || '' }} 
          />
        </article>

        {/* RELATED NEWS SECTION */}
        {otherBlogs.length > 0 && (
          <div className="mt-24 md:mt-40 pt-16 border-t border-zinc-100">
            <div className="flex justify-between items-end mb-12">
               <div>
                  <span className="text-[10px] tracking-[0.5em] font-bold text-zinc-400 uppercase mb-3 block">RECOMMENDATIONS</span>
                  <h3 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-zinc-900 vietnamese-fix">
                    {language === 'vi' ? 'TIN TỨC KHÁC' : 'OTHER STORIES'}
                  </h3>
               </div>
               <a href="/journal" className="text-[9px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all">
                  {language === 'vi' ? 'XEM TẤT CẢ' : 'VIEW ALL'}
               </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
               {otherBlogs.map(blog => {
                 const blogPath = `/blog/${createSlug(blog.title.vi || blog.title.en)}-${blog.id}`;
                 return (
                   <a key={blog.id} href={blogPath} className="group space-y-4">
                      <div className="aspect-video overflow-hidden bg-zinc-100 relative">
                         <img src={blog.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={blog.title?.vi} />
                      </div>
                      <div className="space-y-2">
                         <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-400 uppercase">{blog.date}</span>
                         <h4 className="text-sm font-bold uppercase leading-snug text-zinc-900 group-hover:underline line-clamp-2 vietnamese-fix">
                           {blog.title?.[language] || blog.title?.['vi']}
                         </h4>
                      </div>
                   </a>
                 );
               })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10 md:py-20 min-h-[60vh]">
      <div className="mb-10 md:mb-20 text-center">
        <span className="text-[11px] tracking-[0.4em] font-bold text-zinc-400 uppercase mb-4 block">ELEGANCE JOURNAL</span>
        <h2 className="text-4xl md:text-7xl font-extrabold tracking-tight uppercase text-zinc-900 vietnamese-fix">
          {language === 'vi' ? 'TIN TỨC & PHONG CÁCH' : 'EDITORIAL & STYLE'}
        </h2>
      </div>

      {sortedBlogs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12">
          {sortedBlogs.map((blog) => {
            const blogPath = `/blog/${createSlug(blog.title.vi || blog.title.en)}-${blog.id}`;
            return (
              <a key={blog.id} href={blogPath} className="group flex flex-col md:flex-row gap-6 md:gap-8 items-start bg-zinc-50/50 p-6 md:p-8 border border-zinc-100 hover:border-black transition-all">
                <div className="w-full md:w-2/5 aspect-video overflow-hidden bg-zinc-100 relative shrink-0">
                  <img src={blog.imageUrl} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0" alt={blog.title?.[language] || 'News'} />
                  <div className="absolute top-3 left-3">
                    <span className="bg-black text-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest">
                      {blog.category?.[language] || blog.category?.['vi'] || 'TIN TỨC'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-400 uppercase">{blog.date}</span>
                  <h3 className="text-xl font-bold uppercase tracking-normal text-zinc-900 group-hover:underline underline-offset-4 leading-[1.4] line-clamp-2 vietnamese-fix">
                    {blog.title?.[language] || blog.title?.['vi'] || ''}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-normal">
                    {blog.shortDesc?.[language] || blog.shortDesc?.['vi'] || ''}
                  </p>
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] border-b border-black pb-0.5 mt-2 inline-block">
                    {language === 'vi' ? 'ĐỌC TIẾP' : 'READ MORE'}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center border-4 border-dashed border-zinc-100">
           <p className="text-zinc-300 font-bold uppercase tracking-widest">Hiện chưa có bài viết nào.</p>
        </div>
      )}
    </div>
  );
};

export default BlogSection;
