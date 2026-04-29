'use client';

import { DailyRecommendations } from '@/lib/nutrition-calc';

interface MacroChartProps {
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  recommendations: DailyRecommendations;
}

export function MacroChart({ macros, recommendations }: MacroChartProps) {
  const proteinCals = macros.protein * 4;
  const carbsCals = macros.carbs * 4;
  const fatCals = macros.fat * 9;
  const totalCals = proteinCals + carbsCals + fatCals;

  const proteinPercent = (proteinCals / totalCals) * 100 || 0;
  const carbsPercent = (carbsCals / totalCals) * 100 || 0;
  const fatPercent = (fatCals / totalCals) * 100 || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="30"
              strokeDasharray={`${(proteinPercent * 251) / 100} 251`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--muted-foreground)"
              strokeWidth="30"
              strokeDasharray={`${(carbsPercent * 251) / 100} 251`}
              strokeDashoffset={`-${(proteinPercent * 251) / 100}`}
              transform="rotate(-90 50 50)"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--border)"
              strokeWidth="30"
              strokeDasharray={`${(fatPercent * 251) / 100} 251`}
              strokeDashoffset={`-${((proteinPercent + carbsPercent) * 251) / 100}`}
              transform="rotate(-90 50 50)"
            />
            {/* Center text */}
            <text
              x="50"
              y="45"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="currentColor"
            >
              {Math.round(totalCals)}
            </text>
            <text
              x="50"
              y="58"
              textAnchor="middle"
              fontSize="10"
              fill="currentColor"
              opacity="0.7"
            >
              calories
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="text-center p-3 border border-foreground rounded-lg">
            <div className="text-sm font-bold">{proteinPercent.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground mt-1">Protéines</div>
            <div className="text-xs font-medium mt-2">{macros.protein.toFixed(0)}g</div>
          </div>
          <div className="text-center p-3 border border-muted-foreground rounded-lg">
            <div className="text-sm font-bold">{carbsPercent.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground mt-1">Glucides</div>
            <div className="text-xs font-medium mt-2">{macros.carbs.toFixed(0)}g</div>
          </div>
          <div className="text-center p-3 border border-border rounded-lg">
            <div className="text-sm font-bold">{fatPercent.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground mt-1">Lipides</div>
            <div className="text-xs font-medium mt-2">{macros.fat.toFixed(0)}g</div>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-border">
        <h4 className="font-semibold text-sm">Comparaison avec Recommandations</h4>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Protéines</span>
            <span className="text-muted-foreground">
              {macros.protein.toFixed(0)} / {recommendations.protein}g
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-foreground rounded-full h-1.5"
              style={{
                width: `${Math.min((macros.protein / recommendations.protein) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Glucides</span>
            <span className="text-muted-foreground">
              {macros.carbs.toFixed(0)} / {recommendations.carbs}g
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-muted-foreground rounded-full h-1.5"
              style={{
                width: `${Math.min((macros.carbs / recommendations.carbs) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Lipides</span>
            <span className="text-muted-foreground">
              {macros.fat.toFixed(0)} / {recommendations.fat}g
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-border rounded-full h-1.5"
              style={{
                width: `${Math.min((macros.fat / recommendations.fat) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
