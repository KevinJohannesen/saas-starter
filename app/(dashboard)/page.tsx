import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Code2, Database } from "lucide-react";
import { Terminal } from "./terminal";

export default function HomePage() {
  return (
    <main>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
                Digitalt Intranett
                <span className="block text-cyan-500">For Byggebransjen</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Effektiviser arbeidsflyten med vårt skreddersydde intranett for
                byggebedrifter. Samle all viktig informasjon på ett sted og få
                full oversikt over prosjekter, dokumenter og kommunikasjon.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <Button
                  size="lg"
                  className="text-lg rounded-full bg-cyan-500 hover:bg-cyan-600"
                >
                  Logg inn
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Bygget for byggebransjen
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Skreddersydd løsning som møter byggebransjens unike behov for
                  prosjektstyring, dokumenthåndtering og kommunikasjon.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white">
                <Database className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Sikker datalagring
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  All informasjon lagres trygt i skyen med automatisk backup og
                  tilgangskontroll for sensitive data og dokumenter.
                </p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 text-white">
                <Code2 className="h-6 w-6" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-medium text-gray-900">
                  Moderne teknologi
                </h2>
                <p className="mt-2 text-base text-gray-500">
                  Bygget med det siste innen webteknologi for rask, responsiv og
                  brukervennlig opplevelse på alle enheter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Klar til å digitalisere?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Ta steget inn i fremtiden med et moderne intranett som forenkler
                arbeidshverdagen. Få demo og se hvordan vi kan hjelpe din
                bedrift med å bli mer effektiv.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <Button
                size="lg"
                variant="outline"
                className="text-lg rounded-full"
              >
                Be om demo
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Om oss</h3>
              <p className="text-gray-400">
                Vi leverer moderne digitale løsninger for byggebransjen, med
                fokus på brukervennlighet og effektivitet.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
              <ul className="text-gray-400">
                <li>Telefon: +47 123 45 678</li>
                <li>E-post: kontakt@digitaltintranett.no</li>
                <li>Adresse: Byggveien 1, 0123 Oslo</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Følg oss</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Facebook
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Digitalt Intranett. Alle rettigheter reservert.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
