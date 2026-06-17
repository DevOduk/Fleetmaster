"use client"
import ViewAllCategories from "@/components/client-components/categories";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { useTenant } from "@/context/TenantContext";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined"
import { EnvelopeIcon } from "@/icons";
import ViewAllLocations from "@/components/client-components/locations";


export default function AboutPageContent() {
    const { tenant: tenantData } = useTenant();

    return (
        <div>
            <div className="grid items-center container m-auto grid-cols-1 lg:grid-cols-12 gap-5 p-4">

                {/* 3. Swapped col-7 for col-span-7 */}
                <div className="lg:col-span-7">
                    <ViewAllCategories tenantData={tenantData} />
                </div>

                {/* 2. Swapped col-5 for col-span-5 */}
                <div className="lg:col-span-5">
                    <h3 className="text-amber-500">ABOUT US</h3>
                    <h2 className="text-3xl mt-4 mb-3 font-bold text-black dark:text-white">Welcome to {tenantData?.name || "CarHire"}</h2>
                    {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[700px]">
                        At {tenantData?.name}, we are passionate about providing exceptional car rental services that exceed our customers' expectations. With a commitment to quality, reliability, and customer satisfaction, we strive to be the preferred choice for all your car rental needs. Our extensive fleet of well-maintained vehicles, competitive pricing, and personalized service make us the go-to destination for travelers seeking convenience and comfort on the road.
                    </p>

                    <div className="flex gap-3 mt-5">
                        <Button variant="success" size="sm" className="py-1 small px-4" >Enquire  <PhoneEnabledOutlinedIcon fontSize="small" /></Button>
                        <Button variant="primary" size="sm" className="py-1 small px-4">Send an Email  <EnvelopeIcon fontSize="small" /></Button>
                    </div>
                </div>

            </div>


            <br />
            <div>
                <h3 className="text-brand-500 text-center">Available Countrywide</h3>
                <h2 className="text-3xl mt-4 mb-3 font-bold text-black text-center dark:text-white">Explore Our Locations</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-[700px] m-auto">Browse our extensive collection of well-maintained vehicles across divers locations. From compact cars to luxury sedans, we have the perfect vehicle for your needs.</p>

                <ViewAllLocations tenantData={tenantData} />
            </div>
            <div className="border-gray-500 border-t container m-auto mb-5"></div>


        </div>
    );
}
