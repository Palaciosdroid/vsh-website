export const metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Impressum</h1>
      <div className="mt-6 text-muted-foreground">
        <p className="font-semibold text-vsh-text">Verband Schweizer Hypnosetherapeuten (VSH)</p>
        <p className="mt-2 italic">Adresse und weitere Angaben werden ergänzt.</p>
      </div>
    </div>
  );
}
