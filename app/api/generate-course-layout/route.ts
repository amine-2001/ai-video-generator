import { client } from "@/config/openai";
import { NextRequest, NextResponse } from "next/server";
import { Course_config_prompt } from "@/app/data/prompt";
import { coursesTable } from "@/config/schema";
import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const { userInput, courseId, type } = await req.json();
        const user = await currentUser();
        const response = await client.chat.completions.create({
            model:'gpt-5-mini', // Conseil : Utilisez gpt-4o-mini si gpt-5 n'est pas prêt
            messages: [
                { role: 'system', content: Course_config_prompt },
                { role: 'user', content: 'Course Topic is: ' + userInput + ' and type is: ' + type }
            ],
            response_format: { type: "json_object" } // Force le retour en JSON
        });
        console.log("API Response:", response);
        const rawResult = response.choices[0].message?.content || '{}';
        console.log("Raw Result:", rawResult);
        const JSONResult = JSON.parse(rawResult);
        console.log("Parsed Result:", JSONResult);
        const courseResult = await db.insert(coursesTable).values({
            courseId: courseId,
            courseName: JSONResult.courseName,
            userInput: userInput,
            type: type,
            courseLayout: JSONResult,
            userId: user?.primaryEmailAddress?.emailAddress as string,
        }).returning();

        return NextResponse.json(courseResult[0]);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to generate course" }, { status: 500 });
    }
}