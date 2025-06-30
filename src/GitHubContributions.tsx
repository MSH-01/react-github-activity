"use client";

import React, { useEffect, useState } from "react";
import { cn } from "./utils";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionsData {
  totalContributions: number;
  weeks: ContributionWeek[];
  firstContribution: string | null;
  lastContribution: string | null;
}

export interface ContributionStats {
  totalContributions: number;
  avgContributionsPerDay: string;
  totalActiveDays: number;
  longestStreak: number;
  currentStreak: number;
}

export interface GitHubContributionsProps {
  /** GitHub username to fetch contributions for */
  username: string;
  /** GitHub API token (required for rate limiting) */
  token: string;
  /** Whether to display contribution statistics below the graph */
  showStats?: boolean;
  /** Specific year to display (overrides months) */
  year?: number;
  /** Number of months to show from today (overrides year) */
  months?: number;
  /** Whether to show month labels and legend */
  showLabels?: boolean;
  /** Number of days per column in the grid layout */
  daysPerColumn?: number;
  /** Additional CSS classes to apply to the root container */
  className?: string;
}

// ============================================================================
// Constants
// ============================================================================

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

const CONTRIBUTION_LEVELS = {
  NONE: 'bg-black/5 dark:bg-white/10',
  FIRST_QUARTILE: 'bg-green-300 dark:bg-green-900',
  SECOND_QUARTILE: 'bg-green-400 dark:bg-green-700',
  THIRD_QUARTILE: 'bg-green-600 dark:bg-green-500',
  FOURTH_QUARTILE: 'bg-green-700 dark:bg-green-300',
} as const;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

// ============================================================================
// Sub-components
// ============================================================================

interface MonthLabelsProps {
  columns: ContributionDay[][];
}

