import { db } from "@/config/db";
import { chapterContentSlides, coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const courseId = await req.nextUrl.searchParams.get('courseId');

    const courses = await db.select().from(coursesTable)
        .where(eq(coursesTable.courseId, courseId as string));

    const chaptercontentslide = await db.select().from(chapterContentSlides) 
        .where(eq(chapterContentSlides.courseId, courseId as string));   

    return NextResponse.json({...courses[0], chapterContentSlides: chaptercontentslide});
    //Lorsque vous effectuez une requête pour récupérer un cours (même si vous cherchez par un ID unique), la base de données renvoie toujours un tableau (Array) d'objets.//
}