import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Metadata } from "next";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined"
import { EnvelopeIcon } from "@/icons";
import LeaseInput from "@/components/client-components/LeaseInput";

export const metadata: Metadata = {
  title:
    "Lease Your Fleet with Us",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};


export default function page() {
  return (
    <div className="container m-auto min-h-screen">
      <PageBreadcrumb pageTitle="Lease Your Fleet with Us" />


      <div className="grid items-center container m-auto mt-5 grid-cols-1 lg:grid-cols-12 gap-5 p-4">
        <div className="lg:col-span-6">
          {/* <ViewAllCategories tenant={tenant} /> */}
          <img className="rounded-3xl img-fluid" src='https://www.pigiame.co.ke/discover/wp-content/uploads/2025/06/Car-Hire-Nairobi.jpg' alt="lease" />
        </div>
        <div className="lg:col-span-6">
          <h3 className="text-amber-500">LEASE WITH US</h3>
          <h2 className="text-3xl mt-4 mb-3 font-bold text-black dark:text-white">Lease out your car with us & start earning</h2>
          {/* 4. Removed m-auto so text aligns nicely to the left edge of its container */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            At Oduk CarHire, we are passionate about providing exceptional car rental services that exceed our customers' expectations. With a commitment to quality, reliability, and customer satisfaction, we strive to be the preferred choice for all your car rental needs. Our extensive fleet of well-maintained vehicles, competitive pricing, and personalized service make us the go-to destination for travelers seeking convenience and comfort on the road.
          </p>
          <div className="flex gap-3 mt-5">
            <Button variant="success" size="sm" className="py-1 small px-4" >Enquire  <PhoneEnabledOutlinedIcon fontSize="small" /></Button>
            <Button variant="primary" size="sm" className="py-1 small px-4">Send an Email  <EnvelopeIcon fontSize="small" /></Button>
          </div>
        </div>
      </div>

      <LeaseInput />

    </div>
  );
}
