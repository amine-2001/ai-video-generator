"use client"
import React, { use, useState } from 'react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Loader2, Send } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { QUICK_VIDEO_SUGGESTIONS } from '../data/constant'
import axios from 'axios'
import { toast } from 'sonner'
import { SignInButton, useUser } from '@clerk/nextjs'


function Hero() {
    const [userInput, setUserInput] = useState('');
    const [type, setType] = useState('full-course');
    const [Loading, setLoading] = useState(false);
    const{user}=useUser();
    const courseId = crypto.randomUUID();
   
    const GenerateCourseLayout = async () => {
        try {
    setLoading(true);
    const toastId = toast.loading('Generating your course layout...');
    const result = await axios.post('/api/generate-course-layout', {
        userInput,
        type,
        courseId:courseId
    });
    console.log(result.data);
    toast.success('Course layout generated successfully!', { id: toastId });
    setLoading(false);
} catch (error) {
    console.error(error);
    toast.error('Failed to generate course layout. Please try again.');
    setLoading(false);
}}
    return (
        <div className='flex items-center justify-center flex-col mt-20'>
            <div>
                <h2 className='text-5xl font-bold'>Learn Smarter with <span className='text-primary'>Ai Video Courses</span></h2>
                <p className='flex justify-center mt-4 text-lg text-gray-600'>Turn Any Topic into a Complete Course</p>
            </div>
            <div className="grid w-full max-w-xl mt-5 gap-6 bg-white z-10">
                <InputGroup>
                    <InputGroupTextarea
                        data-slot="input-group-control"
                        className="flex field-sizing-content min-h-24 w-full resize-none rounded-xl
                         bg-white px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
                        placeholder="Autoresize textarea..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    <InputGroupAddon align="block-end">
                        <Select onValueChange={(value) => setType(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="full-course" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full-course">Full Course</SelectItem>
                                <SelectItem value="quick-explain">Quick Explain Video</SelectItem>
                            </SelectContent>
                        </Select>
                        {user?
                        <InputGroupButton className="ml-auto" size="icon-sm" variant="default" onClick={GenerateCourseLayout} disabled={Loading}>
                        {
                            Loading?<Loader2 className='animate-spin'/>:
                            <Send />
                        }
                        </InputGroupButton>
                        :
                        <SignInButton>
                        <InputGroupButton className="ml-auto" size="icon-sm" variant="default" >
                            <Send />
                        </InputGroupButton>
                        </SignInButton>
                        }
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <div className='flex gap-5 mt-5 max-w-3xl flex-wrap justify-center z-10'>
                {QUICK_VIDEO_SUGGESTIONS.map((suggestion,index) => (
                    
                    <h2 key={index} className='border rounded-2xl px-2 p-1 text-sm bg-white cursor-pointer' onClick={()=>setUserInput(suggestion?.prompt)}>
                        {suggestion.title}
                    </h2> 
                ))}
            </div>
        </div>
    )
}

export default Hero
