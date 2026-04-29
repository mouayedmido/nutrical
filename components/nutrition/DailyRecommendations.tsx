'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyRecommendations } from '@/lib/recommendations';

type DailyRecommendationsProps = {
  recommendations: DailyRecommendations | null;
};

export function DailyRecommendationsDisplay({ recommendations }: DailyRecommendationsProps) {
  if (!recommendations) {
    return (
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Objectifs Quotidiens</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Entrez votre âge et poids pour obtenir vos jj objectifs nutritionnels personnalisés.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg">Objectifs Quotidiens (Personnalisés)</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* the macroooos */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Macronutriments</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-muted/40 border border-border rounded">
                <p className="text-xs text-muted-foreground mb-1">Calories</p>
                <p className="text-lg font-bold">{recommendations.calories}</p>
              </div>
              <div className="p-3 bg-muted/40 border border-border rounded">
                <p className="text-xs text-muted-foreground mb-1">Protéines</p>
                <p className="text-lg font-bold">{recommendations.protein}g</p>
              </div>
              <div className="p-3 bg-muted/40 border border-border rounded">
                <p className="text-xs text-muted-foreground mb-1">Glucides</p>
                <p className="text-lg font-bold">{recommendations.carbs}g</p>
              </div>
              <div className="p-3 bg-muted/40 border border-border rounded">
                <p className="text-xs text-muted-foreground mb-1">Lipides</p>
                <p className="text-lg font-bold">{recommendations.fat}g</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-3">
              Basé sur votre âge, poids et sexe. Ces valeurs supposent une activité physique modérée.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
