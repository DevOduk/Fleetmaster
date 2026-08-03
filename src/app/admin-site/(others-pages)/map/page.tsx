import Map from "@/components/map/Map";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import VpnLockOutlinedIcon from "@mui/icons-material/VpnLockOutlined"
export const metadata: Metadata = {
  title:
    "Map | FleetMaster - Best tool for Fleet Management",
  description: "FleetMaster is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Map" />
      <div className="mt-10 text-red-400 flex-col gap-4 dark:text-red-600 text-[10px] min-h-[75vh] justify-center flex items-center">
        <VpnLockOutlinedIcon fontSize="large" className="text-2xl" />
        <p className=" font-medium tracking-[0.2em] uppercase text-red-400 dark:text-red-600">
          Error Status: FEATURE COMING SOON
        </p>
        <p className="text-sm text-gray-500 max-w-4xl">Live maps integration is coming soon. With real-time vehicle traccking and telematics ensring you car is safe, secure and running well.</p>
      </div>

      {/* <Map /> */}
    </div>
  );
}
