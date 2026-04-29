'use client';

import { DailyRecommendations } from '@/lib/nutrition-calc';
import { Card } from '@/components/ui/card';

interface DailyRecommendationsProps {
  recommendations: DailyRecommendations;
}

export function DailyRecommendationsPanel({ recommendations }: DailyRecommendationsProps) {
  const RecommendationGroup = ({ title, items }: any) => (
    <Card className="p-4 border-0 bg-muted/30">
      <h4 className="font-semibold mb-4 text-sm">{title}</h4>
      <div className="space-y-3">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between items-center pb-3 border-b border-border/30 last:border-b-0">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="font-medium text-sm">{item.value} {item.unit}</span>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Besoins Nutritionnels Quotidiens</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Ces valeurs sont basées sur votre profil personnel et sont des recommandations officielles (RDA/AI)
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <RecommendationGroup
          title="Macronutriments"
          items={[
            { label: 'Calories', value: Math.round(recommendations.calories), unit: 'kcal' },
            { label: 'Protéines', value: recommendations.protein, unit: 'g' },
            { label: 'Glucides', value: recommendations.carbs, unit: 'g' },
            { label: 'Lipides', value: recommendations.fat, unit: 'g' },
            { label: 'Gras saturé (max)', value: recommendations.saturatedFat.toFixed(1), unit: 'g' },
            { label: 'Fibres', value: recommendations.fiber.toFixed(1), unit: 'g' },
          ]}
        />

        <RecommendationGroup
          title="Électrolytes & Autres"
          items={[
            { label: 'Sodium (max)', value: recommendations.sodium, unit: 'mg' },
            { label: 'Potassium (min)', value: recommendations.potassium, unit: 'mg' },
          ]}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <RecommendationGroup
          title="Vitamines Liposolubles"
          items={[
            { label: 'Vitamine A', value: recommendations.vitaminA, unit: 'mcg' },
            { label: 'Vitamine D', value: recommendations.vitaminD.toFixed(1), unit: 'mcg' },
            { label: 'Vitamine E', value: recommendations.vitaminE, unit: 'mg' },
            { label: 'Vitamine K', value: recommendations.vitaminK, unit: 'mcg' },
          ]}
        />

        <RecommendationGroup
          title="Vitamines Hydrosolubles"
          items={[
            { label: 'Thiamine (B1)', value: recommendations.thiamine.toFixed(2), unit: 'mg' },
            { label: 'Riboflavine (B2)', value: recommendations.riboflavin.toFixed(2), unit: 'mg' },
            { label: 'Niacine (B3)', value: recommendations.niacin, unit: 'mg' },
            { label: 'Acide Pantothénique (B5)', value: recommendations.pantothenicAcid.toFixed(1), unit: 'mg' },
            { label: 'Vitamine B6', value: recommendations.vitaminB6.toFixed(2), unit: 'mg' },
            { label: 'Biotine (B7)', value: recommendations.biotin, unit: 'mcg' },
            { label: 'Folate (B9)', value: recommendations.folate, unit: 'mcg' },
            { label: 'Vitamine B12', value: recommendations.vitaminB12.toFixed(2), unit: 'mcg' },
            { label: 'Vitamine C', value: recommendations.vitaminC, unit: 'mg' },
          ]}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <RecommendationGroup
          title="Minéraux"
          items={[
            { label: 'Calcium', value: recommendations.calcium, unit: 'mg' },
            { label: 'Fer', value: recommendations.iron.toFixed(1), unit: 'mg' },
            { label: 'Magnésium', value: recommendations.magnesium, unit: 'mg' },
            { label: 'Phosphore', value: recommendations.phosphorus, unit: 'mg' },
            { label: 'Zinc', value: recommendations.zinc.toFixed(1), unit: 'mg' },
            { label: 'Cuivre', value: recommendations.copper.toFixed(2), unit: 'mg' },
            { label: 'Manganèse', value: recommendations.manganese.toFixed(1), unit: 'mg' },
            { label: 'Sélénium', value: recommendations.selenium, unit: 'mcg' },
          ]}
        />

        <Card className="p-4 border-0 bg-muted/30">
          <h4 className="font-semibold mb-4 text-sm">Info Importantes</h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <div className="font-medium text-foreground mb-1">RDA / Adequate Intake</div>
              <p>Les valeurs affichées sont les quantités journalières recommandées pour une bonne santé.</p>
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">Variations</div>
              <p>Les besoins peuvent varier selon le métabolisme, l'activité réelle, et la santé générale.</p>
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">Conseil</div>
              <p>Consultez un nutritionniste pour un plan personnalisé en fonction de vos objectifs.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
