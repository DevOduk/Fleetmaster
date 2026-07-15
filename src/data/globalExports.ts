
export interface PricingFeature {
  text: string;
  included: boolean;
  highlightedText?: string;
}

export interface PricingPlan {
  name: string;
  tagline: string;
  price: string;
  currency: string;
  popular: boolean;
  ctaText: string;
  ctaLink: string;
  featuresTitle: string;
  features: PricingFeature[];
}




export const currencies = [

]
export const languages = [
  {
    value: "english-us",
    label: "English (US)"
  },
  {
    value: "english-uk",
    label: "English (UK)"
  },
]
export const expenseCategories = [
  {
    value: 'hardware',
    label: 'Hardware purchases and equipment'
  },
  {
    value: 'subscription',
    label: 'Subscription purchases and license'
  },
  {
    value: 'bandwidth',
    label: 'Internet and data connectivity costs'
  },
  {
    value: 'salaries',
    label: 'Payment of employee salaries'
  },
  {
    value: 'marketing',
    label: 'Marketing and advertising expenses'
  },
  {
    value: 'rent',
    label: 'Office or yard rental fees'
  },
  {
    value: 'utilities',
    label: 'Utility bills (electricity, water, etc.)'
  },
  {
    value: 'other',
    label: 'Miscellaneous expenses'
  }
];

export const paymentsCategories = [
  {
    value: 'hardware sale',
    label: 'Hardware and equipment sales'
  },
  {
    value: 'rental income',
    label: 'Income from rentals from company'
  },
];

export const timezones = [
  { "timezone": "GMT-11:00", "regions": ["Samoa Standard Time", "Niue Time", "Midway Islands"] },
  { "timezone": "GMT-10:00", "regions": ["Hawaii-Aleutian Standard Time", "Tahiti Time", "Cook Islands"] },
  { "timezone": "GMT-09:00", "regions": ["Alaska Standard Time"] },
  { "timezone": "GMT-08:00", "regions": ["Pacific Standard Time (US & Canada)", "Baja California (Mexico)"] },
  { "timezone": "GMT-07:00", "regions": ["Mountain Standard Time (US & Canada)", "Mexican Pacific Standard Time"] },
  { "timezone": "GMT-06:00", "regions": ["Central Standard Time (US & Canada)", "Central America Time", "Mexico City"] },
  { "timezone": "GMT-05:00", "regions": ["Eastern Standard Time (US & Canada)", "Peru Time", "Colombia Time"] },
  { "timezone": "GMT-04:00", "regions": ["Atlantic Standard Time (Canada)", "Amazon Time (Brazil)", "Chile Time", "Venezuela Time"] },
  { "timezone": "GMT-03:00", "regions": ["Brasilia Time (Brazil)", "Argentina Time", "Uruguay Time"] },
  { "timezone": "GMT+0:00", "regions": ["Greenwich Mean Time", "Western European Time", "Coordinated Universal Time"] },
  { "timezone": "GMT+1:00", "regions": ["Central European Time", "West Africa Time", "British Summer Time"] },
  { "timezone": "GMT+2:00", "regions": ["Eastern European Time", "Central Africa Time", "South Africa Standard Time"] },
  { "timezone": "GMT+3:00", "regions": ["East African Timezone", "Moscow Standard Time", "Arabia Standard Time"] },
  { "timezone": "GMT+4:00", "regions": ["Gulf Standard Time", "Azerbaijan Time", "Georgia Time"] },
  { "timezone": "GMT+5:00", "regions": ["Pakistan Standard Time", "Yekaterinburg Time", "Maldives Time"] },
  { "timezone": "GMT+5:30", "regions": ["Indian Standard Time", "Sri Lanka Time"] },
  { "timezone": "GMT+7:00", "regions": ["Indochina Time", "Western Indonesia Time", "Krasnoyarsk Time"] },
  { "timezone": "GMT+8:00", "regions": ["China Standard Time", "Australian Western Standard Time", "Singapore Time"] },
  { "timezone": "GMT+9:00", "regions": ["Japan Standard Time", "Korea Standard Time", "Eastern Indonesia Time"] },
  { "timezone": "GMT+10:00", "regions": ["Australian Eastern Standard Time", "Vladivostok Time", "Chamorro Standard Time"] },
  { "timezone": "GMT+12:00", "regions": ["New Zealand Standard Time", "Fiji Time", "Gilbert Islands Time (Kiribati)"] }
];


export const subscriptionPlans: PricingPlan[] = [
  {
    name: "Starter",
    tagline: "Solo entrepreneur, freelancer, one-person business",
    price: "450",
    currency: "Ksh",
    popular: false,
    ctaText: "Start free trial",
    ctaLink: "#",
    featuresTitle: "What you get",
    features: [
      { text: " account", included: true, highlightedText: "1 user" },
      { text: " listings", included: true, highlightedText: "50 vehicles" },
      { text: "M-Pesa payment links", included: true },
      { text: "KRA eTIMS compliant receipts", included: true },
      { text: "Your own subdomain (yourname.fleetmaster.com)", included: true },
      { text: "512 MB storage", included: true },
      { text: "Fleet analytics dashboard", included: true },
      { text: "Isolated private database", included: true },
      { text: "Driver vetting", included: false },
      { text: "Expense tracking", included: false },
      { text: "Custom domain", included: false },
      { text: "SEO Optimization", included: false },
    ],
  },
  {
    name: "Pro",
    tagline: "Small team, growing agency, 2 to 5 staff",
    price: "899",
    currency: "Ksh",
    popular: true,
    ctaText: "Start free trial",
    ctaLink: "#",
    featuresTitle: "Everything in Starter, plus",
    features: [
      { text: " accounts", included: true, highlightedText: "3 user" },
      { text: " listings", included: true, highlightedText: "200 vehicles" },
      { text: " (License verification)", included: true, highlightedText: "Automated Vetting" },
      { text: " (Fuel & Repairs)", included: true, highlightedText: "Expense Tracking" },
      { text: " (mybrand.com)", included: true, highlightedText: "1 custom domain" },
      { text: "2 GB storage", included: true },
      { text: "Digital rental contracts", included: true },
      { text: "Purchase orders", included: true },
      { text: "Priority support", included: true },
      { text: " SEO Optimization", included: true, highlightedText: "Basic" },
      { text: "White-label branding", included: false },
      { text: "Real-time Telematics", included: false },

    ],
  },
  {
    name: "Expert",
    tagline: "Established SME, 5 to 10 staff, no limits",
    price: "1299",
    currency: "Ksh",
    popular: false,
    ctaText: "Get started now",
    ctaLink: "#",
    featuresTitle: "Everything in Pro, plus",
    features: [
      { text: " accounts", included: true, highlightedText: "10 user" },
      { text: " listings", included: true, highlightedText: "Unlimited" },
      { text: " expenses", included: true, highlightedText: "Unlimited" },
      { text: " custom domains", included: true, highlightedText: "Unlimited" },
      { text: "20 GB storage", included: true },
      { text: "Real-time Telematics", included: true },
      { text: "Dedicated support", included: true },
      { text: "API Access", included: true },
      { text: "White-label branding", included: true },
      { text: " SEO Optimization", included: true, highlightedText: "Advanced" },
    ],
  },
];