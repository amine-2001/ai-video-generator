"use client"
import { Course } from '@/type/CourseType';
import axios from 'axios';
import React, { use, useEffect, useState } from 'react'
import CourseListCard from './CourseListCard';


const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    GetCourseList();
  }, []);
  const GetCourseList = async () => {
        const result = await axios.get('/api/course');
        console.log(result.data);
        setCourses(result.data);
}
  return (
    <div className='max-w-6xl mt-20'>
    <h2 className='font-bold text-2xl'>My Courses</h2>

    <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5'>
        {courses?.map((course, index) => (
            <CourseListCard courseItem={course} key={index} />
        ))}
    </div>
</div>
  )
}

export default CourseList
