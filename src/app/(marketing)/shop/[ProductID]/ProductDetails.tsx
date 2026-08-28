"use client"

import Input from '@/components/form/input/InputField'
import { Product } from '@/data/globalExports'
import Link from 'next/link'
import { useState } from 'react'

function ProductDetailsView({ ProductDetails }: { ProductDetails: Product }) {
    const [count, setCount] = useState(1)
    return (

        <div className="flex flex-col">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-500">
                {ProductDetails.category}
                <span className="rounded-md bg-green-500 px-2 py-1 text-[11px] text-white">
                    {ProductDetails.badge}
                </span>
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white md:text-4xl">
                {ProductDetails.title}
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
                {ProductDetails.description}
            </p>
            <div className="mt-6 flex items-baseline gap-2 border-y border-slate-200 py-4 dark:border-slate-700">
                <span className="text-sm font-semibold text-slate-400">Ksh</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {ProductDetails.price.toLocaleString()}
                </span>
            </div>
            <section className="mt-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Features</h2>
                <ul className="mt-3 space-y-2">
                    {ProductDetails.specs?.map((spec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <span className="mt-0.5 text-emerald-500">✓</span>
                            <span>{spec}</span>
                        </li>
                    ))}
                </ul>
            </section>
            <section className="mt-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quantity</h2>
                <div className="mt-3 flex w-full items-center gap-4 justify-between">
                    <div className="flex w-fit items-center gap-3">
                        <button
                            name="minus"
                            type="button"
                            onClick={() => setCount((e) => e > 1 ? e - 1 : 1)}
                            className="w-12 aspect-square rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        >{'-'}</button>
                        <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            defaultValue="1"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value) < 1 ? 1 : Number(e.target.value))}
                            className='w-18! h-12 text-center'
                        />
                        <button
                            name="minus"
                            type="button"
                            onClick={() => setCount((e) => e + 1)}
                            className="w-12 aspect-square rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        >{'+'}</button>

                    </div>
                    <span className="text-sm shrink-0 font-semibold text-slate-700 dark:text-slate-300">
                        Total: Ksh {(Number(ProductDetails.price) * count).toLocaleString()}
                    </span>
                </div>
            </section>
            <button

                type="button"
                onClick={() => {
                    const message = `Order details:\nTitle: ${ProductDetails.title}\nID: ${ProductDetails.id}\nPrice: Ksh ${ProductDetails.price}\nQuantity: ${count}\nTotal: ${(Number(ProductDetails.price) * count).toLocaleString()}\nLink: https://www.fleetmaster.co.ke/shop/${ProductDetails.id}`;
                    window.open(
                        `https://wa.me/254768927617?text=${encodeURIComponent(message)}`,
                        "_blank",
                        "noopener,noreferrer",
                    );
                }}

                className="mt-7 inline-flex justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
                Order via WhatsApp
            </button>
            <Link href="/shop" className="mt-4 text-center text-sm font-medium text-green-700 hover:underline dark:text-green-400">
                Back to Shop
            </Link>
        </div>
    )
}

export default ProductDetailsView
