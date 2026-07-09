import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import useTheme from './hooks/useTheme';
import useMouse from './hooks/useMouse';

// Layout
import CursorGlow from './components/layout/CursorGlow';
import ParticleCanvas from './components/layout/ParticleCanvas';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Sections
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import TopicsSection from './components/sections/TopicsSection';
import ScheduleSection from './components/sections/ScheduleSection';
import WorkshopsSection from './components/sections/WorkshopsSection';
import SpeakersSection from './components/sections/SpeakersSection';
import ActivitiesSection from './components/sections/ActivitiesSection';
import SponsorsSection from './components/sections/SponsorsSection';
import PastEventsSection from './components/sections/PastEventsSection';
import RegistrationSection from './components/sections/RegistrationSection';
import FaqSection from './components/sections/FaqSection';
import GalleryPage from './components/sections/GalleryPage';

// Badge Feature
import IdCardGenerator from './components/badge/IdCardGenerator';
import BadgeGeneratorModal from './components/badge/BadgeGeneratorModal';

const Divider = () => <div className="t-divider" />;

function Home({ mouseRef, onOpenBadgeModal }) {
 return (
 <>
 <HeroSection onOpenBadgeModal={onOpenBadgeModal} />
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
 </>
 );
}

export default function App() {
 const { isDark } = useTheme();
 const mouseRef = useMouse();
 const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

 return (
 <div className="t-bg min-h-screen">
 <CursorGlow />
 <ParticleCanvas isDark={isDark} />
 <Navbar onOpenBadgeModal={() => setIsBadgeModalOpen(true)} />

 <Routes>
 <Route path="/" element={<Home mouseRef={mouseRef} onOpenBadgeModal={() => setIsBadgeModalOpen(true)} />} />
 <Route path="/gallery" element={<GalleryPage />} />
 </Routes>

 <Footer />

 <BadgeGeneratorModal isOpen={isBadgeModalOpen} onClose={() => setIsBadgeModalOpen(false)}>
 <IdCardGenerator onClose={() => setIsBadgeModalOpen(false)} />
 </BadgeGeneratorModal>
 </div>
 );
}
