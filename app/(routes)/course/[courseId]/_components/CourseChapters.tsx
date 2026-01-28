import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Course } from '@/type/CourseType';
import { Player } from '@remotion/player';
import { Dot } from 'lucide-react';
import React from 'react'
import ChapterComposition from './ChapterVideo';
import { useCourseStore } from '@/app/store/useCourseStore';

type Props = {
    course: Course | undefined;
}

const CourseChapters = ({course}: Props) => {
    const { durationbySlideId, isCalculated } = useCourseStore();
    console.log('Duration by Slide ID:', durationbySlideId);
    const slides = course?.chapterContentSlides || [];
    console.log('Slides:', slides);
    const GetChapterDurationInFrame = (chapterId: string) => {
    if (!isCalculated) return 3000;
    const total = (course?.chapterContentSlides || [])
      .filter((slide) => {
        return slide.chapterId.toLowerCase().trim() === chapterId.toLowerCase().trim();
      })
      .reduce((sum, slide) => sum + (durationbySlideId[slide.slideId] || 0), 0);

    return total > 0 ? total : 3000; 
  };
    return (
        <div className='max-w-6xl -mt-5 p-10 border rounded-3xl shadow w-full bg-background/80 backdrop-blur'>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-xl'>Course Preview</h2>
                <h2 className='text-sm text-muted-foreground'>Chapters and Short Preview</h2>
            </div>
            <div className='mt-5'>
                {course?.courseLayout.chapters.map((chapter, index) => (
                    <Card className='mb-5' key={index}>
                        <CardHeader>
                            <div className='flex gap-3 items-center'>
                                <h2 className='p-2 bg-primary/40 inline-flex h-10 w-10 text-center rounded-2xl justify-center items-center'>{index + 1}</h2>
                                <CardTitle className='md:text-xl text-base'>
                                    {chapter.chapterTitle}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className='flex flex-col md:flex-row gap-5 items-start mt-5'>
                                <div className='flex-1'>
                                    <div className='grid grid-cols-1 gap-2'>
                                        {chapter.subContent.map((sub, index) => (
                                            <div key={index} className='flex gap-2 items-center'>
                                                <Dot className='h-5 w-5 text-primary' />
                                                <h2 className='text-sm md:text-base'>{sub}</h2>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='flex-1 w-full'>
                                    <Player
                                        component={ChapterComposition}
                                        inputProps={{
                                            // @ts-ignore
                                            slides: slides.filter(slide => slide.chapterId === chapter.chapterId),
                                            durationsBySlideId: durationbySlideId
                                        }}
                                        durationInFrames={GetChapterDurationInFrame(chapter?.chapterId) || 30}
                                        compositionWidth={1280}
                                        compositionHeight={720}
                                        fps={30}
                                        controls
                                        style={{ width: '80%', height: '180px', borderRadius: '10px' }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                ))}
            </div>
        </div>
    )
}

export default CourseChapters
