'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProfileForm } from '@/components/nutrition/ProfileForm';
import { FoodSearch } from '@/components/nutrition/FoodSearch';
import { NutritionDisplay } from '@/components/nutrition/NutritionDisplay';
import { VitaminsPanel } from '@/components/nutrition/VitaminsPanel';
import { DailyRecommendationsDisplay } from '@/components/nutrition/DailyRecommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile, getRecommendations, DailyRecommendations } from '@/lib/recommendations';
import { FoodItem } from '@/lib/nutritionData';

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<DailyRecommendations | null>(null);
  const [consumedFoods, setConsumedFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    const savedProfile = sessionStorage.getItem('nutritionProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setRecommendations(getRecommendations(parsed));
      } catch (e) {
        console.error('Erreur lors du chargement du profil', e);
      }
    }
  }, []);

  const handleProfileChange = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setRecommendations(getRecommendations(newProfile));
    sessionStorage.setItem('nutritionProfile', JSON.stringify(newProfile));
  };

  const handleAddFood = (food: FoodItem, quantity: number) => {
    setConsumedFoods(prev => [...prev, food]);
  };

  const handleRemoveFood = (foodId: string, index: number) => {
    setConsumedFoods(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setConsumedFoods([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ts the header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Calculateur de Nutrition</h1>
              <p className="text-sm text-muted-foreground mt-1">Analysez vos calories et micronutriments</p>
            </div>
            {profile && (
              <Button
                variant="outline"
                onClick={() => {
                  setProfile(null);
                  setRecommendations(null);
                  sessionStorage.removeItem('nutritionProfile');
                }}
                className="border border-border w-fit"
              >
                Changer le Profil
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* and this is like the main shit */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!profile ? (
          <div className="max-w-2xl">
            <ProfileForm onProfileChange={handleProfileChange} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* profile summary */}
            <Card className="border border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-base">Profil Actif</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Âge</p>
                    <p className="text-lg font-semibold">{profile.age} ans</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Poids</p>
                    <p className="text-lg font-semibold">{profile.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Sexe</p>
                    <p className="text-lg font-semibold capitalize">{profile.sex === 'male' ? 'Homme' : 'Femme'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Objectif Cal.</p>
                    <p className="text-lg font-semibold">{recommendations?.calories} cal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="tracker" className="w-full">
              <TabsList className="grid w-full grid-cols-4 border border-border bg-muted/40 p-1">
                <TabsTrigger value="tracker" className="text-xs">Aliments</TabsTrigger>
                <TabsTrigger value="summary" className="text-xs">Résumé</TabsTrigger>
                <TabsTrigger value="nutrients" className="text-xs">Nutrition</TabsTrigger>
                <TabsTrigger value="targets" className="text-xs">Objectifs</TabsTrigger>
              </TabsList>

              {/* track Tab */}
              <TabsContent value="tracker" className="space-y-8 mt-8">
                <FoodSearch onAddFood={handleAddFood} />
              </TabsContent>

              {/* summary Tab */}
              <TabsContent value="summary" className="space-y-8 mt-8">
                <NutritionDisplay
                  foods={consumedFoods}
                  dailyTargets={recommendations ? {
                    calories: recommendations.calories,
                    protein: recommendations.protein,
                    carbs: recommendations.carbs,
                    fat: recommendations.fat,
                  } : undefined}
                  onRemoveFood={handleRemoveFood}
                />
              </TabsContent>

              {/* nutri Tab */}
              <TabsContent value="nutrients" className="space-y-8 mt-8">
                <VitaminsPanel foods={consumedFoods} dailyRecommendations={recommendations} />
              </TabsContent>

              {/* targs Tab */}
              <TabsContent value="targets" className="space-y-8 mt-8">
                <DailyRecommendationsDisplay recommendations={recommendations} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* ts the footah */}
      <footer className="border-t border-border mt-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-muted-foreground">
           Cet outil est développé par Mouayed Zmandar, Hazem Cherif, Iyed Barouni et Adam Assas.
          </p>
        </div>
        <Link 
          href="/about-us" 
          className="px-2 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-xs"
        >
          Clique
        </Link>
      </footer>
    </div>
  );
}
