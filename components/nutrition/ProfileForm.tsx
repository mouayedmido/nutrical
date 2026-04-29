'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { ActivityLevel, NutritionGoal, UserProfile } from '@/lib/recommendations';

type FormProfile = {
  age: number | '';
  sex: 'male' | 'female';
  weight: number | '';
  height: number | '';
  activityLevel: ActivityLevel;
  goal: NutritionGoal;
};

type ProfileFormProps = {
  onProfileChange: (profile: UserProfile) => void;
};

const activityLabels: Array<{ value: ActivityLevel; label: string }> = [
  { value: 'sedentary', label: 'Sédentaire' },
  { value: 'light', label: 'Légère' },
  { value: 'moderate', label: 'Modérée' },
  { value: 'active', label: 'Active' },
  { value: 'very-active', label: 'Très active' },
];

const goalLabels: Array<{ value: NutritionGoal; label: string }> = [
  { value: 'lose', label: 'Perdre du poids' },
  { value: 'maintain', label: 'Maintenir' },
  { value: 'gain', label: 'Prendre du poids' },
];

export function ProfileForm({ onProfileChange }: ProfileFormProps) {
  const [profile, setProfile] = useState<FormProfile>({
    age: '',
    sex: 'male',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    goal: 'maintain',
  });

  const handleChange = <K extends keyof FormProfile>(field: K, value: FormProfile[K]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const isValid = Number(profile.age) > 0 && Number(profile.weight) > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    onProfileChange({
      age: Number(profile.age),
      sex: profile.sex,
      weight: Number(profile.weight),
      height: profile.height ? Number(profile.height) : undefined,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
    });
  };

  return (
    <Card className="border border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg">Votre profil</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="age">Âge</FieldLabel>
            <Input
              id="age"
              type="number"
              inputMode="numeric"
              placeholder="Entrez votre âge"
              value={profile.age}
              onChange={(e) => handleChange('age', e.target.value ? Number(e.target.value) : '')}
              min="1"
              max="120"
              className="border border-border"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="weight">Poids (kg)</FieldLabel>
            <Input
              id="weight"
              type="number"
              inputMode="decimal"
              placeholder="Ex. 70"
              value={profile.weight}
              onChange={(e) => handleChange('weight', e.target.value ? Number(e.target.value) : '')}
              min="1"
              max="500"
              className="border border-border"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="height">Taille (cm)</FieldLabel>
            <Input
              id="height"
              type="number"
              inputMode="numeric"
              placeholder="Optionnel, ex. 175"
              value={profile.height}
              onChange={(e) => handleChange('height', e.target.value ? Number(e.target.value) : '')}
              min="50"
              max="250"
              className="border border-border"
            />
          </Field>

          <Field>
            <FieldLabel>Sexe</FieldLabel>
            <RadioGroup value={profile.sex} onValueChange={(value) => handleChange('sex', value as 'male' | 'female')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer font-normal">Homme</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer font-normal">Femme</Label>
              </div>
            </RadioGroup>
          </Field>

          <Field>
            <FieldLabel>Niveau d’activité</FieldLabel>
            <RadioGroup value={profile.activityLevel} onValueChange={(value) => handleChange('activityLevel', value as ActivityLevel)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activityLabels.map(item => (
                  <div key={item.value} className="flex items-center space-x-2 rounded-md border border-border p-2">
                    <RadioGroupItem value={item.value} id={`activity-${item.value}`} />
                    <Label htmlFor={`activity-${item.value}`} className="cursor-pointer font-normal text-sm">{item.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Field>

          <Field>
            <FieldLabel>Objectif</FieldLabel>
            <RadioGroup value={profile.goal} onValueChange={(value) => handleChange('goal', value as NutritionGoal)}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {goalLabels.map(item => (
                  <div key={item.value} className="flex items-center space-x-2 rounded-md border border-border p-2">
                    <RadioGroupItem value={item.value} id={`goal-${item.value}`} />
                    <Label htmlFor={`goal-${item.value}`} className="cursor-pointer font-normal text-sm">{item.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Field>
        </FieldGroup>

        <div className="space-y-4 mt-6">
          <p className="text-xs text-muted-foreground">
            Ces informations servent à estimer vos calories et macronutriments quotidiens. Les résultats restent indicatifs.
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full bg-foreground text-background hover:bg-foreground/90"
          >
            Continuer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
