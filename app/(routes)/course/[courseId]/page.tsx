"use client"
import React, { useEffect, useState } from 'react'
import CourseInfoCard from './_components/CourseInfoCard'
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Course } from '@/type/CourseType';
import CourseChapters from './_components/CourseChapters';
import { toast } from 'sonner';
import { getAudioData } from '@remotion/media-utils';
import { useCourseStore } from '@/app/store/useCourseStore';


const CourseDetails = () => {

    const { courseId } = useParams();
    const [courseDetail, setCourseDetail] = useState<Course>();

    useEffect(() => {
        courseId && GetCourseDetail();
    }, [courseId])

    const GetCourseDetail = async () => {
        const loadingToast = toast.loading("Fetching Course Details...");
        const result = await axios.get('/api/course?courseId=' + courseId);
        console.log(result.data);
        setCourseDetail(result.data);
        toast.success("Course Details Fetched Successfully!", { id: loadingToast });
        if (result?.data?.chapterContentSlides.length === 0) {
            GenerateVideoContent(result?.data);
       }
    }  
    const GenerateVideoContent = async (course: Course) => {
        for(let i=0; i< course.courseLayout.chapters.length; i++) {
        const toastId = toast.loading("Generating Video Content for Chapter " + (i+1));
        const result = await axios.post('/api/generate-video-content',{
            chapter: course?.courseLayout?.chapters[i],
            courseName: course?.courseLayout?.courseName,
            chapterTitle: course?.courseLayout?.chapters[i]?.chapterTitle,
            chapterSlug: course?.courseLayout?.chapters[i]?.chapterTitle.toLowerCase().replace(/\s+/g, '-'),
            subContent: course?.courseLayout?.chapters[i]?.subContent,
            courseId: course?.courseId
        });
        console.log(result.data);
        toast.success("Video Content Generated for Chapter " + (i+1), { id: toastId });
       }
    }

    const fps=30;
      const slides = courseDetail?.chapterContentSlides??[];
      //const [durationbySlideId, setDurationBySlideId] = useState<Record<string, number>>();
      const { setDurations, reset } = useCourseStore();
      let cancelled = false;
      useEffect(() => {
        if (courseDetail?.chapterContentSlides) {
      
      reset();
      const durations: Record<string, number> = {};
      const run = async () => {
        slides.forEach((slide) => {
        // Utilisation directe de la durée de l'audio
        const frames = Math.ceil((slide.caption?.duration || 0) * fps);
        durations[slide.slideId] = frames;
      });

      setDurations(durations);
    }
      run();
    }
      return () => {
        cancelled = true;
      }
    }, [slides, fps]);

    return (
        <div className='flex flex-col items-center'>
            <CourseInfoCard course={courseDetail}/>
            <CourseChapters course={courseDetail}  />
        </div>
    )
}

export default CourseDetails