"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ShieldCheck, Zap, Clock, Headset, DollarSign, Trophy, Menu, X, ArrowRight, ArrowLeft, CheckCircle, Rocket, Swords, Star, Send, Instagram, MessageCircle, Quote, Mail, Phone, MapPin, Linkedin, Github, Disc } from 'lucide-react';

// --- DEFINISI TIPE DATA (TYPESCRIPT) ---

type GameKey = 'genshin' | 'hsr';

interface PortfolioItem {
    image: string;
    title: string;
    desc: string;
}

interface ServicePlan {
    popular: boolean;
    title: string;
    description: string;
    price: string;
    per?: string;
    features: string[];
    serviceKey: string;
}

interface FormData {
    name: string;
    game: GameKey | '';
    service: string;
    uid: string;
    server: string;
    whatsapp: string;
    notes: string;
}

interface SelectedImage {
    id: string;
    src: string;
    alt: string;
}

// --- DATA OBJEK (Untuk konten dinamis agar mudah diubah) ---

const navLinks: string[] = ["Beranda", "Layanan", "Harga", "Portofolio", "Testimoni", "Pesan"];

const features = [
  { icon: <ShieldCheck className="w-8 h-8 text-white" />, title: "Aman & Terpercaya", text: "Akun Anda aman bersama kami. Tidak menggunakan cheat atau software ilegal." },
  { icon: <Zap className="w-8 h-8 text-white" />, title: "Cepat & Efisien", text: "Pengerjaan cepat dengan tim profesional yang sangat berpengalaman." },
  { icon: <Clock className="w-8 h-8 text-white" />, title: "Jam Operasional", text: "Senin - Minggu, pukul 09:00 - 22:00 WIB." },
  { icon: <Headset className="w-8 h-8 text-white" />, title: "Dukungan Penuh", text: "Layanan pelanggan siap membantu kapan saja melalui kontak yang tersedia." },
  { icon: <DollarSign className="w-8 h-8 text-white" />, title: "Harga Kompetitif", text: "Dapatkan layanan terbaik dengan harga yang bersaing dan transparan." },
  { icon: <Trophy className="w-8 h-8 text-white" />, title: "Hasil Maksimal", text: "Kami memastikan target Anda tercapai dengan hasil yang sangat memuaskan." },
];

const services: Record<GameKey, { name: string; icon: React.ReactNode; list: string[]; images: string[] }> = {
  genshin: {
    name: "Genshin Impact",
    icon: <Swords className="inline-block mr-2" />,
    list: ["Spiral Abyss 36 Stars", "Eksplorasi 100%", "Daily Commissions", "Boss & Artifact Farming", "Semua Jenis Quest"],
    images: [
      "/portfolio/Genshin-Imaginarium-Theater-Clear-1.png",
      "/portfolio/Genshin-Abyss-Clear-2.jpg",
      "/portfolio/Genshin-Eksplorasi-Natlan-5.0.png",
      "/portfolio/Genshin-Stygian-Onslaught-Clear&Party-1.png",
    ],
  },
  hsr: {
    name: "Honkai: Star Rail",
    icon: <Rocket className="inline-block mr-2" />,
    list: ["Simulated Universe", "Relic Farming", "Trailblaze Mission", "Weekly Boss", "Forgotten Hall"],
    images: [
      "/portfolio/HSR-Divergent-Universe-1.png",
      "/portfolio/HSR-Pure-Fiction-Party-1.png",
      "/portfolio/HSR-Build-Char-2.png",
      "/portfolio/HSR-Forgotten-Hall-Clear-Party-2.png",
    ],
  },
};

