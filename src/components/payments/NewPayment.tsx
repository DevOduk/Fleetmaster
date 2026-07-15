"use client"
import React, { useState } from 'react'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select';
import { paymentsCategories } from '@/data/globalExports';
import TextArea from '../form/input/TextArea';
import { useUser } from '@/context/UserContext';
import Input from '../form/input/InputField';
import { ArrowRightIcon } from '@/icons';
import { useToast } from '@/context/ToastContext';
import { createPayment } from '@/app/actions/payments';


const defExpense = {
    category: '',
    method: '',
    amount: 0,
    currency: '',
    description: '',
    payment_ref: '',
    phone: '',
};

export default function NewPaymentsForm() {
    const { profile } = useUser();
    const { showToast } = useToast();
    const [expenseDetails, setExpenseDetails] = useState(defExpense);
    const [loading, setLoading] = useState(false);


    const handleCreate = async (e) => {
        e.preventDefault();
        if (
            !expenseDetails.category.trim() ||
            !expenseDetails.method.trim() ||
            !expenseDetails.description.trim() ||
            !expenseDetails.payment_ref.trim() ||
            !expenseDetails.phone.trim() ||
            expenseDetails.amount === 0
        ) {
            showToast('Please fill out all the required fields!', 'error');
            return;
        }
        setLoading(true);

        const newPayment = {
            tenant_id: profile.tenant_id,
            intasend_invoice_id: expenseDetails?.payment_ref,
            provider: expenseDetails.method,
            provider_reference: expenseDetails?.payment_ref,
            amount: Number(expenseDetails.amount),
            currency: profile?.fleetmaster_tenants?.currency,
            account_number: expenseDetails.phone,
            payment_ref: expenseDetails?.payment_ref,
            user_id: null,
            status: 'Success',
            message: expenseDetails.description,
        };

        const res = await createPayment(newPayment);

        if (res.success) {
            showToast('New payment record has been created successfully!', 'success')
            setExpenseDetails(defExpense);
            window.location.href = '/payments';
        } else {
            showToast(res.error.message, 'error')
            setLoading(false);
        }

    }
    return (
        <div className="max-w-5xl mx-auto space-y-7 py-6">
            <section data-v-298b8f5c="" className="page-head">
                <h1 data-v-298b8f5c="" className="text text-2xl font-bold mb-2 text-black dark:text-white">Record Payment</h1>
                <p data-v-298b8f5c="" className="ph-sub text-sm text-gray-400">Incoming money. The dashboard includes these in revenue to give you a real bottom line.</p>
            </section>

            <form onSubmit={(e) => handleCreate(e)}>
                <section data-v-79ac9dcd="" data-v-298b8f5c="" className="dc">
                    <header data-v-79ac9dcd="" className="mb-3 border border-brand-700 p-3 rounded-2xl dark:border-brand-400">
                        <div data-v-79ac9dcd="" className="dc-head-main">
                            <div data-v-79ac9dcd="" className="dc-title mb-1 text-gray-400">Received</div>
                            <div data-v-79ac9dcd="" className="dc-desc text-sm text-brand-400">Received money. Included in revenue on the dashboard.</div>
                        </div>
                    </header>

                    <div data-v-79ac9dcd="" className="dc-body space-y-3">
                        <div data-v-298b8f5c="" className="cf-row">
                            <Label data-v-298b8f5c="" className="cf-lbl">Payment Purpose<span data-v-298b8f5c="" className="cf-req text-red-500" aria-label="required">*</span>
                            </Label>
                            <div data-v-298b8f5c="" className="cf-control">
                                <Select value={expenseDetails.category} onChange={(e) => setExpenseDetails(prev => ({ ...prev, category: (e), description: `New payment record for ${paymentsCategories.find(v => v.value === e).label}` }))} options={paymentsCategories.map(e => { return { value: e.value, label: e.value } })}></Select>
                            </div>
                        </div>
                        <div data-v-298b8f5c="" className="cf-row">
                            <Label data-v-298b8f5c="" className="cf-lbl">Amount <span data-v-298b8f5c="" className="cf-req" aria-label="required">(KSH)</span>
                            </Label>
                            <Input type="number" placeholder="0" value={expenseDetails.amount} onChange={(e) => setExpenseDetails(prev => ({ ...prev, amount: Number.parseFloat(e.target.value) }))} />
                        </div>
                        <div data-v-298b8f5c="" className="cf-row">
                            <Label data-v-298b8f5c="" className="cf-lbl">Payment Method</Label>
                            <div data-v-298b8f5c="" className="cf-control">
                                <Select value={expenseDetails.method} onChange={(v) => setExpenseDetails(prev => ({ ...prev, method: v }))} options={['Cash', 'M-Pesa', 'Bank', 'Card', 'Other'].map(m => { return { label: m, value: m } })}></Select>
                            </div>
                        </div>
                        <div data-v-298b8f5c="" className="cf-row">
                            <Label data-v-298b8f5c="" className="cf-lbl">Account Number</Label>
                            <div data-v-298b8f5c="" className="cf-control">
                                <Input placeholder='4378 4567 8909 6543' value={expenseDetails.phone} onChange={(v) => setExpenseDetails(prev => ({ ...prev, phone: v.target.value }))} />
                            </div>
                        </div>
                        <div data-v-298b8f5c="" className="cf-row">
                            <Label data-v-298b8f5c="" className="cf-lbl">Receipt number <span data-v-298b8f5c="" className="cf-hint">/ Payment Reference for reconciliation.</span>
                            </Label>
                            <div data-v-298b8f5c="" className="cf-control">
                                <Input value={expenseDetails.payment_ref.toUpperCase()} onChange={(e) => setExpenseDetails(prev => ({ ...prev, payment_ref: (e.target.value).toUpperCase() }))} type="text" placeholder="QXJ87YGD6" className="ti-input ti-field ti-mono ti-narrow" />
                            </div>
                        </div>
                        <div data-v-298b8f5c="" className="cf-row cf-row-stack">
                            <Label data-v-298b8f5c="" className="cf-lbl">Description</Label>
                            <div data-v-298b8f5c="" className="cf-control">
                                <TextArea placeholder="Describe the expense" value={expenseDetails.description} onChange={(e) => setExpenseDetails(prev => ({ ...prev, description: (e) }))} rows={4} className="ta-input">
                                </TextArea>
                            </div>
                        </div>
                    </div>

                    <button disabled={loading} type='submit'
                        className="flex ms-auto mt-3 text-nowrap items-center justify-center p-3 px-4 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
                    >
                        Finish & Submit <ArrowRightIcon className="ml-1" />
                    </button>
                </section>
            </form>
        </div>
    )
}
