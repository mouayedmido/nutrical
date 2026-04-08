'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';

type UserProfile = {
  age: number | '';
  sex: 'male' | 'female';
  weight: number | '';
  height?: number | '';
};

type ProfileFormProps = {
  onProfileChange: (profile: UserProfile) => void;
};

export function ProfileForm({ onProfileChange }: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    age: '',
    sex: 'male',
    weight: '',
    height: '',
  });

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (profile.age && profile.weight) {
      onProfileChange(profile);
    }
  };

  const isValid = profile.age && profile.weight;

  return (
    <Card className="border border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg">Votre Profil</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <FieldGroup>
          <Field>
            <FieldLabel>Âge</FieldLabel>
            <Input
              type="number"
              placeholder="Entrez votre âge"
              value={profile.age}
              onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value) : '')}
              min="1"
              max="120"
              className="border border-border"
            />
          </Field>

          <Field>
            <FieldLabel>Poids (kg)</FieldLabel>
            <Input
              type="number"
              placeholder="Entrez votre poids"
              value={profile.weight}
              onChange={(e) => handleChange('weight', e.target.value ? parseInt(e.target.value) : '')}
              min="1"
              max="500"
              className="border border-border"
            />
          </Field>

          <Field>
            <FieldLabel>Taille (cm) - Optionnel</FieldLabel>
            <Input
              type="number"
              placeholder="Entrez votre taille"
              value={profile.height || ''}
              onChange={(e) => handleChange('height', e.target.value ? parseInt(e.target.value) : '')}
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
        </FieldGroup>

        <div className="space-y-4 mt-6">
          <p className="text-xs text-muted-foreground">
            Entrez vos détails pour obtenir des recommandations nutritionnelles personnalisées.
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
