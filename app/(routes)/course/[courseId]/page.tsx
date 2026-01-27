"use client"
import React, { useEffect, useState } from 'react'
import CourseInfoCard from './_components/CourseInfoCard'
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Course } from '@/type/CourseType';
import CourseChapters from './_components/CourseChapters';
import { toast } from 'sonner';
import { sub } from 'date-fns';


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
        if (i>0) break;
        toast.loading("Generating Video Content for Chapter " + (i+1));
        const result = await axios.post('/api/generate-video-content',{
            chapter: course?.courseLayout?.chapters[0],
            courseName: course?.courseLayout?.courseName,
            chapterTitle: course?.courseLayout?.chapters[0]?.chapterTitle,
            chapterSlug: course?.courseLayout?.chapters[0]?.chapterTitle.toLowerCase().replace(/\s+/g, '-'),
            subContent: course?.courseLayout?.chapters[0]?.subContent,
            courseId: course?.courseId
        });
        console.log(result.data);
        toast.success("Video Content Generated for Chapter " + (i+1));
       }
    }

    return (
        <div className='flex flex-col items-center'>
            <CourseInfoCard course={courseDetail} />
            <CourseChapters course={courseDetail} />
        </div>
    )
}

export default CourseDetails