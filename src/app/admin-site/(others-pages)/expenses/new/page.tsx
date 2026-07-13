import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import NewExpenses from '@/components/expenses/NewExpenses';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title:
    "Create Expense - Best tool for Fleet Management",
  description: "FleetManager is the ultimate fleet management dashboard built with Next.js and Tailwind CSS. Monitor your fleet's performance, track vehicles in real-time, and optimize operations with our intuitive interface. Try it now and experience seamless fleet management like never before.",
};

function NewExpense() {
    return (
        <div className="text-gray-800 dark:text-white">
            <PageBreadcrumb items={
                [
                    {
                        label: 'Expenses',
                        href: '/expenses'
                    }
                ]
            } pageTitle='Create Expense' />

<NewExpenses />
        </div>
    )
}

export default NewExpense
