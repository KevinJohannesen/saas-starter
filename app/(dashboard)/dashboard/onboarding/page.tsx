"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const companyFormSchema = z.object({
  companyName: z.string().min(2, "Bedriftsnavn må være minst 2 tegn"),
  companyAddress: z.string().min(5, "Adresse må være minst 5 tegn"),
  companyPhone: z.string().min(8, "Telefonnummer må være minst 8 tegn"),
  companyEmail: z.string().email("Ugyldig e-postadresse"),
  companyWebsite: z
    .string()
    .url("Ugyldig nettsted")
    .optional()
    .or(z.literal("")),
  companyOrgNumber: z
    .string()
    .min(9, "Organisasjonsnummer må være 9 siffer")
    .optional()
    .or(z.literal("")),
  companyVatNumber: z
    .string()
    .min(9, "MVA-nummer må være 9 siffer")
    .optional()
    .or(z.literal("")),
  theme: z.enum(["light", "dark", "system"]),
  timezone: z.string(),
  language: z.enum(["no", "en"]),
  currency: z.enum(["NOK", "EUR", "USD"]),
  dateFormat: z.enum(["DD.MM.YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]),
  timeFormat: z.enum(["12", "24"]),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "",
      companyAddress: "",
      companyPhone: "",
      companyEmail: "",
      companyWebsite: "",
      companyOrgNumber: "",
      companyVatNumber: "",
      theme: "light",
      timezone: "Europe/Oslo",
      language: "no",
      currency: "NOK",
      dateFormat: "DD.MM.YYYY",
      timeFormat: "24",
    },
  });

  async function onSubmit(data: CompanyFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/team/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update company information");
      }

      toast.success("Bedriftsinformasjon oppdatert", {
        description: "Din bedriftsinformasjon er nå lagret.",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating company information:", error);
      toast.error("Kunne ikke oppdatere bedriftsinformasjon", {
        description: "Prøv igjen senere.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Velkommen til din nye bedrift</CardTitle>
          <CardDescription>
            Fyll inn informasjon om din bedrift for å komme i gang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedriftsnavn</FormLabel>
                      <FormControl>
                        <Input placeholder="Ditt bedriftsnavn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedriftsadresse</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Full bedriftsadresse"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input placeholder="+47 123 45 678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-post</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="firma@eksempel.no"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyWebsite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nettsted</FormLabel>
                        <FormControl>
                          <Input placeholder="https://eksempel.no" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyOrgNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Org.nummer</FormLabel>
                        <FormControl>
                          <Input placeholder="123 456 789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="companyVatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MVA-nummer</FormLabel>
                      <FormControl>
                        <Input placeholder="MVA 123 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tema</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Velg tema" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">Lyst</SelectItem>
                            <SelectItem value="dark">Mørkt</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tidssone</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Velg tidssone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Europe/Oslo">
                              Oslo (GMT+1)
                            </SelectItem>
                            <SelectItem value="Europe/Stockholm">
                              Stockholm (GMT+1)
                            </SelectItem>
                            <SelectItem value="Europe/Copenhagen">
                              København (GMT+1)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Språk</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Velg språk" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no">Norsk</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valuta</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Velg valuta" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NOK">NOK</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tidsformat</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Velg format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="24">24-timers</SelectItem>
                            <SelectItem value="12">12-timers</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Lagrer...
                  </>
                ) : (
                  "Fullfør oppsett"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
