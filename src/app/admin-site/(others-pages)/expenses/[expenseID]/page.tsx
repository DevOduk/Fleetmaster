import { fetchExpenseDetails } from "@/app/actions/expenses";
import ViewExpensePage from "@/components/expenses/ViewExpense";
import EditSystemUserCard from "@/components/ProfilePage/admin-profile/EditSystemUserCard";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Update System User Profile | FleetManager Admin Dashboard - Best tool for Fleet Management",
  description:
    "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

export default async function ViewExpense({
  params,
}: {
  params: Promise<{ expenseID: string }>;
}) {
  const [{ expenseID }] = await Promise.all([params]);
  let expense = null;
  const [res] = await Promise.all([fetchExpenseDetails(expenseID)]);

  if (res.success) {
    expense = res.data;
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="mb-4 flex items-center gap-3">
          <Link href="/expenses" className="mr-2">
            <Button size="sm" variant="danger-outline">
              <ChevronLeftIcon />
              Back to Expenses
            </Button>
          </Link>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            View Expense
          </h3>
        </div>
        <div className="space-y-6">
          <ViewExpensePage expenseDetails={expense} />
        </div>
      </div>
    </div>
  );
}
