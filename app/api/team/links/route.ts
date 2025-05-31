import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { teamLinks, teamMembers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get teamId for the user
    const userTeam = await db
      .select({ teamId: teamMembers.teamId })
      .from(teamMembers)
      .where(eq(teamMembers.userId, user.id))
      .limit(1);

    if (!userTeam.length) {
      return NextResponse.json([]);
    }

    const teamId = userTeam[0].teamId;

    // Get all links for the team
    const links = await db
      .select()
      .from(teamLinks)
      .where(eq(teamLinks.teamId, teamId))
      .orderBy(teamLinks.createdAt);

    return NextResponse.json(links);
  } catch (error) {
    console.error("Error in GET /api/team/links:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get teamId for the user
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

    // Ensure URL has protocol
    let url = data.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const [newLink] = await db
      .insert(teamLinks)
      .values({
        teamId: teamId,
        title: data.title,
        url: url,
        description: data.description || null,
        category: data.category,
        createdBy: user.id,
      })
      .returning();

    return NextResponse.json(newLink);
  } catch (error) {
    console.error("Error in POST /api/team/links:", error);
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

    // Get teamId for the user
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
    const linkId = searchParams.get("id");

    if (!linkId) {
      return NextResponse.json(
        { error: "Link ID is required" },
        { status: 400 }
      );
    }

    // Delete the link, but only if it belongs to the user's team
    const deletedLink = await db
      .delete(teamLinks)
      .where(
        and(eq(teamLinks.id, parseInt(linkId)), eq(teamLinks.teamId, teamId))
      )
      .returning();

    if (deletedLink.length === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      deletedLink: deletedLink[0],
    });
  } catch (error) {
    console.error("Error in DELETE /api/team/links:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
