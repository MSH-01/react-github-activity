# React GitHub Activity

A beautifully designed, highly customizable React component for displaying GitHub contribution graphs with TypeScript support.

[![NPM Version](https://img.shields.io/npm/v/react-github-activity)](https://www.npmjs.com/package/react-github-activity)
[![License](https://img.shields.io/github/license/yourusername/react-github-activity)](https://github.com/yourusername/react-github-activity/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

## ✨ Features

- 🎨 **Modern Design** - Clean, GitHub-like contribution graph with customizable styling
- 📊 **Rich Statistics** - Display contribution counts, streaks, and daily averages
- ⚡ **TypeScript Ready** - Full type safety with comprehensive type exports
- 🗓️ **Flexible Time Ranges** - Show specific years or rolling months
- 🌙 **Dark Mode** - Built-in support for light and dark themes
- 🔧 **Highly Customizable** - Control layout, styling, and data display
- 📱 **Responsive** - Works perfectly on mobile and desktop
- 🚀 **Next.js Compatible** - Includes "use client" directive for App Router
- 🎯 **Zero Dependencies** - Only requires React and clsx

## 📦 Installation

```bash
npm install react-github-activity clsx
```

```bash
yarn add react-github-activity clsx
```

```bash
pnpm add react-github-activity clsx
```

## 🚀 Quick Start

```tsx
import { GitHubContributions } from "react-github-activity";

export default function App() {
  return (
    <div className="p-8">
      <GitHubContributions
        username="octocat"
        token="ghp_your_token_here"
        showStats
        showLabels
      />
    </div>
  );
}
```

## 🔑 GitHub Token Setup

**⚠️ Important:** A GitHub API token is required to avoid rate limiting and ensure reliable data fetching.

### Creating a Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. **No scopes needed** for public contribution data
4. Copy the generated token

### Environment Variables (Recommended)

```bash
# .env.local (Next.js)
GITHUB_TOKEN=ghp_your_token_here

# .env (React/Vite)
VITE_GITHUB_TOKEN=ghp_your_token_here
```

```tsx
<GitHubContributions
  username="octocat"
  token={process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN!}
/>
```

## 🛠️ API Reference

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `username` | `string` | ✅ | - | GitHub username to fetch contributions for |
| `token` | `string` | ✅ | - | GitHub API token (required for rate limiting) |
| `showStats` | `boolean` | ❌ | `false` | Display contribution statistics below the graph |
| `year` | `number` | ❌ | Current year | Specific year to display (overrides `months`) |
| `months` | `number` | ❌ | `undefined` | Number of months to show from today |
| `showLabels` | `boolean` | ❌ | `true` | Show month labels and contribution legend |
| `daysPerColumn` | `number` | ❌ | `7` | Number of days per column in the grid |
| `className` | `string` | ❌ | `undefined` | Additional CSS classes for styling |

### TypeScript Types

```typescript
interface GitHubContributionsProps {
  username: string;
  token: string;
  showStats?: boolean;
  year?: number;
  months?: number;
  showLabels?: boolean;
  daysPerColumn?: number;
  className?: string;
}

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";
}

interface ContributionStats {
  totalContributions: number;
  avgContributionsPerDay: string;
  totalActiveDays: number;
  longestStreak: number;
  currentStreak: number;
}
```

## 📋 Usage Examples

### Basic Usage

```tsx
import { GitHubContributions } from "react-github-activity";

export default function Profile() {
  return (
    <GitHubContributions
      username="octocat"
      token="ghp_your_token_here"
    />
  );
}
```

### With Statistics

```tsx
<GitHubContributions
  username="octocat"
  token="ghp_your_token_here"
  showStats
  className="border rounded-lg p-6"
/>
```

### Last 6 Months

```tsx
<GitHubContributions
  username="octocat"
  token="ghp_your_token_here"
  months={6}
  showStats
/>
```

### Specific Year

```tsx
<GitHubContributions
  username="octocat"
  token="ghp_your_token_here"
  year={2023}
  showLabels={false}
/>
```

### Compact Layout

```tsx
<GitHubContributions
  username="octocat"
  token="ghp_your_token_here"
  daysPerColumn={14}
  showLabels={false}
  className="max-w-md"
/>
```

### Next.js App Router

The component includes `"use client"` directive for Next.js App Router compatibility:

```tsx
// app/components/profile.tsx
import { GitHubContributions } from "react-github-activity";

export default function Profile() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My GitHub Activity</h2>
      <GitHubContributions
        username="your-username"
        token={process.env.GITHUB_TOKEN!}
        showStats
        className="border rounded-lg p-6 bg-white dark:bg-gray-900"
      />
    </div>
  );
}
```

## 🎨 Styling & Customization

### Custom Styling

```tsx
<GitHubContributions
  username="octocat"
  token="ghp_your_token_here"
  className="border rounded-xl p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
  showStats
/>
```

### Contribution Level Colors

The component uses these Tailwind classes for contribution levels:

- **None**: `bg-black/5 dark:bg-white/10`
- **Low**: `bg-green-300 dark:bg-green-900`
- **Medium-Low**: `bg-green-400 dark:bg-green-700`
- **Medium-High**: `bg-green-600 dark:bg-green-500`
- **High**: `bg-green-700 dark:bg-green-300`

## 🚨 Error Handling

The component includes robust error handling:

- **Graceful Degradation**: Shows empty contribution grid on API errors
- **Console Logging**: Detailed error information for debugging
- **Rate Limiting**: Helpful error messages for token issues
- **Invalid Data**: Handles malformed API responses

```tsx
// The component will render an empty grid and log errors to console
<GitHubContributions
  username="invalid-user"
  token="invalid-token"
  showStats
/>
```

## 🔧 Utility Functions

Import additional utilities for custom implementations:

```tsx
import {
  formatDate,
  getDateMonthsAgo,
  getYearBounds,
  isValidGitHubUsername,
  isValidGitHubToken,
  cn
} from "react-github-activity";

// Validate inputs
const isValid = isValidGitHubUsername("octocat"); // true
const tokenValid = isValidGitHubToken("ghp_xxxx"); // true

// Date utilities
const sixMonthsAgo = getDateMonthsAgo(6);
const { start, end } = getYearBounds(2023);

// Formatting
const formatted = formatDate(new Date()); // "Jan 15, 2024"

// Class name utility (same as clsx)
const classes = cn("base-class", condition && "conditional-class");
```

## 🔧 Requirements

- **React**: 16.8.0 or higher
- **CSS Framework**: Tailwind CSS (recommended) or custom CSS
- **GitHub Token**: Required for API access

## ⚠️ Rate Limits

| Token Type | Rate Limit | Recommended Use |
|------------|------------|-----------------|
| No Token | 60/hour | ❌ Not recommended |
| Personal Token | 5,000/hour | ✅ Production ready |

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md).

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by GitHub's contribution graph design
- Built with modern React patterns and TypeScript
- Styled with Tailwind CSS for maximum flexibility
- Follows shadcn/ui design principles 