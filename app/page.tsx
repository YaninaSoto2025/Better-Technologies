"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';



const team = [
  {
    name: "Diego Vargas",
    role: "Founder & Head of Project",
    desc: "The mind behind the 72h framework. Diego built Better Technologies from a conviction: that real innovation doesn't need a million-dollar budget — it needs relentless execution. He leads the vision, the team, and every sprint from day one.",
    initials: "DV",
    photo: "/team/diego.jpg",      
    linkedin: "https://www.linkedin.com/in/diegoe-vargas/",
  },
  {
    name: "Charlotte Götz",
    role: "Head of Marketing",
    desc: "Charlotte turns bold ideas into market movements. With a sharp eye for positioning and a data-driven approach to growth, she ensures every product we build doesn't just work — it gets noticed, adopted, and remembered.",
    initials: "CG",
    photo: "/charlotte.jpeg",   
    linkedin: "https://www.linkedin.com/in/charlotte-goetz-public/",
  },
  {
    name: "Ezequiel Alonso",
    role: "Founder Backend Developer",
    desc: "Ezequiel is the engine room of every product we ship. He architects scalable, production-ready systems at startup speed — writing clean, fast, reliable code that makes the impossible 72h timelines actually possible.",
    initials: "EA",
    photo: "/team/ezequiel.jpg",    
    linkedin: "https://linkedin.com/",
  },
  {
    name: "Victor Menendez",
    role: "Founder Frontend Developer",
    desc: "Victor is the one who makes it beautiful and fast. He crafts interfaces that feel inevitable — intuitive, polished, and ready for real users from the very first sprint. He doesn't just build UIs, he builds experiences.",
    initials: "VM",
    photo: "/team/victor.jpg",      
    linkedin: "https://www.linkedin.com/in/demenezesvictor/",
  },
  {
    name: "Yanina Soto",
    role: "Founder Data Scientist",
    desc: "Yanina speaks the language of data fluently — and translates it into decisions that matter. She extracts signal from noise, builds intelligence layers into every product, and ensures that what we ship isn't just functional — it's smart.",
    initials: "YS",
    photo: "/team/yanina.jpg",      
    linkedin: "https://www.linkedin.com/in/yanina-soto/",
  },
];

// LINKEDIN ICON 
const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#0A66C2" />
    <path
      d="M7 9H5v10h2V9zm-1-1.5A1.25 1.25 0 1 0 6 5a1.25 1.25 0 0 0 0 2.5zM19 13.2c0-2.3-1.1-4.2-3.3-4.2a3.2 3.2 0 0 0-2.7 1.4V9H11v10h2v-5.4c0-1.4.7-2.3 1.9-2.3 1.1 0 1.6.8 1.6 2.2V19h2v-5.8z"
      fill="#fff"
    />
  </svg>
);

//  AVATAR 
const Avatar = ({ member }: { member: (typeof team)[0] }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 flex-shrink-0 bg-blue-50 flex items-center justify-center">
      {!imgError ? (
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="64px"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-blue-600 font-black text-lg">{member.initials}</span>
      )}
    </div>
  );
};

//  ABOUT SECTION 

