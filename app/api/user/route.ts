import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, ne } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  
  // 2. Vérifier si l'utilisateur existe déjà en DB
  
    const existingUsers = await db.select().from(usersTable)
      .where(eq(usersTable.email,user?.primaryEmailAddress?.emailAddress as string));

    // 3. Si l'utilisateur n'existe pas, le créer
    if(existingUsers?.length == 0) {
      const newUser = await db.insert(usersTable).values({
        email: user?.primaryEmailAddress?.emailAddress as string,
        name: user?.fullName as string,
      }).returning();
      return NextResponse.json(newUser[0]);
    }
 return NextResponse.json(existingUsers[0]);
}