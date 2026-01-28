import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Calendar, Dot, Layers, Play } from 'lucide-react'
import React from 'react'
import moment from 'moment'
import Link from 'next/link'

const CourseListCard = ({ courseItem }: { courseItem: any }) => {
  return (
   <>
        <Card className='bg-white z-10'>
            <CardHeader>
                <div className='flex justify-between items-center'>
                <h2 className='font-medium text-xl'>{courseItem?.courseName}</h2>
                <h2 className='text-primary text-sm bg-primary/40 p-1 px-2 border rounded-4xl border-primary'>{courseItem?.courseLayout.level}</h2>
               </div>
               <div className='flex gap-3 items-center'>
                <h2 className='flex items-center text-slate-600 text-xs bg-slate-400/10 p-1 px-2 border rounded-4xl border-slate-500'>
                    <Layers className='h-4 w-4'/>
                    {courseItem?.courseLayout.totalChapters} chapters
                </h2>
                <h2 className='flex items-center text-slate-600 text-xs bg-slate-400/10 p-1 px-2 border rounded-4xl border-slate-500'>
                    <Calendar className='h-4 w-4'/>
                    {moment(courseItem?.createdAt).format('MMM DD, YYYY')}
                    <Dot className='h-4 w-4'/>
                    {moment(courseItem?.createdAt).fromNow()}
                </h2>
               </div>
            </CardHeader>
            <CardContent>
                <div className='flex justify-between items-center'>
                    <p>Keep learning...</p>
                    <Link href={`/course/${courseItem?.courseId}`}>
                    <Button>Watch Now <Play/></Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    </>
  )
}

export default CourseListCard
