'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProfileForm } from '@/components/nutrition/ProfileForm';
import { FoodSearch } from '@/components/nutrition/FoodSearch';
import { NutritionDisplay } from '@/components/nutrition/NutritionDisplay';
import { VitaminsPanel } from '@/components/nutrition/VitaminsPanel';
import { DailyRecommendationsDisplay } from '@/components/nutrition/DailyRecommendations';
import { WeightTracker } from '@/components/nutrition/WeightTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, getRecommendations, DailyRecommendations } from '@/lib/recommendations';
import { FoodItem } from '@/lib/nutritionData';
import { calculateFoodNutrition } from '@/lib/nutritionCalculator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MacronutrientChart } from '@/components/nutrition/MacronutrientChart';

const PROFILE_STORAGE_KEY = 'nutrical.profile.v1';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getFoodStorageKey(dateKey = getTodayKey()) {
  return `nutrical.foods.${dateKey}.v1`;
}

export default function Home() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<DailyRecommendations | null>(null);
  const [consumedFoods, setConsumedFoods] = useState<FoodItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [todayKey] = useState(getTodayKey);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      const legacyProfile = sessionStorage.getItem('nutritionProfile');
      const parsedProfile = savedProfile || legacyProfile;

      if (parsedProfile) {
        const nextProfile = JSON.parse(parsedProfile) as UserProfile;
        setProfile(nextProfile);
        setRecommendations(getRecommendations(nextProfile));
      }

      const savedFoods = localStorage.getItem(getFoodStorageKey(todayKey));
      if (savedFoods) {
        setConsumedFoods(JSON.parse(savedFoods) as FoodItem[]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données locales', error);
    } finally {
      setHydrated(true);
    }
  }, [todayKey]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(getFoodStorageKey(todayKey), JSON.stringify(consumedFoods));
  }, [consumedFoods, hydrated, todayKey]);

  const totals = consumedFoods.reduce(
    (acc, food) => ({
      protein: acc.protein + (food.protein || 0),
      carbs: acc.carbs + (food.carbs || 0),
      fat: acc.fat + (food.fat || 0),
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );

  const handleProfileChange = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setRecommendations(getRecommendations(newProfile));
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    toast({
      title: "Profil enregistré ✅",
      description: "Vos objectifs nutritionnels personnalisés sont prêts.",
    });
  };

  const handleAddFood = (food: FoodItem, quantity: number) => {
    const calculatedFood = calculateFoodNutrition(food, quantity);
    setConsumedFoods(prev => [...prev, calculatedFood]);
  };

  const handleProfileWeightUpdate = (weight: number) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updatedProfile = { ...prev, weight };
      setRecommendations(getRecommendations(updatedProfile));
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  };

  const handleRemoveFood = (_foodId: string, index: number) => {
    const removedFood = consumedFoods[index];
    setConsumedFoods(prev => prev.filter((_, i) => i !== index));
    if (removedFood) {
      toast({
        title: "Aliment retiré",
        description: `${removedFood.name} a été retiré de votre journée.`,
      });
    }
  };

  const handleClearAll = () => {
    setConsumedFoods([]);
    localStorage.removeItem(getFoodStorageKey(todayKey));
    toast({
      title: "Journée vidée",
      description: "Tous les aliments enregistrés aujourd’hui ont été retirés.",
    });
  };

  const resetProfile = () => {
    setProfile(null);
    setRecommendations(null);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    sessionStorage.removeItem("nutritionProfile");
    toast({
      title: "Profil réinitialisé",
      description: "Vous pouvez maintenant saisir un nouveau profil.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">NutriCal Tunisie</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Suivez vos calories, macronutriments, vitamines et minéraux avec des aliments locaux.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <ThemeToggle />
              {profile && (
                <>
                  <Button variant="outline" onClick={resetProfile} className="border border-border w-fit">
                    Changer le profil
                  </Button>
                  {consumedFoods.length > 0 && (
                    <Button variant="outline" onClick={handleClearAll} className="border border-border w-fit">
                      Vider la journée
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!profile ? (
          <div className="max-w-2xl">
            <ProfileForm onProfileChange={handleProfileChange} />
          </div>
        ) : (
          <div className="space-y-8">
            <Card className="border border-border bg-card text-card-foreground">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-base">Profil actif</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date</p>
                    <p className="text-lg font-semibold">{todayKey}</p>
                  </div>
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
                    <p className="text-lg font-semibold">{profile.sex === 'male' ? 'Homme' : 'Femme'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Objectif</p>
                    <p className="text-lg font-semibold">{recommendations?.calories} cal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="tracker" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 border border-border bg-muted/40 p-1">
                <TabsTrigger value="tracker" className="text-xs">Aliments</TabsTrigger>
                <TabsTrigger value="summary" className="text-xs">Résumé</TabsTrigger>
                <TabsTrigger value="nutrients" className="text-xs">Nutrition</TabsTrigger>
                <TabsTrigger value="targets" className="text-xs">Objectifs</TabsTrigger>
                <TabsTrigger value="weight" className="text-xs">Poids</TabsTrigger>
              </TabsList>

              <TabsContent value="tracker" className="space-y-8 mt-8">
                <FoodSearch onAddFood={handleAddFood} />
              </TabsContent>

              <TabsContent value="summary" className="space-y-8 mt-8">
                <div className="space-y-8">
                  <NutritionDisplay
                    foods={consumedFoods}
                    userWeight={profile.weight}
                    dailyTargets={recommendations ? {
                      calories: recommendations.calories,
                      protein: recommendations.protein,
                      carbs: recommendations.carbs,
                      fat: recommendations.fat,
                    } : undefined}
                    onRemoveFood={handleRemoveFood}
                  />
                  
                  <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                      <MacronutrientChart data={totals} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="nutrients" className="space-y-8 mt-8">
                <VitaminsPanel foods={consumedFoods} dailyRecommendations={recommendations} />
              </TabsContent>

              <TabsContent value="targets" className="space-y-8 mt-8">
                <DailyRecommendationsDisplay recommendations={recommendations} />
              </TabsContent>

              <TabsContent value="weight" className="space-y-8 mt-8">
                <WeightTracker
                  profileWeight={profile.weight}
                  onProfileWeightUpdate={handleProfileWeightUpdate}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            Outil éducatif développé par Mouayed Zmandar, Hazem Cherif, Iyed Barouni et Adam Assas.
          </p>
          <Link href="/about-us" className="inline-flex px-3 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all text-sm">
            À propos du projet
          </Link>
        </div>
      </footer>
    </div>
  );
}