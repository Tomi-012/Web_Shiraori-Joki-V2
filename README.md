# 🎮 Shiraori Joki Pro

**Professional Gaming Assistant powered by Z.ai**

Platform jasa gaming terpercaya dengan asisten AI cerdas untuk Genshin Impact dan Honkai Star Rail. Dapatkan pengalaman gaming terbaik dengan teknologi AI terdepan.

## ✨ Features

### 🤖 AI Assistant 24/7
- Asisten AI cerdas dengan Z.ai integration
- Respon cepat dan akurat
- Tersedia 24 jam sehari
- Multi-session chat dengan history

### 📱 Responsive Design
- Desktop dan mobile optimized
- Modern UI dengan Tailwind CSS
- Smooth animations dengan Framer Motion
- Dark/light theme support

### 💾 Chat Features
- Persistent chat history
- Multiple chat sessions
- Real-time typing indicators
- Copy message functionality
- Auto-save ke localStorage

### 🎯 Gaming Services
- Genshin Impact (Abyss, Artifact Farm, Exploration)
- Honkai Star Rail (Forgotten Hall, Relic Farm, Pure Fiction)
- Professional joki services
- Portfolio showcase

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/username/shiraori-joki-pro.git
   cd shiraori-joki-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   # Z.ai API Configuration
   ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic
   ANTHROPIC_AUTH_TOKEN=your_token_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Buka browser**
   Navigate ke [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/chat/          # API route untuk Z.ai
│   ├── chat/              # Chat page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── mobile/            # Mobile-specific components
│   ├── ChatInterface.tsx  # Desktop chat component
│   └── LandingPage.tsx    # Landing page
├── hooks/                 # Custom React hooks
│   └── useMediaQuery.tsx  # Media query hook
├── lib/                   # Utility libraries
│   ├── hooks/            # Custom hooks (localStorage)
│   └── utils.ts          # Utility functions
└── types/                 # TypeScript definitions
    └── index.ts          # Type definitions
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 dengan App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **AI Integration**: Anthropic SDK via Z.ai
- **Storage**: LocalStorage untuk chat history
- **Deployment**: Ready untuk Vercel/Netlify

## 🎨 UI/UX Features

### Landing Page
- Hero section dengan animated elements
- Features showcase
- Portfolio preview
- Statistics display
- Call-to-action sections

### Chat Interface
- **Desktop Version**: Sidebar dengan chat sessions
- **Mobile Version**: Responsive design dengan slide menu
- Typing indicators
- Message timestamps
- Copy functionality
- Auto-resize textarea
- Smooth scrolling

### Mobile Optimizations
- Touch-friendly interface
- Swipe gestures
- Responsive design
- Mobile-safe areas
- Optimized performance

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# PowerShell (Windows)
.\set-anthropic-env.ps1    # Set environment variables
```

## 🤖 API Integration

### Z.ai Setup
Project ini menggunakan Z.ai sebagai API provider untuk Anthropic Claude:

```typescript
// src/app/api/chat/route.ts
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_AUTH_TOKEN,
  baseURL: process.env.ANTHROPIC_BASE_URL,
});
```

### Chat Endpoint
- **URL**: `/api/chat`
- **Method**: POST
- **Body**: `{ messages: Message[] }`
- **Response**: Anthropic Claude response

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment

### Vercel (Recommended)
1. Push ke GitHub repository
2. Connect ke Vercel
3. Setup environment variables
4. Deploy otomatis

### Manual Deployment
```bash
npm run build
npm run start
```

## 🔒 Security Features

- Environment variables untuk sensitive data
- Input validation dan sanitization
- XSS protection
- Safe localStorage implementation
- API rate limiting

## 📊 Performance

- Next.js optimizations
- Image optimization
- Code splitting
- Lazy loading
- Service worker ready

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## 📝 License

MIT License - lihat [LICENSE](LICENSE) file untuk details.

## 🆘 Support

Untuk support atau questions:
- 📧 Email: support@shiraori-joki-pro.com
- 💬 Discord: [Join Discord Server]
- 🐛 Issues: [GitHub Issues](https://github.com/username/shiraori-joki-pro/issues)

## 🌟 Credits

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Icon library
- [Z.ai](https://z.ai/) - AI API provider

---

<div align="center">
  <p>Made with ❤️ by Shiraori Joki Pro Team</p>
  <p>🎮 Professional Gaming Assistant | Powered by Z.ai</p>
</div>
