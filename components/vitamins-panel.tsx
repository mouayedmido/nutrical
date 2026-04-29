'use client';

import { DailyRecommendations, calculatePercentDV } from '@/lib/nutrition-calc';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VitaminsPanelProps {
  consumed: {
    vitaminA: number;
    vitaminC: number;
    vitaminD: number;
    vitaminE: number;
    vitaminK: number;
    thiamine: number;
    riboflavin: number;
    niacin: number;
    pantothenicAcid: number;
    vitaminB6: number;
    biotin: number;
    folate: number;
    vitaminB12: number;
    calcium: number;
    iron: number;
    magnesium: number;
    phosphorus: number;
    zinc: number;
    copper: number;
    manganese: number;
    selenium: number;
    sodium: number;
    potassium: number;
  };
  recommendations: DailyRecommendations;
}

export function VitaminsPanel({ consumed, recommendations }: VitaminsPanelProps) {
  const getNutrientStatus = (percentDV: number) => {
    if (percentDV >= 100) return { label: 'Excellent', color: 'bg-green-100 text-green-900' };
    if (percentDV >= 75) return { label: 'Bon', color: 'bg-blue-100 text-blue-900' };
    if (percentDV >= 50) return { label: 'Acceptable', color: 'bg-amber-100 text-amber-900' };
    return { label: 'Insuffisant', color: 'bg-red-100 text-red-900' };
  };

  const NutrientRow = ({ label, consumed: c, recommendation, unit, displayValue }: any) => {
    const percentDV = calculatePercentDV(c, recommendation);
    const status = getNutrientStatus(percentDV);
    return (
      <div className="flex items-center justify-between p-3 border-b border-border/30 last:border-b-0">
        <div className="flex-1">
          <div className="font-medium text-sm">{label}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {displayValue || `${c.toFixed(1)} / ${recommendation} ${unit}`}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-bold">{percentDV}%</div>
            <div className={`text-xs px-2 py-1 rounded ${status.color}`}>
              {status.label}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProgressBar = ({ value, max, label }: any) => {
    const percent = Math.min((value / max) * 100, 100);
    return (
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">{percent.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-foreground rounded-full h-2 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="vitamins" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="vitamins">Vitamines</TabsTrigger>
          <TabsTrigger value="minerals">Minéraux</TabsTrigger>
          <TabsTrigger value="other">Autres</TabsTrigger>
        </TabsList>

        <TabsContent value="vitamins" className="space-y-4">
          <Card className="p-4 border-0 bg-muted/30">
            <h4 className="font-semibold mb-4">Vitamines Liposolubles</h4>
            <div>
              <NutrientRow
                label="Vitamine A"
                consumed={consumed.vitaminA}
                recommendation={recommendations.vitaminA}
                unit="mcg"
              />
              <NutrientRow
                label="Vitamine D"
                consumed={consumed.vitaminD}
                recommendation={recommendations.vitaminD}
                unit="mcg"
              />
              <NutrientRow
                label="Vitamine E"
                consumed={consumed.vitaminE}
                recommendation={recommendations.vitaminE}
                unit="mg"
              />
              <NutrientRow
                label="Vitamine K"
                consumed={consumed.vitaminK}
                recommendation={recommendations.vitaminK}
                unit="mcg"
              />
            </div>
          </Card>

          <Card className="p-4 border-0 bg-muted/30">
            <h4 className="font-semibold mb-4">Vitamines Hydrosolubles</h4>
            <div>
              <NutrientRow
                label="Thiamine (B1)"
                consumed={consumed.thiamine}
                recommendation={recommendations.thiamine}
                unit="mg"
              />
              <NutrientRow
                label="Riboflavine (B2)"
                consumed={consumed.riboflavin}
                recommendation={recommendations.riboflavin}
                unit="mg"
              />
              <NutrientRow
                label="Niacine (B3)"
                consumed={consumed.niacin}
                recommendation={recommendations.niacin}
                unit="mg"
              />
              <NutrientRow
                label="Acide Pantothénique (B5)"
                consumed={consumed.pantothenicAcid}
                recommendation={recommendations.pantothenicAcid}
                unit="mg"
              />
              <NutrientRow
                label="Vitamine B6"
                consumed={consumed.vitaminB6}
                recommendation={recommendations.vitaminB6}
                unit="mg"
              />
              <NutrientRow
                label="Biotine (B7)"
                consumed={consumed.biotin}
                recommendation={recommendations.biotin}
                unit="mcg"
              />
              <NutrientRow
                label="Folate (B9)"
                consumed={consumed.folate}
                recommendation={recommendations.folate}
                unit="mcg"
              />
              <NutrientRow
                label="Vitamine B12"
                consumed={consumed.vitaminB12}
                recommendation={recommendations.vitaminB12}
                unit="mcg"
              />
              <NutrientRow
                label="Vitamine C"
                consumed={consumed.vitaminC}
                recommendation={recommendations.vitaminC}
                unit="mg"
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="minerals" className="space-y-4">
          <Card className="p-4 border-0 bg-muted/30">
            <h4 className="font-semibold mb-4">Minéraux Essentiels</h4>
            <div>
              <NutrientRow
                label="Calcium"
                consumed={consumed.calcium}
                recommendation={recommendations.calcium}
                unit="mg"
              />
              <NutrientRow
                label="Fer"
                consumed={consumed.iron}
                recommendation={recommendations.iron}
                unit="mg"
              />
              <NutrientRow
                label="Magnésium"
                consumed={consumed.magnesium}
                recommendation={recommendations.magnesium}
                unit="mg"
              />
              <NutrientRow
                label="Phosphore"
                consumed={consumed.phosphorus}
                recommendation={recommendations.phosphorus}
                unit="mg"
              />
              <NutrientRow
                label="Zinc"
                consumed={consumed.zinc}
                recommendation={recommendations.zinc}
                unit="mg"
              />
              <NutrientRow
                label="Cuivre"
                consumed={consumed.copper}
                recommendation={recommendations.copper}
                unit="mg"
              />
              <NutrientRow
                label="Manganèse"
                consumed={consumed.manganese}
                recommendation={recommendations.manganese}
                unit="mg"
              />
              <NutrientRow
                label="Sélénium"
                consumed={consumed.selenium}
                recommendation={recommendations.selenium}
                unit="mcg"
              />
            </div>
          </Card>

          <Card className="p-4 border-0 bg-muted/30">
            <h4 className="font-semibold mb-4">Électrolytes</h4>
            <div>
              <NutrientRow
                label="Potassium"
                consumed={consumed.potassium}
                recommendation={recommendations.potassium}
                unit="mg"
              />
              <NutrientRow
                label="Sodium"
                consumed={consumed.sodium}
                recommendation={recommendations.sodium}
                unit="mg"
                displayValue={`${consumed.sodium.toFixed(0)} / ${recommendations.sodium} mg (à limiter)`}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          <Card className="p-4 border-0 bg-muted/30">
            <h4 className="font-semibold mb-4">Vue d'ensemble</h4>
            <div className="space-y-4">
              <ProgressBar
                value={consumed.vitaminA}
                max={recommendations.vitaminA}
                label="Vitamines liposolubles (avg)"
              />
              <ProgressBar
                value={consumed.vitaminC}
                max={recommendations.vitaminC}
                label="Vitamines hydrosolubles (avg)"
              />
              <ProgressBar
                value={consumed.calcium}
                max={recommendations.calcium}
                label="Minéraux"
              />
              <ProgressBar
                value={consumed.potassium}
                max={recommendations.potassium}
                label="Électrolytes"
              />
            </div>
          </Card>

          <Card className="p-4 border-0 bg-muted/30">
            <h4 className="font-semibold mb-4">Recommandations Nutritionnelles</h4>
            <div className="text-sm space-y-2 text-muted-foreground">
              <p>✓ Diversifiez vos aliments pour obtenir tous les micronutriments</p>
              <p>✓ Les fruits et légumes sont riches en vitamines et minéraux</p>
              <p>✓ Limitez le sodium à moins de 2300 mg par jour</p>
              <p>✓ Visez au moins 3400-2600 mg de potassium par jour</p>
              <p>✓ Les vitamines B sont essentielles pour l'énergie</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
