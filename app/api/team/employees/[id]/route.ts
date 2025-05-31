import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { teamMembers, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";

// GET /api/team/employees/[id] - Get employee details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const { id } = await params;
    const employeeId = parseInt(id);

    // Get employee details
    const employee = await db
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
      .where(
        and(eq(teamMembers.id, employeeId), eq(teamMembers.teamId, teamId))
      )
      .limit(1);

    if (employee.length === 0) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee[0]);
  } catch (error) {
    console.error(`Error in GET /api/team/employees/${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/team/employees/[id] - Update employee
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const { id } = await params;
    const employeeId = parseInt(id);
    const data = await request.json();

    // Update employee
    const [updatedEmployee] = await db
      .update(teamMembers)
      .set({
        role: data.role,
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
        updatedAt: new Date(),
      })
      .where(
        and(eq(teamMembers.id, employeeId), eq(teamMembers.teamId, teamId))
      )
      .returning();

    if (!updatedEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error(`Error in PUT /api/team/employees/${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/team/employees/[id] - Remove employee from team
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const { id } = await params;
    const employeeId = parseInt(id);

    // Delete employee from team
    const [deletedEmployee] = await db
      .delete(teamMembers)
      .where(
        and(eq(teamMembers.id, employeeId), eq(teamMembers.teamId, teamId))
      )
      .returning();

    if (!deletedEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedEmployee,
    });
  } catch (error) {
    console.error(`Error in DELETE /api/team/employees/${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
