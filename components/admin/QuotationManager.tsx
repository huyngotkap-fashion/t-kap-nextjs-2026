import React from 'react';
import { QuotationRequest, QuotationStatus } from '../../types';

interface QuotationManagerProps {
  quotations: QuotationRequest[]
  onUpdateStatus: (q: QuotationRequest, status: QuotationStatus) => void
  onDelete: (id: string) => void
}

const MAX_PRODUCTS_SHOW = 6;

const QuotationManager: React.FC<QuotationManagerProps> = ({
  quotations,
  onUpdateStatus,
  onDelete
}) => {

  return (
    <div className="animate-reveal space-y-6">

      <h3 className="text-2xl font-black uppercase tracking-tight mb-10">
        Yêu cầu & Đơn hàng
      </h3>

      {quotations.length === 0 ? (

        <div className="py-20 text-center border-4 border-dashed border-zinc-100 text-zinc-300 font-bold uppercase tracking-widest">
          Hiện chưa có dữ liệu
        </div>

      ) : (

        <div className="grid grid-cols-1 gap-6">

          {quotations
            .sort(
              (a, b) =>
                new Date(b.createdAt ?? 0).getTime() -
                new Date(a.createdAt ?? 0).getTime()
            )
            .map(q => {

              const isOrder = (q.id ?? '').startsWith('ORD-');

              const productNames = q.productNames ?? [];
              const visibleProducts = productNames.slice(0, MAX_PRODUCTS_SHOW);
              const remainingProducts = productNames.length - MAX_PRODUCTS_SHOW;

              return (

                <div
                  key={q.id}
                  className="bg-white border border-zinc-100 p-8 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row justify-between gap-8"
                >

                  {/* LEFT SIDE */}
                  <div className="flex-1 space-y-4">

                    {/* TAGS */}
                    <div className="flex items-center gap-4 flex-wrap">

                      <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                        isOrder ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {isOrder ? 'Đơn hàng' : 'Hỏi giá'}
                      </span>

                      <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${
                        q.status === 'pending'
                          ? 'bg-zinc-100 text-zinc-500'
                          : q.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-600'
                          : q.status === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {q.status === 'pending'
                          ? 'Mới'
                          : q.status === 'processing'
                          ? 'Đang xử lý'
                          : q.status === 'completed'
                          ? 'Hoàn thành'
                          : 'Đã liên hệ'}
                      </span>

                      <span className="text-[10px] text-zinc-400 font-bold uppercase">
                        {new Date(q.createdAt ?? 0).toLocaleString('vi-VN')}
                      </span>

                    </div>

                    {/* CUSTOMER INFO */}
                    <div>

                      <h4 className="text-xl font-black uppercase mb-1">
                        {q.customerName}
                      </h4>

                      <p className="text-sm text-zinc-500">
                        {q.email} | {q.phone}
                      </p>

                      {q.companyName && (
                        <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">
                          Công ty: {q.companyName}
                        </p>
                      )}

                    </div>

                    {/* PRODUCTS */}
                    <div className="bg-zinc-50 p-6 border border-zinc-100">

                      <div className="flex justify-between items-center mb-3">

                        <span className="text-[9px] font-bold text-zinc-400 uppercase">
                          Sản phẩm chi tiết
                        </span>

                        <span className="text-[9px] font-bold text-zinc-400 uppercase">
                          {productNames.length} sản phẩm
                        </span>

                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">

                        {isOrder && q.productDetails ? (

                          q.productDetails.slice(0, MAX_PRODUCTS_SHOW).map((item, i) => (

                            <div
                              key={i}
                              className="text-[11px] font-bold uppercase border border-zinc-200 px-2 py-1 bg-white"
                            >
                              {item.name} (Size: {item.size})
                            </div>

                          ))

                        ) : (

                          visibleProducts.map((name, i) => (

                            <div
                              key={i}
                              className="text-[11px] font-bold uppercase border border-zinc-200 px-2 py-1 bg-white"
                            >
                              {name}
                            </div>

                          ))

                        )}

                      </div>

                      {/* MORE PRODUCTS */}
                      {remainingProducts > 0 && (

                        <div className="mt-3 text-[10px] text-zinc-400 font-bold">
                          +{remainingProducts} sản phẩm khác
                        </div>

                      )}

                      {/* TOTAL */}
                      {isOrder && q.totalAmount && (

                        <div className="mt-4 pt-4 border-t border-zinc-200 flex justify-between items-baseline">

                          <span className="text-[10px] font-black uppercase">
                            Tổng cộng
                          </span>

                          <span className="text-xl font-black">
                            ${q.totalAmount}
                          </span>

                        </div>

                      )}

                    </div>

                    {/* NOTES */}
                    {q.notes && (

                      <div className="text-xs text-zinc-500 bg-zinc-50/50 p-4 italic">
                        &quot; {q.notes} &quot;
                      </div>

                    )}

                  </div>

                  {/* RIGHT SIDE */}
                  <div className="shrink-0 flex flex-col gap-3 justify-center min-w-[200px]">

                    <label className="text-[9px] font-black uppercase text-zinc-400">
                      Trạng thái xử lý
                    </label>

                    <select
                      value={q.status}
                      onChange={(e) =>
                        onUpdateStatus(q, e.target.value as QuotationStatus)
                      }
                      className="bg-white border border-zinc-200 px-4 py-3 text-[10px] font-bold uppercase outline-none focus:border-black"
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="contacted">Đã liên hệ</option>
                      <option value="processing">Đang đóng gói/xử lý</option>
                      <option value="completed">Đã hoàn thành</option>
                    </select>

                    <button
                      onClick={() => onDelete(q.id)}
                      className="text-red-500 text-[9px] font-bold uppercase tracking-widest hover:underline text-right mt-4"
                    >
                      Xóa dữ liệu
                    </button>

                  </div>

                </div>

              );

            })}

        </div>

      )}

    </div>
  );
};

export default QuotationManager;