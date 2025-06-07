# Rick & Morty Characters App

A modern web application built with Next.js and TypeScript that allows you to explore the Rick & Morty universe. Users can browse all characters, bookmark their favorites, and view detailed information for each one.

## 🚀 Live Demo

**[View Live Application](https://rick-and-morty-bqm6.vercel.app/)**

## 📋 Features

- **Character Exploration**: Browse all Rick & Morty characters using the official API
- **Favorites System**: Mark and unmark characters as favorites with local persistence
- **Detailed View**: Check complete information for each character on individual pages
- **Responsive Design**: Interface optimized for mobile and desktop devices
- **Context API**: Efficient global state management
- **Atomic Design Architecture**: Components organized following atomic design principles

## 🛠️ Technologies Used

- **[Next.js 15.3.3](https://nextjs.org/)** - React framework for production
- **[React 19](https://reactjs.org/)** - JavaScript library for user interfaces
- **[TypeScript 5](https://www.typescriptlang.org/)** - Typed superset of JavaScript
- **[Tailwind CSS 4.1.8](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Rick and Morty API](https://rickandmortyapi.com/)** - Public REST API

## ⚙️ Prerequisites

Make sure you have installed on your system:

- **Node.js** (version 18 or higher)
- **npm** (comes included with Node.js)

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd rick-morty-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run in development mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📜 Available Scripts

```bash
# Development with Turbopack (faster)
npm run dev

# Build for production
npm run build

# Run in production mode
npm run start

# Linter to review code
npm run lint
```

## 📁 Project Structure

```
rick-and-morty/
├── public/                     # Static files
├── src/
│   └── app/
│       ├── components/         # Components organized by Atomic Design
│       │   ├── atoms/         # Basic components
│       │   ├── molecules/     # Compound components
│       │   ├── organisms/     # Complex components
│       │   │   ├── aside/     # Character sidebar list
│       │   │   └── search-filter/
│       │   └── templates/     # Page templates
│       │       └── MainLayout.tsx
│       ├── contexts/          # Context API
│       │   └── characterContext.tsx
│       ├── pages/             # Application pages
│       │   ├── character/     # Character detail page
│       │   │   └── [id].tsx
│       │   └── index.tsx
│       ├── services/          # API services
│       │   └── characterService.ts
│       └── types/             # TypeScript definitions
│           └── characters.ts
├── package.json
└── README.md
```

## 🎯 Main Features

### Context API for State Management

The application uses React Context to handle:
- List of all characters
- Characters marked as favorites
- Currently selected character
- Loading and error states

### Favorites System

- **Mark/Unmark**: Each character has a button to add or remove it from favorites
- **Persistence**: Favorites are saved in browser's localStorage
- **Organization**: Favorite characters appear in a separate section in the list

### Navigation

- **Sidebar**: Sidebar with all characters organized by favorites and regular ones
- **Detail View**: Individual page for each character with complete information
- **Dynamic Routing**: Friendly URLs like `/character/1`

## 🔧 Additional Configuration

### Environment Variables

The project doesn't require additional environment variables as it uses the public Rick & Morty API.

### Customization

To customize styles, modify the Tailwind CSS files in the project configuration.

## 📱 Responsive Design

The application is optimized for:
- 📱 **Mobile**: Adaptive design for small screens
- 🖥️ **Desktop**: Takes advantage of available space on large screens

## 🙏 Acknowledgments

- [Rick and Morty API](https://rickandmortyapi.com/) for providing the free API
- Next.js and React community for the incredible tools

---

**Developed with ❤️ using Next.js and TypeScript**