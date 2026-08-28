"use client"

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Image from "next/image";
import { useState } from "react";
import { Products } from "@/data/globalExports";
import Link from "next/link";


function ShopProducts() {
    const [quantities, setQuantities] = useState<Record<string, number>>({});


    return (
        <div>
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
                {Products.map((product) => {
                    const ProductIcon = product.icon;
                    return (
                        <div
                            key={product.id}
                            className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-zinc-500 bg-white shadow-sm shadow-blue-500/10 transition-all hover:shadow-md dark:border-zinc-600 dark:bg-zinc-800 cursor-pointer"
                        >
                            {/* Product Image Box */}
                            <Link
                            href={`/shop/${product.id}`}
                            >
                            <div className="relative aspect-4/3 overflow-hidden bg-gray-200 dark:bg-slate-800">
                                <div className="absolute inset-0 flex items-center justify-center bg-zinc-200/40 text-xs font-medium text-slate-400 dark:bg-zinc-800/40 dark:text-slate-500">
                                    <span>{product.title} Visual Asset</span>
                                </div>
                                <span className="absolute top-3 right-3 z-10 flex gap-2">
                                    <span className="bg-brand-500 rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase shadow-sm">
                                        {product.badge}
                                    </span>
                                    <span className="rounded-md bg-green-500 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase shadow-sm">
                                        {`${[product.discount]}% Off`}
                                    </span>
                                </span>
                                <Image
                                    src={product.imgSrc}
                                    alt={product.title}
                                    className="absolute inset-0 h-full w-full bg-gray-200 object-cover transition-transform duration-300 group-hover:scale-105"
                                    preload
                                    fill
                                    sizes="(max-width: 1024px) 50vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            </Link>

                            {/* Card Main Body Content Elements */}
                            <div className="flex grow flex-col justify-between p-4">
                                <div>
                                    <div className="mb-2 flex items-center gap-1.5 font-bold text-purple-500">
                                        <ProductIcon className="h-4 w-4" />
                                        <span className="text-xs tracking-wider uppercase">
                                            {product.category}
                                        </span>
                                    </div>

                                    <h3 className="mb-2 font-bold text-slate-900 dark:text-white">
                                        {product.title}
                                    </h3>
                                    <p className="mb-4 text-xs leading-relaxed text-slate-500 dark:text-gray-400 line-clamp-2">
                                        {product.description}
                                    </p>

                                    {/* Features/Bullet Specs Core Matrix Loop */}
                                    {/* <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mb-5 space-y-2">
                      {product.specs.map((spec, specIdx) => (
                        <div key={specIdx} className="flex items-start gap-2">
                          <VerifiedIcon className="text-emerald-500 !w-3.5 !h-3.5 mt-0.5 shrink-0" />
                          <span className="text-xs text-slate-600 dark:text-slate-400">{spec}</span>
                        </div>
                      ))}
                    </div> */}
                                </div>

                                {/* Pricing Matrix & Checkout Action Interceptions */}
                                <div className="mt-0 mb-3 flex items-center justify-between border-t border-brand-100 pt-2 dark:border-zinc-500">
                                    <div>
                                        {/* <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">Price</span> */}
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-xs font-semibold text-slate-400">
                                                Ksh &nbsp;
                                            </span>
                                            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                                                {" "}
                                                {product.price.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-700 inline-flex items-center overflow-hidden rounded-lg text-xs font-semibold text-white shadow-sm">
                                        <button
                                            type="button"
                                            aria-label={`Decrease quantity of ${product.title}`}
                                            className="px-3 py-1 transition-colors hover:bg-zinc-600 active:scale-95"
                                            onClick={() => {
                                                setQuantities((current) => ({
                                                    ...current,
                                                    [product.id]: Math.max(0, (current[product.id] ?? 0) - 1),
                                                }));
                                            }}
                                        >
                                            {"-"}
                                        </button>
                                        <span className="min-w-8 border-x border-white/20 px-2 py-1 text-center">
                                            {quantities[product.id] ?? 0}
                                        </span>
                                        <button
                                            type="button"
                                            aria-label={`Increase quantity of ${product.title}`}
                                            className="px-3 py-1 transition-colors hover:bg-zinc-600 active:scale-95"
                                            onClick={() =>

                                                setQuantities((current) => ({
                                                    ...current,
                                                    [product.id]: (current[product.id] ?? 0) + 1,
                                                }))
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const count = quantities[product.id] ?? 0;
                                        const message = `Order details:\nTitle: ${product.title}\nID: ${product.id}\nPrice: Ksh ${product.price}\nQuantity: ${count}\nTotal: ${(Number(product.price) * count).toLocaleString()}\nLink: https://www.fleetmaster.co.ke/shop/${product.id}`;
                                        window.open(
                                            `https://wa.me/254768927617?text=${encodeURIComponent(message)}`,
                                            "_blank",
                                            "noopener,noreferrer",
                                        );
                                    }}
                                    className="bg-brand-500 justify-center hover:bg-brand-600 inline-flex items-center gap-2 rounded-lg px-3 p-2 text-xs font-semibold text-white shadow-sm transition-all active:scale-95"
                                >
                                    <ShoppingCartOutlinedIcon fontSize="small" />
                                    Order Now
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    )
}

export default ShopProducts
