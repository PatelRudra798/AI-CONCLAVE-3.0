import SectionHeader from './SectionHeader';
import { CONTACT_ITEMS } from '../data';

export default function ContactSection() {
  return (
    <section id="contact" className="relative z-10 section-pad" style={{ background: 'rgba(0,0,0,0.06)' }}>
      <div className="max-container text-center">
        <SectionHeader
          label="Get In Touch"
          title="Location"
          sub="Find us at Silver Oak University."
        />
        <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-accent/20 h-[300px] sm:h-[400px] mb-8">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.369842426002!2d72.53509831502446!3d23.08365288492211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8336336331dd%3A0xc6222b036573c38!2sSilver%20Oak%20University!5e0!3m2!1sen!2sin!4v1689531863641!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <p className="text-[11px] sm:text-[12px] t-muted px-4">
          Organized by IEEE Signal Processing Society Student Branch Chapter · Silver Oak University
        </p>
      </div>
    </section>
  );
}
