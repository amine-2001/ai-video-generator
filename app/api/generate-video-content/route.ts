import { Generate_Video_Prompt } from "@/app/data/prompt";
import { client } from "@/config/openai";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";
import Groq from "groq-sdk";
import { db } from "@/config/db";
import { chapterContentSlides } from "@/config/schema";


export async function POST(req: NextRequest) {
    const payload = await req.json();
        
        const response = await client.chat.completions.create({
            model:'gpt-5-mini',
            messages: [
                { role: 'system', content: Generate_Video_Prompt },
                { role: 'user', content: 'Chapter Detail Is: ' + JSON.stringify(payload)}
            ],
        });
        const AiResult = response.choices[0].message?.content || '{}';
        const VideoContentJson=JSON.parse(AiResult?.replace('```json', '').replace('```','')||'[]');
        
    
    
   //const VideoContentJson = VIDEOSLIDESDUMMY;
   let audioFilesUrls: string[] = [];

for (let i = 0; i < VideoContentJson?.length; i++) {//temporaire, just pour tester un seul slide à la fois
    const narration = VideoContentJson[i].narration.fullText;
    
    const fonadaResult = await axios.post('https://api.fonada.ai/tts/generate-audio-large', // Remplacez par l'URL complète
        {
            input: narration,
            voice: 'Vaanee',
            Languages: 'English'
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.FONADALAB_API_KEY}` // Assurez-vous que la variable d'env est correcte
            },
            responseType: 'arraybuffer',
            timeout: 120000
        }
    );
    
    const audioBuffer = Buffer.from(fonadaResult.data).buffer as ArrayBuffer;
    const audioUrl = await saveAudioToStorage(audioBuffer, VideoContentJson[i].audioFileName);
    console.log(audioUrl);
    audioFilesUrls.push(audioUrl);
}
   let captionsArray: any[] = [];
   for (let i = 0; i < audioFilesUrls?.length; i++) {
      const captions = await GenerateCaptions(audioFilesUrls[i],VideoContentJson[i].audioFileName);
      console.log(captions);
      captionsArray.push(captions);
   }
   
   VideoContentJson.forEach(async (slide:any, index:any) => {
    const result = await db.insert(chapterContentSlides).values({
        courseId: payload.courseId,
        chapterId: payload.chapterSlug,
        slideIndex: VideoContentJson[index].slideIndex,
        slideId: VideoContentJson[index].slideId,
        audioFileName: VideoContentJson[index].audioFileName,
        narration: VideoContentJson[index].narration,
        revelData: VideoContentJson[index].revelData,
        html: VideoContentJson[index].html,
        caption: captionsArray[index],
        audioFileUrl: audioFilesUrls[index]
    }).returning();
    });

    return NextResponse.json({ ...VideoContentJson, audioFilesUrls, captionsArray });
}
const saveAudioToStorage = async (audioBuffer: ArrayBuffer, fileName: string) => {
    const blobService = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || '');
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'audio';
    const containerClient = blobService.getContainerClient(containerName);
    const blobName = `tts/${fileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(audioBuffer, {
        blobHTTPHeaders:
         { blobContentType: 'audio/mpeg', 
           blobCacheControl: 'public, max-age=31536000, immutable' 
         }
    });
    const publicBase= process.env.AZURE_STORAGE_PUBLIC_BASE_URL || '';
    const url =publicBase ? publicBase  + "/" + blobName : blockBlobClient?.url;
    return url;
}
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GenerateCaptions = async (audioUrl: string,audioFileName: string) => {
    try {
        // 1. Récupérer l'audio depuis l'URL Azure
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        // 2. Créer un objet File compatible avec l'API Groq
        // On utilise un nom de fichier générique "audio.mp3"
        const file = new File([arrayBuffer], audioFileName, { type: "audio/mpeg" });

        // 3. Envoyer à Groq pour transcription
        // On demande verbose_json pour avoir les timestamps (start/end) indispensables pour les captions
        const transcription = await groq.audio.transcriptions.create({
            file: file,
            model: "whisper-large-v3",
            response_format: "verbose_json", 
            language: "en", // Optionnel : force la langue si besoin
        });

        console.log("Transcription Groq réussie:", transcription.text);

        // Groq renvoie les détails dans 'segments' (l'équivalent de 'chunks' chez Replicate)
        return transcription; 
        
    } catch (error: any) {
        console.error("Erreur Groq détaillée:", error.response?.data || error.message);
        // Retourne une structure vide pour éviter de faire planter le reste de la boucle
        return { segments: [], text: "" };
    }
}



    