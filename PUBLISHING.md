# Publishing & Usage Guide

## 📦 Publishing to NPM

### 1. Update package.json

Before publishing, make sure to update your `package.json`:

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/react-github-activity.git"
  },
  "homepage": "https://github.com/yourusername/react-github-activity#readme",
  "bugs": {
    "url": "https://github.com/yourusername/react-github-activity/issues"
  }
}
```

### 2. Login to NPM

```bash
npm login
```

### 3. Test the package locally

```bash
# Build the package
npm run build

# Test pack (creates a tarball without publishing)
npm pack
```

### 4. Publish

```bash
# Publish to NPM
npm publish

# For beta releases
npm publish --tag beta
```

### 5. Version management

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

## 🚀 Using in React Projects

### Next.js Project

1. **Install the package:**
```bash
npm install react-github-activity
```

2. **Set up Tailwind CSS** (if not already configured):
```bash
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. **Configure tailwind.config.js:**
```js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-github-activity/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

4. **Use the component:**
```tsx
// app/page.tsx or pages/index.tsx
import { GitHubContributions } from 'react-github-activity';

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">My GitHub Activity</h1>
      <GitHubContributions
        username="octocat"
        token={process.env.GITHUB_TOKEN}
        showStats={true}
        className="border rounded-lg p-4"
      />
    </div>
  );
}
```

### Create React App

1. **Install the package:**
```bash
npm install react-github-activity
```

2. **Install and configure Tailwind:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. **Update src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Use the component:**
```tsx
// src/App.tsx
import React from 'react';
import { GitHubContributions } from 'react-github-activity';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GitHubContributions
          username="octocat"
          showStats={true}
          className="bg-white dark:bg-gray-900 rounded-lg p-4"
        />
      </header>
    </div>
  );
}

export default App;
```

### Vite React Project

1. **Install the package:**
```bash
npm install react-github-activity
```

2. **Install Tailwind:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. **Use the component:**
```tsx
// src/App.tsx
import { GitHubContributions } from 'react-github-activity';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <GitHubContributions
          username="octocat"
          showStats={true}
          months={6}
        />
      </div>
    </div>
  );
}

export default App;
```

## 🔧 Development Setup

### For contributors or local development:

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/react-github-activity.git
cd react-github-activity
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development mode:**
```bash
npm run dev
```

4. **Build the package:**
```bash
npm run build
```

5. **Test locally in another project:**
```bash
# In the package directory
npm pack

# In your test project
npm install /path/to/react-github-activity-1.0.0.tgz
```

## 🌟 Advanced Usage Examples

### With custom styling and animations

```tsx
import { GitHubContributions } from 'react-github-activity';

function AnimatedContributions() {
  return (
    <div className="space-y-6">
      <GitHubContributions
        username="octocat"
        showStats={true}
        className="
          transform transition-all duration-500 hover:scale-105
          bg-gradient-to-br from-white to-gray-50
          dark:from-gray-900 dark:to-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-xl shadow-lg hover:shadow-xl
          p-6
        "
      />
    </div>
  );
}
```

### Multiple time ranges in a dashboard

```tsx
import { GitHubContributions } from 'react-github-activity';

function GitHubDashboard({ username }: { username: string }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Last 3 Months</h3>
        <GitHubContributions
          username={username}
          months={3}
          showStats={true}
          className="border rounded-lg p-4"
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Year</h3>
        <GitHubContributions
          username={username}
          showStats={false}
          showLabels={false}
          className="border rounded-lg p-4"
        />
      </div>
    </div>
  );
}
```

### With error boundary

```tsx
import React from 'react';
import { GitHubContributions } from 'react-github-activity';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 rounded-lg">
          <h2 className="text-red-600 font-semibold">Something went wrong.</h2>
          <p className="text-sm text-gray-600">Unable to load GitHub contributions.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function SafeGitHubContributions({ username }: { username: string }) {
  return (
    <ErrorBoundary>
      <GitHubContributions
        username={username}
        showStats={true}
        token={process.env.REACT_APP_GITHUB_TOKEN}
      />
    </ErrorBoundary>
  );
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Tailwind classes not working:**
   - Ensure the package path is included in your `tailwind.config.js` content array
   - Make sure Tailwind CSS is properly installed and configured

2. **TypeScript errors:**
   - Install `@types/react` if not already installed
   - Ensure your TypeScript version is compatible (4.0+)

3. **Rate limiting:**
   - Always use a GitHub token for production
   - Consider caching the API response on your server

4. **Styling issues:**
   - The component requires Tailwind CSS classes to display properly
   - You can override styles with your own CSS classes

## 📝 Notes

- The package is tree-shakable and optimized for modern bundlers
- TypeScript definitions are included
- The component is SSR-friendly (works with Next.js server-side rendering)
- No peer dependencies beyond React 