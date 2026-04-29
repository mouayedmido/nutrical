'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { UserProfile } from '@/lib/nutrition-calc';

interface ProfileFormProps {
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

export function ProfileForm({ onSave, initialProfile }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      age: 30,
      weight: 70,
      height: 175,
      sex: 'male',
      activityLevel: 'moderate',
    }
  );

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: field === 'sex' || field === 'activityLevel' ? value : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  return (
    <Card className="p-6 border-0">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Votre Profil</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Ces informations permettront de calculer vos besoins nutritionnels quotidiens
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Âge (ans)</label>
            <Input
              type="number"
              min="13"
              max="120"
              value={profile.age}
              onChange={e => handleChange('age', e.target.value)}
              className="border border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Poids (kg)</label>
            <Input
              type="number"
              min="30"
              max="300"
              step="0.1"
              value={profile.weight}
              onChange={e => handleChange('weight', e.target.value)}
              className="border border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Taille (cm)</label>
            <Input
              type="number"
              min="100"
              max="250"
              value={profile.height}
              onChange={e => handleChange('height', e.target.value)}
              className="border border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sexe</label>
            <select
              value={profile.sex}
              onChange={e => handleChange('sex', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Niveau d'Activité</label>
          <select
            value={profile.activityLevel}
            onChange={e => handleChange('activityLevel', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="sedentary">Sédentaire (peu ou pas d'exercice)</option>
            <option value="light">Léger (exercice 1-3 jours/semaine)</option>
            <option value="moderate">Modéré (exercice 3-5 jours/semaine)</option>
            <option value="active">Actif (exercice 6-7 jours/semaine)</option>
            <option value="very-active">Très actif (exercice quotidien intense)</option>
          </select>
        </div>

        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Mettre à jour le Profil
        </Button>
      </form>
    </Card>
  );
}
