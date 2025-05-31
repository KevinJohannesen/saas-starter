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
import { Plus, Trash, ExternalLink, Loader2, Pencil } from "lucide-react";
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

// Define the type for a link (matching database schema)
interface LinkItem {
  id: number;
  title: string;
  url: string;
  description: string | null;
  category: string;
  teamId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

// Group links by category
interface LinkGroups {
  [key: string]: LinkItem[];
}

export default function LenkeadministrasjonPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  // Form state
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    description: "",
    category: "suppliers",
  });

  // Fetch links from the API
  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/team/links");
      if (!response.ok) {
        throw new Error("Failed to fetch links");
      }
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error("Error fetching links:", error);
      toast.error("Kunne ikke laste lenker", {
        description: "Prøv å laste siden på nytt.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load links when component mounts
  useEffect(() => {
    fetchLinks();
  }, []);

  // Group links by category
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

  // Filter links based on active tab
  const getFilteredLinks = () => {
    if (activeTab === "all") {
      return links;
    }
    return links.filter((link) => link.category === activeTab);
  };

  // Handle dialog open for editing
  const handleEditClick = (link: LinkItem) => {
    setEditingLink(link);
    setNewLink({
      title: link.title,
      url: link.url,
      description: link.description || "",
      category: link.category,
    });
    setIsDialogOpen(true);
  };

  // Add or update link
  const handleAddOrUpdateLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast.error("Manglende informasjon", {
        description: "Vennligst fyll ut tittel og URL.",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingLink) {
        // Update existing link
        const response = await fetch(`/api/team/links?id=${editingLink.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLink),
        });

        if (!response.ok) {
          throw new Error("Failed to update link");
        }

        const updatedLink = await response.json();
        setLinks((prev) =>
          prev.map((link) => (link.id === editingLink.id ? updatedLink : link))
        );

        toast.success("Lenke oppdatert", {
          description: `${newLink.title} er oppdatert.`,
        });
      } else {
        // Add new link
        const response = await fetch("/api/team/links", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLink),
        });

        if (!response.ok) {
          throw new Error("Failed to add link");
        }

        const addedLink = await response.json();
        setLinks((prev) => [...prev, addedLink]);

        toast.success("Lenke lagt til", {
          description: `${newLink.title} er lagt til i ${getCategoryName(
            newLink.category
          )}.`,
        });
      }

      setIsDialogOpen(false);
      setEditingLink(null);

      // Reset form
      setNewLink({
        title: "",
        url: "",
        description: "",
        category: "suppliers",
      });
    } catch (error) {
      console.error("Error saving link:", error);
      toast.error(
        editingLink
          ? "Kunne ikke oppdatere lenke"
          : "Kunne ikke legge til lenke",
        {
          description: "Prøv igjen senere.",
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Remove link
  const handleRemoveLink = async (id: number) => {
    const linkToRemove = links.find((link) => link.id === id);

    try {
      const response = await fetch(`/api/team/links?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete link");
      }

      setLinks((prev) => prev.filter((link) => link.id !== id));

      toast.success("Lenke fjernet", {
        description: `${linkToRemove?.title} er fjernet.`,
      });
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Kunne ikke fjerne lenke", {
        description: "Prøv igjen senere.",
      });
    }
  };

  // Get category name in Norwegian
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

  // Grouped links for "all" view
  const groupedLinks = groupLinksByCategory(links);
  const filteredLinks = getFilteredLinks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Lenkeadministrasjon
          </h1>
          <p className="text-muted-foreground">
            Administrer og organiser alle teamets viktige nettlenker
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditingLink(null);
              setNewLink({
                title: "",
                url: "",
                description: "",
                category: "suppliers",
              });
            }
            setIsDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Legg til ny lenke
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingLink ? "Rediger lenke" : "Legg til ny lenke"}
              </DialogTitle>
              <DialogDescription>
                {editingLink
                  ? "Oppdater informasjonen for denne lenken."
                  : "Fyll ut informasjonen for å legge til en ny lenke som hele teamet kan bruke."}
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
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingLink(null);
                }}
              >
                Avbryt
              </Button>
              <Button onClick={handleAddOrUpdateLink} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingLink ? "Oppdater lenke" : "Legg til lenke"}
              </Button>
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
                      onEdit={() => handleEditClick(link)}
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
                      onEdit={() => handleEditClick(link)}
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
  onEdit,
}: {
  link: LinkItem;
  onRemove: () => void;
  onEdit: () => void;
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
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
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
