'use client'

import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined"
import Link from "next/link";
import ContactForm from '../marketing-components/ContactForm';
import { useTenant } from '@/context/TenantContext';
import { useUser } from "@/context/UserContext";


function ContactFormContainer() {
    const { tenant } = useTenant();
    const { profile } = useUser();


    return (
        <div>
            <section className="container mx-auto px-4 py-12 text-center max-w-3xl">
                <span className="text-amber-500 text-sm font-semibold tracking-wider uppercase">
                    Contact Us
                </span>
                <h2 className="text-3xl mt-4 mb-3 font-bold text-black text-center dark:text-white">
                    We’re here to help keep your fleet moving
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-175 m-auto mb-5">
                    Have questions about features, pricing, or enterprise custom solutions? Drop us a message, and our fleet experts will get right back to you.
                </p>
            </section>

            {/* Main Content: Form & Info Grid */}
            <main className="container mx-auto px-4 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">

                    {/* Left Column: Contact Form */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            {/* <ChatBubbleOutlineOutlinedIcon className="text-blue-600 w-5 h-5" />  */}
                            Send us a message
                        </h2>
                        <ContactForm profile={profile} />
                    </div>

                    {/* Right Column: Contact Cards & Info */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Quick Contact Info */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact Information</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <MailOutlinedIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Email Us</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{tenant?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl flex items-center justify-center">
                                        <LocalPhoneIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Call Us</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{tenant?.phone}</p>
                                        <p className="text-slate-400 text-xs">Mon-Fri from 8am to 6pm EST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-violet-50 dark:bg-violet-950/50 text-violet-600 rounded-xl flex items-center justify-center">
                                        <LocationOnIcon className="w-5! h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Head Office</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                            {tenant?.address || tenant?.yards?.[0]?.title}
                                        </p>
                                        <p className="text-xs text-brand-500 mt-1">
                                            {tenant?.city}, {tenant?.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Interactive Map Placeholder */}
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Location</h3>

                        <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                            <div className="absolute w-full h-full">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://maps.google.com/maps?q=${tenant?.yards?.[0]?.location[0]},${tenant?.yards?.[0]?.location[1]}&output=embed`} allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                        <Link className="text-brand-500" href='/yards'>View all locations?</Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ContactFormContainer
