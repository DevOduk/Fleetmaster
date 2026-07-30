"use client"
import React from 'react'
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Select from "@/components/form/Select";
import Input from '../form/input/InputField';
import { ChevronDownIcon } from "@/icons";
import TextArea from '../form/input/TextArea';
import Label from '../form/Label';



export default function ContactForm({profile}: {profile?: any}) {
    
    return (
        <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="first_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</Label>
                    <Input value={profile?.first_name} type="text" id="first_name" placeholder='First Name' className='bg-slate-50 dark:bg-slate-800 ' />
                </div>
                <div>
                    <Label htmlFor="last_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</Label>
                    <Input value={profile?.last_name} type="text" id="last_name" placeholder='Last Name' className='bg-slate-50 dark:bg-slate-800 ' />
                </div>
            </div>

            <div>
                <Label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Work Email</Label>
                <Input value={profile?.email} type="email" id="email" placeholder='Work Email Address' className='bg-slate-50 dark:bg-slate-800 ' />
            </div>

            <div>
                <Label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</Label>

                <div className='relative'>
                    <Select onChange={() => { }} placeholder="Select Subject" options={
                        [
                            { value: 'General Inquiry', label: 'General Inquiry' },
                            { value: 'Sales & Enterprise Pricing', label: 'Sales & Enterprise Pricing' },
                            { value: 'Technical Support', label: 'Technical Support' },
                            { value: 'Partnership Opportunities', label: 'Partnership Opportunities' }
                        ]
                    }
                        className='bg-slate-50 dark:bg-slate-800'
                    />

                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                    </span>
                </div>
            </div>

            <div>
                <Label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">How can we help?</Label>
                <TextArea rows={4} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Tell us a bit about your fleet size and what you're looking for..."></TextArea>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/10">
                Submit Request
                <ArrowForwardIcon className="w-4! h-4! transition-transform group-hover:translate-x-1" />
            </button>
        </form>
    )
}