const MonthLabels: React.FC<MonthLabelsProps> = ({ columns }) => {
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
    <div className="flex mb-2 text-xs text-gray-600 dark:text-gray-400">
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

interface ContributionGridProps {
  columns: ContributionDay[][];
}

const ContributionGrid: React.FC<ContributionGridProps> = ({ columns }) => {
  return (
    <div className="flex gap-0.5">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-0.5">
          {column.map((day, dayIndex) => (
            <div
              key={`${columnIndex}-${dayIndex}`}
              className={cn(
                "w-[10px] h-[10px] rounded-[3px]",
                CONTRIBUTION_LEVELS[day.contributionLevel]
              )}
              title={`${
                day.contributionCount
              } contributions on ${new Date(
                day.date
              ).toLocaleDateString()}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

interface ContributionLegendProps {
  stats?: ContributionStats | undefined;
  months?: number | undefined;
  currentYear: number;
}

const ContributionLegend: React.FC<ContributionLegendProps> = ({ 
  stats, 
  months, 
  currentYear 
}) => {
  return (
    <div className="flex items-center justify-between mt-4 text-xs text-gray-600 dark:text-gray-400">
      <div>
        {stats?.totalContributions} contributions in{" "}
        {months ? `last ${months} months` : currentYear}
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs">Less</span>
        <div className="flex gap-0.5">
          {Object.entries(CONTRIBUTION_LEVELS).map(
            ([level, className]) => (
              <div
                key={level}
                className={cn(
                  "w-[10px] h-[10px] rounded-[3px]",
                  className
                )}
              />
            )
          )}
        </div>
        <span className="text-xs">More</span>
      </div>
    </div>
  );
};

interface ContributionStatsProps {
  stats: ContributionStats;
}

const ContributionStatsGrid: React.FC<ContributionStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <div>
        <div className="text-xs uppercase text-gray-600 dark:text-gray-400">
          Total Contributions
        </div>
        <div className="text-2xl font-bold">
          {stats.totalContributions}
        </div>
      </div>
      <div>
        <div className="text-xs uppercase text-gray-600 dark:text-gray-400">
          Daily Average
        </div>
        <div className="text-2xl font-bold">
          {stats.avgContributionsPerDay}
        </div>
      </div>
      <div>
        <div className="text-xs uppercase text-gray-600 dark:text-gray-400">
          Longest Streak
        </div>
        <div className="text-2xl font-bold">
          {stats.longestStreak} days
        </div>
      </div>
      <div>
        <div className="text-xs uppercase text-gray-600 dark:text-gray-400">
          Current Streak
        </div>
        <div className="text-2xl font-bold">
          {stats.currentStreak} days
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * GitHub Contributions Component
 * 
 * A React component that displays a user's GitHub contribution graph
 * with optional statistics and customizable styling.
 */
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

  const generateEmptyContributionData = (
    year: number,
    monthsBack?: number
  ): ContributionsData => {
    let startDate: Date;
    let endDate: Date;

    if (monthsBack) {
      endDate = new Date();
      startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - monthsBack);
    } else {
      startDate = new Date(year, 0, 1); // January 1st
      endDate = new Date(year, 11, 31); // December 31st
    }

    const weeks: ContributionWeek[] = [];
    const currentDate = new Date(startDate);

    // Start from the Sunday of the week containing startDate
    const startSunday = new Date(currentDate);
    startSunday.setDate(currentDate.getDate() - currentDate.getDay());

    let weekDays: ContributionDay[] = [];
    const iterDate = new Date(startSunday);

    while (iterDate <= endDate) {
      weekDays.push({
        date: iterDate.toISOString().split("T")[0],
        contributionCount: 0,
        contributionLevel: "NONE",
      });

      // If we've filled a week (7 days) or reached the end
      if (weekDays.length === 7) {
        weeks.push({ contributionDays: [...weekDays] });
        weekDays = [];
      }

      iterDate.setDate(iterDate.getDate() + 1);
    }

    // Add any remaining days as a partial week
    if (weekDays.length > 0) {
      weeks.push({ contributionDays: weekDays });
    }

    return {
      totalContributions: 0,
      weeks,
      firstContribution: null,
      lastContribution: null,
    };
  };

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
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        };

        // Debug logging
        console.log("GitHub API Request:", {
          url: GITHUB_GRAPHQL_API,
          tokenPreview: `${token.substring(0, 8)}...`,
          username,
          dateRange: months ? `${months} months` : `year ${currentYear}`,
          fromDate,
          toDate,
        });

        const response = await fetch(GITHUB_GRAPHQL_API, {
          method: "POST",
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
          console.error("GitHub API Error:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            headers: Object.fromEntries(response.headers.entries()),
          });

          // Handle specific rate limit error
          if (
            response.status === 403 &&
            errorText.includes("rate limit exceeded")
          ) {
            throw new Error(
              "GitHub API rate limit exceeded. Please check your token or try again later."
            );
          }

          throw new Error(
            `GitHub API error (${response.status}): ${response.statusText}. ${errorText}`
          );
        }

        const result = await response.json();

        if (result.errors) {
          console.error("GraphQL errors:", result.errors);
          throw new Error(`GraphQL error: ${result.errors[0].message}`);
        }

        const contributionData =
          result.data.user.contributionsCollection.contributionCalendar;

        // Calculate additional stats
        const allDays = contributionData.weeks.flatMap(
          (week: ContributionWeek) => week.contributionDays
        );
        const daysWithContributions = allDays.filter(
          (day: ContributionDay) => day.contributionCount > 0
        );
        const firstContribution =
          daysWithContributions.length > 0
            ? daysWithContributions[0].date
            : null;
        const lastContribution =
          daysWithContributions.length > 0
            ? daysWithContributions[daysWithContributions.length - 1].date
            : null;

        setData({
          totalContributions: contributionData.totalContributions,
          weeks: contributionData.weeks,
          firstContribution,
          lastContribution,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        console.error("GitHub Contributions Error:", errorMessage);
        setError(errorMessage);

        // Generate empty contribution data for the requested time period
        const emptyData = generateEmptyContributionData(currentYear, months);
        setData(emptyData);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username, token, currentYear, months]);

  const calculateStats = (): ContributionStats | null => {
    if (!data) return null;

    const allDays = data.weeks.flatMap((week) => week.contributionDays);
    const daysWithContributions = allDays.filter(
      (day) => day.contributionCount > 0
    );
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

  

  const regroupDaysByColumns = (
    weeks: ContributionWeek[]
  ): ContributionDay[][] => {
    // Flatten all days from weeks
    const allDays = weeks.flatMap((week) => week.contributionDays);

    // Group by custom daysPerColumn
    const columns: ContributionDay[][] = [];
    for (let i = 0; i < allDays.length; i += daysPerColumn) {
      columns.push(allDays.slice(i, i + daysPerColumn));
    }

    return columns;
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={cn("p-4 text-gray-500 dark:text-gray-400", className)}>
        No contribution data found.
      </div>
    );
  }

  const stats = calculateStats();
  const columns = regroupDaysByColumns(data.weeks);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        {showLabels && (
          <div className="relative mb-8">
            <MonthLabels columns={columns} />
          </div>
        )}

        <div className="flex">
          <ContributionGrid columns={columns} />
        </div>
        
        {showLabels && (
          <ContributionLegend 
            stats={stats || undefined} 
            months={months} 
            currentYear={currentYear} 
          />
        )}
        
        {showStats && stats && (
          <ContributionStatsGrid stats={stats} />
        )}
      </div>
    </div>
  );
}