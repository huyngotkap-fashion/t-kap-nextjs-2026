import React from "react";
import { LPBlock } from "../../types";

interface Props {
  blocks: LPBlock[]
  onUpdate: (blocks: LPBlock[]) => void
}

const BlockEditor: React.FC<Props> = ({ blocks, onUpdate }) => {

  const input = "w-full border border-zinc-200 px-3 py-2 text-xs"
  const label = "text-[10px] font-bold uppercase text-zinc-400 mb-1 block"

  const addBlock = (type: LPBlock["type"]) => {

    const block: LPBlock = {
      id: "block-" + Date.now(),
      type,
      createdAt: Date.now(),
      content: {
        title: { vi: "", en: "" },
        text: { vi: "", en: "" },
        buttonText: { vi: "", en: "" }
      },
      settings: {
        animation: "fade-up",
        layout: "left"
      }
    }

    onUpdate([...blocks, block])

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      })
    }, 100)
  }

  const update = (index:number, key:string, value:any) => {

    const copy = [...blocks]
    const block:any = {...copy[index]}

    const path = key.split(".")
    let obj = block

    for(let i=0;i<path.length-1;i++){
      obj[path[i]] = {...obj[path[i]]}
      obj = obj[path[i]]
    }

    obj[path[path.length-1]] = value

    copy[index] = block
    onUpdate(copy)
  }

  const remove = (i:number)=>{
    onUpdate(blocks.filter((_,idx)=>idx!==i))
  }

  const move = (i:number,dir:"up"|"down")=>{

    const list=[...blocks]

    const target = dir==="up" ? i-1 : i+1
    if(target<0 || target>=list.length) return

    ;[list[i],list[target]]=[list[target],list[i]]

    onUpdate(list)
  }

  return (

<div className="space-y-10">

<h3 className="text-lg font-black">
Landing Page Structure ({blocks.length})
</h3>


{blocks.map((b,i)=>(
<div key={b.id} className="border p-6 bg-white shadow-sm">

<div className="flex justify-between mb-4">

<div className="font-bold text-xs uppercase">
Block {i+1} • {b.type}
</div>

<div className="flex gap-2">

<button onClick={()=>move(i,"up")}>↑</button>
<button onClick={()=>move(i,"down")}>↓</button>

<button
onClick={()=>remove(i)}
className="text-red-500"
>
Delete
</button>

</div>
</div>


<div className="grid md:grid-cols-2 gap-6">

<div>

<label className={label}>Title VI</label>
<input
className={input}
value={b.content?.title?.vi || ""}
onChange={e=>update(i,"content.title.vi",e.target.value)}
/>

<label className={label}>Title EN</label>
<input
className={input}
value={b.content?.title?.en || ""}
onChange={e=>update(i,"content.title.en",e.target.value)}
/>

<label className={label}>Text VI</label>
<textarea
className={input}
value={b.content?.text?.vi || ""}
onChange={e=>update(i,"content.text.vi",e.target.value)}
/>

<label className={label}>Text EN</label>
<textarea
className={input}
value={b.content?.text?.en || ""}
onChange={e=>update(i,"content.text.en",e.target.value)}
/>

</div>


<div>

<label className={label}>Image URL</label>
<input
className={input}
value={b.content?.imageUrl || ""}
onChange={e=>update(i,"content.imageUrl",e.target.value)}
/>

{b.content?.imageUrl && (
<img
  src={b.content?.imageUrl}
  alt=""
  className="mt-2 w-full h-40 object-cover"
/>
)}

{b.type==="video" && (
<>
<label className={label}>Video URL</label>

<input
className={input}
value={b.content?.videoUrl || ""}
onChange={e=>update(i,"content.videoUrl",e.target.value)}
/>

{b.content?.videoUrl && (
<video
src={b.content.videoUrl}
controls
className="mt-2 w-full"
/>
)}

</>
)}

<label className={label}>Button Text</label>
<input
className={input}
value={b.content?.buttonText?.vi || ""}
onChange={e=>update(i,"content.buttonText.vi",e.target.value)}
/>

<label className={label}>Button Link</label>
<input
className={input}
value={b.content?.buttonLink || ""}
onChange={e=>update(i,"content.buttonLink",e.target.value)}
/>

<label className={label}>Animation</label>
<select
className={input}
value={b.settings?.animation}
onChange={e=>update(i,"settings.animation",e.target.value)}
>
<option value="fade-up">Fade Up</option>
<option value="fade-in">Fade In</option>
<option value="zoom-in">Zoom</option>
</select>

{b.type==="image-text" && (
<>
<label className={label}>Layout</label>

<select
className={input}
value={b.settings?.layout}
onChange={e=>update(i,"settings.layout",e.target.value)}
>
<option value="left">Image Left</option>
<option value="right">Image Right</option>
</select>
</>
)}

</div>

</div>

</div>
))}


<div className="flex flex-wrap gap-3 pt-8">

<button onClick={()=>addBlock("hero")}>+ Hero</button>

<button onClick={()=>addBlock("video")}>+ Video</button>

<button onClick={()=>addBlock("image-text")}>+ Image Text</button>

<button onClick={()=>addBlock("banner")}>+ Banner</button>

<button onClick={()=>addBlock("text")}>+ CTA</button>

</div>

</div>
  )
}

export default BlockEditor;