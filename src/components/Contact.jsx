"use client";

import Link from 'next/link';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function Contact() {
  const contacts = [
    {
      title: 'Email',
      value: 'naufalpratomo8@gmail.com',
      href: 'mailto:naufalpratomo8@gmail.com',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      ),
    },
    {
      title: 'GitHub',
      value: 'NaufalPratomo',
      href: 'https://github.com/NaufalPratomo',
      icon: (
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      ),
      fill: true,
    },
    {
      title: 'LinkedIn',
      value: 'naufalpratomo',
      href: 'https://www.linkedin.com/in/naufalpratomo/',
      icon: (
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      ),
      fill: true,
    },
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  }, [isInView, controls, hasAnimated]);

  return (
    <section id="contact" className="relative min-h-screen flex items-center px-4 py-20 overflow-hidden bg-gradient-to-tr from-sky-50/70 to-blue-100/70 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <div ref={sectionRef} className="max-w-4xl mx-auto w-full text-center relative z-10">
        <motion.h2
          className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
        >
          Mari Terhubung & Berdiskusi
        </motion.h2>

        <motion.p
          className="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-xl mx-auto mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Tertarik mendiskusikan peluang kerja sama, rekrutmen, atau eksplorasi teknis seputar rekayasa perangkat lunak? Silakan hubungi saya langsung.
        </motion.p>

        <motion.div
          className="grid sm:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.2,
                staggerChildren: 0.15
              }
            }
          }}
          initial="hidden"
          animate={controls}
        >
          {contacts.map((contact) => (
            <motion.div
              key={contact.title}
              variants={{
                hidden: { y: 16, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Link
                href={contact.href}
                target={contact.href.startsWith('http') ? '_blank' : undefined}
                rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all focus-visible:rounded-2xl"
              >
                <div className="relative z-10">
                  <svg
                    className="mx-auto mb-4 text-blue-600 dark:text-sky-400"
                    width="36"
                    height="36"
                    fill={contact.fill ? 'currentColor' : 'none'}
                    stroke={contact.fill ? 'none' : 'currentColor'}
                    viewBox="0 0 24 24"
                  >
                    {contact.icon}
                  </svg>

                  <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">
                    {contact.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-sm break-all font-medium">{contact.value}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
