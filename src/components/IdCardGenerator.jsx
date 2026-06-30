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

  const cardRef = useRef(null);
  const containerRef = useRef(null);

  const safeName = (name || '').trim().slice(0, 25);
  const safeRole = role;

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
    if (!safeName) {
      showToast('Please enter your name first.', 'error');
      return;
    }
    setIsGenerating(true);
    showToast('Generating badge for clipboard...', 'loading');
    try {
      const { blob } = await generateBadgeImage();
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        showToast('Badge copied to clipboard!', 'success');
      } else {
        throw new Error('ClipboardItem not supported');
      }
    } catch (e) {
      console.error(e);
      showToast('Copy failed. Please download the PNG instead.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

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

  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 md:px-8 box-border">
      
      {/* 1. Event Information Header (Mobile-first responsive typography scaling with clamp) */}
      <div className="mb-8 text-center md:text-left">
        <h1 
          className="font-sora font-extrabold text-white tracking-tight leading-tight"
          style={{ fontSize: 'clamp(22px, 5.5vw, 36px)' }}
        >
          AI CONCLAVE <span className="text-accent">3.0</span> Badge Generator
        </h1>
        <p 
          className="text-white/60 mt-2 font-medium"
          style={{ fontSize: 'clamp(13px, 3.5vw, 16px)' }}
        >
          Generate, download, and share your personalized attendee badge for AI Conclave 3.0.
        </p>
      </div>

      {/* Container switches to two-columns at tablet (md: >= 768px) and desktop */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 items-start justify-center w-full">
        
        {/* Left Column: Form Steps (Single column on mobile) */}
        <div className="flex-1 w-full flex flex-col gap-4 sm:gap-6">
          
          {/* Step 1: Name input (Event details) */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 w-full box-border">
            <h3 className="text-white font-sora font-bold mb-4" style={{ fontSize: 'clamp(16px, 4.5vw, 18px)' }}>1. Enter Your Name</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={25}
              className="w-full bg-[#040810] border border-white/10 text-white rounded-xl px-5 py-4 outline-none focus:border-accent focus:bg-accent/5 transition-all font-medium placeholder:text-white/20 uppercase"
              placeholder="e.g. JOHN DOE"
            />
          </div>

          {/* Step 2: Template Selection */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 w-full box-border">
            <h3 className="text-white font-sora font-bold mb-4" style={{ fontSize: 'clamp(16px, 4.5vw, 18px)' }}>2. Choose Template</h3>
            <div className="flex flex-col gap-3">
              {['Attendee', 'Speaker', 'Volunteer', 'Organizer'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex items-center gap-3 w-full rounded-xl px-5 py-4 border transition-all text-left font-semibold ${
                    role === r
                      ? 'bg-accent/20 border-accent text-white'
                      : 'bg-[#040810] border-white/10 text-white/70 hover:border-white/30'
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

          {/* The Badge Scaling Container - Centers badge, auto-resizes to 90-95% of container width, prevents overflow */}
          <div ref={containerRef} className="relative flex justify-center w-full overflow-hidden" style={{ height: `${600 * scale}px` }}>
            <div
              ref={cardRef}
              id="badge-preview"
              className="relative w-[360px] h-[600px] min-h-[600px] pb-8 overflow-hidden bg-[#02050A] font-sans flex flex-col border-2 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] box-border"
              style={{
                backgroundImage: `url(${new URL('../assets/badge-bg.png', import.meta.url).href})`,
                backgroundSize: 'cover',
                backgroundPosition: 'bottom center',
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                position: 'absolute',
                top: 0
              }}
            >
              {/* Subtle background overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#02050A]/40 via-transparent to-[#02050A]/80 pointer-events-none z-0" />

              {/* Globe (left background decoration) */}
              <div className="absolute left-[-40px] top-[150px] w-[200px] h-[200px] rounded-full border border-cyan-500/20 opacity-30 pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)' }}>
                <div className="absolute inset-4 rounded-full border border-cyan-400/10 border-dashed" style={{ animation: 'spin 30s linear infinite' }} />
              </div>

              {/* AI Head Illustration (right background decoration) */}
              <div className="absolute right-[-60px] top-[180px] w-[220px] h-[220px] opacity-20 pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(106,13,173,0.15) 0%, transparent 70%)' }}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] bg-contain bg-no-repeat bg-center" />
              </div>

              {/* Corner Design Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#3b82f6] m-4 z-10" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#3b82f6] m-4 z-10" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#3b82f6] m-4 z-10" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#3b82f6] m-4 z-10" />

              {/* Matrix Grid overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />

              {/* SUniversity & Sponsors Logos Top */}
              <div className="pt-6 px-4 flex justify-center items-center z-10 w-full">
                <img 
                  src={new URL('../assets/icons/Group 16.png', import.meta.url).toString()} 
                  alt="Sponsors Logos" 
                  className="w-full h-auto object-contain max-h-8"
                />
              </div>

              {/* Title Section */}
              <div className="flex flex-col items-center mt-6 z-10">
                <div className="flex items-center gap-2">
                  <span className="text-[40px] font-black text-white leading-none" style={{ textShadow: '2px 0 #0ff, -2px 0 #3b82f6, 0 0 10px rgba(0,255,255,0.5)' }}>AI</span>
                  <span className="text-[34px] font-black text-transparent leading-none mt-1" style={{ WebkitTextStroke: '1px #3b82f6', letterSpacing: '0.05em' }}>CONCLAVE</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[#0ff] text-[10px] font-mono tracking-widest">// 2026 EDITION</span>
                  <span className="text-xl font-black text-white" style={{ textShadow: '2px 0 #0ff, -2px 0 #3b82f6' }}>3.0</span>
                </div>
              </div>

              {/* User Portrait Area (Centers and bounds photos to prevent stretching) */}
              <div className="relative flex-1 flex items-center justify-center z-10 mt-4 mb-2">
                <div className="relative w-[180px] h-[180px] rounded-full flex items-center justify-center p-1" style={{ background: 'linear-gradient(45deg, #3b82f6, #0ff, #3b82f6)' }}>
                  <div className="w-full h-full rounded-full bg-[#02050A] flex items-center justify-center overflow-hidden border-[6px] border-[#02050A]">
                    {photo ? (
                      <img src={photo} alt="Profile" className="w-full h-full object-cover object-center" />
                    ) : (
                      <span className="text-white/40 font-mono text-sm tracking-widest text-center px-4">AWAITING UPLOAD</span>
                    )}
                  </div>
                </div>
                <div className="absolute w-[200px] h-[200px] rounded-full border border-[#3b82f6]/40 border-dashed" style={{ animation: 'spin 20s linear infinite' }} />
                <div className="absolute w-[230px] h-[230px] rounded-full border border-[#0ff]/20" />
              </div>

              {/* Name & Role Text */}
              <div className="flex flex-col items-center justify-center z-10 px-4 mt-2 min-h-[50px] w-full box-border">
                {safeName ? (
                  <h2 
                    className={`font-sora font-bold text-white uppercase tracking-wider text-center leading-[1.2] w-full drop-shadow-md overflow-wrap-anywhere`}
                    style={{ fontSize: safeName.length <= 12 ? '32px' : safeName.length <= 18 ? '26px' : '22px' }}
                  >
                    {safeName}
                  </h2>
                ) : (
                  <div className="h-[38px]"></div>
                )}
                
                {safeRole ? (
                  <div className="mt-3 px-6 py-1.5 rounded-lg border border-[#3b82f6] bg-[#3b82f6]/10 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-sm">
                    <span className="text-white font-mono text-sm tracking-widest uppercase font-bold">
                      &lt; {safeRole} /&gt;
                    </span>
                  </div>
                ) : (
                  <div className="h-[34px] mt-3"></div>
                )}
              </div>

              {/* Footer Details: Date, Location, and QR Code */}
              <div className="flex justify-between items-end mt-6 mb-8 z-10 px-8 w-full box-border">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border border-[#3b82f6]/50 flex items-center justify-center bg-[#3b82f6]/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#0ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#3b82f6] text-[9px] font-bold tracking-widest mb-0.5">DATE</p>
                      <p className="text-white text-[11px] font-medium tracking-wide">21 JULY, 2026</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border border-[#3b82f6]/50 flex items-center justify-center bg-[#3b82f6]/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#0ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#3b82f6] text-[9px] font-bold tracking-widest mb-0.5">LOCATION</p>
                      <p className="text-white text-[11px] font-medium tracking-wide">GANDHINAGAR, IN</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-1.5 rounded-lg border-2 border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <QRCode 
                    value="https://forms.gle/Ucu9KrsA27EXH1X67" 
                    size={64} 
                    level="Q"
                  />
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
