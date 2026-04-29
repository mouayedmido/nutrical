'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyRecommendations } from '@/lib/recommendations';

type DailyRecommendationsProps = {
  recommendations: DailyRecommendations | null;
};

const activityLabels = {
  sedentary: 'Sédentaire',
  light: 'Activité légère',
  moderate: 'Activité modérée',
  active: 'Active',
  'very-active': 'Très active',
};

const goalLabels = {
  lose: 'Perte de poids',
  maintain: 'Maintien',
  gain: 'Prise de poids',
};

export function DailyRecommendationsDisplay({ recommendations }: DailyRecommendationsProps) {
  if (!recommendations) {
    return (
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Objectifs quotidiens</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Entrez votre profil pour obtenir vos objectifs nutritionnels personnalisés.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg">Objectifs quotidiens personnalisés</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
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

          <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-muted/40 border border-border rounded">
              <p className="text-xs text-muted-foreground mb-1">Activité</p>
              <p className="text-sm font-semibold">{activityLabels[recommendations.activityLevel]}</p>
            </div>
            <div className="p-3 bg-muted/40 border border-border rounded">
              <p className="text-xs text-muted-foreground mb-1">Objectif</p>
              <p className="text-sm font-semibold">{goalLabels[recommendations.goal]}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Estimation calculée avec la formule Mifflin-St Jeor, un facteur d’activité et votre objectif. Les valeurs ne remplacent pas un avis médical.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
