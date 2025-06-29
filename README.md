# React Github Activity

A React component that displays GitHub contribution data in a heatmap format similar to GitHub's contribution graph.

## Features

- 🔥 GitHub contribution heatmap visualization
- 📊 Optional statistics display (total contributions, daily average, streaks)
- 🌓 Dark/light mode support
- 🎨 Customizable with Tailwind CSS
- 📱 Responsive design
- 🔑 Works with or without GitHub API token

## Usage

### Basic Usage

```tsx
import GitHubContributions from '@/components/generic/github-contributions';

export default function Profile() {
  return (
    <div>
      <GitHubContributions username="your-github-username" />
    </div>
  );
}
```

### With Statistics

```tsx
<GitHubContributions 
  username="your-github-username"
  showStats={true}
/>
```

### With GitHub API Token (Recommended)

```tsx
<GitHubContributions 
  username="your-github-username"
  token={process.env.GITHUB_API_TOKEN}
  showStats={true}
  year={2024}
/>
```

### Show Last N Months

```tsx
<GitHubContributions 
  username="your-github-username"
  token={process.env.GITHUB_API_TOKEN}
  months={6}
  showStats={true}
/>
```

### Without Labels (Minimal View)

```tsx
<GitHubContributions 
  username="your-github-username"
  token={process.env.GITHUB_API_TOKEN}
  showLabels={false}
  className="compact-view"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | `string` | **required** | GitHub username |
| `token` | `string` | `undefined` | GitHub API token (recommended for higher rate limits) |
| `showStats` | `boolean` | `false` | Show additional statistics above the contribution graph |
| `year` | `number` | Current year | Year to display contributions for (ignored if `months` is set) |
| `months` | `number` | `undefined` | Number of months to display from today backwards (overrides `year`) |
| `showLabels` | `boolean` | `true` | Show month and day labels around the contribution grid |
| `className` | `string` | `undefined` | Additional CSS classes |

## GitHub API Setup

### Why Use an API Token?

Without a token, you're limited to 60 requests per hour. With a token, you get 5,000 requests per hour.

### Getting a GitHub API Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token (classic)
3. Select the following scopes:
   - `public_repo` (for public repositories)
   - `read:user` (for user profile data)
4. Copy the generated token

### Environment Setup

Add your token to your `.env.local` file:

```bash
GITHUB_API_TOKEN=your_github_token_here
```

Then use it in your component:

```tsx
<GitHubContributions 
  username="your-username"
  token={process.env.GITHUB_API_TOKEN}
/>
```

## Date Range Options

### Full Year (Default)
Shows contributions for an entire calendar year:
```tsx
<GitHubContributions username="your-username" year={2024} />
```

### Last N Months
Shows contributions for the last N months from today:
```tsx
<GitHubContributions username="your-username" months={6} />
```

**Note**: When `months` is specified, it overrides the `year` prop and shows a rolling window from today backwards.

**Common use cases:**
- `months={3}` - Last 3 months (quarterly view)
- `months={6}` - Last 6 months (half-year view)  
- `months={12}` - Last 12 months (rolling annual view)

## Label Display Options

### Show Labels (Default)
Displays month names above and day abbreviations to the left of the contribution grid:
```tsx
<GitHubContributions username="your-username" showLabels={true} />
```

### Hide Labels (Minimal View)
Shows only the contribution squares for a cleaner, more compact display:
```tsx
<GitHubContributions username="your-username" showLabels={false} />
```

**Use cases for hiding labels:**
- **Embedded in tight spaces**: When space is limited
- **Minimal design preference**: For cleaner aesthetic
- **Multiple instances**: When showing several contribution graphs
- **Dashboard views**: Where context is provided elsewhere

## Statistics Displayed

When `showStats={true}`, the component displays:

- **Total Contributions**: Total contributions for the selected time period
- **Daily Average**: Average contributions per day
- **Longest Streak**: Maximum consecutive days with contributions
- **Current Streak**: Current consecutive days with contributions (from today backwards)

## Styling

The component uses Tailwind CSS and follows your project's design system:

- Uses `font-commit-mono` for labels and stats
- Supports dark mode with `dark:` prefixes
- Uses green color scheme matching GitHub's design
- Responsive grid layout for statistics

## Error Handling

The component handles various error states:

- Loading spinner while fetching data
- Error messages for API failures
- Graceful fallback for missing data
- Rate limit handling

## Rate Limits

- **Without token**: 60 requests/hour
- **With token**: 5,000 requests/hour

The component caches data in component state to minimize API calls during the session.

## Example Implementation

See `app/(content)/about/page.tsx` for a complete implementation example. 