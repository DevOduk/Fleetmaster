import CallToAction from "@/components/marketing-components/CallToAction";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import { Metadata } from "next";
import Image from "next/image";
import { Product, Products } from "@/data/globalExports";
import ProductDetailsView from "./ProductDetails";
import VehicleNotFound from "@/components/vehicles/NotFound";

export async function generateMetadata({
    params,
}: {
    params: Promise<{
        ProductID: string
    }>;
}): Promise<Metadata> {
    const { ProductID } = await params;
    const product = Products.find((p) => p.id === ProductID);

    return {
        title: product?.title ?? 'Product' + " | Shop | FleetMaster - Fleet Hardware & GPS Trackers",
        description:
            product?.description ??
            "Equip your fleet with commercial-grade vehicle hardware. Purchase pre-configured wired GPS trackers, magnetic asset trackers, and advanced fuel telemetry sensors fully integrated with your FleetMaster dashboard.",
    };
}

export default async function ShopPage({
    params,
}: {
    params: Promise<{ ProductID: string }>;
}) {
    const pages = [
        { label: "Home", href: "/" },
        { label: "Shop", href: "/shop" },
    ];
    const productId = (await params).ProductID;
    const ProductDetails: Product | undefined = Products.find(p => p.id === productId);

    if (!ProductDetails) {
        return (<VehicleNotFound name="Product" />)
    }

    return (
        <div className="m-auto min-h-screen w-full">
            <SecondaryHero
                pages={[...pages, { label: ProductDetails.title, href: `/shop/${productId}` }]}
                title={ProductDetails.title}
                highlightedText="Hardware"
                className="dark:bg-zinc-950"
                description="Commercial-grade fleet hardware, pre-configured and ready to connect with your FleetMaster dashboard."
            />

            <main className="container mx-auto max-w-6xl px-4 py-16">
                <div className="grid items-start gap-10 md:grid-cols-2">

                    <div className="relative aspect-4/3 overflow-hidden bg-gray-200 dark:bg-slate-800">
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-200/40 text-xs font-medium text-slate-400 dark:bg-zinc-800/40 dark:text-slate-500">
                            <span>{ProductDetails.title} Visual Asset</span>
                        </div>
                        <span className="absolute top-3 right-3 z-10 flex gap-2">
                            <span className="bg-brand-500 rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase shadow-sm">
                                {ProductDetails.badge}
                            </span>
                            <span className="rounded-md bg-green-500 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase shadow-sm">
                                {`${ProductDetails.discount}% Off`}
                            </span>
                        </span>
                        <Image
                            src={ProductDetails.imgSrc}
                            alt={ProductDetails.title}
                            className="absolute inset-0 h-full w-full bg-gray-200 object-cover transition-transform duration-300 group-hover:scale-105"
                            preload
                            fill
                            sizes="(max-width: 1024px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>

                    <ProductDetailsView ProductDetails={ProductDetails} />

                </div>
            </main>

            <div className="border-t border-slate-200 dark:border-slate-800">
                <CallToAction />
            </div>
        </div>
    );
}
