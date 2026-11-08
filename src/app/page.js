import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Achievements from '@/components/Achievements';
import CopyrightSection from '@/components/CopyrightSection';
import Contact from '@/components/Contact';

// Projects come right after About: they are the strongest evidence, so they should not sit below five other sections.
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Achievements />
      <CopyrightSection />
      <Contact />
    </>
  );
}
