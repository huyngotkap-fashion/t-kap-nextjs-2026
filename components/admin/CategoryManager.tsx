import React, { useState, useEffect } from "react";
import {
  addDocument,
  getCollectionOnce,
  removeDocument,
  upsertDocument
} from "../../services/firebaseService";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent: string | null;
  order?: number;
}

const CategoryManager = () => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getCollectionOnce("categories") as Category[];

    const sorted = data.sort(
      (a: Category, b: Category) => (a.order || 0) - (b.order || 0)
    );

    setCategories(sorted);
  };

  const resetForm = () => {
    setName("");
    setParent("");
    setEditingId(null);
  };

  const generateSlug = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const addCategory = async () => {

    if (!name.trim()) return;

    const slug = generateSlug(name);

    try {

      await addDocument("categories", {
        name,
        slug,
        parent: parent || null,
        order: Date.now()
      });

    } catch (err) {
      console.log("ADD ERROR:", err);
    }

    resetForm();
    load();
  };

  const updateCategory = async () => {

    if (!editingId) return;

    const slug = generateSlug(name);

    try {

      await upsertDocument("categories", editingId, {
        name,
        slug,
        parent: parent || null
      });

    } catch (err) {
      console.log("UPDATE ERROR:", err);
    }

    resetForm();
    load();
  };

  const deleteCategory = async (id: string, slug: string) => {

    const hasChildren = categories.some(c => c.parent === slug);

    if (hasChildren) {
      alert("Không thể xóa danh mục cha khi còn danh mục con");
      return;
    }

    const confirmDelete = confirm("Bạn chắc chắn muốn xóa danh mục này?");
    if (!confirmDelete) return;

    try {

      await removeDocument("categories", id);

    } catch (err) {
      console.log("DELETE ERROR:", err);
    }

    load();
  };

  return (

    <div className="space-y-10">

      <h2 className="text-2xl font-bold">
        {editingId ? "Sửa danh mục" : "Thêm danh mục"}
      </h2>

      <div className="flex gap-4 flex-wrap">

        <input
          className="border px-4 py-2 w-64"
          placeholder="Tên danh mục"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <select
          className="border px-4 py-2"
          value={parent}
          onChange={e => setParent(e.target.value)}
        >

          <option value="">Danh mục cha</option>

          {categories
            .filter(c => !c.parent)
            .map(c => (

              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>

            ))}

        </select>

        <button
          onClick={editingId ? updateCategory : addCategory}
          className="bg-black text-white px-6 py-2 rounded"
        >
          {editingId ? "Cập nhật" : "Thêm"}
        </button>

        {editingId && (

          <button
            onClick={resetForm}
            className="px-4 py-2 border rounded"
          >
            Hủy
          </button>

        )}

      </div>

      <div className="mt-10">

        {categories
          .filter(c => !c.parent)
          .map(parent => (

            <div key={parent.id} className="mb-6">

              <div className="flex items-center gap-4">

                <h3 className="font-bold text-lg">
                  {parent.name}
                </h3>

                <button
                  onClick={() => {
                    setEditingId(parent.id);
                    setName(parent.name);
                    setParent("");
                  }}
                  className="text-blue-500 text-sm"
                >
                  Sửa
                </button>

                <button
                  onClick={() => deleteCategory(parent.id, parent.slug)}
                  className="text-red-500 text-sm"
                >
                  Xóa
                </button>

              </div>

              <div className="ml-6 mt-2 space-y-1">

                {categories
                  .filter(c => c.parent === parent.slug)
                  .map(sub => (

                    <div key={sub.id} className="flex items-center gap-3">

                      <span>- {sub.name}</span>

                      <button
                        onClick={() => {
                          setEditingId(sub.id);
                          setName(sub.name);
                          setParent(parent.slug);
                        }}
                        className="text-blue-500 text-xs"
                      >
                        sửa
                      </button>

                      <button
                        onClick={() => deleteCategory(sub.id, sub.slug)}
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