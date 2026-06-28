import { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import QRCode from 'react-qr-code';

export default function IdCardGenerator() {
  const [name, setName] = useState('Rudra Patel');
  const [regNo, setRegNo] = useState('AI-10101');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [tierType, setTierType] = useState('IEEE Student');
  const [tierPrice, setTierPrice] = useState('150');

  const cardRef = useRef(null);

  const safeName = (name || '').trim().slice(0, 40) || 'Your Name';
  const safeRegNo = (regNo || '').trim().slice(0, 20) || 'AI-0001';
  const safeRole = tierType || 'Participant';
  const safePrice = String(tierPrice || '0').trim();


  const download = async () => {
    if (!cardRef.current) return;
    try {
      setIsGenerating(true);
      setError('');

      // We use htmlToImage to convert the DOM node to a PNG data URL
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3, // High resolution for professional print-ready quality
        skipFonts: false,
      });

      const link = document.createElement('a');
      link.download = `AI-Conclave-3.0-ID-${safeRegNo}-${safeRole.replace(/\s+/g, '-').toUpperCase()}-RS-${safePrice}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      setError('Could not generate image. Please try again.');
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="t-card rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden">

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 relative z-10">

          {/* Form Section */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-sora font-extrabold text-[24px] sm:text-[28px] text-white mb-3">
              Badge Generator
            </h2>
            <p className="text-white/60 text-[14px] sm:text-[15px] mb-8 leading-relaxed max-w-md">
              Fill in your registration details below to generate a real-time downloadable pass for AI Conclave 3.0.
            </p>

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
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#0A1325]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating PNG...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Badge
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="flex-1 flex flex-col items-center justify-center pt-8 lg:pt-0">
            <div className="relative">

              {/* Outer decorative frame for preview */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] blur-xl opacity-50" />

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


                {/* Middle Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                  {/* Subtle Background Elements */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-accent/10 rounded-full blur-[40px]" />
                    <div className="absolute bottom-[20%] right-[10%] w-32 h-32 bg-accent2/10 rounded-full blur-[40px]" />
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

            <p className="text-white/40 text-[12px] font-medium mt-8 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Live preview matches final download
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
