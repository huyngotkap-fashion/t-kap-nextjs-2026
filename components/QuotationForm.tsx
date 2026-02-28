
import React, { useState, useEffect, useMemo } from 'react';
import { Product, Language, QuotationRequest, User, CartItem } from '../types';
import { upsertDocument } from '../services/firebaseService';

interface QuotationFormProps {
  products: Product[];
  language: Language;
  initialProductId?: string | null;
  user?: User | null;
  cart?: CartItem[];
  clearCart?: () => void;
  mode?: 'quotation' | 'checkout';
}

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + ' VNĐ';
};

const QuotationForm: React.FC<QuotationFormProps> = ({ 
  products, language, initialProductId, user, cart = [], clearCart, mode = 'quotation'
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    companyName: '',
    selectedProductIds: [] as string[],
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const displayCartItems = useMemo(() => {
    if (mode === 'quotation') {
      return cart.filter(i => i.pricingType === 'quotation');
    }
    return cart;
  }, [cart, mode]);

  const { hasQuotationItems, hasPricedItems, totalPricedAmount } = useMemo(() => {
    const quotationItems = displayCartItems.filter(i => i.pricingType === 'quotation');
    const pricedItems = displayCartItems.filter(i => i.pricingType !== 'quotation');
    return {
      hasQuotationItems: quotationItems.length > 0,
      hasPricedItems: pricedItems.length > 0,
      totalPricedAmount: pricedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    };
  }, [displayCartItems]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || prev.customerName,
        email: user.email || prev.email
      }));
    }

    if (displayCartItems.length > 0) {
      setFormData(prev => ({
        ...prev,
        selectedProductIds: Array.from(new Set([...displayCartItems.map(i => i.id)]))
      }));
    } else if (initialProductId) {
      setFormData(prev => ({
        ...prev,
        selectedProductIds: [initialProductId]
      }));
    }
  }, [user, displayCartItems, initialProductId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.selectedProductIds.length === 0) {
      alert(language === 'vi' ? 'Vui lòng chọn ít nhất một sản phẩm.' : 'Please select at least one product.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isOrder = mode === 'checkout' || (displayCartItems.length > 0 && !hasQuotationItems);
      const baseId = Date.now().toString();
      const requestId = (isOrder && !hasQuotationItems) ? `ORD-${baseId}` : `INQ-${baseId}`;

      const request: QuotationRequest = {
        id: requestId,
        userId: user?.id || undefined,
        type: (isOrder && !hasQuotationItems) ? 'order' : 'inquiry',
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        companyName: formData.companyName,
        productIds: formData.selectedProductIds,
        productNames: products.filter(p => formData.selectedProductIds.includes(p.id)).map(p => p.name),
        productDetails: displayCartItems.map(i => ({ id: i.id, name: i.name, size: i.selectedSize || 'N/A', price: i.pricingType === 'quotation' ? 0 : i.price })),
        totalAmount: totalPricedAmount,
        notes: formData.notes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await upsertDocument('quotations', requestId, request);
      if (clearCart) clearCart();
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert(language === 'vi' ? 'Có lỗi xảy ra, vui lòng thử lại.' : 'An error occurred, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleProduct = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProductIds: prev.selectedProductIds.includes(id)
        ? prev.selectedProductIds.filter(pid => pid !== id)
        : [...prev.selectedProductIds, id]
    }));
  };

  const quotationOnlyProducts = useMemo(() => {
    return products.filter(p => p.status !== 'hidden' && p.pricingType === 'quotation');
  }, [products]);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-32 px-6 text-center animate-reveal">
        <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-10">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">
          {language === 'vi' ? 'GỬI THÀNH CÔNG' : 'SUCCESSFULLY SENT'}
        </h2>
        <p className="text-zinc-500 mb-12">
          {language === 'vi' ? 'Chúng tôi đã nhận được thông tin và sẽ phản hồi sớm nhất.' : 'We have received your request and will respond shortly.'}
        </p>
        <button onClick={() => window.location.href = '/'} className="bg-black text-white px-10 py-4 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
          {language === 'vi' ? 'QUAY LẠI TRANG CHỦ' : 'BACK TO HOME'}
        </button>
      </div>
    );
  }

  const pageTitle = mode === 'checkout'
    ? (language === 'vi' ? 'XÁC NHẬN THANH TOÁN' : 'CHECKOUT')
    : (displayCartItems.length > 0 
        ? (language === 'vi' ? 'YÊU CẦU BÁO GIÁ' : 'INQUIRY REQUEST')
        : (language === 'vi' ? 'YÊU CẦU BÁO GIÁ' : 'GET A QUOTATION'));

  return (
    <div className="max-w-6xl mx-auto py-16 md:py-24 px-6 animate-reveal">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
          {pageTitle}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <h3 className="text-sm font-black uppercase tracking-widest border-b border-zinc-100 pb-4">1. {language === 'vi' ? 'SẢN PHẨM' : 'PRODUCTS'}</h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 no-scrollbar">
            {displayCartItems.length > 0 ? (
              displayCartItems.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex gap-4 p-4 border border-black bg-zinc-50">
                  <div className="w-16 h-20 bg-zinc-100 shrink-0 overflow-hidden">
                    <img src={item.imageUrl} className="w-full h-full object-cover grayscale" alt="" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] font-black uppercase leading-tight">{item.name}</h4>
                    <p className="text-[9px] text-zinc-400 font-bold mt-1 uppercase">Size: {item.selectedSize || 'N/A'} | SL: {item.quantity}</p>
                    <p className="text-[11px] font-black mt-2">
                      {item.pricingType === 'quotation' 
                        ? (language === 'vi' ? 'Báo giá' : 'Quote') 
                        : formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quotationOnlyProducts.map(p => (
                  <div key={p.id} onClick={() => toggleProduct(p.id)} className={`flex gap-4 p-4 border cursor-pointer transition-all ${formData.selectedProductIds.includes(p.id) ? 'border-black bg-zinc-50' : 'border-zinc-100'}`}>
                    <div className="w-16 h-20 bg-zinc-100 overflow-hidden"><img src={p.imageUrl} className="w-full h-full object-cover grayscale" /></div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold uppercase">{p.name}</h4>
                      <p className="text-[9px] font-black mt-1">
                        {p.pricingType === 'quotation' ? (language === 'vi' ? 'Báo giá' : 'Quote') : formatPrice(p.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {hasPricedItems && (
            <div className="pt-6 border-t border-zinc-100 flex justify-between items-baseline">
              <span className="text-[10px] font-black uppercase tracking-widest">
                {language === 'vi' ? 'Tổng cộng' : 'Total'}
              </span>
              <span className="text-3xl font-black">{formatPrice(totalPricedAmount)}</span>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <h3 className="text-sm font-black uppercase tracking-widest border-b border-zinc-100 pb-4">2. {language === 'vi' ? 'THÔNG TIN' : 'INFO'}</h3>
          <div className="space-y-6">
            <input required placeholder={language === 'vi' ? 'Họ tên' : 'Full Name'} value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full border-b py-3 outline-none focus:border-black transition-all" />
            <input required type="tel" placeholder={language === 'vi' ? 'Số điện thoại' : 'Phone'} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-b py-3 outline-none focus:border-black transition-all" />
            <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-b py-3 outline-none focus:border-black transition-all" />
            <textarea placeholder={language === 'vi' ? 'Địa chỉ & Ghi chú' : 'Address & Notes'} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border p-4 h-32 outline-none focus:border-black resize-none" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 disabled:opacity-50">
            {isSubmitting ? '...' : (
              (mode === 'checkout') 
                ? (language === 'vi' ? 'XÁC NHẬN THANH TOÁN' : 'PLACE ORDER') 
                : (language === 'vi' ? 'GỬI YÊU CẦU BÁO GIÁ' : 'SUBMIT INQUIRY')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuotationForm;
