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

### Custom Column Layout

```tsx
<GitHubContributions 
  username="your-github-username"
  token={process.env.GITHUB_API_TOKEN}
  daysPerColumn={3}
  showLabels={false}
  className="long-thin"
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
| `daysPerColumn` | `number` | `7` | Number of days to display in each column (customizes aspect ratio) |
| `className` | `string` | `undefined` | Additional CSS classes |

## GitHub API Setup

### ⚠️ API Token Strongly Recommended

**Rate Limits:**
- **Without token**: 60 requests/hour per IP address
- **With token**: 5,000 requests/hour

**Reality Check:** You'll likely hit the 60/hour limit quickly during development or if multiple users visit your site. A token is practically required for any real-world usage.

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

## Custom Column Layout

### Days Per Column
Control the visual aspect ratio by changing how many days are displayed in each column:

```tsx
// Default GitHub-style (7 days per column)
<GitHubContributions username="your-username" daysPerColumn={7} />

// Long and thin (3 days per column - more columns, shorter height)
<GitHubContributions username="your-username" daysPerColumn={3} />

// Tall and narrow (14 days per column - fewer columns, taller height)
<GitHubContributions username="your-username" daysPerColumn={14} />
```

**Visual Effects:**
- **Lower values** (1-6): Creates a longer, thinner visualization with more columns
- **Higher values** (8-21): Creates a taller, narrower visualization with fewer columns
- **Value of 7**: Standard GitHub appearance

**Common Use Cases:**
- `daysPerColumn={3}` - Perfect for wide, horizontal layouts
- `daysPerColumn={7}` - Classic GitHub look (default)
- `daysPerColumn={14}` - Compact vertical display for sidebars

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

- **Loading spinner** while fetching data
- **Detailed error messages** for API failures
- **Rate limit guidance** with actionable solutions
- **Graceful fallback** for missing data

### Common Errors

**Rate Limit Exceeded (403)**
```
GitHub API rate limit exceeded. Please add a GitHub API token to increase your rate limit from 60 to 5,000 requests per hour.
```

**Solutions:**
1. Add a GitHub API token (recommended)
2. Wait 1 hour for rate limit reset
3. Check if other applications are using GitHub API from your IP

**Authentication Issues**
- Verify token format (should start with `ghp_` or `github_pat_`)
- Check token scopes (`public_repo`, `read:user`)
- Ensure token is properly set in environment variables

## Rate Limits

- **Without token**: 60 requests/hour per IP address
- **With token**: 5,000 requests/hour per token

**Important:** Rate limits are shared across your entire IP address, so development and production usage both count against the same limit.

## Example Implementation

See `app/(content)/about/page.tsx` for a complete implementation example. 