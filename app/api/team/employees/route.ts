import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { teamMembers, users } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";

// GET /api/team/employees - Get all employees for the team
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

    // Get all team members with their user information
    const employees = await db
      .select({
        id: teamMembers.id,
        userId: teamMembers.userId,
        teamId: teamMembers.teamId,
        role: teamMembers.role,
        position: teamMembers.position,
        department: teamMembers.department,
        phone: teamMembers.phone,
        address: teamMembers.address,
        hireDate: teamMembers.hireDate,
        emergencyContact: teamMembers.emergencyContact,
        skills: teamMembers.skills,
        certifications: teamMembers.certifications,
        joinedAt: teamMembers.joinedAt,
        updatedAt: teamMembers.updatedAt,
        name: users.name,
        email: users.email,
      })
      .from(teamMembers)
      .leftJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId));

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error in GET /api/team/employees:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/team/employees - Add a new employee
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

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    let userId;

    if (existingUser.length > 0) {
      // Use existing user
      userId = existingUser[0].id;
    } else {
      // Create new user
      const [newUser] = await db
        .insert(users)
        .values({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          passwordHash: "temp-password", // This should be handled properly in a real app
          role: "member",
        })
        .returning();
      userId = newUser.id;
    }

    // Add user to team
    const [newTeamMember] = await db
      .insert(teamMembers)
      .values({
        userId: userId,
        teamId: teamId,
        role: data.role || "member",
        position: data.position,
        department: data.department,
        phone: data.phone,
        address: data.address,
        hireDate: data.hireDate ? new Date(data.hireDate) : null,
        emergencyContact: data.emergencyContact,
        skills: data.skills ? JSON.parse(data.skills) : [],
        certifications: data.certifications
          ? JSON.parse(data.certifications)
          : [],
      })
      .returning();

    return NextResponse.json(newTeamMember);
  } catch (error) {
    console.error("Error in POST /api/team/employees:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
