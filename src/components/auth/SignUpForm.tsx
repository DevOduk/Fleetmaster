"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useTenant } from "@/context/TenantContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { createTenantClient } from "@/app/actions/client";
import Select from "../form/Select";
import Button from "../ui/button/Button";

export const countries = [
  { code: "AF", label: "+93", country: "Afghanistan" },
  { code: "AX", label: "+358", country: "Aland Islands" },
  { code: "AL", label: "+355", country: "Albania" },
  { code: "DZ", label: "+213", country: "Algeria" },
  { code: "AS", label: "+1-684", country: "American Samoa" },
  { code: "AD", label: "+376", country: "Andorra" },
  { code: "AO", label: "+244", country: "Angola" },
  { code: "AI", label: "+1-264", country: "Anguilla" },
  { code: "AG", label: "+1-268", country: "Antigua and Barbuda" },
  { code: "AR", label: "+54", country: "Argentina" },
  { code: "AM", label: "+374", country: "Armenia" },
  { code: "AW", label: "+297", country: "Aruba" },
  { code: "AU", label: "+61", country: "Australia" },
  { code: "AT", label: "+43", country: "Austria" },
  { code: "AZ", label: "+994", country: "Azerbaijan" },
  { code: "BS", label: "+1-242", country: "Bahamas" },
  { code: "BH", label: "+973", country: "Bahrain" },
  { code: "BD", label: "+880", country: "Bangladesh" },
  { code: "BB", label: "+1-246", country: "Barbados" },
  { code: "BY", label: "+375", country: "Belarus" },
  { code: "BE", label: "+32", country: "Belgium" },
  { code: "BZ", label: "+501", country: "Belize" },
  { code: "BJ", label: "+229", country: "Benin" },
  { code: "BM", label: "+1-441", country: "Bermuda" },
  { code: "BT", label: "+975", country: "Bhutan" },
  { code: "BO", label: "+591", country: "Bolivia" },
  { code: "BQ", label: "+599", country: "Bonaire, Sint Eustatius and Saba" },
  { code: "BA", label: "+387", country: "Bosnia and Herzegovina" },
  { code: "BW", label: "+267", country: "Botswana" },
  { code: "BR", label: "+55", country: "Brazil" },
  { code: "IO", label: "+246", country: "British Indian Ocean Territory" },
  { code: "BN", label: "+673", country: "Brunei Darussalam" },
  { code: "BG", label: "+359", country: "Bulgaria" },
  { code: "BF", label: "+226", country: "Burkina Faso" },
  { code: "BI", label: "+257", country: "Burundi" },
  { code: "KH", label: "+855", country: "Cambodia" },
  { code: "CM", label: "+237", country: "Cameroon" },
  { code: "CA", label: "+1", country: "Canada" },
  { code: "CV", label: "+238", country: "Cape Verde" },
  { code: "KY", label: "+1-345", country: "Cayman Islands" },
  { code: "CF", label: "+236", country: "Central African Republic" },
  { code: "TD", label: "+235", country: "Chad" },
  { code: "CL", label: "+56", country: "Chile" },
  { code: "CN", label: "+86", country: "China" },
  { code: "CX", label: "+61", country: "Christmas Island" },
  { code: "CC", label: "+61", country: "Cocos (Keeling) Islands" },
  { code: "CO", label: "+57", country: "Colombia" },
  { code: "KM", label: "+269", country: "Comoros" },
  { code: "CG", label: "+242", country: "Congo" },
  { code: "CD", label: "+243", country: "Congo, Democratic Republic of the" },
  { code: "CK", label: "+682", country: "Cook Islands" },
  { code: "CR", label: "+506", country: "Costa Rica" },
  { code: "CI", label: "+225", country: "Cote D'Ivoire" },
  { code: "HR", label: "+385", country: "Croatia" },
  { code: "CU", label: "+53", country: "Cuba" },
  { code: "CW", label: "+599", country: "Curacao" },
  { code: "CY", label: "+357", country: "Cyprus" },
  { code: "CZ", label: "+420", country: "Czech Republic" },
  { code: "DK", label: "+45", country: "Denmark" },
  { code: "DJ", label: "+253", country: "Djibouti" },
  { code: "DM", label: "+1-767", country: "Dominica" },
  { code: "DO", label: "+1-809", country: "Dominican Republic" },
  { code: "EC", label: "+593", country: "Ecuador" },
  { code: "EG", label: "+20", country: "Egypt" },
  { code: "SV", label: "+503", country: "El Salvador" },
  { code: "GQ", label: "+240", country: "Equatorial Guinea" },
  { code: "ER", label: "+291", country: "Eritrea" },
  { code: "EE", label: "+372", country: "Estonia" },
  { code: "ET", label: "+251", country: "Ethiopia" },
  { code: "FK", label: "+500", country: "Falkland Islands (Malvinas)" },
  { code: "FO", label: "+298", country: "Faroe Islands" },
  { code: "FJ", label: "+679", country: "Fiji" },
  { code: "FI", label: "+358", country: "Finland" },
  { code: "FR", label: "+33", country: "France" },
  { code: "GF", label: "+594", country: "French Guiana" },
  { code: "PF", label: "+689", country: "French Polynesia" },
  { code: "GA", label: "+241", country: "Gabon" },
  { code: "GM", label: "+220", country: "Gambia" },
  { code: "GE", label: "+995", country: "Georgia" },
  { code: "DE", label: "+49", country: "Germany" },
  { code: "GH", label: "+233", country: "Ghana" },
  { code: "GI", label: "+350", country: "Gibraltar" },
  { code: "GR", label: "+30", country: "Greece" },
  { code: "GL", label: "+299", country: "Greenland" },
  { code: "GD", label: "+1-473", country: "Grenada" },
  { code: "GP", label: "+590", country: "Guadeloupe" },
  { code: "GU", label: "+1-671", country: "Guam" },
  { code: "GT", label: "+502", country: "Guatemala" },
  { code: "GG", label: "+44", country: "Guernsey" },
  { code: "GN", label: "+224", country: "Guinea" },
  { code: "GW", label: "+245", country: "Guinea-Bissau" },
  { code: "GY", label: "+592", country: "Guyana" },
  { code: "HT", label: "+509", country: "Haiti" },
  { code: "VA", label: "+379", country: "Holy See (Vatican City State)" },
  { code: "HN", label: "+504", country: "Honduras" },
  { code: "HK", label: "+852", country: "Hong Kong" },
  { code: "HU", label: "+36", country: "Hungary" },
  { code: "IS", label: "+354", country: "Iceland" },
  { code: "IN", label: "+91", country: "India" },
  { code: "ID", label: "+62", country: "Indonesia" },
  { code: "IR", label: "+98", country: "Iran, Islamic Republic Of" },
  { code: "IQ", label: "+964", country: "Iraq" },
  { code: "IE", label: "+353", country: "Ireland" },
  { code: "IM", label: "+44", country: "Isle of Man" },
  { code: "IL", label: "+972", country: "Israel" },
  { code: "IT", label: "+39", country: "Italy" },
  { code: "JM", label: "+1-876", country: "Jamaica" },
  { code: "JP", label: "+81", country: "Japan" },
  { code: "JE", label: "+44", country: "Jersey" },
  { code: "JO", label: "+962", country: "Jordan" },
  { code: "KZ", label: "+7", country: "Kazakhstan" },
  { code: "KE", label: "+254", country: "Kenya" },
  { code: "KI", label: "+686", country: "Kiribati" },
  { code: "KP", label: "+850", country: "Korea, Democratic People's Republic of" },
  { code: "KR", label: "+82", country: "Korea, Republic of" },
  { code: "KW", label: "+965", country: "Kuwait" },
  { code: "KG", label: "+996", country: "Kyrgyzstan" },
  { code: "LA", label: "+856", country: "Lao People's Democratic Republic" },
  { code: "LV", label: "+371", country: "Latvia" },
  { code: "LB", label: "+961", country: "Lebanon" },
  { code: "LS", label: "+266", country: "Lesotho" },
  { code: "LR", label: "+231", country: "Liberia" },
  { code: "LY", label: "+218", country: "Libya" },
  { code: "LI", label: "+423", country: "Liechtenstein" },
  { code: "LT", label: "+370", country: "Lithuania" },
  { code: "LU", label: "+352", country: "Luxembourg" },
  { code: "MO", label: "+853", country: "Macao" },
  { code: "MK", label: "+389", country: "Macedonia, The Former Yugoslav Republic Of" },
  { code: "MG", label: "+261", country: "Madagascar" },
  { code: "MW", label: "+265", country: "Malawi" },
  { code: "MY", label: "+60", country: "Malaysia" },
  { code: "MV", label: "+960", country: "Maldives" },
  { code: "ML", label: "+223", country: "Mali" },
  { code: "MT", label: "+356", country: "Malta" },
  { code: "MH", label: "+692", country: "Marshall Islands" },
  { code: "MQ", label: "+596", country: "Martinique" },
  { code: "MR", label: "+222", country: "Mauritania" },
  { code: "MU", label: "+230", country: "Mauritius" },
  { code: "YT", label: "+262", country: "Mayotte" },
  { code: "MX", label: "+52", country: "Mexico" },
  { code: "FM", label: "+691", country: "Micronesia, Federated States of" },
  { code: "MD", label: "+373", country: "Moldova, Republic of" },
  { code: "MC", label: "+377", country: "Monaco" },
  { code: "MN", label: "+976", country: "Mongolia" },
  { code: "ME", label: "+382", country: "Montenegro" },
  { code: "MS", label: "+1-664", country: "Montserrat" },
  { code: "MA", label: "+212", country: "Morocco" },
  { code: "MZ", label: "+258", country: "Mozambique" },
  { code: "MM", label: "+95", country: "Myanmar" },
  { code: "NA", label: "+264", country: "Namibia" },
  { code: "NR", label: "+674", country: "Nauru" },
  { code: "NP", label: "+977", country: "Nepal" },
  { code: "NL", label: "+31", country: "Netherlands" },
  { code: "NC", label: "+687", country: "New Caledonia" },
  { code: "NZ", label: "+64", country: "New Zealand" },
  { code: "NI", label: "+505", country: "Nicaragua" },
  { code: "NE", label: "+227", country: "Niger" },
  { code: "NG", label: "+234", country: "Nigeria" },
  { code: "NU", label: "+683", country: "Niue" },
  { code: "NF", label: "+672", country: "Norfolk Island" },
  { code: "MP", label: "+1-670", country: "Northern Mariana Islands" },
  { code: "NO", label: "+47", country: "Norway" },
  { code: "OM", label: "+968", country: "Oman" },
  { code: "PK", label: "+92", country: "Pakistan" },
  { code: "PW", label: "+680", country: "Palau" },
  { code: "PS", label: "+970", country: "Palestine, State of" },
  { code: "PA", label: "+507", country: "Panama" },
  { code: "PG", label: "+675", country: "Papua New Guinea" },
  { code: "PY", label: "+595", country: "Paraguay" },
  { code: "PE", label: "+51", country: "Peru" },
  { code: "PH", label: "+63", country: "Philippines" },
  { code: "PN", label: "+64", country: "Pitcairn" },
  { code: "PL", label: "+48", country: "Poland" },
  { code: "PT", label: "+351", country: "Portugal" },
  { code: "PR", label: "+1-787", country: "Puerto Rico" },
  { code: "QA", label: "+974", country: "Qatar" },
  { code: "RE", label: "+262", country: "Reunion" },
  { code: "RO", label: "+40", country: "Romania" },
  { code: "RU", label: "+7", country: "Russian Federation" },
  { code: "RW", label: "+250", country: "Rwanda" },
  { code: "BL", label: "+590", country: "Saint Barthelemy" },
  { code: "SH", label: "+290", country: "Saint Helena" },
  { code: "KN", label: "+1-869", country: "Saint Kitts and Nevis" },
  { code: "LC", label: "+1-758", country: "Saint Lucia" },
  { code: "MF", label: "+590", country: "Saint Martin" },
  { code: "PM", label: "+508", country: "Saint Pierre and Miquelon" },
  { code: "VC", label: "+1-784", country: "Saint Vincent and the Grenadines" },
  { code: "WS", label: "+685", country: "Samoa" },
  { code: "SM", label: "+378", country: "San Marino" },
  { code: "ST", label: "+239", country: "Sao Tome and Principe" },
  { code: "SA", label: "+966", country: "Saudi Arabia" },
  { code: "SN", label: "+221", country: "Senegal" },
  { code: "RS", label: "+381", country: "Serbia" },
  { code: "SC", label: "+248", country: "Seychelles" },
  { code: "SL", label: "+232", country: "Sierra Leone" },
  { code: "SG", label: "+65", country: "Singapore" },
  { code: "SX", label: "+1-721", country: "Sint Maarten" },
  { code: "SK", label: "+421", country: "Slovakia" },
  { code: "SI", label: "+386", country: "Slovenia" },
  { code: "SB", label: "+677", country: "Solomon Islands" },
  { code: "SO", label: "+252", country: "Somalia" },
  { code: "ZA", label: "+27", country: "South Africa" },
  { code: "SS", label: "+211", country: "South Sudan" },
  { code: "ES", label: "+34", country: "Spain" },
  { code: "LK", label: "+94", country: "Sri Lanka" },
  { code: "SD", label: "+249", country: "Sudan" },
  { code: "SR", label: "+597", country: "Suriname" },
  { code: "SJ", label: "+47", country: "Svalbard and Jan Mayen" },
  { code: "SZ", label: "+268", country: "Swaziland" },
  { code: "SE", label: "+46", country: "Sweden" },
  { code: "CH", label: "+41", country: "Switzerland" },
  { code: "SY", label: "+963", country: "Syrian Arab Republic" },
  { code: "TW", label: "+886", country: "Taiwan" },
  { code: "TJ", label: "+992", country: "Tajikistan" },
  { code: "TZ", label: "+255", country: "Tanzania, United Republic of" },
  { code: "TH", label: "+66", country: "Thailand" },
  { code: "TL", label: "+670", country: "Timor-Leste" },
  { code: "TG", label: "+228", country: "Togo" },
  { code: "TK", label: "+690", country: "Tokelau" },
  { code: "TO", label: "+676", country: "Tonga" },
  { code: "TT", label: "+1-868", country: "Trinidad and Tobago" },
  { code: "TN", label: "+216", country: "Tunisia" },
  { code: "TR", label: "+90", country: "Turkey" },
  { code: "TM", label: "+993", country: "Turkmenistan" },
  { code: "TC", label: "+1-649", country: "Turks and Caicos Islands" },
  { code: "TV", label: "+688", country: "Tuvalu" },
  { code: "UG", label: "+256", country: "Uganda" },
  { code: "UA", label: "+380", country: "Ukraine" },
  { code: "AE", label: "+971", country: "United Arab Emirates" },
  { code: "GB", label: "+44", country: "United Kingdom" },
  { code: "US", label: "+1", country: "United States" },
  { code: "UY", label: "+598", country: "Uruguay" },
  { code: "UZ", label: "+998", country: "Uzbekistan" },
  { code: "VU", label: "+678", country: "Vanuatu" },
  { code: "VE", label: "+58", country: "Venezuela" },
  { code: "VN", label: "+84", country: "Viet Nam" },
  { code: "VG", label: "+1-284", country: "Virgin Islands, British" },
  { code: "VI", label: "+1-340", country: "Virgin Islands, U.S." },
  { code: "WF", label: "+681", country: "Wallis and Futuna" },
  { code: "YE", label: "+967", country: "Yemen" },
  { code: "ZM", label: "+260", country: "Zambia" },
  { code: "ZW", label: "+263", country: "Zimbabwe" }
];
const formatToE164 = (phone: string, countryCode: string) => {
  // 1. Parse the number
  const phoneNumber = parsePhoneNumberFromString(phone, countryCode as any);

  // 2. Perform Strict Validation:
  // - Must be a valid phone number
  // - The detected country from the phone string must match your selected countryCode
  if (
    phoneNumber &&
    phoneNumber.isValid() &&
    phoneNumber.country === countryCode
  ) {
    return phoneNumber.format('E.164');
  }

  return null;
};