const pricing: Record<GameKey, ServicePlan[]> = {
    genshin: [
        { 
            popular: true, 
            title: "Paket Harian", 
            description: "Jaga progres akunmu setiap hari tanpa repot.",
            price: "Rp150.000", 
            per: "/bulan", 
            features: ["Selesaikan Daily Commission", "Habiskan 160 Resin", "Klaim Battle Pass EXP", "Laporan Harian via Screenshot"], 
            serviceKey: 'paket-harian' 
        },
        { 
            popular: true, 
            title: "Endgame Finisher",
            description: "Taklukkan tantangan tersulit dan raih semua hadiahnya.", 
            price: "Rp50.000", 
            per: "/reset", 
            features: ["Spiral Abyss Floor 9-12 (36 Bintang)", "Analisis tim & saran build", "Dijoki oleh pemain berpengalaman", "Proses Cepat < 2 Jam"], 
            serviceKey: 'spiral-abyss' 
        },
        { 
            popular: false, 
            title: "Sang Penjelajah", 
            description: "Buka semua misteri Teyvat dengan eksplorasi 100%.",
            price: "Mulai 100rb", 
            per: "/region", 
            features: ["Eksplorasi 100% per Region", "Semua Teleport Waypoint & Patung", "Semua Oculus/Sigil", "Quest Dunia terkait area"], 
            serviceKey: 'eksplorasi' 
        },
        { 
            popular: false, 
            title: "Raja Grinding", 
            description: "Farming material dan artifact tanpa henti untuk karakter impian.",
            price: "Rp50.000", 
            per: "/sesi", 
            features: ["Farming Artifact (20x run)", "Farming Boss Material Karakter", "Farming Boss Mingguan", "Bebas pilih domain/boss"], 
            serviceKey: 'grinding' 
        },
    ],
    hsr: [
        { 
            popular: true, 
            title: "Weekly Conqueror", 
            description: "Selesaikan semua konten mingguan dan maksimalkan hadiah.",
            price: "Rp75.000", 
            per: "/minggu", 
            features: ["Simulated Universe (Skor Maks)", "Echo of War (3x run)", "Pembersihan Peta & Misi Harian", "Laporan progres lengkap"], 
            serviceKey: 'weekly-conqueror' 
        },
        { 
            popular: true, 
            title: "Relic Hunter",
            description: "Dapatkan set relic sempurna dengan stat dewa.", 
            price: "Rp60.000", 
            per: "/10 run", 
            features: ["Farming di Cavern of Corrosion", "Bebas pilih set relic", "Filter & sisakan relic potensial", "Screenshot hasil drop terbaik"], 
            serviceKey: 'relic-hunter' 
        },
        { 
            popular: false, 
            title: "Pionir Cerita",
            description: "Nikmati alur cerita utama tanpa grinding yang melelahkan.", 
            price: "Hubungi Admin", 
            features: ["Selesaikan Misi Trailblaze terbaru", "Termasuk misi sampingan terkait", "Semua hadiah misi dijamin aman", "Progres cepat dan efisien"], 
            serviceKey: 'trailblaze-mission' 
        },
         { 
            popular: false, 
            title: "Memory Master",
            description: "Tembus lantai tertinggi Forgotten Hall & Pure Fiction.", 
            price: "Mulai 50rb", 
            per: "/lantai", 
            features: ["Forgotten Hall (Memory of Chaos)", "Pure Fiction (Skor Maks)", "Saran tim & strategi", "Hadiah Bintang Penuh"], 
            serviceKey: 'memory-master' 
        },
    ]
};

const portfolio: Record<GameKey, PortfolioItem[]> = {
    genshin: [
        { image: "/portfolio/Genshin-Abyss-Clear-1.jpg", title: "Spiral Abyss 36★", desc: "Clear full stars dengan waktu yang cepat." },
        { image: "/portfolio/Genshin-Abyss-Party-1.png", title: "Team Composition", desc: "Tim yang digunakan untuk clear Abyss." },
        { image: "/portfolio/Genshin-Artifact-Drop-1.jpg", title: "Artifact Farming", desc: "Hasil farm artifact dengan stat bagus." },
        { image: "/portfolio/Genshin-Eksplorasi-Natlan-5.5.png", title: "Eksplorasi Natlan", desc: "Menyelesaikan eksplorasi hingga 100%." },
        { image: "/portfolio/Genshin-Stygian-Onslaught-Clear&Party-2.png", title: "Event Stygian Onslaught", desc: "Menyelesaikan event dengan skor maksimal." },
        { image: "/portfolio/Genshin-Imaginarium-Theater-Clear-1.png", title: "Imaginarium Theater", desc: "Clear panggung teater terbaru." },
    ],
    hsr: [
        { image: "/portfolio/HSR-Forgotten-Hall-Clear-1.jpg", title: "Forgotten Hall", desc: "Clear World 6 dengan full rewards." },
        { image: "/portfolio/HSR-Apocalyptic-Shadow-party-1.png", title: "Apocalyptic Shadow Team", desc: "Komposisi tim untuk Apocalyptic Shadow." },
        { image: "/portfolio/HSR-Farm-Relic-2.png", title: "Relic Farming", desc: "Hasil farm relic dengan stat bagus." },
        { image: "/portfolio/HSR-Build-Char-1.png", title: "Character Build", desc: "Contoh build karakter yang optimal." },
        { image: "/portfolio/HSR-Pure-Fiction-Clear-1.png", title: "Pure Fiction", desc: "Menyelesaikan Pure Fiction dengan skor tinggi." },
        { image: "/portfolio/HSR-Divergent-Universe-1.png", title: "Divergent Universe", desc: "Menaklukkan tantangan Divergent Universe." },
    ]
};

const testimonials = [
  { name: "Rizky", game: "Genshin Impact", text: "Joki Spiral Abyss 36 stars cepat banget! Hanya 2 jam sudah selesai. Recommended banget buat yang mau clear Abyss tapi ga punya waktu.", rating: 5 },
  { name: "Sarah", game: "Honkai: Star Rail", text: "Relic farmingnya dapat yang bagus-bagus. Akun aman dan selalu dikasih update. Gak nyesel pake jasa disini, harganya juga terjangkau.", rating: 5 },
  { name: "Andi", game: "Genshin Impact", text: "Order joki AR leveling dari 45 ke 50. Cepet banget selesainya, cuma 3 hari. Supportnya responsif banget, tanya apa aja dijawab dengan jelas.", rating: 4.5 },
  { name: "Dewi", game: "Honkai: Star Rail", text: "Pesan joki Simulated Universe World 6. Ga nyangka bisa clear dengan karakter yang saya punya. Penjelasannya detail, pokoknya worth it!", rating: 5 },
];

// --- VARIAN ANIMASI Framer Motion ---

const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "circOut" } }
};

// --- KOMPONEN-KOMPONEN ---
// Komponen Modal Gambar Zoom
const ImageModal = ({ selectedImage, onClose }: { selectedImage: SelectedImage | null; onClose: () => void }) => (
    <AnimatePresence>
        {selectedImage && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            >
                <motion.div
                    layoutId={selectedImage.id}
                    onClick={(e) => e.stopPropagation()}
                    className="relative max-w-4xl max-h-[90vh] w-full"
                >
                    <img src={selectedImage.src} alt={selectedImage.alt} className="w-full h-auto object-contain rounded-lg shadow-2xl"/>
                </motion.div>
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={onClose}
                    className="absolute top-4 left-4 text-white bg-black/50 rounded-full p-2"
                >
                    <ArrowLeft size={24} />
                </motion.button>
            </motion.div>
        )}
    </AnimatePresence>
);

// Komponen Header/Navigasi
const Header = ({ activeSection, setActiveSection }: { activeSection: string, setActiveSection: (section: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(sectionId);
        setIsOpen(false);
    };

    if (!isClient) {
        return null;
    }

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-lg z-50 border-b border-slate-800">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <a href="#" onClick={() => scrollToSection('Beranda')} className="flex items-center gap-3 text-2xl font-heading font-bold tracking-wider">
                    <img src="/logo/Logo-4-cut.png" alt="Shiraori Joki Pro Logo" className="h-12 w-12" />
                    <div>
                        <span className="text-sky-400">Shiraori</span>
                        <span className="text-slate-200">Joki</span>
                        <span className="text-fuchsia-500">Pro</span>
                    </div>
                </a>
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <a key={link} href={`#${link.toLowerCase()}`} onClick={() => scrollToSection(link)}
                           className={`font-poppins font-semibold text-sm tracking-wide transition-colors duration-300 relative ${activeSection === link ? 'text-sky-400' : 'text-slate-300 hover:text-sky-400'}`}>
                            {link}
                            {activeSection === link && (
                                <motion.div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-fuchsia-500" layoutId="underline" />
                            )}
                        </a>
                    ))}
                </div>
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-slate-200 focus:outline-none">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-950/90 backdrop-blur-lg border-t border-slate-800">
                        <div className="flex flex-col items-center px-6 pt-2 pb-6 space-y-4">
                            {navLinks.map((link) => (
                                <a key={link} href={`#${link.toLowerCase()}`} onClick={() => scrollToSection(link)}
                                   className={`block font-poppins text-lg w-full text-center py-2 rounded-md ${activeSection === link ? 'text-sky-400 bg-slate-800' : 'text-slate-300 hover:bg-slate-800'}`}>
                                    {link}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

// Komponen Slider Gambar di Hero Section
const HeroSlider = () => {
    const images = [
        { src: "/heroes/genshin-hsr-hero.png", alt: "Genshin Impact and Honkai Star Rail characters" },
        { src: "/heroes/genshin-abyss.jpg", alt: "Genshin Impact Raiden Shogun" },
        { src: "/heroes/hsr-universe.jpg", alt: "Honkai Star Rail Acheron" },
    ];
    const [index, setIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const nextSlide = useCallback(() => {
        setIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevSlide = () => {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    
    useEffect(() => {
      if(isClient) {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
      }
    }, [nextSlide, isClient]);

    if (!isClient) {
        return <div className="relative w-full max-w-2xl mx-auto h-64 md:h-80 lg:h-96 rounded-2xl bg-slate-800 animate-pulse"></div>; 
    }

    return (
        <div className="relative w-full max-w-2xl mx-auto h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-sky-500/10 border border-slate-800">
            <AnimatePresence initial={false}>
                 <motion.img
                    key={index}
                    src={images[index].src}
                    alt={images[index].alt}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute w-full h-full object-cover"
                />
            </AnimatePresence>
            <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10">
                <ArrowLeft />
            </button>
            <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10">
                <ArrowRight />
            </button>
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                    <div key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full cursor-pointer transition-all ${i === index ? 'w-4 bg-sky-400' : 'bg-slate-500'}`} />
                ))}
            </div>
        </div>
    );
};

// Komponen Slider Gambar untuk Section Layanan
const ServiceImageSlider = ({ images, onImageClick }: { images: string[], onImageClick: (src: string, alt: string) => void }) => {
    const [index, setIndex] = useState(0);

    const paginate = (newDirection: number) => {
        setIndex(prev => (prev + newDirection + images.length) % images.length);
    };

    return (
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-slate-800">
            <AnimatePresence initial={false} custom={index}>
                <motion.div
                    key={index}
                    className="absolute w-full h-full"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        onClick={() => onImageClick(images[index], `Layanan ${index + 1}`)}
                        className="w-full h-full group cursor-pointer"
                    >
                        <img 
                          src={images[index]} 
                          alt={`Layanan ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                    </motion.div>
                </motion.div>
            </AnimatePresence>
            <button onClick={() => paginate(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10">
                <ArrowLeft />
            </button>
            <button onClick={() => paginate(1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10">
                <ArrowRight />
            </button>
        </div>
    );
}

// Komponen Pembungkus Section
const Section = ({ id, children, className = '' }: { id: string, children: React.ReactNode, className?: string }) => {
    return (
        <motion.section
            id={id}
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className={`py-24 md:py-32 relative ${className}`}
        >
            <div className="container mx-auto px-6 relative z-10">
                {children}
            </div>
        </motion.section>
    );
}

// Komponen Judul Section
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <motion.h2 variants={itemVariant} className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]">
        {children}
    </motion.h2>
);

// Komponen Form Pemesanan
const OrderForm = ({ onSubmit }: { onSubmit: (formData: FormData) => void }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '', game: '', service: '', uid: '', server: '', whatsapp: '', notes: ''
    });
    const [availableServices, setAvailableServices] = useState<ServicePlan[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


    useEffect(() => {
        if (formData.game) {
            setAvailableServices(pricing[formData.game] || []);
            setFormData(prev => ({ ...prev, service: '' }));
        } else {
            setAvailableServices([]);
        }
    }, [formData.game]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: id === 'game' ? value as GameKey : value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isClient) {
        return <div className="max-w-2xl mx-auto h-96 bg-slate-800/50 rounded-2xl animate-pulse"></div>;
    }
    
    const inputStyles = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 placeholder:text-slate-500";

    return (
      <motion.div variants={itemVariant} className="max-w-2xl mx-auto bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Nama Lengkap</label>
                      <input type="text" id="name" value={formData.name} onChange={handleChange} required className={inputStyles} placeholder="John Doe"/>
                  </div>
                  <div>
                      <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-300 mb-2">Nomor WhatsApp</label>
                      <input type="tel" id="whatsapp" value={formData.whatsapp} onChange={handleChange} required placeholder="08123456789" className={inputStyles} />
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label htmlFor="game" className="block text-sm font-medium text-slate-300 mb-2">Pilih Game</label>
                      <select id="game" value={formData.game} onChange={handleChange} required className={inputStyles}>
                          <option value="" disabled>-- Pilih Game --</option>
                          <option value="genshin">Genshin Impact</option>
                          <option value="hsr">Honkai: Star Rail</option>
                      </select>
                  </div>
                  <div>
                      <label htmlFor="service" className="block text-sm font-medium text-slate-300 mb-2">Pilih Layanan</label>
                      <select id="service" value={formData.service} onChange={handleChange} required disabled={!formData.game} className={`${inputStyles} disabled:opacity-50`}>
                          <option value="" disabled>-- Pilih Layanan --</option>
                          {availableServices.map(s => <option key={s.serviceKey} value={s.serviceKey}>{s.title}</option>)}
                      </select>
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label htmlFor="uid" className="block text-sm font-medium text-slate-300 mb-2">UID Game</label>
                      <input type="text" id="uid" value={formData.uid} onChange={handleChange} required className={inputStyles} placeholder="800123456"/>
                  </div>
                  <div>
                      <label htmlFor="server" className="block text-sm font-medium text-slate-300 mb-2">Server</label>
                      <select id="server" value={formData.server} onChange={handleChange} required className={inputStyles}>
                          <option value="" disabled>-- Pilih Server --</option>
                          <option value="Asia">Asia</option>
                          <option value="Europe">Europe</option>
                          <option value="America">America</option>
                          <option value="TW, HK, MO">TW, HK, MO</option>
                      </select>
                  </div>
              </div>
              <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">Catatan Tambahan (Opsional)</label>
                  <textarea id="notes" value={formData.notes} onChange={handleChange} rows={4} className={inputStyles} placeholder="Login via Google, karakter prioritas, dll."></textarea>
              </div>
              <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(14, 165, 233, 0.5)" }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-sky-500 to-fuchsia-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:saturate-150">
                  <Send size={20} />
                  Kirim Pesanan via WhatsApp
              </motion.button>
          </form>
      </motion.div>
    );
};


const Footer = () => {
  const footerLinks = {
    Layanan: [
      { name: "Genshin Impact", href: "#layanan" },
      { name: "Honkai: Star Rail", href: "#layanan" },
      { name: "Daftar Harga", href: "#harga" },
      { name: "Portofolio", href: "#portofolio" },
    ],
    Perusahaan: [
      { name: "Tentang Kami", href: "#fitur" },
      { name: "Testimoni", href: "#testimoni" },
    ],
  };

  const contactInfo = [
    { icon: <Mail size={16}/>, text: "bustomiilham117@gmail.com", href:"mailto:bustomiilham117@gmail.com"},
    { icon: <Phone size={16}/>, text: "+62 858 9008 4378", href:"https://wa.me/6285890084378"},
    { icon: <MapPin size={16}/>, text: "Jakarta, Indonesia", href:"#"},
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Kolom 1: Logo & Deskripsi */}
          <div className="md:col-span-2 lg:col-span-1">
             <a href="#beranda" className="flex items-center gap-3 text-2xl font-heading font-bold mb-4 tracking-wider">
                  <img src="/logo/Logo-4.png" alt="Shiraori Joki Pro Logo" className="h-12 w-12" />
                  <div>
                    <span className="text-sky-400">Shiraori</span>
                    <span className="text-slate-200">Joki</span>
                    <span className="text-fuchsia-500">Pro</span>
                  </div>
              </a>
              <p className="text-slate-400 text-sm max-w-xs">
                Layanan joki profesional untuk Genshin Impact dan Honkai: Star Rail. Aman, cepat, dan terpercaya.
              </p>
              <div className="flex gap-4 mt-6">
                  <a href="https://wa.me/6285890084378" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-green-400 hover:bg-slate-700 transition-all duration-300 hover:-translate-y-1"><MessageCircle size={20}/></a>
                  <a href="https://www.instagram.com/_ilham_bustomi_/?hl=id" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-pink-500 hover:bg-slate-700 transition-all duration-300 hover:-translate-y-1"><Instagram size={20}/></a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition-all duration-300 hover:-translate-y-1"><Disc size={20}/></a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-all duration-300 hover:-translate-y-1"><Github size={20}/></a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-sky-500 hover:bg-slate-700 transition-all duration-300 hover:-translate-y-1"><Linkedin size={20}/></a>
              </div>
          </div>
          
          {/* Kolom 2 & 3: Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-heading font-bold text-lg text-slate-200 mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-slate-400 text-sm hover:text-sky-400 transition-all duration-300 inline-block hover:translate-x-1">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Kolom 4: Kontak */}
           <div>
              <h3 className="font-heading font-bold text-lg text-slate-200 mb-4">Kontak</h3>
              <ul className="space-y-3">
                {contactInfo.map(info => (
                  <li key={info.text}>
                    <a href={info.href} className="flex items-center gap-3 text-slate-400 text-sm hover:text-sky-400 transition-all duration-300 group">
                      <span className="flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300">{info.icon}</span>
                      <span>{info.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-slate-500 text-xs">
           <p>&copy; {new Date().getFullYear()} ShiraoriJokiPro. Dibuat dengan ❤️ di Jakarta.</p>
        </div>
      </div>
    </footer>
  );
};


// --- KOMPONEN UTAMA APP ---

export default function Home() {
    const [activeSection, setActiveSection] = useState<string>('Beranda');
    const [activeServiceTab, setActiveServiceTab] = useState<GameKey>('genshin');
    const [activePricingTab, setActivePricingTab] = useState<GameKey>('genshin');
    const [activePortfolioTab, setActivePortfolioTab] = useState<GameKey | 'all'>('all');
    const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
    
    const handleOrder = (formData: FormData) => {
      const gameMap: Record<GameKey, string> = { 'genshin': 'Genshin Impact', 'hsr': 'Honkai: Star Rail' };
      if (!formData.game) return;
      
      const serviceTitle = pricing[formData.game]?.find(s => s.serviceKey === formData.service)?.title || 'Layanan Kustom';
      const whatsappMessage = `*PESANAN JOKI SHIRAORI PRO*\n
📋 *Detail Pemesan:*
├ Nama: ${formData.name}
└ WhatsApp: ${formData.whatsapp}

🎮 *Detail Game:*
├ Game: ${gameMap[formData.game]}
├ Layanan: ${serviceTitle}
├ UID: ${formData.uid}
└ Server: ${formData.server}

📝 *Catatan:*
${formData.notes || 'Tidak ada catatan'}

_Silahkan konfirmasi ketersediaan dan detail pembayaran_`;
      const encodedMessage = encodeURIComponent(whatsappMessage);
      window.open(`https://wa.me/6285890084378?text=${encodedMessage}`, '_blank');
    };
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const capitalizedId = entry.target.id.charAt(0).toUpperCase() + entry.target.id.slice(1);
                        setActiveSection(capitalizedId);
                    }
                });
            },
            { rootMargin: "-50% 0px -50% 0px" }
        );

        const sectionElements = document.querySelectorAll('section');
        sectionElements.forEach((sec) => observer.observe(sec));

        return () => sectionElements.forEach((sec) => observer.unobserve(sec));
    }, []);

    const portfolioItems = activePortfolioTab === 'all' 
      ? [...portfolio.genshin, ...portfolio.hsr] 
      : portfolio[activePortfolioTab as GameKey] || [];

    return (
        <div className="bg-slate-950 text-slate-200 font-poppins scroll-smooth relative">
            <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <Header activeSection={activeSection} setActiveSection={setActiveSection} />
            <ImageModal selectedImage={selectedImage} onClose={() => setSelectedImage(null)} />
            
            <main className="pt-20">
                {/* --- BERANDA --- */}
                <Section id="beranda">
                    <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
                        <motion.div variants={sectionVariant} initial="hidden" animate="visible" className="text-center md:text-left">
                            <motion.h1 variants={itemVariant} className="text-4xl lg:text-6xl font-extrabold font-heading mb-6 leading-tight" style={{textShadow: '0 0 20px rgba(14, 165, 233, 0.4)'}}>
                                Jasa Joki <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-fuchsia-500">Genshin & Honkai</span>
                            </motion.h1>
                            <motion.p variants={itemVariant} className="text-lg text-slate-300 mb-10 max-w-xl mx-auto md:mx-0">
                                Profesional, cepat, dan terpercaya. Fokus farming, Spiral Abyss, Simulated Universe, Eksplorasi & lainnya!
                            </motion.p>
                            <motion.div variants={itemVariant} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(192, 132, 252, 0.5)" }} whileTap={{ scale: 0.95 }}
                                  onClick={() => document.getElementById('pesan')?.scrollIntoView({ behavior: 'smooth' })}
                                  className="bg-gradient-to-r from-sky-500 to-fuchsia-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform">
                                    Pesan Sekarang
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.05, backgroundColor: "rgba(14, 165, 233, 0.1)", borderColor: "#0ea5e9" }} whileTap={{ scale: 0.95 }}
                                  onClick={() => document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' })}
                                  className="bg-slate-800 text-sky-400 font-bold py-3 px-8 rounded-lg border-2 border-sky-500/50 transition-colors">
                                    Lihat Layanan
                                </motion.button>
                            </motion.div>
                        </motion.div>
                        <motion.div variants={itemVariant}>
                            <HeroSlider />
                        </motion.div>
                    </div>
                </Section>
                
                {/* --- FITUR UNGGULAN --- */}
                <Section id="fitur">
                  <SectionTitle>Mengapa Memilih Kami?</SectionTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                      <motion.div key={i} variants={itemVariant}
                        className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-center transition-all duration-300 hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-2 backdrop-blur-sm">
                        <div className="inline-block p-4 bg-gradient-to-br from-sky-500 to-fuchsia-600 rounded-full mb-4 shadow-lg shadow-sky-500/20">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold font-heading mb-2 text-slate-100">{feature.title}</h3>
                        <p className="text-slate-400">{feature.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </Section>

                {/* --- LAYANAN --- */}
                <Section id="layanan">
                    <SectionTitle>Layanan Kami</SectionTitle>
                    <motion.div variants={itemVariant} className="flex justify-center mb-10 gap-4 bg-slate-900 p-2 rounded-xl max-w-md mx-auto border border-slate-800">
                        <button onClick={() => setActiveServiceTab('genshin')} className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-colors text-sm ${activeServiceTab === 'genshin' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' : 'text-slate-300 hover:bg-slate-800'}`}>
                            Genshin Impact
                        </button>
                        <button onClick={() => setActiveServiceTab('hsr')} className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-colors text-sm ${activeServiceTab === 'hsr' ? 'bg-fuchsia-500 text-white shadow-md shadow-fuchsia-500/30' : 'text-slate-300 hover:bg-slate-800'}`}>
                            Honkai: Star Rail
                        </button>
                    </motion.div>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeServiceTab} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                            <motion.div
                              variants={itemVariant}
                              className="grid md:grid-cols-2 gap-10 items-center bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10">
                               <ServiceImageSlider 
                                  images={services[activeServiceTab].images} 
                                  onImageClick={(src, alt) => {
                                      setSelectedImage({
                                          id: src,
                                          src: src,
                                          alt: alt
                                      });
                                  }}
                                />
                                <div>
                                    <h3 className="text-2xl lg:text-3xl font-bold font-heading mb-6 flex items-center">{services[activeServiceTab].icon} {services[activeServiceTab].name}</h3>
                                    <ul className="space-y-3 mb-8">
                                        {services[activeServiceTab].list.map((item, i) => (
                                            <li key={i} className="flex items-center text-slate-300"><CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /><span>{item}</span></li>
                                        ))}
                                    </ul>
                                    <div className="flex gap-4">
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => document.getElementById('harga')?.scrollIntoView({ behavior: 'smooth' })} className="bg-sky-500 hover:bg-sky-600 transition-colors text-white font-semibold py-2.5 px-6 rounded-lg">Lihat Harga</motion.button>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => document.getElementById('portofolio')?.scrollIntoView({ behavior: 'smooth' })} className="bg-slate-700 hover:bg-slate-600 transition-colors text-white font-semibold py-2.5 px-6 rounded-lg">Lihat Portofolio</motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </Section>
                
                {/* --- HARGA --- */}
                <Section id="harga" className="bg-slate-900/30">
                    <SectionTitle>Paket Layanan</SectionTitle>
                     <motion.div variants={itemVariant} className="flex justify-center mb-10 gap-4 bg-slate-900 p-2 rounded-xl max-w-md mx-auto border border-slate-800">
                        <button onClick={() => setActivePricingTab('genshin')} className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-colors text-sm ${activePricingTab === 'genshin' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' : 'text-slate-300 hover:bg-slate-800'}`}>Genshin Impact</button>
                        <button onClick={() => setActivePricingTab('hsr')} className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-colors text-sm ${activePricingTab === 'hsr' ? 'bg-fuchsia-500 text-white shadow-md shadow-fuchsia-500/30' : 'text-slate-300 hover:bg-slate-800'}`}>Honkai: Star Rail</button>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                       <AnimatePresence>
                         {pricing[activePricingTab].map((plan) => (
                          <motion.div key={plan.title} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}
                             className={`relative bg-slate-900 p-6 rounded-2xl border-2 transition-all flex flex-col ${plan.popular ? 'border-fuchsia-500 shadow-2xl shadow-fuchsia-500/10' : 'border-slate-800'}`}>
                              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-fuchsia-500 text-xs font-bold text-white px-3 py-1 rounded-full">Populer</div>}
                              <h3 className="text-xl font-bold font-heading mb-2 text-slate-100">{plan.title}</h3>
                              <p className="text-sm text-slate-400 mb-4 h-12">{plan.description}</p>
                              <p className="text-4xl font-bold my-4 text-slate-50">{plan.price} <span className="text-lg font-normal text-slate-400">{plan.per}</span></p>
                              <ul className="space-y-3 mb-6 flex-grow border-t border-slate-800 pt-6">
                                  {plan.features.map((feat, i) => (
                                      <li key={i} className="flex items-start text-slate-300 text-sm"><CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /><span>{feat}</span></li>
                                  ))}
                              </ul>
                              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
                                   const orderSection = document.getElementById('pesan');
                                   if (orderSection) {
                                     orderSection.scrollIntoView({ behavior: 'smooth' });
                                     const gameSelect = orderSection.querySelector<HTMLSelectElement>('#game');
                                     const serviceSelect = orderSection.querySelector<HTMLSelectElement>('#service');
                                     if(gameSelect && serviceSelect){
                                        gameSelect.value = activePricingTab;
                                        const event = new Event('change', { bubbles: true });
                                        gameSelect.dispatchEvent(event);
                                        setTimeout(() => { if(serviceSelect) serviceSelect.value = plan.serviceKey; }, 100);
                                     }
                                   }
                                 }}
                                 className={`w-full font-bold py-3 rounded-lg mt-auto transition-all ${plan.popular ? 'bg-gradient-to-r from-sky-500 to-fuchsia-600 text-white' : 'bg-slate-800 text-sky-400 hover:bg-slate-700'}`}>Pesan Paket Ini</motion.button>
                           </motion.div>
                         ))}
                       </AnimatePresence>
                    </div>
                </Section>
                
                {/* --- PORTOFOLIO --- */}
                <Section id="portofolio">
                    <SectionTitle>Portofolio Kami</SectionTitle>
                    <motion.div variants={itemVariant} className="flex flex-wrap justify-center mb-10 gap-3 bg-slate-900 p-2 rounded-xl max-w-lg mx-auto border border-slate-800">
                         <button onClick={() => setActivePortfolioTab('all')} className={`py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${activePortfolioTab === 'all' ? 'bg-fuchsia-500 text-white shadow-md shadow-fuchsia-500/30' : 'text-slate-300 hover:bg-slate-800'}`}>Semua</button>
                         <button onClick={() => setActivePortfolioTab('genshin')} className={`py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${activePortfolioTab === 'genshin' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' : 'text-slate-300 hover:bg-slate-800'}`}>Genshin Impact</button>
                         <button onClick={() => setActivePortfolioTab('hsr')} className={`py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${activePortfolioTab === 'hsr' ? 'bg-fuchsia-500 text-white shadow-md shadow-fuchsia-500/30' : 'text-slate-300 hover:bg-slate-800'}`}>Honkai: Star Rail</button>
                    </motion.div>
                    
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                           {portfolioItems.map((item, i) => {
                                const portfolioImageId = `portfolio-${item.title}-${i}`;
                                return (
                                <motion.div 
                                    key={portfolioImageId} 
                                    layout 
                                    initial={{ opacity: 0, scale: 0.8 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    exit={{ opacity: 0, scale: 0.8 }} 
                                    transition={{ duration: 0.4 }}
                                    className="group relative rounded-lg overflow-hidden shadow-lg border-2 border-slate-800 hover:border-sky-500 transition-all">
                                    <motion.img 
                                        layoutId={portfolioImageId}
                                        src={item.image} 
                                        alt={item.title} 
                                        width={500}
                                        height={350}
                                        className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                                        onClick={() => {
                                            setSelectedImage({
                                                id: portfolioImageId,
                                                src: item.image,
                                                alt: item.title
                                            });
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                                        <h3 className="text-lg font-bold text-white drop-shadow-md">{item.title}</h3>
                                        <p className="text-sm text-slate-300 drop-shadow-md">{item.desc}</p>
                                    </div>
                                </motion.div>
                           )})}
                        </AnimatePresence>
                    </motion.div>
                </Section>

                {/* --- TESTIMONI --- */}
                <Section id="testimoni" className="bg-slate-900/30">
                    <SectionTitle>Apa Kata Pelanggan Kami?</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {testimonials.map((testimonial, i) => (
                           <motion.div key={i} variants={itemVariant} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 relative">
                               <Quote className="absolute top-4 right-4 text-slate-700" size={40}/>
                               <div className="flex items-center">
                                   {[...Array(Math.floor(testimonial.rating))].map((_, starIndex) => <Star key={starIndex} className="text-yellow-400 fill-yellow-400" size={20}/>)}
                                   {testimonial.rating % 1 !== 0 && <Star className="text-yellow-400 fill-yellow-400" size={20} style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' }} />}
                               </div>
                               <p className="text-slate-300 italic text-base">&quot;{testimonial.text}&quot;</p>
                               <div className="flex items-center gap-4 pt-2">
                                   <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-fuchsia-600 rounded-full flex items-center justify-center font-bold text-xl text-white">
                                       {testimonial.name.charAt(0)}
                                   </div>
                                   <div>
                                       <h4 className="font-bold text-slate-100">{testimonial.name}</h4>
                                       <p className="text-sm text-slate-400">{testimonial.game}</p>
                                   </div>
                               </div>
                           </motion.div>
                       ))}
                    </div>
                </Section>
                
                {/* --- PESAN (FORM) --- */}
                <Section id="pesan">
                    <SectionTitle>Formulir Pemesanan</SectionTitle>
                    <OrderForm onSubmit={handleOrder} />
                </Section>
            </main>
            
            <Footer />
        </div>
    );
}