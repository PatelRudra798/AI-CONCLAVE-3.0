import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import useTheme from './hooks/useTheme';
import useMouse from './hooks/useMouse';
import CursorGlow          from './components/CursorGlow';
import ParticleCanvas      from './components/ParticleCanvas';
import Navbar              from './components/Navbar';
import HeroSection         from './components/HeroSection';
import AboutSection        from './components/AboutSection';
import TopicsSection       from './components/TopicsSection';
import ScheduleSection     from './components/ScheduleSection';
import WorkshopsSection    from './components/WorkshopsSection';
import SpeakersSection     from './components/SpeakersSection';
import ActivitiesSection   from './components/ActivitiesSection';
import SponsorsSection     from './components/SponsorsSection';
import PastEventsSection   from './components/PastEventsSection';
import RegistrationSection from './components/RegistrationSection';
import FaqSection          from './components/FaqSection';
import ContactSection      from './components/ContactSection';
import Footer              from './components/Footer';
import IdCardGenerator     from './components/IdCardGenerator';
import BadgeGeneratorModal from './components/BadgeGeneratorModal';
import GalleryPage         from './components/GalleryPage';

const Divider = () => <div className="t-divider" />;

function Home({ mouseRef }) {
  return (
    <>
      <HeroSection />
      <Divider />
      <AboutSection mouseRef={mouseRef} />
      <Divider />
      <TopicsSection />
      <Divider />
      <ScheduleSection />
      <Divider />
      <WorkshopsSection />
      <SpeakersSection />
      <Divider />
      <ActivitiesSection />
      <Divider />
      <SponsorsSection />
      <Divider />
      <PastEventsSection />
      <Divider />
      <RegistrationSection />
      <Divider />
      <FaqSection />
      <Divider />
      <ContactSection />
    </>
  );
}

export default function App() {
  const { isDark, toggle } = useTheme();
  const mouseRef = useMouse();
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  return (
    <div className="t-bg min-h-screen">
      <CursorGlow />
      <ParticleCanvas isDark={isDark} />
      <Navbar isDark={isDark} onToggle={toggle} onOpenBadgeModal={() => setIsBadgeModalOpen(true)} />

      <Routes>
        <Route path="/" element={<Home mouseRef={mouseRef} />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>

      <Footer />

      <BadgeGeneratorModal isOpen={isBadgeModalOpen} onClose={() => setIsBadgeModalOpen(false)}>
        <IdCardGenerator />
      </BadgeGeneratorModal>
    </div>
  );
}
