
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { loginUser, registerUser } from '../services/firebaseService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, language }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = translations[language].auth;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email.trim(), password);
      } else {
        await registerUser(email.trim(), password);
      }
      // Trạng thái User sẽ được App.tsx tự động cập nhật qua onAuthUpdate
      onClose();
    } catch (err: any) {
      console.error("[AuthError]", err.code, err.message);
      
      // Xử lý các mã lỗi cụ thể từ Firebase
      if (err.code === 'auth/invalid-credential') {
        setError(language === 'vi' 
          ? 'Email hoặc mật khẩu không chính xác. Nếu bạn chưa có tài khoản, hãy nhấn "Đăng Ký Ngay".' 
          : 'Invalid email or password. If you do not have an account, please click "Register Now".');
      } else if (err.code === 'auth/email-already-in-use') {
        setError(language === 'vi' ? 'Email này đã được sử dụng.' : 'Email already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError(language === 'vi' ? 'Mật khẩu quá yếu (tối thiểu 6 ký tự).' : 'Password is too weak.');
      } else {
        setError(err.message || t.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-0 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-up my-auto md:max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-6 top-6 z-10 p-2 text-zinc-400 hover:text-black transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-8 md:p-20">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] block mb-4">TKAP GLOBAL</span>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">
              {isLogin ? t.loginTitle : t.signupTitle}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">{t.name}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border-b border-zinc-200 py-3 text-sm focus:outline-none focus:border-black bg-transparent" placeholder="Full Name" required={!isLogin} />
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">{t.email}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-b border-zinc-200 py-3 text-sm focus:outline-none focus:border-black bg-transparent" placeholder="email@example.com" required />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 tracking-widest">{t.password}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-b border-zinc-200 py-3 text-sm focus:outline-none focus:border-black bg-transparent" placeholder="••••••••" required />
            </div>

            {error && <p className="text-[11px] text-red-500 font-bold uppercase tracking-widest text-center leading-relaxed border border-red-100 p-4 bg-red-50">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-black text-white py-6 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all shadow-2xl active:scale-95 disabled:opacity-50">
              {loading ? 'Processing...' : (isLogin ? t.signIn : t.signUp)}
            </button>
          </form>

          <div className="mt-16 text-center pt-8 border-t border-zinc-100 flex flex-col items-center gap-4">
            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">{isLogin ? t.noAccount : t.hasAccount}</p>
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-[11px] font-black uppercase tracking-[0.3em] border-b-2 border-black pb-1 hover:text-zinc-600 transition-all">
              {isLogin ? t.signUp : t.signIn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
