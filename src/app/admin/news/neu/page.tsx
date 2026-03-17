import { NewsEditor } from "@/components/admin/news-editor";

export const metadata = { title: "Neuer Beitrag – VSH" };

export default function AdminNewsNeuPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Neuer Beitrag</h1>
      <p className="mt-2 text-muted-foreground">
        Erstellen Sie einen neuen News-Beitrag.
      </p>
      <div className="mt-8">
        <NewsEditor initialData={null} />
      </div>
    </div>
  );
}
