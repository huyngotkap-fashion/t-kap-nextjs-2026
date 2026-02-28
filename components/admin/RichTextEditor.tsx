
import React, { useEffect } from 'react'

interface RichTextEditorProps {
  contentRef: React.RefObject<HTMLDivElement>
  initialContent?: string
  label?: string
}

const exec = (command: string, value?: string) => {
  document.execCommand(command, false, value)
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  contentRef,
  initialContent = '',
  label
}) => {
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = initialContent
    }
  }, [initialContent, contentRef])

  return (
    <div className="w-full space-y-4 relative">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 block mb-4">
          {label}
        </label>
      )}
      
      {/* TOOLBAR */}
      <div className="sticky top-0 z-[30] bg-zinc-100/80 backdrop-blur-md pb-4 pt-1">
        <div className="flex flex-wrap items-center gap-y-3 gap-x-2 border border-zinc-200 px-4 py-3 bg-white shadow-sm rounded-sm">
          
          {/* TEXT STYLE */}
          <div className="flex items-center gap-1 border-r border-zinc-100 pr-2">
            <button onClick={() => exec('bold')} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded font-bold" title="Bold">B</button>
            <button onClick={() => exec('italic')} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded italic" title="Italic">I</button>
            <button onClick={() => exec('underline')} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded underline" title="Underline">U</button>
          </div>

          {/* FONT FAMILY & SIZE */}
          <div className="flex items-center gap-2 border-r border-zinc-100 pr-2">
            <select
              onChange={e => exec('fontName', e.target.value)}
              className="border-none bg-zinc-50 px-2 py-1.5 text-[10px] font-bold uppercase outline-none focus:ring-0 cursor-pointer max-w-[100px]"
              title="Font Family"
            >
              <option value="Inter">Inter</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Playfair Display">Playfair</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Serif</option>
            </select>

            <select
              onChange={e => exec('fontSize', e.target.value)}
              className="border-none bg-zinc-50 px-2 py-1.5 text-[10px] font-bold uppercase outline-none focus:ring-0 cursor-pointer"
              title="Font Size"
            >
              <option value="3">Size M</option>
              <option value="1">Size XS</option>
              <option value="2">Size S</option>
              <option value="4">Size L</option>
              <option value="5">Size XL</option>
              <option value="6">Size XXL</option>
              <option value="7">Size MAX</option>
            </select>
          </div>

          {/* COLOR PICKER */}
          <div className="flex items-center gap-2 border-r border-zinc-100 pr-2">
            <div className="relative flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded border border-transparent hover:border-zinc-200 transition-all">
              <span className="text-[9px] font-black uppercase text-zinc-400">Color</span>
              <input 
                type="color" 
                onChange={e => exec('foreColor', e.target.value)}
                className="w-5 h-5 border-none bg-transparent cursor-pointer p-0"
                title="Text Color"
              />
            </div>
          </div>

          {/* ALIGNMENT */}
          <div className="flex items-center gap-1 border-r border-zinc-100 pr-2">
            <button onClick={() => exec('justifyLeft')} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded" title="Align Left">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>
            </button>
            <button onClick={() => exec('justifyCenter')} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded" title="Align Center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18h16" /></svg>
            </button>
            <button onClick={() => exec('justifyRight')} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded" title="Align Right">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" /></svg>
            </button>
            <button onClick={() => exec('justifyFull')} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded" title="Justify Full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            </button>
          </div>

          {/* LISTS */}
          <div className="flex items-center gap-1 border-r border-zinc-100 pr-2">
            <button onClick={() => exec('insertUnorderedList')} className="px-2 h-8 flex items-center justify-center hover:bg-zinc-100 rounded text-[10px] font-bold uppercase tracking-widest" title="Bullet List">• List</button>
            <button onClick={() => exec('insertOrderedList')} className="px-2 h-8 flex items-center justify-center hover:bg-zinc-100 rounded text-[10px] font-bold uppercase tracking-widest" title="Numbered List">1. List</button>
          </div>

          {/* FORMATS */}
          <select
            onChange={e => exec('formatBlock', e.target.value)}
            className="border-none bg-zinc-50 px-2 py-1.5 text-[10px] font-bold uppercase outline-none focus:ring-0 cursor-pointer"
          >
            <option value="p">Paragraph</option>
            <option value="h2">Heading H2</option>
            <option value="h3">Heading H3</option>
          </select>

          {/* ACTIONS */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => {
                const url = prompt('Nhập link:')
                if (url) exec('createLink', url)
              }}
              className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded"
              title="Add Link"
            >
              🔗
            </button>
            <button
              onClick={() => {
                const url = prompt('Nhập link ảnh:')
                if (url) exec('insertImage', url)
              }}
              className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded"
              title="Insert Image"
            >
              🖼
            </button>
            <button onClick={() => exec('undo')} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded" title="Undo">↶</button>
            <button onClick={() => exec('removeFormat')} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded text-red-500" title="Clear Formatting">Tx</button>
          </div>
        </div>
      </div>

      {/* EDITOR AREA */}
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        className="w-full min-h-[70vh] bg-white p-10 md:p-16 outline-none border border-zinc-200 shadow-sm leading-relaxed text-zinc-700 font-light prose prose-zinc max-w-none"
      />
    </div>
  )
}

export default RichTextEditor
