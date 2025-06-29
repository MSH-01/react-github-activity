# React GitHub Activity

A customizable React component for displaying GitHub contribution graphs with detailed statistics and flexible styling options.

![GitHub](https://img.shields.io/github/license/yourusername/react-github-activity)
![npm](https://img.shields.io/npm/v/react-github-activity)
![npm downloads](https://img.shields.io/npm/dm/react-github-activity)

## ✨ Features

- 🎨 **Customizable Design** - Full control over styling with Tailwind CSS classes
- 📊 **Detailed Statistics** - Display contribution counts, streaks, and averages
- 🗓️ **Flexible Time Ranges** - Show specific years or rolling months
- 🌙 **Dark Mode Support** - Built-in dark mode styling
- ⚡ **TypeScript Support** - Full type safety and IntelliSense
- 🔧 **Configurable Layout** - Adjust days per column and labels
- 🚫 **No External Dependencies** - Only requires React and clsx

## 📦 Installation

```bash
# npm
npm install react-github-activity

# yarn
yarn add react-github-activity

# pnpm
pnpm add react-github-activity
```

## 🚀 Quick Start

```tsx
import React from 'react';
import { GitHubContributions } from 'react-github-activity';

function App() {
  return (
    <div className="p-8">
      <GitHubContributions
        username="octocat"
        token="your-github-token" // Optional but recommended
        showStats={true}
        showLabels={true}
      />
    </div>
  );
}

export default App;
```

## 🛠️ API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | **Required** | GitHub username to fetch contributions for |
| `token` | `string` | `undefined` | GitHub API token (recommended for higher rate limits) |
| `showStats` | `boolean` | `false` | Whether to display contribution statistics |
| `year` | `number` | Current year | Specific year to display (overrides `months`) |
| `months` | `number` | `undefined` | Number of months to show from today |
| `showLabels` | `boolean` | `true` | Whether to show month and day labels |
| `daysPerColumn` | `number` | `7` | Number of days per column in the grid |
| `className` | `string` | `undefined` | Additional CSS classes to apply |

### Types

```typescript
interface GitHubContributionsProps {
  username: string;
  token?: string;
  showStats?: boolean;
  year?: number;
  months?: number;
  showLabels?: boolean;
  daysPerColumn?: number;
  className?: string;
}
```

## 📋 Examples

### Basic Usage

```tsx
import { GitHubContributions } from 'react-github-activity';

<GitHubContributions username="octocat" />
```

### With Statistics

```tsx
<GitHubContributions 
  username="octocat"
  showStats={true}
  token="ghp_your_token_here"
/>
```

### Last 6 Months

```tsx
<GitHubContributions 
  username="octocat"
  months={6}
  showStats={true}
/>
```

### Specific Year

```tsx
<GitHubContributions 
  username="octocat"
  year={2023}
  showLabels={false}
/>
```

### Custom Styling

```tsx
<GitHubContributions 
  username="octocat"
  className="border rounded-lg p-4 bg-white dark:bg-gray-900"
  showStats={true}
/>
```

### Compact Layout

```tsx
<GitHubContributions 
  username="octocat"
  daysPerColumn={14}
  showLabels={false}
/>
```

## 🔑 GitHub Token Setup

To avoid rate limiting (60 requests/hour without token vs 5,000 with token), create a GitHub personal access token:

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: No additional scopes needed for public contribution data
4. Copy the token and use it in your component

**Environment Variable (Recommended):**

```bash
# .env.local
GITHUB_TOKEN=ghp_your_token_here
```

```tsx
<GitHubContributions 
  username="octocat"
  token={process.env.GITHUB_TOKEN}
/>
```

## 🎨 Styling

The component uses Tailwind CSS classes by default. You can customize the appearance by:

1. **Overriding with custom classes:**
```tsx
<GitHubContributions 
  username="octocat"
  className="my-custom-styles"
/>
```

2. **Using CSS-in-JS or styled-components:**
```tsx
const StyledGitHubContributions = styled(GitHubContributions)`
  /* Your custom styles */
`;
```

3. **Customizing contribution level colors:**
The component uses these Tailwind classes for different contribution levels:
- `bg-black/5 dark:bg-white/10` (no contributions)
- `bg-green-300 dark:bg-green-900` (low)
- `bg-green-400 dark:bg-green-700` (medium-low)
- `bg-green-600 dark:bg-green-500` (medium-high)
- `bg-green-700 dark:bg-green-300` (high)

## 🔧 Requirements

- React 16.8.0 or higher
- A CSS framework that supports the classes used (Tailwind CSS recommended)

## ⚠️ Error Handling

The component includes built-in error handling for common scenarios:

- **Rate limiting:** Shows helpful messages about token usage
- **Invalid usernames:** Displays appropriate error messages
- **Network issues:** Graceful fallback with error display
- **Loading states:** Spinner animation during data fetching

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by GitHub's contribution graph
- Built with TypeScript and modern React patterns
- Styled with Tailwind CSS for maximum customization 