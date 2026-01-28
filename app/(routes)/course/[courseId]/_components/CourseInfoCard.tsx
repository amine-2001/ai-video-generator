import { Course } from '@/type/CourseType'
import { BookOpen, ChartNoAxesColumn, ChartNoAxesColumnIncreasing, Sparkles } from 'lucide-react';
import React, { useEffect, useMemo } from 'react'
import { Player } from '@remotion/player';
import ChapterComposition from './ChapterVideo';
import{getAudioData} from '@remotion/media-utils'
import { useCourseStore } from '@/app/store/useCourseStore';

type Props={
    course:Course|undefined;
}
const CourseInfoCard = ({course}:Props) => {
  const fps = 30;
    // On récupère les données depuis Zustand au lieu des props
    const { durationbySlideId, isCalculated } = useCourseStore();
    
    const slides = course?.chapterContentSlides ?? [];

    const durationInFrames = useMemo(() => {
        // Si Zustand n'est pas encore prêt, on ne calcule rien pour éviter le crash
        if (!isCalculated || Object.keys(durationbySlideId).length === 0) return 0;

        return slides.reduce((sum, slide) => {
            const frameCount = durationbySlideId[slide.slideId];
            return sum + (frameCount ?? 0);
        }, 0);
    }, [durationbySlideId, slides, isCalculated]);
if(!durationbySlideId){
  return <div>Loading...</div>
}

  return (
    <div>
      <div className='p-20 grid grid-cols-1 md:grid-cols-2 gap-5 bg-gradient-to-br from-slate-950 via-slate-800 to-emerald-900 rounded-2xl'>
        <div>
          <h2 className='flex gap-2 p-1 px-2 border rounded-2xl inline-flex text-white border-gray-200/20'><Sparkles/>Course Preview</h2>
          <h2 className='text-4xl font-bold mt-4 text-white'>{course?.courseName}</h2>
          <p className='text-lg text-muted-foreground mt-3'>{course?.courseLayout?.courseDescription}</p>
          <div className='mt-5 flex gap-5 text-white'>
            <h2 className='px-3 p-2 border rounded-4xl flex gap-2 items-center inline-flex'><ChartNoAxesColumnIncreasing className='text-sky-400' /> {course?.courseLayout?.level}</h2>
            <h2 className='px-3 p-2 border rounded-4xl flex gap-2 items-center inline-flex'><BookOpen className='text-green-400'/> {course?.courseLayout?.totalChapters} Chapters</h2>
          </div>
        </div>
        <div className='border-2 border-white/10 rounded 2xl'>
          <Player
           component={ChapterComposition}
           inputProps={{
            // @ts-ignore
            slides: slides,
            durationsBySlideId: durationbySlideId
          }}
            durationInFrames={durationInFrames&&durationInFrames!==0?durationInFrames:30}
            compositionWidth={1280}
            compositionHeight={720}
            fps={30}
            controls
            style={{ width: '100%', aspectRatio: '16/9' }}
          />
        </div>
      </div>
    </div>
  )
}

export default CourseInfoCard
