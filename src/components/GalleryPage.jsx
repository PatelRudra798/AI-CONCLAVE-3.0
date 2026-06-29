export default function GalleryPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative z-10 pt-24 pb-12">
      <h1 className="text-[40px] sm:text-[60px] font-sora font-black text-white mb-4 uppercase tracking-wider" style={{ textShadow: '2px 0 #0ff, -2px 0 #3b82f6' }}>
        Gallery
      </h1>
      <div className="mt-6 px-8 py-3 rounded-xl border border-accent bg-accent/10 shadow-[0_0_20px_rgba(57,255,143,0.15)] inline-block">
        <p className="text-accent text-[18px] sm:text-[22px] font-mono tracking-[4px] uppercase font-bold">
          &lt; Coming Soon /&gt;
        </p>
      </div>
    </div>
  );
}
