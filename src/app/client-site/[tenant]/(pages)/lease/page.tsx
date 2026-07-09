import { Metadata } from "next";
import LeasingCheck from "@/components/client-components/LeasingCheck";



export const metadata: Metadata = {
  title: "Lease Your Fleet with Us",
  description: "Join Oduk CarHire and start earning from your vehicle.",
};


export default function Page() {

  return (
    <LeasingCheck />
  );
}