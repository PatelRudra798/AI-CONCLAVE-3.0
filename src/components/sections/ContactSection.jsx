import SectionHeader from '../ui/SectionHeader';
import { CONTACT_ITEMS } from '../../data';

export default function ContactSection() {
 return (
 <section id="contact" className="relative z-10 section-pad" style={{ background: 'rgba(0,0,0,0.06)' }}>
 <div className="max-container text-center">
 <SectionHeader
 label="Get In Touch"
 title="Location"
 sub="Find us at Silver Oak University."
 />
 <a 
 href="https://maps.app.goo.gl/Fm6TAotg4mqjV6on8"
 target="_blank"
 rel="noreferrer"
 className="block w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-accent/20 h-[300px] sm:h-[400px] mb-8 relative group cursor-pointer"
 >
 <div className="absolute inset-0 bg-transparent z-10 pointer-events-auto"></div>
 <iframe 
 src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12706.870002403602!2d72.53896855217506!3d23.08870848251876!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e833af6f39347%3A0xf1db9065daea7008!2sSilver%20Oak%20University!5e0!3m2!1sen!2sin!4v1782798330098!5m2!1sen!2sin" 
 width="100%" 
 height="100%" 
 style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }} 
 allowFullScreen="" 
 loading="lazy" 
 referrerPolicy="strict-origin-when-cross-origin"
 className="w-full h-full pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity"
 ></iframe>
 </a>
 <p className="text-[11px] sm:text-[12px] t-muted px-4">
 Organised by IEEE Signal Processing Society Student Branch Chapter · Silver Oak University
 </p>
 </div>
 </section>
 );
}
