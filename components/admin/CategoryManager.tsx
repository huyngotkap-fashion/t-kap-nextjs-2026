import React, { useState, useEffect } from "react";
import { addDocument, getCollectionOnce, removeDocument, upsertDocument } from "../../services/firebaseService";

const CategoryManager = () => {

const [categories, setCategories] = useState<any[]>([]);
const [name, setName] = useState("");
const [parent, setParent] = useState("");
const [editingId, setEditingId] = useState<string | null>(null);

useEffect(() => {
  load();
}, []);

const load = async () => {
  const data = await getCollectionOnce("categories");
  setCategories(data);
};

const resetForm = () => {
  setName("");
  setParent("");
  setEditingId(null);
};

const addCategory = async () => {

  if (!name) return;

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g,"-");

  try {

    await addDocument("categories",{
      name,
      slug,
      parent: parent || null,
      order: Date.now()
    });

  } catch(err){
    console.log("ADD ERROR:",err);
  }

  resetForm();
  load();
};

const updateCategory = async () => {

  if (!editingId) return;

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g,"-");

  await upsertDocument("categories", editingId,{
    name,
    slug,
    parent: parent || null
  });

  resetForm();
  load();
};

const deleteCategory = async (id:string, slug:string)=>{

  const hasChildren = categories.some(c => c.parent === slug);

  if(hasChildren){
    alert("Không thể xóa danh mục cha khi còn danh mục con");
    return;
  }

  const confirmDelete = confirm("Bạn chắc chắn muốn xóa danh mục này?");
  if(!confirmDelete) return;

  try {

    await removeDocument("categories",id);

  } catch(err){
    console.log("DELETE ERROR:",err);
  }

  load();
};

return (

<div className="space-y-10">

<h2 className="text-2xl font-bold">
{editingId ? "Sửa danh mục" : "Thêm danh mục"}
</h2>

<div className="flex gap-4">

<input
className="border px-4 py-2"
placeholder="Tên danh mục"
value={name}
onChange={e=>setName(e.target.value)}
/>

<select
className="border px-4 py-2"
value={parent}
onChange={e=>setParent(e.target.value)}
>

<option value="">Danh mục cha</option>

{categories
.filter(c=>!c.parent)
.sort((a,b)=>a.order-b.order)
.map(c=>(

<option key={c.slug} value={c.slug}>
{c.name}
</option>

))}

</select>

<button
onClick={editingId ? updateCategory : addCategory}
className="bg-black text-white px-6 py-2"
>

{editingId ? "Cập nhật" : "Thêm"}

</button>

{editingId && (

<button
onClick={resetForm}
className="px-4 py-2 border"
>

Hủy

</button>

)}

</div>

<div className="mt-10">

{categories
.filter(c=>!c.parent)
.sort((a,b)=>a.order-b.order)
.map(parent=>(

<div key={parent.id} className="mb-6">

<div className="flex items-center gap-4">

<h3 className="font-bold text-lg">
{parent.name}
</h3>

<button
onClick={()=>{
setEditingId(parent.id);
setName(parent.name);
setParent("");
}}
className="text-blue-500 text-sm"
>

Sửa

</button>

<button
onClick={()=>deleteCategory(parent.id,parent.slug)}
className="text-red-500 text-sm"
>

Xóa

</button>

</div>

<div className="ml-6">

{categories
.filter(c=>c.parent===parent.slug)
.map(sub=>(

<div key={sub.id} className="flex items-center gap-3">

<span>- {sub.name}</span>

<button
onClick={()=>{
setEditingId(sub.id);
setName(sub.name);
setParent(parent.slug);
}}
className="text-blue-500 text-xs"
>

sửa

</button>

<button
onClick={()=>deleteCategory(sub.id,sub.slug)}
className="text-red-500 text-xs"
>

x

</button>

</div>

))}

</div>

</div>

))}

</div>

</div>

);

};

export default CategoryManager;