export default function SignUpForm() {
  const router = useRouter();
  const { tenant } = useTenant();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('123456789');
  const [formData, setFormData] = useState({
    first_name: 'Austine',
    last_name: 'Test',
    email: 'austinetest@gmail.com',
    phone: '768927617',
    password: '123456789',
    country: 'United States',
  })
  const [isLoading, setIsLoading] = useState(false);


  const handleCreateAccount = async () => {
    if (!tenant || !tenant?.id) {
      showToast('An error occured while finding destination!', 'error');
      return;
    }

    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password.trim() || !confirmPassword.trim()) {
      showToast('Please fill out all the required fields!', 'error');
      return;
    }

    if (formData.password.trim() !== confirmPassword.trim()) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    if (!isChecked) {
      showToast('Please read and agree to the Terms and Conditions!', 'error');
      return;
    }
    // 1. Find the country first
    const selectedCountry = countries.find(c => c.country === formData.country);

    // 2. Defensive check
    if (!selectedCountry) {
      throw new Error("Invalid country selected");
    }

    // 3. Format with safety
    const e164Phone = formatToE164(formData.phone, selectedCountry.code);
    if (e164Phone === null) {
      showToast('Please enter a valid phone number!', 'error');
      return;
    }

    setIsLoading(true);
    const res = await createTenantClient({ ...formData, tenant_id: tenant.id, phone: e164Phone });


    if (res.success) {
      showToast(`Registration Complete! You will be redirected to login in 5 sec.`, "success");

      setTimeout(() => {
        router.push("/signin");
        setIsLoading(false);
      }, 5000);
    } else {
      showToast(`Failed to register details: ${res.error.message}`, "error");
      setIsLoading(false);
    }

  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign up with Google
              </button>
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="21"
                  className="fill-current"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
                </svg>
                Sign up with X
              </button>
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();

              handleCreateAccount();
            }}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      value={formData.first_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      value={formData.last_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, last_name: e.target.value }))}

                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}

                    placeholder="Enter your email"
                  />
                </div>

                {/* <!-- Phone --> */}
                <div>
                  <Label>
                    Phone<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <Select
                      className="w-full"
                      defaultValue={'United States'}
                      value={formData.country}
                      options={countries.map(c => {
                        return {
                          value: c.country,
                          label: `${c.country} (${c.label})`,
                        }
                      })}
                      onChange={(e) => setFormData((prev) => ({ ...prev, country: e }))}
                    />

                    <Input
                      type="tel"
                      className="w-full"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}

                      placeholder="555 555-0199"
                    />
                  </div>
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      value={formData.password}
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}

                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      value={confirmPassword}
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p
                    onClick={() => setIsChecked(!isChecked)}
                    className="inline-block text-sm font-normal text-gray-500 dark:text-gray-400"
                  >
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <Button type="submit" variant="primary" disabled={isLoading} className="px-4! py-3! w-full text-sm">
                    Sign Up
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? &nbsp;
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
