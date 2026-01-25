import { Course } from '@/type/CourseType'
import { BookOpen, ChartNoAxesColumn, ChartNoAxesColumnIncreasing, Sparkles } from 'lucide-react';
import React from 'react'
import { Player } from '@remotion/player';
import ChapterVideo from './ChapterVideo';

type Props={
    course:Course|undefined;
}
const CourseInfoCard = (course:Props) => {
  console.log(course);
  return (
    <div>
      <div className='p-20 grid grid-cols-1 md:grid-cols-2 gap-5 bg-gradient-to-br from-slate-950 via-slate-800 to-emerald-900 rounded-2xl'>
        <div>
          <h2 className='flex gap-2 p-1 px-2 border rounded-2xl inline-flex text-white border-gray-200/20'><Sparkles/>Course Preview</h2>
          <h2 className='text-4xl font-bold mt-4 text-white'>{course.course?.courseName}</h2>
          <p className='text-lg text-muted-foreground mt-3'>{course.course?.courseLayout?.courseDescription}</p>
          <div className='mt-5 flex gap-5 text-white'>
            <h2 className='px-3 p-2 border rounded-4xl flex gap-2 items-center inline-flex'><ChartNoAxesColumnIncreasing className='text-sky-400' /> {course.course?.courseLayout?.level}</h2>
            <h2 className='px-3 p-2 border rounded-4xl flex gap-2 items-center inline-flex'><BookOpen className='text-green-400'/> {course.course?.courseLayout?.totalChapters} Chapters</h2>
          </div>
        </div>
        <div className='border-2 border-white/10 rounded 2xl'>
          <Player
           component={ChapterVideo}
            durationInFrames={30}
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
