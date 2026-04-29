'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const WEIGHT_STORAGE_KEY = 'nutrical.weightEntries.v1';

type WeightEntry = {
  id: string;
  date: string;
  weight: number;
};

type WeightTrackerProps = {
  profileWeight: number;
  onProfileWeightUpdate: (weight: number) => void;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function sanitizeWeight(value: string): number | null {
  const parsed = Number(value.replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 500) return null;
  return Math.round(parsed * 10) / 10;
}

function createEntry(weight: number, date = todayKey()): WeightEntry {
  return {
    id: `${date}-${Date.now()}`,
    date,
    weight,
  };
}

export function WeightTracker({ profileWeight, onProfileWeightUpdate }: WeightTrackerProps) {
  const { toast } = useToast();
  const initialProfileWeight = useRef(profileWeight);
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [weightInput, setWeightInput] = useState(String(profileWeight));
  const [dateInput, setDateInput] = useState(todayKey());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem(WEIGHT_STORAGE_KEY);
      const parsedEntries = savedEntries ? JSON.parse(savedEntries) as WeightEntry[] : [];

      if (parsedEntries.length > 0) {
        setEntries(parsedEntries);
      } else if (initialProfileWeight.current > 0) {
        setEntries([createEntry(initialProfileWeight.current)]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du suivi du poids', error);
      if (initialProfileWeight.current > 0) setEntries([createEntry(initialProfileWeight.current)]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(entries));
  }, [entries, hydrated]);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  }, [entries]);

  const latestEntry = sortedEntries[0];
  const oldestEntry = sortedEntries[sortedEntries.length - 1];
  const totalChange = latestEntry && oldestEntry ? Math.round((latestEntry.weight - oldestEntry.weight) * 10) / 10 : 0;
  const inputWeight = sanitizeWeight(weightInput);
  const canSubmit = inputWeight !== null && Boolean(dateInput);

  const addWeightEntry = () => {
    if (!canSubmit || inputWeight === null) {
      toast({
        title: "Poids invalide",
        description: "Entrez un poids valide entre 1 et 500 kg.",
        variant: "destructive",
      });
      return;
    }

    const nextEntry = createEntry(inputWeight, dateInput);
    setEntries(prev => [nextEntry, ...prev]);
    onProfileWeightUpdate(inputWeight);
    setWeightInput(String(inputWeight));
    setDateInput(todayKey());
    toast({
      title: "Poids enregistré ✅",
      description: `${inputWeight} kg a été ajouté à votre historique.`,
    });
  };

  const removeEntry = (entryId: string) => {
    const removedEntry = entries.find(entry => entry.id === entryId);
    setEntries(prev => prev.filter(entry => entry.id !== entryId));

    if (removedEntry) {
      toast({
        title: "Entrée supprimée",
        description: `${removedEntry.weight} kg du ${removedEntry.date} a été retiré de l’historique.`,
      });
    }
  };

  return (
    <section className="space-y-6" aria-labelledby="weight-tracker-heading">
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle id="weight-tracker-heading" className="text-lg">Suivi du poids</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/40 rounded border border-border">
              <p className="text-xs text-muted-foreground mb-1">Poids actuel</p>
              <p className="text-3xl font-bold">{latestEntry ? latestEntry.weight : profileWeight} kg</p>
              {latestEntry && <p className="text-xs text-muted-foreground mt-1">Dernière entrée : {latestEntry.date}</p>}
            </div>
            <div className="p-4 bg-muted/40 rounded border border-border">
              <p className="text-xs text-muted-foreground mb-1">Changement total</p>
              <p className="text-3xl font-bold">{totalChange > 0 ? '+' : ''}{totalChange} kg</p>
              <p className="text-xs text-muted-foreground mt-1">Depuis la première entrée enregistrée</p>
            </div>
            <div className="p-4 bg-muted/40 rounded border border-border">
              <p className="text-xs text-muted-foreground mb-1">Entrées</p>
              <p className="text-3xl font-bold">{entries.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Sauvegardées localement</p>
            </div>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="weight-entry">Nouveau poids (kg)</FieldLabel>
              <Input
                id="weight-entry"
                type="number"
                inputMode="decimal"
                min="1"
                max="500"
                step="0.1"
                value={weightInput}
                onChange={(event) => setWeightInput(event.target.value)}
                placeholder="Ex. 72.5"
                className="border border-border h-10 text-base"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="weight-date">Date</FieldLabel>
              <Input
                id="weight-date"
                type="date"
                value={dateInput}
                onChange={(event) => setDateInput(event.target.value)}
                className="border border-border h-10 text-base"
              />
            </Field>
          </FieldGroup>

          <Button
            onClick={addWeightEntry}
            disabled={!canSubmit}
            className="w-full h-11 text-base font-semibold bg-foreground text-background hover:bg-foreground/90"
          >
            Enregistrer le poids
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Historique du poids</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {sortedEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune entrée de poids enregistrée pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {sortedEntries.map((entry, index) => {
                const previousEntry = sortedEntries[index + 1];
                const change = previousEntry ? Math.round((entry.weight - previousEntry.weight) * 10) / 10 : 0;

                return (
                  <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-muted/40 border border-border rounded">
                    <div>
                      <p className="text-sm font-medium">{entry.weight} kg</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.date}{previousEntry ? ` • ${change > 0 ? '+' : ''}${change} kg depuis l’entrée précédente` : ' • première entrée'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEntry(entry.id)}
                      className="h-8 px-3 text-xs hover:bg-foreground/10 w-fit"
                    >
                      Retirer
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
