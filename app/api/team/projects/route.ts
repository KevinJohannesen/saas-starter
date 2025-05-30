import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { projects, teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Hent teamId for brukeren
    const userTeam = await db
      .select({ teamId: teamMembers.teamId })
      .from(teamMembers)
      .where(eq(teamMembers.userId, user.id))
      .limit(1);

    if (!userTeam.length) {
      return NextResponse.json([]);
    }

    const teamId = userTeam[0].teamId;

    const teamProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.teamId, teamId));

    return NextResponse.json(teamProjects);
  } catch (error) {
    console.error("Error in GET /api/team/projects:", error);
    return NextResponse.json([], { status: 200 }); // Returner tom array ved feil
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Hent teamId for brukeren
    const userTeam = await db
      .select({ teamId: teamMembers.teamId })
      .from(teamMembers)
      .where(eq(teamMembers.userId, user.id))
      .limit(1);

    if (!userTeam.length) {
      return NextResponse.json({ error: "No team found" }, { status: 404 });
    }

    const teamId = userTeam[0].teamId;
    const data = await request.json();

    const [newProject] = await db
      .insert(projects)
      .values({
        teamId: teamId,
        ...data,
      })
      .returning();

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("Error in POST /api/team/projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
