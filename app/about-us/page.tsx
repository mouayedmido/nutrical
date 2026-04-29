import Link from 'next/link';

const team = ['Mouayed Zmandar', 'Hazem Cherif', 'Iyed Barouni', 'Adam Assas'];

export default function AboutUs() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans px-4">
      <div className="max-w-2xl w-full text-center p-8 border border-border rounded-3xl bg-muted/30 shadow-sm space-y-8">
        <div>
          <h1 className="text-sm uppercase tracking-[0.3em] mb-4 text-muted-foreground">Crédits du projet</h1>
          <h2 className="text-2xl md:text-3xl font-semibold">NutriCal Tunisie</h2>
          <p className="text-sm text-muted-foreground mt-3">
            Une application de suivi nutritionnel pensée pour aider les utilisateurs en Tunisie à suivre leur alimentation quotidienne.
          </p>
        </div>

        <div className="space-y-3" aria-label="Membres de l'équipe">
          {team.map((name) => (
            <p key={name} className="text-xl md:text-2xl font-bold">
              {name}
            </p>
          ))}
        </div>

        <Link href="/" className="inline-flex px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all text-sm">
          Retour au calculateur
        </Link>
      </div>
    </main>
  );
}
