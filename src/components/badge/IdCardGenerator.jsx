import { useState, useRef, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import socialBadgeBg from '../../assets/Social_Media_Badge.png';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

export default function IdCardGenerator({ onClose }) {
 const [role, setRole] = useState('');
 const [photo, setPhoto] = useState(null);
 const [error, setError] = useState('');
 const [isGenerating, setIsGenerating] = useState(false);
 const [scale, setScale] = useState(1);
 const [toast, setToast] = useState({ show: false, message: '', type: '' });
 const [showShareModal, setShowShareModal] = useState(false);

 // Cropper states
 const [imageSrc, setImageSrc] = useState(null);
 const [crop, setCrop] = useState({ x: 0, y: 0 });
 const [zoom, setZoom] = useState(1);
 const [rotation, setRotation] = useState(0);
 const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
 const [isCropping, setIsCropping] = useState(false);

 const [tierType, setTierType] = useState('Attendee');

 const cardRef = useRef(null);
 const containerRef = useRef(null);

 const safeRole = tierType;


 // Auto-scale badge preview based on the actual container width to prevent overflow/distortion
 useEffect(() => {
 const handleResize = () => {
 if (containerRef.current) {
 const parentWidth = containerRef.current.getBoundingClientRect().width;
 if (parentWidth < 360) {
 // Scales badge down proportionally to fit the mobile container width (approx 90-95% of parent)
 const newScale = (parentWidth - 8) / 360;
 setScale(Math.min(newScale, 1));
 } else {
 setScale(1);
 }
 }
 };
 
 window.addEventListener('resize', handleResize);
 const timer = setTimeout(handleResize, 100);
 
 return () => {
 window.removeEventListener('resize', handleResize);
 clearTimeout(timer);
 };
 }, []);

 const handlePhotoUpload = (e) => {
 const file = e.target.files[0];
 if (file) {
 if (file.size > 5 * 1024 * 1024) {
 setError('File is too large. Max 5MB.');
 return;
 }
 setError('');
 const reader = new FileReader();
 reader.onloadend = () => {
 setImageSrc(reader.result);
 setIsCropping(true);
 setZoom(1);
 setRotation(0);
 setCrop({ x: 0, y: 0 });
 };
 reader.readAsDataURL(file);
 }
 // reset input value so the same file can be uploaded again if needed
 e.target.value = '';
 };

 const onCropComplete = (croppedArea, croppedAreaPixels) => {
 setCroppedAreaPixels(croppedAreaPixels);
 };

 const showCroppedImage = async () => {
 try {
 const croppedImage = await getCroppedImg(
 imageSrc,
 croppedAreaPixels,
 rotation
 );
 setPhoto(croppedImage);
 setIsCropping(false);
 } catch (e) {
 console.error(e);
 setError('Failed to crop image');
 }
 };

 const showToast = (message, type = 'success') => {
 setToast({ show: true, message, type });
 if (type !== 'loading') {
 setTimeout(() => {
 setToast(prev => prev.message === message ? { ...prev, show: false } : prev);
 }, 3000);
 }
 };

 // Convert Base64 dataURL to Blob for Clipboard and Sharing
 const dataUrlToBlob = (dataUrl) => {
 const arr = dataUrl.split(',');
 const mime = arr[0].match(/:(.*?);/)[1];
 const bstr = atob(arr[1]);
 let n = bstr.length;
 const u8arr = new Uint8Array(n);
 while (n--) {
 u8arr[n] = bstr.charCodeAt(n);
 }
 return new Blob([u8arr], { type: mime });
 };

 // Unified badge generation to ensure identical styling across all actions
 const generateBadgeImage = async () => {
 if (!cardRef.current) throw new Error('Badge element not found');
 
 const originalNode = cardRef.current;
 
 // Save original styles to restore them perfectly
 const originalWidth = originalNode.style.width;
 const originalHeight = originalNode.style.height;
 const originalMinHeight = originalNode.style.minHeight;
 const originalBoxShadow = originalNode.style.boxShadow;
 const originalTransform = originalNode.style.transform;
 const originalFilter = originalNode.style.filter;
 const originalBackdropFilter = originalNode.style.backdropFilter;
 const originalWebkitBackdropFilter = originalNode.style.webkitBackdropFilter;
 
 const elementsToRestore = [];
 
 try {
 // Force high-res dimensions for a perfect 360x640 export regardless of mobile scaling
 originalNode.style.width = '360px';
 originalNode.style.height = '640px';
 originalNode.style.minHeight = '640px';
 originalNode.style.boxShadow = 'none';
 originalNode.style.transform = 'none';
 originalNode.style.filter = 'none';
 originalNode.style.backdropFilter = 'none';
 originalNode.style.webkitBackdropFilter = 'none';

 // Find and temporarily remove blur/filter from all child elements inside the badge
 const allElements = originalNode.querySelectorAll('*');
 allElements.forEach(el => {
 const hasBlurClass = el.className && typeof el.className === 'string' && (el.className.includes('backdrop-blur') || el.className.includes('blur-'));
 const hasFilterStyle = el.style.filter || el.style.backdropFilter || el.style.webkitBackdropFilter;
 if (hasBlurClass || hasFilterStyle) {
 elementsToRestore.push({
 el,
 originalClassName: el.className,
 originalFilter: el.style.filter,
 originalBackdropFilter: el.style.backdropFilter,
 originalWebkitBackdropFilter: el.style.webkitBackdropFilter,
 });

 // Strip blur/filter from class names
 if (el.className && typeof el.className === 'string') {
 el.className = el.className
 .replace(/\bbackdrop-blur-\w+\b/g, '')
 .replace(/\bbackdrop-blur\b/g, '')
 .replace(/\bblur-\w+\b/g, '')
 .replace(/\bblur\b/g, '')
 .replace(/\bfilter-\w+\b/g, '')
 .replace(/\bfilter\b/g, '');
 }
 // Strip inline style filters
 el.style.filter = 'none';
 el.style.backdropFilter = 'none';
 el.style.webkitBackdropFilter = 'none';
 }
 });

 // Render image
 const dataUrl = await htmlToImage.toPng(originalNode, {
 cacheBust: true,
 pixelRatio: 3,
 backgroundColor: null,
 });
 
 const blob = dataUrlToBlob(dataUrl);
 const fileName = `AI-Conclave-3.0-SocialBadge-${Date.now()}.png`;
 const file = new File([blob], fileName, { type: 'image/png' });

 return { dataUrl, blob, file, fileName };
 } finally {
 // Always restore styles in finally block
 if (originalNode) {
 originalNode.style.width = originalWidth;
 originalNode.style.height = originalHeight;
 originalNode.style.minHeight = originalMinHeight;
 originalNode.style.boxShadow = originalBoxShadow;
 originalNode.style.transform = originalTransform;
 originalNode.style.filter = originalFilter;
 originalNode.style.backdropFilter = originalBackdropFilter;
 originalNode.style.webkitBackdropFilter = originalWebkitBackdropFilter;
 }

 elementsToRestore.forEach(item => {
 item.el.className = item.originalClassName;
 item.el.style.filter = item.originalFilter;
 item.el.style.backdropFilter = item.originalBackdropFilter;
 item.el.style.webkitBackdropFilter = item.originalWebkitBackdropFilter;
 });
 }
 };

 const handleDownload = async () => {
 if (!photo) {
 showToast('Please upload a photo first.', 'error');
 return;
 }
 setIsGenerating(true);
 showToast('Generating badge for download...', 'loading');
 try {
 const { dataUrl, fileName } = await generateBadgeImage();
 const link = document.createElement('a');
 link.download = fileName;
 link.href = dataUrl;
 link.click();
 showToast('Badge downloaded successfully!', 'success');
 } catch (e) {
 console.error(e);
 showToast('Failed to generate badge.', 'error');
 } finally {
 setIsGenerating(false);
 }
 };

 const handleCopy = async () => {
 if (!photo) {
 showToast('Please upload a photo first.', 'error');
 return;
 }
 setIsGenerating(true);
 showToast('Generating badge for clipboard...', 'loading');
 try {
 const { blob } = await generateBadgeImage();
 await navigator.clipboard.write([
 new ClipboardItem({
 [blob.type]: blob
 })
 ]);
 showToast('Badge copied to clipboard!', 'success');
 } catch (e) {
 console.error(e);
 showToast('Failed to copy badge to clipboard.', 'error');
 } finally {
 setIsGenerating(false);
 }
 };

 const handleShare = async () => {
 if (!photo) {
 showToast('Please upload a photo first.', 'error');
 return;
 }
 setIsGenerating(true);
 showToast('Preparing share package...', 'loading');
 try {
 const { file } = await generateBadgeImage();
 if (navigator.canShare && navigator.canShare({ files: [file] })) {
 await navigator.share({
 files: [file],
 title: 'AI Conclave 3.0 Badge',
 text: `Excited to attend AI Conclave 3.0! Here is my custom badge.`
 });
 showToast('Badge shared successfully!', 'success');
 } else if (navigator.share) {
 await navigator.share({
 title: 'AI Conclave 3.0 Badge',
 text: `Excited to attend AI Conclave 3.0! Join me here: https://forms.gle/Ucu9KrsA27EXH1X67`
 });
 showToast('Shared successfully!', 'success');
 } else {
 setShowShareModal(true);
 showToast('Sharing not supported on this browser.', 'error');
 }
 } catch (e) {
 console.error(e);
 if (e.name !== 'AbortError') {
 showToast('Sharing failed or was cancelled.', 'error');
 } else {
 showToast('Share cancelled.', 'error');
 }
 } finally {
 setIsGenerating(false);
 }
 };

 const handleSocialShare = async (platform) => {
 if (!photo) {
 showToast('Please upload a photo first.', 'error');
 return;
 }
 setIsGenerating(true);
 showToast(`Preparing share for ${platform === 'twitter' ? 'Twitter/X' : platform === 'linkedin' ? 'LinkedIn' : 'Facebook'}...`, 'loading');
 try {
 const shareUrl = encodeURIComponent('https://forms.gle/Ucu9KrsA27EXH1X67');
 const shareText = encodeURIComponent(`Excited to attend AI Conclave 3.0! Just generated my personalized badge. Check it out!`);
 
 let url = '';
 if (platform === 'twitter') {
 url = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
 } else if (platform === 'linkedin') {
 url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
 } else if (platform === 'facebook') {
 url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
 }
 
 if (url) {
 window.open(url, '_blank', 'noopener,noreferrer');
 showToast('Opened share dialog.', 'success');
 }
 } catch (e) {
 console.error(e);
 showToast('Failed to prepare sharing.', 'error');
 } finally {
 setIsGenerating(false);
 }
 };

 return (
 <div className="w-full max-w-5xl mx-auto pb-8">
 <div className="t-card rounded-[2.5rem] p-6 sm:p-10 pb-12 sm:pb-16 relative overflow-hidden">
 {onClose && (
 <button
 onClick={onClose}
 className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
 aria-label="Close modal"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="18" y1="6" x2="6" y2="18"></line>
 <line x1="6" y1="6" x2="18" y2="18"></line>
 </svg>
 </button>
 )}

 {/* Decorative background glow */}
 <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

 <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
 {/* Left Column: Form Controls & Photo Upload */}
 <div className="flex-1 w-full flex flex-col gap-4">

 {/* Removed Name Step */}

 {/* Step 2: Choose Template */}
 <div className="t-card-bg border t-border rounded-xl p-5 w-full box-border">
 <h3 className="t-text font-sora font-bold mb-4" style={{ fontSize: 'clamp(14px, 4vw, 15px)' }}>2. Choose Template</h3>
 <div className="flex flex-col gap-3">
 {[
 { label: 'Attendee', type: 'Attendee' },
 { label: 'Speaker', type: 'Speaker' },
 { label: 'Volunteer', type: 'Volunteer' },
 ].map((t) => {
 const selected = tierType === t.type;
 return (
 <button
 key={t.type}
 type="button"
 onClick={() => {
 setTierType(t.type);
 }}
 className="w-full flex items-center gap-3 t-card2-bg border t-border rounded-lg px-4 py-3.5 hover:border-accent transition-all text-left"
 >
 <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected ? 'border-accent' : 'border-white/20 bg-transparent'}`}>
 {selected && <div className="w-2 h-2 rounded-full bg-accent" />}
 </div>
 <span className="t-text font-semibold text-sm">{t.label}</span>
 </button>
 );
 })}
 </div>
 </div>

 {error && (
 <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold flex items-center gap-2">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
 </svg>
 {error}
 </div>
 )}

 {/* Step 3: Upload and Adjust */}
 <div className="t-card-bg border t-border rounded-xl p-5 w-full box-border">
 <h3 className="t-text font-sora font-bold mb-4" style={{ fontSize: 'clamp(14px, 4vw, 15px)' }}>3. Upload and Adjust</h3>
 
 {isCropping && imageSrc ? (
 <div className="w-full flex flex-col gap-4">
 <div className="relative w-full h-[300px] bg-black/20 rounded-lg overflow-hidden border border-white/10">
 <Cropper
 image={imageSrc}
 crop={crop}
 zoom={zoom}
 rotation={rotation}
 aspect={1}
 cropShape="round"
 showGrid={true}
 onCropChange={setCrop}
 onCropComplete={onCropComplete}
 onZoomChange={setZoom}
 onRotationChange={setRotation}
 />
 </div>
 
 <div className="flex flex-col gap-3">
 <div className="flex flex-col gap-1">
 <label className="text-xs t-muted flex justify-between">
 <span>Zoom</span>
 <span>{Math.round(zoom * 100)}%</span>
 </label>
 <input
 type="range"
 value={zoom}
 min={1}
 max={3}
 step={0.1}
 aria-labelledby="Zoom"
 onChange={(e) => setZoom(Number(e.target.value))}
 className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-accent"
 />
 </div>
 
 <div className="flex flex-col gap-1">
 <label className="text-xs t-muted flex justify-between">
 <span>Rotation</span>
 <span>{rotation}°</span>
 </label>
 <input
 type="range"
 value={rotation}
 min={0}
 max={360}
 step={1}
 aria-labelledby="Rotation"
 onChange={(e) => setRotation(Number(e.target.value))}
 className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-accent"
 />
 </div>
 </div>

 <div className="flex gap-3 mt-2">
 <button
 onClick={() => setIsCropping(false)}
 className="flex-1 py-2.5 rounded-lg border border-white/20 text-white/70 text-sm font-semibold hover:bg-white/5 transition-all"
 >
 Cancel
 </button>
 <button
 onClick={showCroppedImage}
 className="flex-1 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-all"
 >
 Apply Crop
 </button>
 </div>
 </div>
 ) : (
 <div className="flex flex-col gap-3">
 <label className="flex flex-col items-center justify-center border border-dashed t-border rounded-xl p-8 hover:border-accent transition-all cursor-pointer w-full box-border t-card2-bg">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white/40 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
 </svg>
 <span className="t-muted text-xs mb-4 text-center leading-relaxed">Upload a clear headshot or portrait photo.<br/>PNG or JPG recommended.</span>
 <span className="t-text font-bold text-sm">Upload Photo</span>
 <input
 type="file"
 accept="image/png, image/jpeg"
 className="hidden"
 onChange={handlePhotoUpload}
 />
 </label>
 
 {imageSrc && !isCropping && (
 <button
 onClick={() => setIsCropping(true)}
 className="w-full py-2.5 rounded-lg border border-accent/40 text-accent text-sm font-semibold hover:bg-accent/10 transition-all flex items-center justify-center gap-2"
 >
 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
 <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
 </svg>
 Edit Crop
 </button>
 )}
 </div>
 )}
 </div>

 </div>

 {/* Right Column: Preview & Action Buttons */}
 <div className="flex-1 w-full flex flex-col gap-4 items-center" ref={containerRef}>
  <div style={{ position: 'relative', height: `${690 * scale * 0.85}px`, width: `${360 * scale * 0.85}px` }}>
 <div style={{ transform: `scale(${scale * 0.85})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
                                    {/* The Actual Badge to be downloaded */}
                                    <div
                                        ref={cardRef}
                                        className="relative bg-[#020813] w-[360px] h-[690px] rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center border border-white/10"
                                        style={{
                                            backgroundImage: `url(${socialBadgeBg})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    >
                                        
                                        {/* Photo Overlay */}
                                        {photo && (
                                            <div className="absolute left-1/2 top-[240px] -translate-x-1/2 w-[220px] h-[220px] rounded-full overflow-hidden flex items-center justify-center z-10 shadow-lg">
                                                <img src={photo} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                            </div>
                                        )}

                                        {/* Role Overlay */}
                                        <div className="absolute left-0 bottom-[140px] w-full flex flex-col items-center px-6 z-20">
                                            {safeRole && (
                                                <span className="text-[#50e3c2] font-black text-[24px] tracking-widest uppercase drop-shadow-lg">
                                                    {safeRole}
                                                </span>
                                            )}
                                        </div>

                                    </div>
 </div>
 </div>

 {/* Action Buttons: Full-width, touch-friendly, equal gaps (12px = gap-3) */}
 <div className="w-full max-w-[360px] flex flex-col gap-3 mt-2 mx-auto md:mx-0 box-border">
 <button
 onClick={handleDownload}
 disabled={isGenerating || (!photo)}
 className="w-full h-12 bg-[#10b981] hover:bg-[#059669] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2 flex-shrink-0"
 >
 {isGenerating && toast.type === 'loading' && toast.message.includes('download') ? (
 <>
 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
 Generating...
 </>
 ) : (
 <>
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
 </svg>
 Download PNG
 </>
 )}
 </button>
 
 <button 
 onClick={handleCopy}
 disabled={isGenerating || (!photo)}
 className="w-full h-12 bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2 flex-shrink-0"
 >
 {isGenerating && toast.type === 'loading' && toast.message.includes('clipboard') ? (
 <>
 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
 Copying...
 </>
 ) : (
 <>
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
 </svg>
 Copy to Clipboard
 </>
 )}
 </button>
 
 <button 
 onClick={handleShare}
 disabled={isGenerating || (!photo)}
 className="w-full h-12 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2 border border-white/10 flex-shrink-0"
 >
 {isGenerating && toast.type === 'loading' && toast.message.includes('share') ? (
 <>
 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
 Preparing...
 </>
 ) : (
 <>
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
 </svg>
 Share Badge
 </>
 )}
 </button>

 {/* Social Sharing Intents: Grid layout responsive to viewport width */}
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1 w-full box-border">
 <button 
 onClick={() => handleSocialShare('twitter')}
 disabled={isGenerating || (!photo)}
 className="col-span-1 sm:col-span-1 h-12 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/40 disabled:bg-gray-600 disabled:cursor-not-allowed text-[#1DA1F2] border border-[#1DA1F2]/30 font-bold rounded-xl transition-all text-sm flex justify-center items-center"
 >
 Twitter
 </button>
 <button 
 onClick={() => handleSocialShare('linkedin')}
 disabled={isGenerating || (!photo)}
 className="col-span-1 sm:col-span-1 h-12 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/40 disabled:bg-gray-600 disabled:cursor-not-allowed text-[#0A66C2] border border-[#0A66C2]/30 font-bold rounded-xl transition-all text-sm flex justify-center items-center"
 >
 LinkedIn
 </button>
 <button 
 onClick={() => handleSocialShare('facebook')}
 disabled={isGenerating || (!photo)}
 className="col-span-2 sm:col-span-1 h-12 bg-[#1877F2]/20 hover:bg-[#1877F2]/40 disabled:bg-gray-600 disabled:cursor-not-allowed text-[#1877F2] border border-[#1877F2]/30 font-bold rounded-xl transition-all text-sm flex justify-center items-center"
 >
 Facebook
 </button>
 </div>
 </div>

 </div>
 </div>
 </div>

 {/* Premium Glassmorphic Toast Notification */}
 {toast.show && (
 <div className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-5 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-[#0c1826]/95 backdrop-blur-md shadow-2xl animate-fade-in max-w-sm sm:w-auto">
 {toast.type === 'loading' && (
 <svg className="animate-spin h-5 w-5 text-accent flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
 )}
 {toast.type === 'success' && (
 <div className="w-5 h-5 rounded-full bg-emerald-500/25 border border-emerald-500 flex items-center justify-center text-emerald-400 flex-shrink-0">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
 </svg>
 </div>
 )}
 {toast.type === 'error' && (
 <div className="w-5 h-5 rounded-full bg-red-500/25 border border-red-500 flex items-center justify-center text-red-400 flex-shrink-0">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
 </svg>
 </div>
 )}
 <span className="text-white text-sm font-medium">{toast.message}</span>
 </div>
 )}

 {/* Share Fallback Modal */}
 {showShareModal && (
 <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
 <div className="bg-[#0c1826] border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl text-center box-border">
 <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center mx-auto mb-4 text-[#3b82f6]">
 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
 </svg>
 </div>
 <h3 className="text-white font-sora font-bold text-lg mb-2">Sharing Not Supported</h3>
 <p className="text-white/70 text-sm mb-6">
 Web sharing is not supported by your browser. You can still download your badge or copy it to the clipboard.
 </p>
 <div className="flex flex-col gap-3">
 <button
 onClick={() => {
 setShowShareModal(false);
 handleDownload();
 }}
 className="w-full h-11 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-xl transition-all"
 >
 Download PNG
 </button>
 <button
 onClick={() => {
 setShowShareModal(false);
 handleCopy();
 }}
 className="w-full h-11 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold rounded-xl transition-all"
 >
 Copy to Clipboard
 </button>
 <button
 onClick={() => setShowShareModal(false)}
 className="w-full h-10 bg-white/5 hover:bg-white/10 text-white/70 font-semibold rounded-xl transition-all"
 >
 Close
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
