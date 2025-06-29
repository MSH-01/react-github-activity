import React, { useEffect, useState } from 'react';
import { cn } from './utils';

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionsData {
  totalContributions: number;
  weeks: ContributionWeek[];
  firstContribution: string | null;
  lastContribution: string | null;
}

export interface GitHubContributionsProps {
  username: string;
  token?: string;
  showStats?: boolean;
  year?: number;
  months?: number;
  showLabels?: boolean;
  daysPerColumn?: number;
  className?: string;
}

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

const CONTRIBUTION_LEVELS = {
  NONE: 'bg-black/5 dark:bg-white/10',
  FIRST_QUARTILE: 'bg-green-300 dark:bg-green-900',
  SECOND_QUARTILE: 'bg-green-400 dark:bg-green-700',
  THIRD_QUARTILE: 'bg-green-600 dark:bg-green-500',
  FOURTH_QUARTILE: 'bg-green-700 dark:bg-green-300',
} as const;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function GitHubContributions({
  username,
  token,
  showStats = false,
  year,
  months,
  showLabels = true,
  daysPerColumn = 7,
  className,
}: GitHubContributionsProps) {
  const [data, setData] = useState<ContributionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentYear = year || new Date().getFullYear();

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        setError(null);

        let fromDate: string;
        let toDate: string;

        if (months) {
          // Calculate date range based on months from today
          const today = new Date();
          const startDate = new Date(today);
          startDate.setMonth(today.getMonth() - months);
          
          fromDate = startDate.toISOString();
          toDate = today.toISOString();
        } else {
          // Default to full year
          fromDate = `${currentYear}-01-01T00:00:00Z`;
          toDate = `${currentYear}-12-31T23:59:59Z`;
        }

        const query = `
          query($username: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $username) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                      contributionLevel
                    }
                  }
                }
              }
            }
          }
        `;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers.Authorization = `token ${token}`;
        }

        // Debug logging
        console.log('GitHub API Request:', {
          url: GITHUB_GRAPHQL_API,
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 8)}...` : 'none',
          username,
          dateRange: months ? `${months} months` : `year ${currentYear}`,
          fromDate,
          toDate,
        });

        const response = await fetch(GITHUB_GRAPHQL_API, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query,
            variables: {
              username,
              from: fromDate,
              to: toDate,
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('GitHub API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            headers: Object.fromEntries(response.headers.entries()),
          });
          
          // Handle specific rate limit error
          if (response.status === 403 && errorText.includes('rate limit exceeded')) {
            throw new Error(
              token 
                ? 'GitHub API rate limit exceeded. Please check your token or try again later.'
                : 'GitHub API rate limit exceeded. Please add a GitHub API token to increase your rate limit from 60 to 5,000 requests per hour.'
            );
          }
          
          throw new Error(`GitHub API error (${response.status}): ${response.statusText}. ${errorText}`);
        }

        const result = await response.json();

        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          throw new Error(`GraphQL error: ${result.errors[0].message}`);
        }

        const contributionData = result.data.user.contributionsCollection.contributionCalendar;
        
        // Calculate additional stats
        const allDays = contributionData.weeks.flatMap((week: ContributionWeek) => week.contributionDays);
        const daysWithContributions = allDays.filter((day: ContributionDay) => day.contributionCount > 0);
        const firstContribution = daysWithContributions.length > 0 ? daysWithContributions[0].date : null;
        const lastContribution = daysWithContributions.length > 0 ? daysWithContributions[daysWithContributions.length - 1].date : null;

        setData({
          totalContributions: contributionData.totalContributions,
          weeks: contributionData.weeks,
          firstContribution,
          lastContribution,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username, token, currentYear, months]);

  const calculateStats = () => {
    if (!data) return null;

    const allDays = data.weeks.flatMap(week => week.contributionDays);
    const daysWithContributions = allDays.filter(day => day.contributionCount > 0);
    const totalDays = allDays.length;
    const avgContributionsPerDay = data.totalContributions / totalDays;
    const longestStreak = calculateLongestStreak(allDays);
    const currentStreak = calculateCurrentStreak(allDays);

    return {
      totalContributions: data.totalContributions,
      avgContributionsPerDay: avgContributionsPerDay.toFixed(2),
      totalActiveDays: daysWithContributions.length,
      longestStreak,
      currentStreak,
    };
  };

  const calculateLongestStreak = (days: ContributionDay[]): number => {
    let maxStreak = 0;
    let currentStreak = 0;

    for (const day of days) {
      if (day.contributionCount > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  };

  const calculateCurrentStreak = (days: ContributionDay[]): number => {
    let streak = 0;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Start from the end and work backwards
    for (let i = days.length - 1; i >= 0; i--) {
      const dayDate = new Date(days[i].date);
      if (days[i].contributionCount > 0) {
        streak++;
      } else if (dayDate < yesterday) {
        // If we hit a day with no contributions and it's not today, break
        break;
      }
    }

    return streak;
  };

  const renderMonthLabels = (columns: ContributionDay[][]) => {
    if (!data) return null;

    const monthLabels: { month: string; offset: number }[] = [];
    let currentMonth = -1;

    columns.forEach((column, columnIndex) => {
      if (column.length > 0) {
        const firstDay = new Date(column[0].date);
        const month = firstDay.getMonth();
        
        if (month !== currentMonth) {
          monthLabels.push({
            month: MONTHS[month],
            offset: columnIndex * 11, // 11px per column (10px + 1px gap)
          });
          currentMonth = month;
        }
      }
    });

    return (
      <div className="flex mb-2 font-commit-mono text-xs text-gray-600 dark:text-gray-400">
        {monthLabels.map((label, index) => (
          <div
            key={`${label.month}-${index}`}
            className="absolute"
            style={{ left: `${label.offset}px` }}
          >
            {label.month}
          </div>
        ))}
      </div>
    );
  };

  const renderDayLabels = () => {
    const dayLabels = DAYS.slice(0, daysPerColumn);
    
    return (
      <div className="flex flex-col mr-2 font-commit-mono text-xs text-gray-600 dark:text-gray-400">
        {dayLabels.map((day, index) => (
          <div
            key={day}
            className="h-[11px] flex items-center"
            style={{ visibility: index % 2 === 1 ? 'visible' : 'hidden' }}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const regroupDaysByColumns = (weeks: ContributionWeek[]): ContributionDay[][] => {
    // Flatten all days from weeks
    const allDays = weeks.flatMap(week => week.contributionDays);
    
    // Group by custom daysPerColumn
    const columns: ContributionDay[][] = [];
    for (let i = 0; i < allDays.length; i += daysPerColumn) {
      columns.push(allDays.slice(i, i + daysPerColumn));
    }
    
    return columns;
  };

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    const isRateLimit = error.includes('rate limit exceeded');
    
    return (
      <div className={cn('p-4 rounded-lg border border-red-200 dark:border-red-800', className)}>
        <div className="text-red-600 dark:text-red-400 font-medium text-sm mb-2">
          {isRateLimit ? '⚠️ GitHub API Rate Limit Exceeded' : '❌ Error Loading Contributions'}
        </div>
        <div className="text-red-500 dark:text-red-400 text-xs mb-3">
          {error}
        </div>
        {isRateLimit && !token && (
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
            <p><strong>Quick fixes:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Add a GitHub API token to your environment</li>
              <li>Wait an hour for the rate limit to reset</li>
              <li>Check if other apps are using GitHub's API from your IP</li>
            </ul>
            <p className="font-commit-mono text-xs">
              <strong>Rate limits:</strong> Without token: 60/hour • With token: 5,000/hour
            </p>
          </div>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className={cn('p-4 text-gray-500 dark:text-gray-400', className)}>
        No contribution data found.
      </div>
    );
  }

  const stats = calculateStats();
  const columns = regroupDaysByColumns(data.weeks);

  return (
    <div className={cn('space-y-4', className)}>
      {showStats && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-sm">
            <div className="font-commit-mono text-xs uppercase text-gray-600 dark:text-gray-400">
              Total Contributions
            </div>
            <div className="text-2xl font-bold">{stats.totalContributions}</div>
          </div>
          <div className="text-sm">
            <div className="font-commit-mono text-xs uppercase text-gray-600 dark:text-gray-400">
              Daily Average
            </div>
            <div className="text-2xl font-bold">{stats.avgContributionsPerDay}</div>
          </div>
          <div className="text-sm">
            <div className="font-commit-mono text-xs uppercase text-gray-600 dark:text-gray-400">
              Longest Streak
            </div>
            <div className="text-2xl font-bold">{stats.longestStreak} days</div>
          </div>
          <div className="text-sm">
            <div className="font-commit-mono text-xs uppercase text-gray-600 dark:text-gray-400">
              Current Streak
            </div>
            <div className="text-2xl font-bold">{stats.currentStreak} days</div>
          </div>
        </div>
      )}

      <div className="relative">
        {showLabels && (
          <div className="relative mb-8">
            {renderMonthLabels(columns)}
          </div>
        )}
        
        <div className="flex">
          {showLabels && renderDayLabels()}
          
          <div className="flex gap-0.5">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col gap-0.5">
                {column.map((day, dayIndex) => (
                  <div
                    key={`${columnIndex}-${dayIndex}`}
                    className={cn(
                      'w-[10px] h-[10px] rounded-[3px]',
                      CONTRIBUTION_LEVELS[day.contributionLevel]
                    )}
                    title={`${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString()}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        {showLabels && (
        <div className="flex items-center justify-between mt-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="font-commit-mono">
            {stats?.totalContributions} contributions in {months ? `last ${months} months` : currentYear}
          </div>
          
          <div className="flex items-center gap-1">
            <span className="font-commit-mono text-xs">Less</span>
            <div className="flex gap-1">
              {Object.entries(CONTRIBUTION_LEVELS).map(([level, className]) => (
                <div
                  key={level}
                  className={cn('w-[10px] h-[10px]', className)}
                />
              ))}
            </div>
              <span className="font-commit-mono text-xs">More</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 