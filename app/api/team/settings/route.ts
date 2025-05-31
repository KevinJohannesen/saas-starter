import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { teamSettings, teamMembers, teams } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      console.log("No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User found:", user.id);

    // Hent teamId for brukeren
    const userTeam = await db
      .select({ teamId: teamMembers.teamId })
      .from(teamMembers)
      .where(eq(teamMembers.userId, user.id))
      .limit(1);

    if (!userTeam.length) {
      console.log("No team found for user");
      return NextResponse.json({
        numberOfEmployees: 5,
        averageHoursPerEmployee: 1800,
        overheadCosts: [
          { name: "Kontorlokaler", amount: 120000 },
          { name: "Administrative lønninger", amount: 350000 },
          { name: "Strøm og kommunale avgifter", amount: 45000 },
          { name: "Forsikringer", amount: 85000 },
        ],
        equipmentCosts: [
          { name: "Utstyrsavskrivninger", amount: 180000 },
          { name: "Utstyrsvedlikehold", amount: 65000 },
          { name: "Småverktøy", amount: 30000 },
        ],
        generalCosts: [
          { name: "Opplæring", amount: 40000 },
          { name: "HMS-programmer", amount: 55000 },
          { name: "IT-systemer", amount: 70000 },
          { name: "Profesjonelle tjenester", amount: 90000 },
        ],
      });
    }

    const teamId = userTeam[0].teamId;
    console.log("Team ID found:", teamId);

    try {
      const settings = await db
        .select()
        .from(teamSettings)
        .where(eq(teamSettings.teamId, teamId))
        .limit(1);

      console.log("Settings found:", settings.length > 0);

      if (settings.length === 0) {
        // Return default settings hvis ingen er lagret
        return NextResponse.json({
          numberOfEmployees: 5,
          averageHoursPerEmployee: 1800,
          overheadCosts: [
            { name: "Kontorlokaler", amount: 120000 },
            { name: "Administrative lønninger", amount: 350000 },
            { name: "Strøm og kommunale avgifter", amount: 45000 },
            { name: "Forsikringer", amount: 85000 },
          ],
          equipmentCosts: [
            { name: "Utstyrsavskrivninger", amount: 180000 },
            { name: "Utstyrsvedlikehold", amount: 65000 },
            { name: "Småverktøy", amount: 30000 },
          ],
          generalCosts: [
            { name: "Opplæring", amount: 40000 },
            { name: "HMS-programmer", amount: 55000 },
            { name: "IT-systemer", amount: 70000 },
            { name: "Profesjonelle tjenester", amount: 90000 },
          ],
        });
      }

      return NextResponse.json(settings[0]);
    } catch (dbError) {
      console.error("Database error when fetching settings:", dbError);
      // Hvis tabellen ikke eksisterer, returner standardverdier
      return NextResponse.json({
        numberOfEmployees: 5,
        averageHoursPerEmployee: 1800,
        overheadCosts: [
          { name: "Kontorlokaler", amount: 120000 },
          { name: "Administrative lønninger", amount: 350000 },
          { name: "Strøm og kommunale avgifter", amount: 45000 },
          { name: "Forsikringer", amount: 85000 },
        ],
        equipmentCosts: [
          { name: "Utstyrsavskrivninger", amount: 180000 },
          { name: "Utstyrsvedlikehold", amount: 65000 },
          { name: "Småverktøy", amount: 30000 },
        ],
        generalCosts: [
          { name: "Opplæring", amount: 40000 },
          { name: "HMS-programmer", amount: 55000 },
          { name: "IT-systemer", amount: 70000 },
          { name: "Profesjonelle tjenester", amount: 90000 },
        ],
      });
    }
  } catch (error) {
    console.error("Error in GET /api/team/settings:", error);
    return NextResponse.json({
      numberOfEmployees: 5,
      averageHoursPerEmployee: 1800,
      overheadCosts: [
        { name: "Kontorlokaler", amount: 120000 },
        { name: "Administrative lønninger", amount: 350000 },
        { name: "Strøm og kommunale avgifter", amount: 45000 },
        { name: "Forsikringer", amount: 85000 },
      ],
      equipmentCosts: [
        { name: "Utstyrsavskrivninger", amount: 180000 },
        { name: "Utstyrsvedlikehold", amount: 65000 },
        { name: "Småverktøy", amount: 30000 },
      ],
      generalCosts: [
        { name: "Opplæring", amount: 40000 },
        { name: "HMS-programmer", amount: 55000 },
        { name: "IT-systemer", amount: 70000 },
        { name: "Profesjonelle tjenester", amount: 90000 },
      ],
    });
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

    // Update team settings
    const [updatedTeam] = await db
      .update(teams)
      .set({
        name: data.companyName,
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        companyPhone: data.companyPhone,
        companyEmail: data.companyEmail,
        companyWebsite: data.companyWebsite || null,
        companyOrgNumber: data.companyOrgNumber || null,
        companyVatNumber: data.companyVatNumber || null,
        theme: data.theme,
        timezone: data.timezone,
        language: data.language,
        currency: data.currency,
        dateFormat: data.dateFormat,
        timeFormat: data.timeFormat,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, teamId))
      .returning();

    if (!updatedTeam) {
      return NextResponse.json(
        { error: "Failed to update team settings" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error("Error in POST /api/team/settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
