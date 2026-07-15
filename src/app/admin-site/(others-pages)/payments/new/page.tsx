import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewExpenses from "@/components/expenses/NewExpenses";
import NewPaymentsForm from "@/components/payments/NewPayment";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Record New Payment | FleetManager Admin Dashboard - Best tool for Fleet Management",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default function NewBooking() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <PageBreadcrumb items={
          [
            {
              label: 'Payments',
              href: '/payments'
            }
          ]
        } pageTitle="Record Payment" />

        <div className="flex gap-3 items-center mb-4">

          <Link href="/payments" className="mr-2">
            <Button size="sm" variant="danger-outline">
              <ChevronLeftIcon />
              Back to Payments
            </Button>
          </Link>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Record Payment
          </h3>
        </div>
        <div className="space-y-6">
          <NewPaymentsForm />
        </div>
      </div>
    </div>
  );
}
