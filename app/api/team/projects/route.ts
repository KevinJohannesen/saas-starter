import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { projects, teamMembers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
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

export async function DELETE(request: Request) {
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
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("id");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Slett prosjektet, men bare hvis det tilhører brukerens team
    const deletedProject = await db
      .delete(projects)
      .where(
        and(eq(projects.id, parseInt(projectId)), eq(projects.teamId, teamId))
      )
      .returning();

    if (deletedProject.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      deletedProject: deletedProject[0],
    });
  } catch (error) {
    console.error("Error in DELETE /api/team/projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
