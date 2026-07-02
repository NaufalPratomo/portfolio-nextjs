import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Achievements from '@/components/Achievements';
import Contact from '@/components/Contact';
import '../app/globals.css';
import ScrollObserver from '@/components/ScrollObserver';
import OverlapSection from '@/components/OverlapSection';

export default function Home() {
  return (
    <div className="relative w-full">
      <Navbar />
      <div className="w-full relative">
        <ScrollObserver />
        <OverlapSection className="bg-gradient-to-br from-white to-sky-100 dark:from-slate-950 dark:to-slate-900" zIndex={10}>
          <Hero />
        </OverlapSection>
        <OverlapSection className="bg-white dark:bg-slate-950" zIndex={20}>
          <About />
        </OverlapSection>
        <OverlapSection className="bg-slate-50 dark:bg-slate-900" zIndex={30}>
          <Experience />
        </OverlapSection>
        <OverlapSection className="bg-white dark:bg-slate-950" zIndex={40}>
          <Skills />
        </OverlapSection>
        <OverlapSection className="bg-slate-50 dark:bg-slate-900" zIndex={50}>
          <Achievements />
        </OverlapSection>
        <OverlapSection className="bg-white dark:bg-slate-950" zIndex={60}>
          <Projects />
        </OverlapSection>
        <OverlapSection className="bg-gradient-to-tr from-sky-50 to-blue-100 dark:from-slate-950 dark:to-slate-900" zIndex={70}>
          <Contact />
        </OverlapSection>
      </div>
    </div>
  );
}