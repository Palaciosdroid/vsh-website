import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export const metadata = { title: "Dokumente – VSH" };

interface Document {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  file_url: string;
}

export default async function DokumentePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("category")
    .order("title");

  const grouped = (documents ?? []).reduce<Record<string, Document[]>>(
    (acc, doc) => {
      const cat = doc.category ?? "Allgemein";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(doc);
      return acc;
    },
    {}
  );

  const categories = Object.keys(grouped).sort((a, b) => {
    if (a === "Allgemein") return 1;
    if (b === "Allgemein") return -1;
    return a.localeCompare(b, "de");
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Dokumente</h1>
      <p className="mt-2 text-muted-foreground">
        Interne Verbandsdokumente für Mitglieder.
      </p>

      <div className="mt-8 space-y-8">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">
                Noch keine Dokumente vorhanden
              </p>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <section key={category}>
              <h2 className="mb-3 text-lg font-semibold text-vsh-text">
                {category}
              </h2>
              <div className="space-y-3">
                {grouped[category].map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-vsh-blue/10">
                        <FileText className="h-5 w-5 text-vsh-blue" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-vsh-text">
                            {doc.title}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {doc.category ?? "Allgemein"}
                          </Badge>
                        </div>
                        {doc.description && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {doc.description}
                          </p>
                        )}
                      </div>

                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Download className="mr-1.5 h-3.5 w-3.5" />
                          Herunterladen
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
