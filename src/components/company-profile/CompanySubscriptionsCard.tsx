"use client";

import { fetchTenantDetails } from "@/app/actions/tenant";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import ExpiryBanner, { getExpiryString } from "./ExpiryBanner";
import Input from "../form/input/InputField";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MobileScreenShareOutlinedIcon from "@mui/icons-material/MobileScreenShareOutlined"
import Button from "../ui/button/Button";
import { subscriptionPlans } from "@/data/globalExports";







export default function CompanySubscriptionsCard() {
  const { profile } = useUser();
  const [company, setCompany] = useState<any>(null);
  const [loadingCompany, setLoadingCompany] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('m-pesa');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const getTenantDetails = async () => {
      if (!profile?.tenant_id) {
        setLoadingCompany(false);
        return;
      }
      if (profile?.tenant_id) {
        const res = await fetchTenantDetails(profile.tenant_id);
        setCompany(res.data);
        if (res) {
          setLoadingCompany(false);
        }
      }
    };

    getTenantDetails();
  }, [profile?.tenant_id]);

  const handleCheckoutSubmit = async () => {
    // implement ptment and expense, pyment, company profile update here; start with payment, then expenses then update profile 
    
  };

  if (!profile || !profile.tenant_id || loadingCompany) {
    return (
      <div className="w-full mx-auto p-6 space-y-6 animate-pulse">
        {/* Header Section Placeholder */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded-md dark:bg-gray-600"></div>
            <div className="h-4 w-32 bg-gray-100 rounded-md dark:bg-gray-600"></div>
          </div>
          <div className="h-10 w-28 bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-5 border border-gray-100 dark:border-gray-700 rounded-xl space-y-3">
              <div className="h-4 w-34 bg-gray-100 rounded-md dark:bg-gray-600"></div>
              <div className="h-8 w-19 bg-gray-200 rounded-md dark:bg-gray-600"></div>
            </div>
          ))}
        </div>

        {/* Main Content Area / List Placeholder */}
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 space-y-4">
          <div className="h-5 w-36 bg-gray-200 dark:bg-gray-500 rounded-md mb-2"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-600 last:border-0">
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full shrink-0"></div>
                <div className="space-y-2 w-full max-w-[60%]">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-md w-3/4"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded-md w-1/2"></div>
                </div>
              </div>
              <div className="h-4 w-12 bg-gray-100 rounded-md dark:bg-gray-600"></div>
            </div>
          ))}
        </div>

        {/* Subtle Loading Text Indicator */}
        <div className="flex items-center justify-center space-x-2 pt-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <span className="text-xs text-gray-400 font-medium pl-1">Syncing workspace...</span>
        </div>
      </div>

    );
  }
  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 min-h-[70vh]">
        <div className="text-4xl mb-4">🏢</div>
        <h3 className="text-lg font-semibold text-red-600">Company Not Found</h3>
        <p className="text-gray-500 max-w-sm mt-2">
          We couldn't locate a profile associated with your account. If you believe this is an error, please contact support.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <ExpiryBanner plan={company.subscription_plan} expiryDate={company.expiry_date} />

      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            {company.tenant_logo ? (
              <img src={company.tenant_logo} alt="Company Logo" className="h-full w-full object-contain p-1 bg-white" />
            ) : (
              <span className="text-xl font-bold text-gray-400">{company.name?.charAt(0)}</span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{company.name}</h2>
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-gray-500">{company.slug}.fleetmaster.co.ke {company.website && ` - ${company.website}`}</p>
              <span className="text-xs text-gray-400">|</span>
              <p className="text-xs font-medium text-gray-500">{company.subscription_plan || "N/A"} Plan</p>
              <span className="text-xs text-gray-400">|</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${company.subscription_status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600'}`}>
                {company.subscription_status || "Inactive"}
              </span>
              <span className="text-xs text-gray-400">|</span>
              <p className="text-xs font-medium text-gray-500">{
                getExpiryString(company.expiry_date)
              }</p>

            </div>
          </div>
        </div>

      </div>

      <div className="p-6 space-y-8">
        {/* new  subscription */}
        <ComponentCard title="Contact Information">
          <div className="text-gray-400">New subscriptions are automatically added to existing ones and features will update within 1 day</div>
          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {
              subscriptionPlans?.map((plan, index) => (
                <div key={index}
                  className={`relative cursor-pointer h-full flex flex-col rounded-2xl p-8 border border-brand-300 dark:border-brand-900 dark:text-white shadow-sm hover:-translate-y-5 ${selectedIndex === index ? '-translate-y-5 bg-brand-950' : 'bg-transparent'} transition-all`}
                  style={{ opacity: selectedIndex === index ? 1 : 0.85 }}
                  onClick={() => setSelectedIndex(index)}
                >
                  <h3 className={`text-brand-500 uppercase ${selectedIndex === index ? 'text-white font-semibold' : ''}`}>{plan?.name}</h3>
                  <p className={`mt-1 mb-5 text-xs text-muted  ${selectedIndex === index ? 'text-gray-300' : 'text-muted'}`}> {plan?.tagline}</p>
                  <div className="mb-3">
                    <span className="align-top text-sm text-gray-400">{plan?.currency}</span>
                    <span className={`ml-1 text-4xl font-extrabold text- dark:text-white ${selectedIndex === index ? 'text-white' : 'text-black'}`}>{plan?.price}</span>
                  </div>
                  <div className="border-t pt-6 border-border">
                    <p className={`mb-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-gray-500  ${selectedIndex === index ? 'text-white' : 'text-black'}`}>{plan.featuresTitle}</p>
                    <div className="space-y-2.5">
                      {plan?.features.filter(f => f.included).map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          {feature?.included ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check mt-0.5 shrink-0 text-brand-500" aria-hidden="true">
                              <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus mt-0.5 shrink-0 text-red-500" aria-hidden="true">
                              <path d="M5 12h14"></path>
                            </svg>
                          )}
                          <span className={`text-[13px] ${selectedIndex === index ? 'text-gray-200' : 'text-muted'}`}>
                            <span
                              className={`font-medium text-foreground ${!feature?.included ? 'line-through opacity-40' : ''}`}                        ><span className="font-semibold">{feature.highlightedText}</span> {feature.text}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>


          {/* Billing Gateway Gateway Interface Config */}
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">3. Choose Payment Method</h4>
          <FormControl component="fieldset" className="w-full mb-6">
            {/* Use ONE RadioGroup mapped directly to your state variable */}
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="space-y-3"
            >
              {/* M-Pesa Option Layout Box */}
              <div
                onClick={() => setPaymentMethod('m-pesa')}
                className={`flex items-center justify-between border rounded-xl px-3 py-2 cursor-pointer bg-white dark:bg-gray-900 transition-colors ${paymentMethod === 'm-pesa'
                  ? 'border-brand-500 bg-brand-50/5'
                  : 'border-gray-200 dark:border-gray-800'
                  }`}
              >
                <FormControlLabel
                  value="m-pesa"
                  control={<Radio size="small" />}
                  label={
                    <div className="flex items-center gap-2">
                      <MobileScreenShareOutlinedIcon className="text-brand-500" fontSize="small" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">M-Pesa Instant PayBill</span>
                    </div>
                  }
                />
              </div>

              {/* Card Option Layout Box */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-between border rounded-xl px-3 py-2 cursor-pointer bg-white dark:bg-gray-900 transition-colors ${paymentMethod === 'card'
                  ? 'border-brand-500 bg-brand-50/5'
                  : 'border-gray-200 dark:border-gray-800'
                  }`}
              >
                <FormControlLabel
                  value="card"
                  control={<Radio size="small" />}
                  label={
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="text-brand-500" fontSize="small" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Bank Instant Checkout (VISA/MASTER Card)</span>
                    </div>
                  }
                />
              </div>
            </RadioGroup>
          </FormControl>

          <div className="mt-4 mb-4 transition-all duration-200">
            {paymentMethod === 'm-pesa' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  M-Pesa Mobile Number
                </label>
                <div className="relative mt-2">
                  <Input
                    type="tel"
                    placeholder="e.g., 0712345678"
                    className="pl-15.5"
                    defaultValue={company?.phone}
                    value={mpesaNumber || company?.phone}
                    onChange={(e) => setMpesaNumber(e.target.value)}
                    disabled={isPaying}
                  />
                  <span className="absolute left-0 top-1/2 flex text-sm h-11 w-13.75 dark:text-white -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                    +254
                  </span>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                {/* Card Number Row */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Card Details
                  </label>
                  <div className="relative mt-2">
                    <Input
                      type="text"
                      placeholder="Card number"
                      className="pl-15.5"
                    // value={cardNumber}
                    // onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <span className="absolute left-0 top-1/2 flex h-11 w-11.5 -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="6.25" cy="10" r="5.625" fill="#E80B26" />
                        <circle cx="13.75" cy="10" r="5.625" fill="#F59D31" />
                        <path
                          d="M10 14.1924C11.1508 13.1625 11.875 11.6657 11.875 9.99979C11.875 8.33383 11.1508 6.8371 10 5.80713C8.84918 6.8371 8.125 8.33383 8.125 9.99979C8.125 11.6657 8.84918 13.1625 10 14.1924Z"
                          fill="#FC6020"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Expiry and CVV Side-by-Side Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Expiry Date
                    </label>
                    <Input
                      type="text"
                      max={'5'}
                      placeholder="MM/YY"
                      className="w-full text-center mt-2"
                    // value={expiry}
                    // onChange={(e) => handleExpiryChange(e.target.value)}
                    />
                  </div>

                  {/* CVV/CVC Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Secure Code (CVV)
                    </label>
                    <Input
                      type="password"
                      max={'4'}
                      placeholder="•••"
                      className="w-full text-center tracking-widest mt-2"
                    // value={cvv}
                    // onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Dynamic Call-To-Action Operations Routing Grid */}
          <div className="space-y-3 mt-4">
            <Button onClick={handleCheckoutSubmit} className="w-full intaSendPayButton" data-amount="10" data-currency="KES" size='md' disabled={isPaying || paymentSuccess}>
              {isPaying
                ? "Processing Transaction..."
                : `Pay Now (Ksh. ${(parseInt(subscriptionPlans[selectedIndex].price)).toLocaleString()})`
              }
            </Button>
          </div>
        </ComponentCard>

        {/* Operational Settings */}
        <ComponentCard title="Subscription History">
          <div className="grid grid-cols-1 gap-4">
            <DataPoint label="Expert Plan" value={company.timezone} />
            <DataPoint label="Free Trial Plan" value={company.language} />
          </div>
        </ComponentCard>
      </div>

      {/* Footer / About Section */}
      {company.about && (
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">About</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{company.about}</p>
        </div>
      )}
    </div>
  );
}

function DataPoint({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col rounded-lg bg-gray-50 p-3 dark:bg-gray-800/30">
      <span className="mb-2 text-[12px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
      <span className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
        Ksh. 550 | M-PESA | {(new Date()).toLocaleString()}
      </span>
    </div>
  );
}