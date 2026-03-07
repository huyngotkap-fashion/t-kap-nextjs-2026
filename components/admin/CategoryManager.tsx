import React, { useState, useEffect } from "react";
import { addDocument, getCollection } from "../../services/firebaseService";
import { getCollectionOnce } from "../../services/firebaseService";

const CategoryManager = () => {

const [categories, setCategories] = useState<any[]>([]);
const [name, setName] = useState("");
const [parent, setParent] = useState("");

useEffect(() => {
load();
}, []);

const load = async () => {
const data = await getCollectionOnce("categories");
setCategories(data);
};

const addCategory = async () => {

if (!name) return;

const slug = name
.toLowerCase()
.replace(/\s+/g,"-");

await addDocument("categories",{
name,
slug,
parent: parent || null
});

setName("");
setParent("");

load();

};

return (

<div className="space-y-10">

<h2 className="text-2xl font-bold">Thêm danh mục</h2>

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
.map(c=>(
<option key={c.slug} value={c.slug}>
{c.name}
</option>
))}

</select>

<button
onClick={addCategory}
className="bg-black text-white px-6 py-2"
>

Thêm

</button>

</div>

<div className="mt-10">

{categories
.filter(c=>!c.parent)
.map(parent=>(
<div key={parent.slug} className="mb-6">

<h3 className="font-bold text-lg">
{parent.name}
</h3>

<div className="ml-6">

{categories
.filter(c=>c.parent===parent.slug)
.map(sub=>(
<div key={sub.slug}>
- {sub.name}
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