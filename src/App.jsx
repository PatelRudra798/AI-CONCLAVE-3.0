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
import RegistrationSection from './components/RegistrationSection';
import FaqSection          from './components/FaqSection';
import ContactSection      from './components/ContactSection';
import Footer              from './components/Footer';

const Divider = () => <div className="t-divider" />;

export default function App() {
  const { isDark, toggle } = useTheme();
  const mouseRef = useMouse();

  return (
    <div className="t-bg min-h-screen">
      <CursorGlow />
      <ParticleCanvas isDark={isDark} />
      <Navbar isDark={isDark} onToggle={toggle} />

      <HeroSection />
      <Divider />
      <AboutSection mouseRef={mouseRef} />
      <Divider />
      <TopicsSection />
      <Divider />
      <ScheduleSection />
      <Divider />
      <WorkshopsSection />
      <Divider />
      <SpeakersSection />
      <Divider />
      <ActivitiesSection />
      <Divider />
      <SponsorsSection />
      <Divider />
      <RegistrationSection />
      <Divider />
      <FaqSection />
      <Divider />
      <ContactSection />
      <Footer />
    </div>
  );
}
