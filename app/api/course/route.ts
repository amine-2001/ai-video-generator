import { db } from "@/config/db";
import { chapterContentSlides, coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const courseId = await req.nextUrl.searchParams.get('courseId');
    const user = await currentUser();
    if(!courseId){
        const usercourses = await db.select().from(coursesTable)
            .where(eq(coursesTable.userId, user?.primaryEmailAddress?.emailAddress as string))
            .orderBy(desc(coursesTable.createdAt));
        return NextResponse.json(usercourses);
    }

    const courses = await db.select().from(coursesTable)
        .where(eq(coursesTable.courseId, courseId as string));

    const chaptercontentslide = await db.select().from(chapterContentSlides) 
        .where(eq(chapterContentSlides.courseId, courseId as string));   

    return NextResponse.json({...courses[0], chapterContentSlides: chaptercontentslide});
    //Lorsque vous effectuez une requête pour récupérer un cours (même si vous cherchez par un ID unique), la base de données renvoie toujours un tableau (Array) d'objets.//
}