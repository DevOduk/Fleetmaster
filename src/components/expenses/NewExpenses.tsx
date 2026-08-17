"use client";
import React, { useState } from "react";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { expenseCategories } from "@/data/globalExports";
import TextArea from "../form/input/TextArea";
import { useUser } from "@/context/UserContext";
import Input from "../form/input/InputField";
import { ArrowRightIcon } from "@/icons";
import { useToast } from "@/context/ToastContext";
import { createExpense } from "@/app/actions/expenses";

const defExpense = {
  category: "",
  method: "",
  amount: 0,
  currency: "",
  description: "",
  payment_ref: "",
};

function NewExpenses() {
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
      expenseDetails.amount === 0
    ) {
      showToast("Please fill out all the required fields!", "error");
      return;
    }
    setLoading(true);

    const res = await createExpense({
      ...expenseDetails,
      currency: profile?.fleetmaster_tenants?.currency,
      tenant_id: profile.tenant_id,
    });

    if (res.success) {
      showToast("New expense record has been created successfully!", "success");
      setExpenseDetails(defExpense);
      window.location.href = "/expenses";
    } else {
      showToast(res.error.message, "error");
      setLoading(false);
    }
  };
  return (
    <div className="mx-auto max-w-5xl space-y-7 py-6">
      <section data-v-298b8f5c="" className="page-head">
        <h1
          data-v-298b8f5c=""
          className="text mb-2 text-2xl font-bold text-black dark:text-white"
        >
          Record an expense
        </h1>
        <p data-v-298b8f5c="" className="ph-sub text-sm text-gray-400">
          Outgoing money. The dashboard subtracts these from revenue to give you
          a real bottom line.
        </p>
      </section>

      <form onSubmit={(e) => handleCreate(e)}>
        <section data-v-79ac9dcd="" data-v-298b8f5c="" className="dc">
          <header
            data-v-79ac9dcd=""
            className="border-brand-700 dark:border-brand-400 mb-3 rounded-2xl border p-3"
          >
            <div data-v-79ac9dcd="" className="dc-head-main">
              <div data-v-79ac9dcd="" className="dc-title mb-1">
                Spend
              </div>
              <div
                data-v-79ac9dcd=""
                className="dc-desc text-brand-400 text-sm"
              >
                Outgoing money. Subtracted from revenue on the dashboard.
              </div>
            </div>
          </header>

          <div data-v-79ac9dcd="" className="dc-body space-y-3">
            <div data-v-298b8f5c="" className="cf-row">
              <Label data-v-298b8f5c="" className="cf-lbl">
                Category
                <span
                  data-v-298b8f5c=""
                  className="cf-req text-red-500"
                  aria-label="required"
                >
                  *
                </span>
              </Label>
              <div data-v-298b8f5c="" className="cf-control">
                <Select
                  value={expenseDetails.category}
                  onChange={(e) =>
                    setExpenseDetails((prev) => ({
                      ...prev,
                      category: e,
                      description: expenseCategories.find((v) => v.value === e)
                        .label,
                    }))
                  }
                  options={expenseCategories.map((e) => {
                    return { value: e.value, label: e.value };
                  })}
                ></Select>
              </div>
            </div>
            <div data-v-298b8f5c="" className="cf-row">
              <Label data-v-298b8f5c="" className="cf-lbl">
                Amount{" "}
                <span
                  data-v-298b8f5c=""
                  className="cf-req"
                  aria-label="required"
                >
                  (KSH)
                </span>
              </Label>
              <Input
                type="number"
                placeholder="0"
                value={expenseDetails.amount}
                onChange={(e) => {
                  const val = e.target.value;

                  const sanitized = val.replace(/^0+(?!$)/, "");

                  setExpenseDetails((prev) => ({
                    ...prev,
                    amount: sanitized === "" ? 0 : Number(sanitized),
                  }));
                }}
              />
            </div>
            <div data-v-298b8f5c="" className="cf-row">
              <Label data-v-298b8f5c="" className="cf-lbl">
                Payment method
              </Label>
              <div data-v-298b8f5c="" className="cf-control">
                <Select
                  value={expenseDetails.method}
                  onChange={(v) =>
                    setExpenseDetails((prev) => ({ ...prev, method: v }))
                  }
                  options={["Cash", "M-Pesa", "Bank", "Card", "Other"].map(
                    (m) => {
                      return { label: m, value: m };
                    },
                  )}
                ></Select>
              </div>
            </div>
            <div data-v-298b8f5c="" className="cf-row">
              <Label data-v-298b8f5c="" className="cf-lbl">
                Receipt number{" "}
                <span data-v-298b8f5c="" className="cf-hint">
                  / Payment Reference for reconciliation.
                </span>
              </Label>
              <div data-v-298b8f5c="" className="cf-control">
                <Input
                  value={expenseDetails.payment_ref.toUpperCase()}
                  onChange={(e) =>
                    setExpenseDetails((prev) => ({
                      ...prev,
                      payment_ref: e.target.value.toUpperCase(),
                    }))
                  }
                  type="text"
                  placeholder="QXJ87YGD6"
                  className="ti-input ti-field ti-mono ti-narrow"
                />
              </div>
            </div>
            <div data-v-298b8f5c="" className="cf-row cf-row-stack">
              <Label data-v-298b8f5c="" className="cf-lbl">
                Description
              </Label>
              <div data-v-298b8f5c="" className="cf-control">
                <TextArea
                  placeholder="Describe the expense"
                  value={expenseDetails.description}
                  onChange={(e) =>
                    setExpenseDetails((prev) => ({ ...prev, description: e }))
                  }
                  rows={4}
                  className="ta-input"
                ></TextArea>
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="bg-brand-500 text-theme-sm hover:bg-brand-600 ms-auto mt-3 flex items-center justify-center rounded-lg p-3 px-4 font-medium text-nowrap text-white"
          >
            Finish & Submit <ArrowRightIcon className="ml-1" />
          </button>
        </section>
      </form>
    </div>
  );
}

export default NewExpenses;
