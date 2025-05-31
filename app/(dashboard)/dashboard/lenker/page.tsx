"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Definere typen for en lenke
interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
}

// Gruppere lenker etter kategori
interface LinkGroups {
  [key: string]: LinkItem[];
}

export default function LenkeadministrasjonPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [newLink, setNewLink] = useState<Omit<LinkItem, "id">>({
    title: "",
    url: "",
    description: "",
    category: "suppliers",
  });

  // Last inn lenker fra localStorage når komponenten lastes
  useEffect(() => {
    const savedLinks = localStorage.getItem("intranet-links");
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    } else {
      // Standard lenker hvis ingen er lagret
      const defaultLinks: LinkItem[] = [
        {
          id: "1",
          title: "ABC Byggematerialer",
          url: "https://abcmaterialer.com",
          description: "Hovedleverandør av byggematerialer",
          category: "suppliers",
        },
        {
          id: "2",
          title: "XYZ Utstyrsutleie",
          url: "https://xyzutleie.com",
          description: "Portal for utleie av tungt utstyr",
          category: "suppliers",
        },
        {
          id: "3",
          title: "Hurtigbetong",
          url: "https://hurtigbetong.com",
          description: "Betongbestillingssystem",
          category: "suppliers",
        },
        {
          id: "4",
          title: "Byutviklingsselskapet",
          url: "https://byutvikling.com",
          description: "Nåværende kundeportal",
          category: "clients",
        },
        {
          id: "5",
          title: "Boligbyggelaget",
          url: "https://boligbyggelaget.org",
          description: "Boligprosjektkunde",
          category: "clients",
        },
        {
          id: "6",
          title: "Byggforskrifter",
          url: "https://byggforskrifter.no",
          description: "Nyeste byggforskrifter og standarder",
          category: "resources",
        },
        {
          id: "7",
          title: "Byggebransjeforeningen",
          url: "https://byggebransjeforeningen.org",
          description: "Bransjeforeningsressurser",
          category: "resources",
        },
        {
          id: "8",
          title: "Materialkalkulator",
          url: "https://materialkalkulator.no",
          description: "Beregn materialbehov",
          category: "tools",
        },
        {
          id: "9",
          title: "Prosjekttidslinjeverkøy",
          url: "https://prosjekttidslinje.no",
          description: "Prosjektplanleggingsverktøy",
          category: "tools",
        },
      ];
      setLinks(defaultLinks);
      localStorage.setItem("intranet-links", JSON.stringify(defaultLinks));
    }
  }, []);

  // Lagre lenker til localStorage når de endres
  useEffect(() => {
    localStorage.setItem("intranet-links", JSON.stringify(links));
  }, [links]);

  // Gruppere lenker etter kategori
  const groupLinksByCategory = (links: LinkItem[]): LinkGroups => {
    return links.reduce((groups: LinkGroups, link) => {
      const category = link.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(link);
      return groups;
    }, {});
  };

  // Filtrer lenker basert på aktiv fane
  const getFilteredLinks = () => {
    if (activeTab === "all") {
      return links;
    }
    return links.filter((link) => link.category === activeTab);
  };

  // Legg til ny lenke
  const handleAddLink = () => {
    if (!newLink.title || !newLink.url) {
      toast.error("Manglende informasjon", {
        description: "Vennligst fyll ut tittel og URL.",
      });
      return;
    }

    // Ensure URL has protocol
    let url = newLink.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const newLinkItem: LinkItem = {
      ...newLink,
      url,
      id: Date.now().toString(),
    };

    setLinks((prev) => [...prev, newLinkItem]);
    setIsDialogOpen(false);

    toast.success("Lenke lagt til", {
      description: `${newLink.title} er lagt til i ${getCategoryName(
        newLink.category
      )}.`,
    });

    // Reset form
    setNewLink({
      title: "",
      url: "",
      description: "",
      category: "suppliers",
    });
  };

  // Fjern lenke
  const handleRemoveLink = (id: string) => {
    const linkToRemove = links.find((link) => link.id === id);
    setLinks((prev) => prev.filter((link) => link.id !== id));

    toast.success("Lenke fjernet", {
      description: `${linkToRemove?.title} er fjernet.`,
    });
  };

  // Få kategorinavn på norsk
  const getCategoryName = (category: string): string => {
    switch (category) {
      case "suppliers":
        return "Leverandører";
      case "clients":
        return "Kunder";
      case "resources":
        return "Ressurser";
      case "tools":
        return "Verktøy";
      default:
        return "Annet";
    }
  };

  // Grupperte lenker for "all" visning
  const groupedLinks = groupLinksByCategory(links);
  const filteredLinks = getFilteredLinks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Lenkeadministrasjon
          </h1>
          <p className="text-muted-foreground">
            Administrer og organiser alle dine viktige nettlenker
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Legg til ny lenke
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Legg til ny lenke</DialogTitle>
              <DialogDescription>
                Fyll ut informasjonen for å legge til en ny lenke i din samling.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tittel</Label>
                <Input
                  id="title"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                  placeholder="Skriv inn nettstedets tittel"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                  placeholder="https://eksempel.no"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={newLink.category}
                  onValueChange={(value) =>
                    setNewLink({ ...newLink, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Velg en kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suppliers">Leverandører</SelectItem>
                    <SelectItem value="clients">Kunder</SelectItem>
                    <SelectItem value="resources">Ressurser</SelectItem>
                    <SelectItem value="tools">Verktøy</SelectItem>
                    <SelectItem value="other">Annet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Beskrivelse</Label>
                <Textarea
                  id="description"
                  value={newLink.description}
                  onChange={(e) =>
                    setNewLink({ ...newLink, description: e.target.value })
                  }
                  placeholder="Kort beskrivelse av nettstedet"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Avbryt
              </Button>
              <Button onClick={handleAddLink}>Legg til lenke</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Alle Lenker</TabsTrigger>
          <TabsTrigger value="suppliers">Leverandører</TabsTrigger>
          <TabsTrigger value="clients">Kunder</TabsTrigger>
          <TabsTrigger value="resources">Ressurser</TabsTrigger>
          <TabsTrigger value="tools">Verktøy</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {Object.keys(groupedLinks).length > 0 ? (
            Object.entries(groupedLinks).map(([category, categoryLinks]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{getCategoryName(category)}</CardTitle>
                  <CardDescription>
                    Lenker til {getCategoryName(category).toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryLinks.map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onRemove={() => handleRemoveLink(link.id)}
                    />
                  ))}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                Ingen lenker funnet. Legg til noen lenker for å komme i gang.
              </p>
            </div>
          )}
        </TabsContent>

        {["suppliers", "clients", "resources", "tools"].map((category) => (
          <TabsContent
            key={category}
            value={category}
            className="space-y-4 mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>{getCategoryName(category)}</CardTitle>
                <CardDescription>
                  Lenker til {getCategoryName(category).toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLinks.length > 0 ? (
                  filteredLinks.map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onRemove={() => handleRemoveLink(link.id)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-6">
                    <p className="text-muted-foreground">
                      Ingen lenker i denne kategorien. Legg til noen lenker for
                      å komme i gang.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function LinkCard({
  link,
  onRemove,
}: {
  link: LinkItem;
  onRemove: () => void;
}) {
  // Ensure URL has protocol
  const getFullUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{link.title}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{link.description}</p>
        <a
          href={getFullUrl(link.url)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline inline-flex items-center"
        >
          Besøk nettsted
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
