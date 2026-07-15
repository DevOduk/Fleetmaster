import Label from '@/components/form/Label'


export default function ViewExpensePage({ expenseDetails }: { expenseDetails: any; }) {

    return (
        <div className="max-w-5xl mx-auto space-y-7 py-6">
            <section data-v-298b8f5c="" className="page-head">
                <h1 data-v-298b8f5c="" className="text text-2xl font-bold mb-2 text-black dark:text-white">View Expense</h1>
                <p data-v-298b8f5c="" className="ph-sub text-sm text-gray-400">Outgoing money. The dashboard subtracts these from revenue to give you a real bottom line.</p>
            </section>

            <section data-v-79ac9dcd="" data-v-298b8f5c="" className="dc">
                <header data-v-79ac9dcd="" className="mb-3 border border-brand-700 p-3 rounded-2xl dark:border-brand-400">
                    <div data-v-79ac9dcd="" className="dc-head-main">
                        <div data-v-79ac9dcd="" className="dc-title mb-1 dark:text-gray-300">Spend</div>
                        <div data-v-79ac9dcd="" className="dc-desc text-sm text-brand-400">Outgoing money. Subtracted from revenue on the dashboard.</div>
                    </div>
                </header>

                <div data-v-79ac9dcd="" className="dc-body space-y-3">
                    <div data-v-298b8f5c="" className="cf-row">
                        <Label data-v-298b8f5c="" className="cf-lbl">Category<span data-v-298b8f5c="" className="cf-req text-red-500" aria-label="required">*</span>
                        </Label>
                        <div data-v-298b8f5c="" className="cf-control">
                            <div className='text-black dark:text-white p-2 px-4 rounded-lg bg-gray-200 capitalize dark:bg-gray-900'> {expenseDetails?.category} </div>
                        </div>
                    </div>
                    <div data-v-298b8f5c="" className="cf-row">
                        <Label data-v-298b8f5c="" className="cf-lbl">Amount <span data-v-298b8f5c="" className="cf-req" aria-label="required">(KSH)</span>
                        </Label>
                        <div className='text-black dark:text-white p-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-900'> {expenseDetails?.amount?.toLocaleString()} {expenseDetails?.currency} </div>
                    </div>
                    <div data-v-298b8f5c="" className="cf-row">
                        <Label data-v-298b8f5c="" className="cf-lbl">Payment method</Label>
                        <div data-v-298b8f5c="" className="cf-control">
                            <div className='text-black dark:text-white p-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-900'> {expenseDetails?.method} </div>
                        </div>
                    </div>
                    <div data-v-298b8f5c="" className="cf-row">
                        <Label data-v-298b8f5c="" className="cf-lbl">Receipt number <span data-v-298b8f5c="" className="cf-hint">/ Payment Reference for reconciliation.</span>
                        </Label>
                        <div data-v-298b8f5c="" className="cf-control">
                            <div className='text-black dark:text-white p-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-900 uppercase'> {expenseDetails?.payment_ref} </div>
                        </div>
                    </div>
                    <div data-v-298b8f5c="" className="cf-row cf-row-stack">
                        <Label data-v-298b8f5c="" className="cf-lbl">Description</Label>
                        <div data-v-298b8f5c="" className="cf-control">
                            <div className='text-black dark:text-white p-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-900'> {expenseDetails?.description} </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
