import { Suspense } from "react";
import { getTeamForUser, getUser } from "@/lib/db/queries";

async function LinksContent() {
  const user = await getUser();
  const teamData = await getTeamForUser();

  if (!user || !teamData) {
    throw new Error("Unauthorized");
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">
        Lenkeadministrasjon
      </h1>
      <p className="text-gray-600 mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
      <p className="text-gray-600">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </section>
  );
}

export default function LenkeadministrasjonPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LinksContent />
    </Suspense>
  );
}
