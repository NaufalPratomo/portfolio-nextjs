import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import '../app/globals.css';
import ScrollObserver from '@/components/ScrollObserver';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="scroll-snap-y">
        <ScrollObserver />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
}