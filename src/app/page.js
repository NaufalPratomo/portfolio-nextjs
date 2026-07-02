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
        <div id="scroll-home" className="h-0 invisible" />
        <OverlapSection className="bg-gradient-to-br from-white to-sky-100 dark:from-slate-950 dark:to-slate-900" zIndex={10}>
          <Hero />
        </OverlapSection>
        
        <div id="scroll-about" className="h-0 invisible" />
        <OverlapSection className="bg-white dark:bg-slate-950" zIndex={20}>
          <About />
        </OverlapSection>
        
        <div id="scroll-experience" className="h-0 invisible" />
        <OverlapSection className="bg-slate-50 dark:bg-slate-900" zIndex={30}>
          <Experience />
        </OverlapSection>
        
        <div id="scroll-skills" className="h-0 invisible" />
        <OverlapSection className="bg-white dark:bg-slate-950" zIndex={40}>
          <Skills />
        </OverlapSection>
        
        <div id="scroll-achievements" className="h-0 invisible" />
        <OverlapSection className="bg-slate-50 dark:bg-slate-900" zIndex={50}>
          <Achievements />
        </OverlapSection>
        
        <div id="scroll-projects" className="h-0 invisible" />
        <OverlapSection className="bg-white dark:bg-slate-950" zIndex={60}>
          <Projects />
        </OverlapSection>
        
        <div id="scroll-contact" className="h-0 invisible" />
        <OverlapSection className="bg-gradient-to-tr from-sky-50 to-blue-100 dark:from-slate-950 dark:to-slate-900" zIndex={70}>
          <Contact />
        </OverlapSection>
      </div>
    </div>
  );
}