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

export default function Home() {
  return (
    <div className="relative w-full">
      <Navbar />
      <div className="w-full">
        <ScrollObserver />
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Achievements />
        <Projects />
        <Contact />
      </div>
    </div>
  );
}