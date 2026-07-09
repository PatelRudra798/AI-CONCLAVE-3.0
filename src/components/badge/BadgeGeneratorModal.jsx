import { useEffect } from 'react';

export default function BadgeGeneratorModal({ isOpen, onClose, children }) {
 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow = 'hidden';
 const handleEscape = (e) => {
 if (e.key === 'Escape') onClose();
 };
 window.addEventListener('keydown', handleEscape);
 return () => {
 document.body.style.overflow = '';
 window.removeEventListener('keydown', handleEscape);
 };
 } else {
 document.body.style.overflow = '';
 }
 return () => {
 document.body.style.overflow = '';
 };
 }, [isOpen, onClose]);

 if (!isOpen) return null;

 const handleBackdropClick = (e) => {
 if (e.target === e.currentTarget) {
 onClose();
 }
 };

 return (
 <div
 className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 backdrop-blur-md animate-fade-in p-4 sm:p-8 overflow-y-auto custom-scrollbar"
 onClick={handleBackdropClick}
 >
 <div className="w-full animate-scale-up my-auto">
 {children}
 </div>
 </div>
 );
}
