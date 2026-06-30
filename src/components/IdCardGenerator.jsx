import { useState, useRef, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import QRCode from 'react-qr-code';

export default function IdCardGenerator() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scale, setScale] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showShareModal, setShowShareModal] = useState(false);

  const [tierType, setTierType] = useState('IEEE Student');
  const [tierPrice, setTierPrice] = useState('150');

  const cardRef = useRef(null);
  const containerRef = useRef(null);

  const safeName = (name || '').trim().slice(0, 40) || 'Your Name';
  const safeRegNo = (regNo || '').trim().slice(0, 20) || 'AI-0001';
  const safeRole = tierType || 'Participant';
  const safePrice = String(tierPrice || '0').trim();


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
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
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
      // Force high-res dimensions for a perfect 360x600 export regardless of mobile scaling
      originalNode.style.width = '360px';
      originalNode.style.height = '600px';
      originalNode.style.minHeight = '600px';
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
      const nameSlug = safeName.replace(/\s+/g, '-').toUpperCase() || 'BADGE';
      const fileName = `AI-Conclave-3.0-${nameSlug}.png`;
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
    if (!safeName) {
      showToast('Please enter your name first.', 'error');
      return;
    }
    setIsGenerating(true);
    showToast('Generating badge for download...', 'loading');
    try {
      const { dataUrl, fileName } = await generateBadgeImage();
      const link = document.createElement('a');
      link.download = `AI-Conclave-3.0-ID-${safeRegNo}-${safeRole.replace(/\s+/g, '-').toUpperCase()}-RS-${safePrice}.png`;
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


  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="t-card rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden">

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

  const handleShare = async () => {
    if (!safeName) {
      showToast('Please enter your name first.', 'error');
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
    if (!safeName) {
      showToast('Please enter your name first.', 'error');
      return;
    }
    setIsGenerating(true);
    showToast(`Preparing share for ${platform === 'twitter' ? 'Twitter/X' : platform === 'linkedin' ? 'LinkedIn' : 'Facebook'}...`, 'loading');
    try {
      await generateBadgeImage();
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

            <div className="flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="text-[13px] text-white/80 font-semibold ml-1">Full Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 outline-none focus:border-accent focus:bg-accent/5 transition-all duration-300 font-medium placeholder:text-white/20"
                  placeholder="e.g. John Doe"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[13px] text-white/80 font-semibold ml-1">Registration ID</span>
                <input
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 outline-none focus:border-accent focus:bg-accent/5 transition-all duration-300 font-medium uppercase placeholder:text-white/20"
                  placeholder="e.g. AI-0001"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[13px] text-white/80 font-semibold ml-1">Professional Type</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { type: 'IEEE Student', price: '150' },
                    { type: 'Non-IEEE Student', price: '200' },
                    { type: 'Professional', price: '350' },
                  ].map((t) => {
                    const selected = tierType === t.type;
                    return (
                      <button
                        key={t.type}
                        type="button"
                        onClick={() => {
                          setTierType(t.type);
                          setTierPrice(t.price);
                        }}
                        className={`rounded-2xl px-3 py-3 border text-[12px] font-bold transition-all duration-300 uppercase tracking-wide ${
                          selected
                            ? 'bg-red-500/15 border-red-400/40 text-red-200'
                            : 'bg-white/5 border-white/10 text-white/70 hover:border-red-400/30 hover:text-red-200'
                        }`}
                      >
                        {t.type.replace('Member', 'M').replace('Student', 'S')}<br />
                        ₹{t.price}
                      </button>
                    );
                  })}
                </div>
              </label>
            </div>


            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="mt-10">
              <button
                onClick={download}
                disabled={isGenerating}
                className={`w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-[#0A1325] font-bold text-[14px] px-8 py-4 rounded-xl transition-all duration-300 ${isGenerating
                  ? 'opacity-50 cursor-not-allowed scale-[0.98]'
                  : 'hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${role === r ? 'bg-accent' : 'bg-white/10 border border-white/20'}`}>
                     {role === r && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Photo Upload */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 w-full box-border">
            <h3 className="text-white font-sora font-bold mb-4" style={{ fontSize: 'clamp(16px, 4.5vw, 18px)' }}>3. Upload and Adjust</h3>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-6 sm:p-8 hover:bg-white/5 hover:border-accent/50 transition-all cursor-pointer w-full box-border">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-white/70 text-sm mb-4 text-center">Upload a clear headshot or portrait photo.<br/>PNG or JPG recommended.</span>
              <span className="bg-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-accent/80 transition-all">Upload Photo</span>
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
            {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
          </div>

        </div>

        {/* Right Column: Preview & Action Buttons */}
        <div className="flex-1 w-full flex flex-col gap-6 items-center">
          
          <h2 className="text-white font-sora font-bold w-full text-center md:text-left" style={{ fontSize: 'clamp(18px, 4.5vw, 24px)' }}>Badge Preview</h2>

              {/* The Actual Badge to be downloaded */}
              <div
                ref={cardRef}
                className="relative bg-gradient-to-b from-[#0a172a] to-[#080E1A] w-[320px] aspect-[1/1.45] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                style={{
                  border: '1px solid var(--accent)'
                }}
              >
                {/* Lanyard Hole */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-[#040810] z-20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border border-white/5" />

                {/* Gradient overlay for subtle background flair */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-accent2/20 opacity-30 pointer-events-none" />
                {/* Top Colored Section */}
                <div className="relative bg-gradient-to-r from-accent to-accent2 pt-14 pb-8 flex flex-col items-center border-b border-accent/20">
                  <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent opacity-80" />

                  {/* Event Logo / Text */}
                  <h3 className="relative z-10 font-sora font-black text-[22px] tracking-wide text-white drop-shadow-md">
                    <span className="flex items-center gap-2">
                      <span className="text-accent">AI CONCLAVE </span>3.0
                    </span>
                  </h3>
                  <p className="text-white/70 text-[12px] mt-1 text-center">13‑14 Oct 2026 • Online</p>
                </div>

                {/* Event Logo Placeholder */}
                <div className="flex justify-center mt-2 mb-2">
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    LOGO
                  </div>
                </div>
              </div>


                {/* Middle Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                  {/* Subtle Background Elements */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-accent/10 rounded-full blur-[40px]" />
                    <div className="absolute bottom-[20%] right-[10%] w-32 h-32 bg-accent2/10 rounded-full blur-[40px]" />
                  </div>
                </div>
                <div className="absolute w-[200px] h-[200px] rounded-full border border-[#3b82f6]/40 border-dashed" style={{ animation: 'spin 20s linear infinite' }} />
                <div className="absolute w-[230px] h-[230px] rounded-full border border-[#0ff]/20" />
              </div>

                  {/* QR Code Container */}
                  <div className="relative z-10 mb-8 p-4 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-accent/20">
                    <QRCode
                      value={safeRegNo}
                      size={120}
                      level="H"
                      fgColor="#080E1A"
                      bgColor="#ffffff"
                    />
                  </div>
                ) : (
                  <div className="h-[34px] mt-3"></div>
                )}
              </div>

                  {/* Name and Role */}
                  <div className="relative z-10 flex flex-col items-center text-center w-full">
                    <h4 className="font-sora font-bold text-[28px] text-gradient-brand leading-tight mb-3 drop-shadow-md break-words max-w-full px-2">
                      {safeName}
                    </h4>

                    {/* Red box tier (fixed layout, always aligned) */}
                    <div className="w-full flex justify-center">
                      <div className="w-[92%] max-w-[260px] rounded-2xl bg-red-500/15 border border-red-400/35 px-4 py-2 flex items-center justify-center gap-2">
                        <span className="text-red-200 font-space font-bold text-[12px] uppercase tracking-widest whitespace-nowrap">
                          {safeRole}
                        </span>
                        <span className="text-white/80 font-mono font-bold text-[12px]">
                          ₹{safePrice}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer Section */}
                <div className="bg-gradient-to-r from-accent/20 to-accent2/20 py-5 flex flex-col items-center justify-center border-t border-white/5 relative z-10">
                  <p className="text-white/60 text-[9px] font-bold tracking-[0.2em] mb-1">
                    REGISTRATION ID
                  </p>
                  <p className="text-white font-mono font-bold text-[18px] tracking-wider">
                    {safeRegNo}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons: Full-width, touch-friendly, equal gaps (12px = gap-3) */}
          <div className="w-full max-w-[360px] flex flex-col gap-3 mt-2 mx-auto md:mx-0 box-border">
            <button
              onClick={handleDownload}
              disabled={isGenerating || (!safeName)}
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
              disabled={isGenerating || (!safeName)}
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
              disabled={isGenerating || (!safeName)}
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
                disabled={isGenerating || (!safeName)}
                className="col-span-1 sm:col-span-1 h-12 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/40 disabled:bg-gray-600 disabled:cursor-not-allowed text-[#1DA1F2] border border-[#1DA1F2]/30 font-bold rounded-xl transition-all text-sm flex justify-center items-center"
              >
                Twitter
              </button>
              <button 
                onClick={() => handleSocialShare('linkedin')}
                disabled={isGenerating || (!safeName)}
                className="col-span-1 sm:col-span-1 h-12 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/40 disabled:bg-gray-600 disabled:cursor-not-allowed text-[#0A66C2] border border-[#0A66C2]/30 font-bold rounded-xl transition-all text-sm flex justify-center items-center"
              >
                LinkedIn
              </button>
              <button 
                onClick={() => handleSocialShare('facebook')}
                disabled={isGenerating || (!safeName)}
                className="col-span-2 sm:col-span-1 h-12 bg-[#1877F2]/20 hover:bg-[#1877F2]/40 disabled:bg-gray-600 disabled:cursor-not-allowed text-[#1877F2] border border-[#1877F2]/30 font-bold rounded-xl transition-all text-sm flex justify-center items-center"
              >
                Facebook
              </button>
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