// --- NEWS SECTION COMPONENT ---
const NewsSection = () => {
  
  const [loading, setLoading] = React.useState(true);
  const [articles, setArticles] = React.useState<any[]>([]);

  React.useEffect(() => {
  const fetchNews = async () => {
    try {
      // Ahora llamamos a nuestra propia ruta interna
      const response = await fetch('/api/news');
      const data = await response.json();

      if (data.articles && data.articles.length > 0) {
        const bbc = data.articles.find((a: any) => a.source.name.toLowerCase().includes('bbc'));
        const cnn = data.articles.find((a: any) => a.source.name.toLowerCase().includes('cnn'));
        const reuters = data.articles.find((a: any) => a.source.name.toLowerCase().includes('reuters'));

        let selection = [bbc, cnn, reuters].filter(Boolean);

        if (selection.length < 3) {
          const fillers = data.articles.filter((a: any) => !selection.includes(a));
          selection = [...selection, ...fillers].slice(0, 3);
        }

        setArticles(selection);
      }
    } catch (error) {
      console.error("Error local fetch:", error);
    } finally {
      setLoading(false);
    }
  };

    fetchNews();
  }, []);
   

  if (loading) return <div className="py-20 text-center text-slate-400 uppercase tracking-widest text-[10px] font-bold">Loading Intelligence Feed...</div>;

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
          
          {/* 1. Espaciador para centrar en Desktop */}
          <div className="hidden md:block w-48"></div>

          {/* 2. Títulos centrados */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="mt-8 inline-flex flex-col items-center">
              <p className="text-slate-400 uppercase tracking-[0.2em] text-[10px] mb-2 font-bold">Real Time Certainty (RTC)</p>
              <p className="text-3xl font-light border-b-2 border-blue-600 pb-2 text-slate-900 uppercase">Our kitchen is always open.</p>
            </div>
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mt-6 mb-4 block italic">Global Intelligence Feed</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Stay ahead of the <br /> <span className="text-blue-600 italic underline decoration-slate-200">Evolution.</span>
            </h2>
          </div>

          {/* 3. Live Updates a la derecha en Desktop */}
          <div className="text-center md:text-right md:w-48">
            <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Live updates // April 2026</p>
            <div className="flex gap-2 justify-center md:justify-end mt-2 items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-900 uppercase">System Active</span>
            </div>
          </div>
        </div>

        {/* 4. Grid de noticias  */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full min-h-[100px] clear-both relative z-20">          {articles.map((article: any, index: number) => (
            <motion.a
  key={index}
  href={article.url}
  target="_blank"
  rel="noopener noreferrer"
  
  className="group border border-slate-100 rounded-3xl overflow-hidden hover:border-blue-600/30 hover:shadow-2xl transition-all duration-500 bg-white flex flex-col"
>
  {/* IMAGEN DE LA NOTICIA */}
  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
    {article.urlToImage ? (
      <img 
        src={article.urlToImage} 
        alt={article.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-slate-200">
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">No Preview Available</span>
      </div>
    )}
    <div className="absolute top-4 left-4">
      <span className="text-[9px] font-black text-white bg-blue-600 px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
        {article.source.name}
      </span>
    </div>
  </div>

  {/* CONTENIDO DE LA NOTICIA */}
  <div className="p-8 flex-1 flex flex-col justify-between">
    <div>
      <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
        {article.title}
      </h3>
      <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2 font-medium">
        {article.description || "Click to read the full coverage of this digital transformation update."}
      </p>
    </div>
    
    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
      <span className="text-[10px] font-bold uppercase text-slate-400">
        {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
      <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">Read →</span>
    </div>
  </div>
</motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- CHAT SECTION COMPONENT ---
const ChatSection = () => {
  const [step, setStep] = useState<number>(1);
  const [selection, setSelection] = useState<string>("");

  const options = [
    "Scale my Business",
    "Data Intelligence",
    "Frontend Development",
    "Custom MVP",
    "Consultancy"
  ];

  const handleWhatsApp = (option: string) => {
    const phoneNumber = "593995269974";
    const message = encodeURIComponent(`Hi! I'm interested in ${option}. I'd like to talk to the team about a new project.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleSelect = (e: React.MouseEvent<HTMLButtonElement>, opt: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelection(opt);
    setStep(2);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setStep(1);
  };

  const handleConnect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleWhatsApp(selection);
  };

  return (
    <section className="w-full py-24 bg-[#f8f9fa] border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12 text-center">
          <span className="text-blue-600 text-sm font-mono tracking-widest uppercase mb-3 block">
            Start your 72h validation
          </span>
          <span className="text-red-600 text-sm font-mono tracking-widest uppercase mb-3 block">
  &quot;We were told the future would be built somewhere else. We chose to prove them wrong!&quot;
</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
  Let&apos;s build the future.<span className="text-blue-600 font-black italic">Today.</span>
</h2>
        </div>

        <div className="relative bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl transition-all hover:border-blue-600/30">

          {step === 1 && (
            <div>
              <p className="text-xl text-slate-600 mb-8 font-light">
                How can <span className="text-slate-900 font-semibold underline decoration-blue-600 underline-offset-4">the team</span> help you today?
              </p>
              <div className="flex flex-col gap-3">
                {options.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={(e) => handleSelect(e, opt)}
                    className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-900 text-sm font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all touch-manipulation"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-4">
              <p className="text-xl md:text-2xl text-slate-900 mb-8 font-medium leading-tight">
                Great! Connecting you with our specialists regarding <br />
                <span className="text-blue-600 font-black block mt-2 text-2xl uppercase tracking-tighter">
                  {selection}
                </span>
              </p>
              <button
                type="button"
                onClick={(e) => handleConnect(e)}
                className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-full font-black text-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest shadow-xl shadow-blue-600/20 touch-manipulation"
              >
                Connect with the team
              </button>
              <button
                type="button"
                onClick={(e) => handleBack(e)}
                className="block mx-auto mt-8 text-slate-400 hover:text-blue-600 text-xs uppercase font-bold tracking-widest transition-colors touch-manipulation"
              >
                ← Go back
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

// --- MAIN HOME COMPONENT ---
export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
const [selected, setSelected] = useState<number | null>(null); 

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  
  const menuItems = [
    { name: "Home", href: "#top" },
    { name: "What we are", href: "#what-we-are" },
    { name: "Mittelstand", href: "#mittelstand" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <main className="relative w-full min-h-screen bg-white" id="top">

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-24 py-5 z-[50] backdrop-blur-md bg-black/90 border-b border-white/10">
        <div className="relative w-[120px] md:w-[140px] h-[35px] md:h-[40px] flex items-center justify-start">
          <Image src="/logo.png" alt="Logo" fill sizes="(max-width: 768px) 120px, 140px" className="object-contain" priority />
        </div>

        <nav className="hidden md:flex gap-8 text-white font-black uppercase text-xs tracking-widest">
          {menuItems.map((item) => (
            <a key={item.name} href={item.href} className="hover:text-blue-600 transition-colors">{item.name}</a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative z-[60] flex flex-col gap-1.5 p-4"
        >
          <div className={`w-7 h-0.5 bg-white transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}></div>
          <div className={`w-7 h-0.5 bg-white transition-all ${isOpen ? "opacity-0" : ""}`}></div>
          <div className={`w-7 h-0.5 bg-white transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/50 backdrop-brightness-110"></div>
        </div>

        <div className="relative z-10 px-6 mt-20">
          <p className="text-blue-600 uppercase tracking-[0.4em] mb-6 text-xs font-black">Find a way to do better</p>
          <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter max-w-5xl text-slate-900">
            Build and validate <br /> businesses in 72 hours
          </h1>
          <p className="mt-10 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Evolution comes from finding a way to do better. <br />
            <span className="text-slate-900 font-bold">We build the world of tomorrow, today.</span>
          </p>
          <a href="#pricing" className="mt-12 inline-block">
            <button type="button" className="px-10 py-4 bg-black text-white rounded-full font-bold hover:bg-blue-600 transition-all shadow-2xl shadow-black/20 uppercase tracking-widest">
              72h Challenge
            </button>
          </a>
        </div>
      </section>

      {/* WHAT WE ARE */}
<section id="what-we-are" className="py-20 px-6 text-center bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto">
          <h2 className="text-blue-600 uppercase tracking-widest text-xs font-bold mb-8">What we are</h2>
          <p className="text-4xl md:text-6xl font-bold max-w-5xl mx-auto leading-tight tracking-tight text-slate-800 italic">
            "We are a Public Venture Lab. <br /> We build and validate businesses in public."
          </p>
          
        </div>
      </section>

     {/* ---  FEED DE NOTICIAS  --- */}
      <NewsSection />

      {/* TARGET CLIENT: MITTELSTAND */}
      <section id="mittelstand" className="py-40 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-slate-900 leading-[1.1] tracking-tighter">
              Our Customer: <br />
              <span className="text-blue-600">Mittelstand</span>
            </h2>

            <ul className="space-y-6 text-xl text-slate-600 font-medium mb-10">
              <li className="flex items-center gap-4">
                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                50-500 employees
              </li>
              <li className="flex items-center gap-4">
                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                Solid revenues & Traditional business
              </li>
              <li className="flex items-center gap-4">
                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                Dynamic markets
              </li>
            </ul>

            <h3 className="text-sm text-slate-400 italic font-normal tracking-wide">
              Example: industrial manufacturers, retail, logistics, services.
            </h3>
          </div>

          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wider text-slate-900">
              The Problem we solve
            </h3>

            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              They know they need innovation, but don't know how — and believe they don't have the budget.
            </p>

            {/* Bloque de consultoras  */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <p className="text-base line-through decoration-red-600 decoration-2 font-bold italic text-slate-400">
                  BCG Digital Ventures
                </p>
              </div>
              <div className="flex items-center">
                <p className="text-base line-through decoration-red-600 decoration-2 font-bold italic text-slate-400">
                  McKinsey & Company
                </p>
              </div>
              <div className="flex items-center">
                <p className="text-base line-through decoration-red-600 decoration-2 font-bold italic text-slate-400">
                  Accenture
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100">
              <p className="text-sm font-bold italic text-slate-900 tracking-tight">
                Typical tickets: <span className="text-blue-600">€150k - €1M+</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-40 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-20 text-slate-900 uppercase tracking-tighter">
            What you <span className="text-blue-600">can</span> afford
          </h2>
          <div className="grid md:grid-cols-2 gap-12 text-left">
            <div className="group border-2 border-slate-100 p-12 rounded-3xl hover:border-blue-600 transition-all duration-500 bg-slate-50/50">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-bold text-slate-900 uppercase">72h Innovation Sprint</h3>
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black italic">€3k – €10k</span>
              </div>
              <ul className="space-y-4 text-slate-600">
                <li className="font-bold flex items-center gap-2"><span className="text-blue-600">→</span> Idea Validation : Problem + Solution</li>
                <li className="font-bold flex items-center gap-2"><span className="text-blue-600">→</span> Opportunity Validation</li>
                <li className="font-bold flex items-center gap-2"><span className="text-blue-600">→</span> Functional Prototype / Insight harvesting tool</li>
              </ul>
            </div>
            <div className="group border-2 border-slate-100 p-12 rounded-3xl hover:border-blue-600 transition-all duration-500 bg-slate-50/50 shadow-xl shadow-slate-100">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-bold text-slate-900 uppercase">8 week Speed process</h3>
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black italic">€30k – €120k</span>
              </div>
              <ul className="space-y-4 text-slate-600">
                <li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span> Solution engineering</li>
                <li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span> Functional MVP</li>
                <li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span> Beta testing ( with real users) </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

     {/* ABOUT US */}         
  
    <section id="about" className="py-24 px-6 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto">

        {/* Eyebrow */}
        <p className="text-blue-600 uppercase tracking-[0.25em] text-[10px] font-black mb-3">
          About our Team
        </p>

        {/* Main title */}
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase mb-6">
          High{" "}
          <em className="italic underline decoration-blue-100">Performance execution team</em>{" "}
          built in high 
          <br />
          pressure environments.
        </h2>

        {/* Quote block */}
        <div className="border-l-[3px] border-blue-600 pl-5 bg-slate-50 py-4 pr-5 rounded-r-2xl mb-8">
          <p className="text-slate-900 font-black italic text-sm leading-relaxed tracking-tight">
            &ldquo;We were told the future would be built somewhere else.
            <br />
            <span className="text-blue-600">We chose to prove them wrong.&rdquo;</span>
          </p>
        </div>

        {/* Profile card */}
        <AnimatePresence mode="wait">
          {selected !== null && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-5 border border-slate-100 rounded-3xl p-5 mb-6 hover:border-blue-600/30 transition-colors duration-300"
            >
              <Avatar member={team[selected]} />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-slate-900 font-black uppercase tracking-tight text-sm">
                      {team[selected].name}
                    </p>
                    <p className="text-blue-600 font-black uppercase tracking-[0.15em] text-[10px] mt-0.5 mb-2">
                      {team[selected].role}
                    </p>
                  </div>

                  {/* LinkedIn button */}
                  <a
                    href={team[selected].linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-slate-200 rounded-full px-3 py-1.5 hover:border-blue-600 hover:bg-blue-50 transition-all flex-shrink-0"
                  >
                    <LinkedInIcon />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">
                      LinkedIn
                    </span>
                  </a>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  {team[selected].desc}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pills */}
        <div className="flex flex-wrap gap-2">
          {team.map((member, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(selected === i ? null : i)}
              className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border-2 transition-all duration-200 active:scale-95
                ${selected === i
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-500 border-slate-200 hover:border-blue-600 hover:text-blue-600"
                }`}
            >
              {member.name.split(" ")[0]} {member.name.split(" ")[1]}
            </button>
          ))}
        </div>

      </div>
    </section>

      {/* CHAT SECTION INTEGRATION */}
      <ChatSection />

      {/* BLOG CTA SECTION */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
            Stay Updated with <span className="italic underline decoration-white decoration-2">Our Latest Insights</span>
          </h2>
          <p className="text-lg text-blue-100 mb-10 font-medium max-w-2xl mx-auto">
            Explore our blog for industry trends, tech updates, and innovation stories from the Better Technologies team.
          </p>
          <a href="/blog" className="inline-block">
            <button type="button" className="px-12 py-5 bg-white text-blue-600 rounded-full font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-2xl shadow-blue-900/30 text-lg hover:scale-105 active:scale-95">
              Read the Blog
            </button>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center border-t border-slate-100 bg-white">
        <div className="flex justify-center gap-8 mb-10 text-[11px] font-black uppercase tracking-[0.2em]">
          <a href="#" className="text-slate-900 hover:text-blue-600 transition-colors">LinkedIn</a>
          <a href="#" className="text-slate-900 hover:text-blue-600 transition-colors">Instagram</a>
        </div>
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Better Technologies. All rights reserved.
        </p>
      </footer>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[155] flex flex-col items-center justify-center"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-6 flex flex-col gap-1.5 p-4"
            >
              <div className="w-7 h-0.5 bg-white rotate-45 translate-y-2"></div>
              <div className="w-7 h-0.5 bg-white opacity-0"></div>
              <div className="w-7 h-0.5 bg-white -rotate-45 -translate-y-2"></div>
            </button>
            <nav className="flex flex-col gap-10 text-center">
              {menuItems.map((item) => (
                <a key={item.name} href={item.href} onClick={() => setIsOpen(false)}
                  className="text-white text-5xl font-black uppercase tracking-tighter active:text-blue-600">
                  {item.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}