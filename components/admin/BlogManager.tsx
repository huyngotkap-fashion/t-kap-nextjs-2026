
import React, { useEffect, useRef, useState } from 'react'
import { Blog } from '../../types'
import RichTextEditor from './RichTextEditor'

interface BlogManagerProps {
  blogs: Blog[]
  onAddBlog: (blog: Blog) => void;
  onUpdateBlog: (blog: Blog) => void;
  onDeleteBlog: (id: string) => void;
}

const BlogManager: React.FC<BlogManagerProps> = ({
  blogs,
  onAddBlog,
  onUpdateBlog,
  onDeleteBlog
}) => {
  const [showEditor, setShowEditor] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [blogForm, setBlogForm] = useState<Partial<Blog>>({})
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showEditor && editingBlog && contentRef.current) {
      contentRef.current.innerHTML = editingBlog.content?.vi || ''
    }
  }, [showEditor, editingBlog])

  const handleSave = () => {
    const html = contentRef.current?.innerHTML || ''

    const finalBlog: Blog = {
      id: editingBlog?.id || Date.now().toString(),
      title: blogForm.title || { vi: '', en: '' },
      shortDesc: blogForm.shortDesc || { vi: '', en: '' },
      content: { vi: html, en: '' },
      imageUrl: blogForm.imageUrl || '',
      videoUrl: blogForm.videoUrl || '',
      category: blogForm.category || { vi: '', en: '' },
      date: blogForm.date || new Date().toISOString().split('T')[0],
      author: blogForm.author || 'T-KAP'
    }

    if (editingBlog) onUpdateBlog(finalBlog)
    else onAddBlog(finalBlog)

    setShowEditor(false)
    setEditingBlog(null)
    setBlogForm({})
  }

  return (
    <div className="space-y-10">
      {!showEditor && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold uppercase tracking-tight">Danh sách bài viết</h2>
            <button
              onClick={() => {
                setEditingBlog(null)
                setBlogForm({})
                setShowEditor(true)
              }}
              className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg"
            >
              + VIẾT BÀI MỚI
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...blogs]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() -
                  new Date(a.date).getTime()
              )
              .map(blog => (
                <div
                  key={blog.id}
                  className="bg-white border border-zinc-100 p-6 space-y-4 hover:shadow-xl transition-all group"
                >
                  <div className="aspect-video overflow-hidden bg-zinc-100">
                    <img
                      src={blog.imageUrl}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      alt=""
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">{blog.date}</span>
                    {blog.category?.vi && (
                      <span className="text-[8px] font-black bg-zinc-100 px-2 py-0.5 uppercase tracking-widest">{blog.category.vi}</span>
                    )}
                  </div>
                  <h3 className="font-black uppercase text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
                    {blog.title?.vi}
                  </h3>

                  <div className="flex gap-6 pt-4 border-t border-zinc-50">
                    <button
                      onClick={() => {
                        setEditingBlog(blog)
                        setBlogForm(blog)
                        setShowEditor(true)
                      }}
                      className="text-[9px] font-black uppercase tracking-widest text-zinc-900 hover:underline"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Xóa bài viết này?')) {
                          onDeleteBlog(blog.id)
                        }
                      }}
                      className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:underline"
                    >
                      Xóa bài
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {showEditor && (
        <div className="fixed inset-0 bg-white z-[2000] flex flex-col lg:flex-row animate-fade-in">
          {/* Sidebar Editor Panel */}
          <div className="w-full lg:w-[420px] p-8 md:p-10 border-r border-zinc-100 space-y-8 overflow-y-auto bg-zinc-50 shrink-0 custom-scrollbar">
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn hủy? Nội dung đang viết sẽ không được lưu.')) {
                  setShowEditor(false)
                  setEditingBlog(null)
                  setBlogForm({})
                }
              }}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black mb-8 block transition-colors"
            >
              ← HỦY & QUAY LẠI
            </button>

            <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">
              {editingBlog ? 'CẬP NHẬT BÀI VIẾT' : 'VIẾT BÀI MỚI'}
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Tiêu đề bài viết (VI)</label>
                <input
                  className="w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all"
                  placeholder="Nhập tiêu đề..."
                  value={blogForm.title?.vi || ''}
                  onChange={e =>
                    setBlogForm({
                      ...blogForm,
                      title: { vi: e.target.value, en: '' }
                    })
                  }
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Mô tả ngắn gọn</label>
                <textarea
                  className="w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all h-24 resize-none"
                  placeholder="Tóm tắt nội dung chính..."
                  value={blogForm.shortDesc?.vi || ''}
                  onChange={e =>
                    setBlogForm({
                      ...blogForm,
                      shortDesc: { vi: e.target.value, en: '' }
                    })
                  }
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Link ảnh bìa (URL)</label>
                <input
                  className="w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all"
                  placeholder="https://..."
                  value={blogForm.imageUrl || ''}
                  onChange={e =>
                    setBlogForm({
                      ...blogForm,
                      imageUrl: e.target.value
                    })
                  }
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Link video Youtube (Nếu có)</label>
                <input
                  className="w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all"
                  placeholder="https://youtube.com/..."
                  value={blogForm.videoUrl || ''}
                  onChange={e =>
                    setBlogForm({
                      ...blogForm,
                      videoUrl: e.target.value
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Chuyên mục</label>
                  <input
                    className="w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all"
                    placeholder="Tin tức, Sự kiện..."
                    value={blogForm.category?.vi || ''}
                    onChange={e =>
                      setBlogForm({
                        ...blogForm,
                        category: { vi: e.target.value, en: '' }
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Ngày đăng</label>
                  <input
                    type="date"
                    className="w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all"
                    value={blogForm.date || ''}
                    onChange={e =>
                      setBlogForm({
                        ...blogForm,
                        date: e.target.value
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Tác giả</label>
                <input
                  className="w-full bg-white border border-zinc-200 px-4 py-3 text-xs outline-none focus:border-black transition-all"
                  placeholder="Người viết..."
                  value={blogForm.author || ''}
                  onChange={e =>
                    setBlogForm({
                      ...blogForm,
                      author: e.target.value
                    })
                  }
                />
              </div>
            </div>

            <div className="pt-8 sticky bottom-0 bg-zinc-50 pb-4">
              <button
                onClick={handleSave}
                className="bg-black text-white w-full py-5 font-black uppercase text-[11px] tracking-[0.3em] hover:bg-zinc-800 transition-all shadow-xl"
              >
                XUẤT BẢN BÀI VIẾT
              </button>
            </div>
          </div>

          {/* Main Content Editor Area */}
          <div className="flex-1 p-6 md:p-12 lg:p-20 bg-zinc-100 overflow-y-auto h-full">
            <div className="max-w-4xl mx-auto bg-white shadow-2xl p-2 min-h-full">
              <RichTextEditor
                contentRef={contentRef}
                initialContent={editingBlog?.content?.vi || ''}
                label="Nội dung bài viết chi tiết"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogManager
