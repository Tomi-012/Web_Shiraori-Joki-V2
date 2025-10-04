'use client';

import { Bot, Gamepad2, Star, Trophy, Users, Zap, Shield, ChevronRight, MessageCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl"
              >
                <Bot className="w-20 h-20 text-white" />
              </motion.div>
            </div>

            <h1 className="text-responsive-3xl font-bold text-white mb-8 leading-tight text-balance">
              <span className="text-gradient">
                Shiraori Joki Pro
              </span>
              <br />
              <span className="text-responsive-2xl text-gray-300 font-normal">
                Powered by Z.ai
              </span>
            </h1>

            <p className="text-responsive-lg text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed text-pretty">
              Asisten AI profesional untuk gaming terbaik Indonesia.
              Solusi joki Genshin Impact dan Honkai Star Rail dengan AI cerdas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/chat"
                  className="btn btn-primary btn-lg shadow-2xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  Mulai Chat Sekarang
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="#portfolio"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-xl"
                >
                  <Trophy className="w-5 h-5" />
                  Lihat Portfolio
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto"
          >
            {[
              { icon: Users, label: "Klien Puas", value: "500+" },
              { icon: Trophy, label: "Achievement", value: "1000+" },
              { icon: Star, label: "Rating", value: "5.0" },
              { icon: Zap, label: "Response Time", value: "< 1menit" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="glass rounded-2xl p-6 hover-lift"
              >
                <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-responsive-xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-responsive-2xl font-bold text-white mb-6">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-responsive-base text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Fitur unggulan yang membuat kami menjadi pilihan terbaik untuk jasa gaming Anda
            </p>
          </motion.div>

          <div className="grid-responsive">
            {[
              {
                icon: Bot,
                title: "AI Assistant 24/7",
                description: "Asisten AI cerdas yang siap membantu Anda kapan saja dengan respon cepat dan akurat.",
                gradient: "from-blue-600 to-purple-600"
              },
              {
                icon: Shield,
                title: "100% Aman & Terpercaya",
                description: "Jaminan keamanan akun dan privasi data Anda dengan sistem proteksi terbaik.",
                gradient: "from-green-600 to-teal-600"
              },
              {
                icon: Zap,
                title: "Super Fast Service",
                description: "Pengerjaan cepat dengan waktu respons yang singkat untuk semua jenis jasa.",
                gradient: "from-orange-600 to-red-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl p-8 hover-lift"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-responsive-lg font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section id="portfolio" className="section bg-black/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-responsive-2xl font-bold text-white mb-6">
              Portfolio Kami
            </h2>
            <p className="text-responsive-base text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Hasil kerja terbaik untuk game Genshin Impact dan Honkai Star Rail
            </p>
          </motion.div>

          <div className="grid-responsive">
            {[
              { game: "Genshin Impact", type: "Abyss Clear", stars: 9 },
              { game: "Honkai Star Rail", type: "Forgotten Hall", stars: 12 },
              { game: "Genshin Impact", type: "Artifact Farm", stars: 5 },
              { game: "Honkai Star Rail", type: "Relic Farm", stars: 6 },
              { game: "Genshin Impact", type: "Exploration", stars: 4 },
              { game: "Honkai Star Rail", type: "Pure Fiction", stars: 4 }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover-lift"
              >
                <div className="flex items-center justify-between mb-4">
                  <Gamepad2 className="w-8 h-8 text-purple-400" />
                  <div className="flex gap-1">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.game}</h3>
                <p className="text-purple-300 text-sm">{item.type}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
            >
              Lihat Semua Portfolio
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="gradient-primary rounded-3xl p-12 shadow-2xl"
            >
              <h2 className="text-responsive-xl font-bold text-white mb-6">
                Siap untuk Meningkatkan Gaming Experience Anda?
              </h2>
              <p className="text-responsive-base text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Bergabunglah dengan ratusan klien puas yang telah menggunakan jasa kami.
                Dapatkan bantuan terbaik dari asisten AI kami.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  Mulai Sekarang - Gratis!
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}