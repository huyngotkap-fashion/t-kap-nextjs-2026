
import React, { useState, useEffect, useMemo } from 'react';
import { User, Language, Product, QuotationRequest } from '../types';
import { db } from '../services/firebaseService';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface OrderHistoryProps {
  user: User;
  language: Language;
  products: Product[];
}

interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
  customerInfo?: any;
}

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + ' VNĐ';
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ user, language, products }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'quotations'>('orders');
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [userQuotations, setUserQuotations] = useState<QuotationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    setLoading(true);
    
    const qOrders = query(collection(db, 'orders'), where('userId', '==', user.id));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
      setUserOrders(orders);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    const qQuotes = query(collection(db, 'quotations'), where('userId', '==', user.id));
    const unsubQuotations = onSnapshot(qQuotes, (snapshot) => {
      const quotes = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as QuotationRequest));
      setUserQuotations(quotes);
    }, (error) => {
      console.error("Error fetching quotations:", error);
    });

    return () => { 
      unsubOrders(); 
      unsubQuotations(); 
    };
  }, [user.id]);

  const displayOrders = useMemo(() => {
    const directOrders = [...userOrders];
    const fallbackOrders = userQuotations
      .filter(q => q.id.startsWith('ORD-'))
      .map(q => ({
        id: q.id,
        userId: q.userId || '',
        items: q.productNames.map(name => ({ name, quantity: 1, price: 0, selectedSize: 'N/A' })),
        total: q.totalAmount || 0,
        status: q.status,
        createdAt: q.createdAt,
        customerInfo: { name: q.customerName, address: q.notes?.split('Địa chỉ: ')[1]?.split('\n')[0] || '' }
      } as Order));

    return [...directOrders, ...fallbackOrders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [userOrders, userQuotations]);

  const displayQuotations = useMemo(() => {
    return userQuotations
      .filter(q => !q.id.startsWith('ORD-'))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [userQuotations]);

  const getStatusLabel = (status: string) => {
    if (language === 'vi') {
      switch (status) {
        case 'pending': return 'Chờ xử lý';
        case 'contacted': return 'Đã liên hệ';
        case 'quoted': return 'Đã báo giá';
        case 'processing': return 'Đang xử lý';
        case 'completed': return 'Hoàn thành';
        default: return 'Đã nhận';
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const isVi = language === 'vi';

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 animate-reveal">
      <div className="mb-16">
        <span className="text-[10px] tracking-[0.5em] font-black text-zinc-400 uppercase mb-4 block">Personal Dashboard</span>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter vietnamese-fix">
          {isVi ? 'LỊCH SỬ CỦA TÔI' : 'MY HISTORY'}
        </h2>
      </div>

      <div className="flex border-b border-zinc-100 mb-12">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all ${activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-black'}`}
        >
          {isVi ? 'ĐƠN HÀNG' : 'ORDERS'} ({displayOrders.length})
        </button>
        <button 
          onClick={() => setActiveTab('quotations')}
          className={`px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all ${activeTab === 'quotations' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-black'}`}
        >
          {isVi ? 'YÊU CẦU BÁO GIÁ' : 'QUOTATIONS'} ({displayQuotations.length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-300 font-bold uppercase tracking-widest animate-pulse">
          {isVi ? 'ĐANG TẢI DỮ LIỆU...' : 'LOADING DATA...'}
        </div>
      ) : (
        <div className="space-y-8">
          {activeTab === 'orders' ? (
            displayOrders.length > 0 ? (
              displayOrders.map(order => (
                <div key={order.id} className="bg-white border border-zinc-100 p-8 shadow-sm hover:shadow-md transition-all animate-reveal">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-zinc-900 text-white px-3 py-1">
                          ID: {order.id.startsWith('ORD-') ? order.id.replace('ORD-', '').slice(-6).toUpperCase() : order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${order.status === 'pending' ? 'bg-zinc-100 text-zinc-500' : 'bg-green-100 text-green-600'}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                          {new Date(order.createdAt).toLocaleString(isVi ? 'vi-VN' : 'en-US')}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="w-12 h-16 bg-zinc-50 shrink-0 overflow-hidden">
                               <img src={products.find(p => p.id === item.id || p.name === item.name)?.imageUrl || 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=100'} className="w-full h-full object-cover grayscale" alt="" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase leading-tight">{item.name}</p>
                               <p className="text-[9px] text-zinc-400 font-bold mt-1">SL: {item.quantity} | SIZE: {item.selectedSize}</p>
                               <p className="text-[10px] font-black mt-1">{item.price > 0 ? formatPrice(item.price) : (isVi ? 'Chờ báo giá' : 'Pending price')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {order.customerInfo?.address && (
                        <div className="pt-2 border-t border-zinc-50 mt-4">
                           <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-1">{isVi ? 'GIAO ĐẾN' : 'SHIP TO'}</p>
                           <p className="text-[11px] text-zinc-600 font-medium">{order.customerInfo.address}</p>
                        </div>
                      )}
                    </div>
                    <div className="md:text-right flex flex-col justify-center border-t md:border-t-0 md:border-l border-zinc-50 md:pl-8 pt-6 md:pt-0">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{isVi ? 'TỔNG CỘNG' : 'TOTAL'}</span>
                      <span className="text-3xl font-black">{order.total > 0 ? formatPrice(order.total) : '---'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center border-4 border-dashed border-zinc-100">
                <p className="text-zinc-300 font-bold uppercase tracking-widest">{isVi ? 'CHƯA CÓ ĐƠN HÀNG NÀO' : 'NO ORDERS YET'}</p>
                <a href="/" className="mt-4 inline-block text-[10px] font-black uppercase tracking-widest border-b border-black pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all">{isVi ? 'MUA SẮM NGAY' : 'SHOP NOW'}</a>
              </div>
            )
          ) : (
            displayQuotations.length > 0 ? (
              displayQuotations.map(q => (
                <div key={q.id} className="bg-white border border-zinc-100 p-8 shadow-sm hover:shadow-md transition-all animate-reveal">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-500 px-3 py-1">
                          REQ: {q.id.slice(-6).toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${q.status === 'pending' ? 'bg-zinc-100 text-zinc-500' : 'bg-blue-100 text-blue-600'}`}>
                          {getStatusLabel(q.status)}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                          {new Date(q.createdAt).toLocaleString(isVi ? 'vi-VN' : 'en-US')}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">{isVi ? 'SẢN PHẨM QUAN TÂM' : 'INTERESTED PRODUCTS'}</h4>
                        <div className="flex flex-wrap gap-2">
                          {q.productNames.map((name, i) => (
                            <span key={i} className="text-[10px] font-bold uppercase border border-zinc-100 px-3 py-1 bg-zinc-50">{name}</span>
                          ))}
                        </div>
                      </div>
                      {q.notes && (
                        <div className="bg-zinc-50 p-4 border-l-2 border-zinc-200">
                           <p className="text-xs text-zinc-500 italic">&quot;{q.notes.length > 100 ? q.notes.substring(0, 100) + '...' : q.notes}&quot;</p>
                        </div>
                      )}
                    </div>
                    <div className="md:text-right flex items-center shrink-0">
                       <a href="/quotation" className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-zinc-500 hover:border-zinc-500">
                         {isVi ? 'LIÊN HỆ TƯ VẤN' : 'SUPPORT CHAT'}
                       </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center border-4 border-dashed border-zinc-100">
                <p className="text-zinc-300 font-bold uppercase tracking-widest">{isVi ? 'CHƯA CÓ YÊU CẦU BÁO GIÁ' : 'NO QUOTATIONS YET'}</p>
                <a href="/quotation" className="mt-4 inline-block text-[10px] font-black uppercase tracking-widest border-b border-black pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all">{isVi ? 'GỬI YÊU CẦU NGAY' : 'SEND REQUEST'}</a>
              </div>
            )
          )}
        </div>
      )}

      <div className="mt-20 pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        <p className="text-center md:text-left">{isVi ? 'THẮC MẮC VỀ ĐƠN HÀNG?' : 'NEED HELP WITH ORDERS?'}</p>
        <div className="flex gap-6">
          <a href="https://zalo.me/0914792881" target="_blank" rel="noreferrer" className="hover:text-black underline">ZALO SUPPORT</a>
          <a href="mailto:info@t-kap.com.vn" className="hover:text-black underline">EMAIL US</a>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
