import Label from "@/components/form/Label";

export default function ViewPaymentPage({
  paymentDetails,
}: {
  paymentDetails: any;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-7 py-6">
      <section data-v-298b8f5c="" className="page-head">
        <h1
          data-v-298b8f5c=""
          className="text mb-2 text-2xl font-bold text-black dark:text-white"
        >
          View Payment
        </h1>
        <p data-v-298b8f5c="" className="ph-sub text-sm text-gray-400">
          Incoming money. The dashboard includes these in revenue to give you a
          real bottom line.
        </p>
      </section>

      <section data-v-79ac9dcd="" data-v-298b8f5c="" className="dc">
        <header
          data-v-79ac9dcd=""
          className="border-brand-700 dark:border-brand-400 mb-3 rounded-2xl border p-3"
        >
          <div data-v-79ac9dcd="" className="dc-head-main">
            <div data-v-79ac9dcd="" className="dc-title mb-1 text-gray-400">
              Received
            </div>
            <div data-v-79ac9dcd="" className="dc-desc text-brand-400 text-sm">
              Received money. Included in revenue on the dashboard.
            </div>
          </div>
        </header>

        <div data-v-79ac9dcd="" className="dc-body space-y-3">
          <div data-v-298b8f5c="" className="cf-row">
            <Label data-v-298b8f5c="" className="cf-lbl">
              Payment Purpose
              <span
                data-v-298b8f5c=""
                className="cf-req text-red-500"
                aria-label="required"
              >
                *
              </span>
            </Label>
            <div data-v-298b8f5c="" className="cf-control">
              <div className="rounded-lg bg-gray-200 p-2 px-4 text-sm leading-6 text-gray-600 capitalize dark:bg-gray-900 dark:text-gray-400">
                {paymentDetails?.message?.replace(
                  "New payment record for ",
                  "",
                ) || "Payment successful!"}{" "}
              </div>
            </div>
          </div>
          <div data-v-298b8f5c="" className="cf-row">
            <Label data-v-298b8f5c="" className="cf-lbl">
              Amount{" "}
              <span data-v-298b8f5c="" className="cf-req" aria-label="required">
                (KSH)
              </span>
            </Label>
            <div className="rounded-lg bg-gray-200 p-2 px-4 text-black dark:bg-gray-900 dark:text-white">
              {" "}
              {paymentDetails?.amount?.toLocaleString()}{" "}
              {paymentDetails?.currency}{" "}
            </div>
          </div>
          <div data-v-298b8f5c="" className="cf-row">
            <Label data-v-298b8f5c="" className="cf-lbl">
              Payment Method
            </Label>
            <div data-v-298b8f5c="" className="cf-control">
              <div className="rounded-lg bg-gray-200 p-2 px-4 text-black dark:bg-gray-900 dark:text-white">
                {" "}
                {paymentDetails?.provider}{" "}
              </div>
            </div>
          </div>
          <div data-v-298b8f5c="" className="cf-row">
            <Label data-v-298b8f5c="" className="cf-lbl">
              Account Number
            </Label>
            <div data-v-298b8f5c="" className="cf-control">
              <div className="rounded-lg bg-gray-200 p-2 px-4 text-black dark:bg-gray-900 dark:text-white">
                {" "}
                {paymentDetails?.account_number}{" "}
              </div>
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
              <div className="rounded-lg bg-gray-200 p-2 px-4 text-black uppercase dark:bg-gray-900 dark:text-white">
                {" "}
                {paymentDetails?.payment_ref}{" "}
              </div>
            </div>
          </div>
          <div data-v-298b8f5c="" className="cf-row cf-row-stack">
            <Label data-v-298b8f5c="" className="cf-lbl">
              Message
            </Label>
            <div data-v-298b8f5c="" className="cf-control">
              <div className="rounded-lg bg-gray-200 p-2 px-4 text-sm leading-6 text-gray-600 capitalize dark:bg-gray-900 dark:text-gray-400">
                {paymentDetails?.message || "Payment successful!"}{" "}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
