import { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import QRCode from 'react-qr-code';

export default function IdCardGenerator() {
  // 1. No default values for name or role
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const cardRef = useRef(null);

  const safeName = (name || '').trim().slice(0, 25);
  const safeRole = role;

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

  const download = async () => {
    if (!cardRef.current) return;
    if (!safeName) {
      setError('Please enter your name before downloading.');
      return;
    }
    try {
      setIsGenerating(true);
      setError('');

      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
        skipFonts: false,
      });

      const link = document.createElement('a');
      link.download = `AI-Conclave-3.0-${safeName.replace(/\s+/g, '-').toUpperCase()}.png`;
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
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        
        {/* Left Side: Controls */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Step 1: Name */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-sora font-bold text-lg mb-4">1. Enter Your Name</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={25}
              className="w-full bg-[#040810] border border-white/10 text-white rounded-xl px-5 py-4 outline-none focus:border-accent focus:bg-accent/5 transition-all font-medium placeholder:text-white/20 uppercase"
              placeholder="e.g. JOHN DOE"
            />
          </div>

          {/* Step 2: Role */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-sora font-bold text-lg mb-4">2. Choose Template</h3>
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

          {/* Step 3: Photo */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-sora font-bold text-lg mb-4">3. Upload and Adjust</h3>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-8 hover:bg-white/5 hover:border-accent/50 transition-all cursor-pointer">
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

        {/* Right Side: Preview & Download */}
        <div className="flex-1 flex flex-col gap-6 lg:items-center">
          
          <h2 className="text-white font-sora font-bold text-2xl w-full text-center lg:text-left">Badge Preview</h2>

          {/* The Badge */}
          <div className="relative flex justify-center w-full">
            <div
              ref={cardRef}
              className="relative w-[360px] h-auto min-h-[600px] pb-8 overflow-hidden bg-[#02050A] font-sans flex flex-col border-2 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              style={{
                backgroundImage: `url(${new URL('../assets/badge-bg.png', import.meta.url).href})`,
                backgroundSize: 'cover',
                backgroundPosition: 'bottom center',
              }}
            >
              {/* Overlay for readability if needed, keeping it subtle */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#02050A]/40 via-transparent to-[#02050A]/80 pointer-events-none z-0" />

              {/* Globe (left) - Placeholder using CSS since image is missing from repo */}
              <div className="absolute left-[-40px] top-[150px] w-[200px] h-[200px] rounded-full border border-cyan-500/20 opacity-30 pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)' }}>
                <div className="absolute inset-4 rounded-full border border-cyan-400/10 border-dashed" style={{ animation: 'spin 30s linear infinite' }} />
              </div>

              {/* AI Head Illustration (right) - Placeholder using CSS */}
              <div className="absolute right-[-60px] top-[180px] w-[220px] h-[220px] opacity-20 pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(106,13,173,0.15) 0%, transparent 70%)' }}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] bg-contain bg-no-repeat bg-center" />
              </div>

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#3b82f6] m-4 z-10" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#3b82f6] m-4 z-10" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#3b82f6] m-4 z-10" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#3b82f6] m-4 z-10" />

              {/* Grid Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />

              {/* Logos Top - Inlined using Group 16.png */}
              <div className="pt-6 px-4 flex justify-center items-center z-10 w-full">
                <img 
                  src={new URL('../assets/icons/Group 16.png', import.meta.url).toString()} 
                  alt="Sponsors Logos" 
                  className="w-full h-auto object-contain max-h-8"
                />
              </div>

              {/* Title */}
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

              {/* Photo Area */}
              <div className="relative flex-1 flex items-center justify-center z-10 mt-4 mb-2">
                <div className="relative w-[180px] h-[180px] rounded-full flex items-center justify-center p-1" style={{ background: 'linear-gradient(45deg, #3b82f6, #0ff, #3b82f6)' }}>
                  <div className="w-full h-full rounded-full bg-[#02050A] flex items-center justify-center overflow-hidden border-[6px] border-[#02050A]">
                    {photo ? (
                      <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white/40 font-mono text-sm tracking-widest text-center px-4">AWAITING UPLOAD</span>
                    )}
                  </div>
                </div>
                {/* Decorative circles around photo */}
                <div className="absolute w-[200px] h-[200px] rounded-full border border-[#3b82f6]/40 border-dashed" style={{ animation: 'spin 20s linear infinite' }} />
                <div className="absolute w-[230px] h-[230px] rounded-full border border-[#0ff]/20" />
              </div>

              {/* Name & Role */}
              <div className="flex flex-col items-center justify-center z-10 px-4 mt-2 min-h-[50px]">
                {safeName ? (
                  <h2 className={`font-sora font-bold text-white uppercase tracking-wider text-center leading-[1.2] w-full drop-shadow-md ${
                    safeName.length <= 12 ? 'text-[32px]' : safeName.length <= 18 ? 'text-[26px]' : 'text-[22px]'
                  }`}>
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

              {/* Footer / Date, Location, and QR Code */}
              <div className="flex justify-between items-end mt-6 mb-8 z-10 px-8 w-full">
                
                {/* Left side: Date & Location stacked */}
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

                {/* Right side: QR Code */}
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

          {/* Download & Share Actions */}
          <div className="w-full max-w-[360px] flex flex-col gap-3 mt-2">
            <button
              onClick={download}
              disabled={isGenerating || (!safeName)}
              className="w-full bg-[#10b981] hover:bg-[#059669] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            
            <button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy to Clipboard
            </button>
            
            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-2 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Badge
            </button>

            <div className="flex gap-3">
              <button className="flex-1 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/40 text-[#1DA1F2] border border-[#1DA1F2]/30 font-bold py-2 rounded-xl transition-all text-sm">
                Twitter
              </button>
              <button className="flex-1 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/40 text-[#0A66C2] border border-[#0A66C2]/30 font-bold py-2 rounded-xl transition-all text-sm">
                LinkedIn
              </button>
              <button className="flex-1 bg-[#1877F2]/20 hover:bg-[#1877F2]/40 text-[#1877F2] border border-[#1877F2]/30 font-bold py-2 rounded-xl transition-all text-sm">
                Facebook
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
