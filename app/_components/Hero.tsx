import React from 'react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Send } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { QUICK_VIDEO_SUGGESTIONS } from '../data/constant'
function Hero() {
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
                    />
                    <InputGroupAddon align="block-end">
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="full-course" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full-course">Full Course</SelectItem>
                                <SelectItem value="quick-explain">Quick Explain Video</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputGroupButton className="ml-auto" size="icon-sm" variant="default">
                            <Send/>
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <div className='flex gap-5 mt-5 max-w-3xl flex-wrap justify-center z-10'>
                {QUICK_VIDEO_SUGGESTIONS.map((suggestion,index) => (
                    <button key={index} className='border rounded-2xl px-2 p-1 text-sm bg-white'>
                        {suggestion.title}
                    </button> 
                ))}
            </div>
        </div>
    )
}

export default Hero
