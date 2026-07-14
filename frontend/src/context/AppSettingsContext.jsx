import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'

const AppSettingsContext = createContext(null)

/* ─── Accent colour presets ──────────────────────────────────── */
export const ACCENT_PRESETS = [
  { name: 'Indigo',   hex: '#6366f1' },
  { name: 'Violet',   hex: '#8b5cf6' },
  { name: 'Sky',      hex: '#0ea5e9' },
  { name: 'Cyan',     hex: '#06b6d4' },
  { name: 'Emerald',  hex: '#10b981' },
  { name: 'Rose',     hex: '#f43f5e' },
  { name: 'Amber',    hex: '#f59e0b' },
  { name: 'Orange',   hex: '#f97316' },
]

/* Convert hex → r,g,b string for rgba() usage in CSS vars */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `${r},${g},${b}`
}

function hexLighten(hex, amount = 0.15) {
  let r = parseInt(hex.slice(1,3),16)
  let g = parseInt(hex.slice(3,5),16)
  let b = parseInt(hex.slice(5,7),16)
  r = Math.min(255, Math.round(r + (255-r)*amount))
  g = Math.min(255, Math.round(g + (255-g)*amount))
  b = Math.min(255, Math.round(b + (255-b)*amount))
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

function hexDarken(hex, amount = 0.12) {
  let r = parseInt(hex.slice(1,3),16)
  let g = parseInt(hex.slice(3,5),16)
  let b = parseInt(hex.slice(5,7),16)
  r = Math.max(0, Math.round(r * (1-amount)))
  g = Math.max(0, Math.round(g * (1-amount)))
  b = Math.max(0, Math.round(b * (1-amount)))
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

function applyAccent(hex) {
  const rgb = hexToRgb(hex)
  const light = hexLighten(hex)
  const dark  = hexDarken(hex)
  const root = document.documentElement
  root.style.setProperty('--accent',          hex)
  root.style.setProperty('--indigo',          hex)
  root.style.setProperty('--indigo-light',    light)
  root.style.setProperty('--indigo-dark',     dark)
  root.style.setProperty('--bg-surface',      `rgba(${rgb},0.05)`)
  root.style.setProperty('--bg-surface-h',    `rgba(${rgb},0.09)`)
  root.style.setProperty('--border-subtle',   `rgba(${rgb},0.15)`)
  root.style.setProperty('--border-accent',   `rgba(${rgb},0.4)`)
  root.style.setProperty('--card-border',     `rgba(${rgb},0.32)`)
  root.style.setProperty('--nav-border',      `rgba(${rgb},0.15)`)
  root.style.setProperty('--glow-indigo',     `rgba(${rgb},0.25)`)
}

/* ─── Language metadata ──────────────────────────────────────── */
export const LANGUAGES = [
  { code: 'en',  name: 'English',    native: 'English'    },
  { code: 'hi',  name: 'Hindi',      native: 'हिन्दी'      },
  { code: 'bn',  name: 'Bengali',    native: 'বাংলা'       },
  { code: 'te',  name: 'Telugu',     native: 'తెలుగు'      },
  { code: 'mr',  name: 'Marathi',    native: 'मराठी'       },
  { code: 'ta',  name: 'Tamil',      native: 'தமிழ்'       },
  { code: 'gu',  name: 'Gujarati',   native: 'ગુજરાતી'     },
  { code: 'pa',  name: 'Punjabi',    native: 'ਪੰਜਾਬੀ'      },
  { code: 'or',  name: 'Odia',       native: 'ଓଡ଼ିଆ'       },
  { code: 'ml',  name: 'Malayalam',  native: 'മലയാളം'      },
  { code: 'kn',  name: 'Kannada',    native: 'ಕನ್ನಡ'       },
  { code: 'as',  name: 'Assamese',   native: 'অসমীয়া'     },
  { code: 'ur',  name: 'Urdu',       native: 'اردو'        },
  { code: 'mai', name: 'Maithili',   native: 'मैथिली'      },
]

/* ─── Translations ───────────────────────────────────────────── */
const translations = {
  en: {
    dashboard: 'Dashboard', savedSchemes: 'Saved Schemes', profile: 'Profile', logout: 'Logout',
    light: 'Light', dark: 'Dark', searchSchemes: 'Search schemes', allTypes: 'All types',
    education: 'Education', jobs: 'Jobs', agriculture: 'Agriculture',
    heroBadge: 'AI-powered eligibility matching',
    heroTitle: 'Find Government Schemes You Are Eligible For',
    heroSubtitle: 'Personalized scheme recommendations powered by AI',
    getStarted: 'Get Started', learnMore: 'Learn More',
    featureSmartTitle: 'Smart Eligibility', featureSmartDesc: 'Answer a few questions and we match you to relevant schemes.',
    featureStepsTitle: 'Clear Next Steps', featureStepsDesc: 'Get a simple checklist of what you need to apply.',
    featureFreshTitle: 'Always Up-to-date', featureFreshDesc: 'We keep track of programs and updates so you do not have to.',
    loadingTitle: 'Finding matching schemes', loadingSubtitle: 'Scanning eligibility rules...',
    emptyTitle: 'No schemes found for your details',
    emptyText: 'Try selecting a different category/state or increasing your income to see more matches.',
    aiRecommendedTitle: 'AI Recommended Schemes', resultsTitle: 'Recommended schemes',
    resultsSubtitle: 'Based on the details you provided.', matches: 'matches', match: 'match',
    saveScheme: 'Save scheme', benefits: 'Benefits', eligibility: 'Eligibility', apply: 'Apply',
    noSearchResults: 'No schemes match your search/filter. Try another keyword or type.',
    footerTagline: 'AI-powered public scheme discovery platform.', footerProduct: 'Product',
    footerBuiltForCitizens: 'Built for citizens',
    formTitle: 'Check your eligibility', formSubtitle: 'Fill in the details below to find schemes that match you.',
    formAge: 'Age', formCategory: 'Category', formIncome: 'Income', formState: 'State', formOccupation: 'Occupation',
    formAgePlaceholder: 'e.g., 28', formIncomePlaceholder: 'e.g., 250000',
    formOccupationPlaceholder: 'e.g., Student / Farmer / Self-employed',
    formSelectCategory: 'Select category', formSelectState: 'Select state', formSubmit: 'Find Schemes',
    errAgeRequired: 'Age is required.', errCategoryRequired: 'Category is required.',
    errIncomeRequired: 'Income is required.', errStateRequired: 'State is required.',
    errOccupationRequired: 'Occupation is required.',
    login: 'Login', createAccount: 'Create account',
    signInSubtitle: 'Sign in to access personalized scheme matching.',
    signUpSubtitle: 'Sign up to get personalized scheme recommendations.',
    name: 'Name', email: 'Email', password: 'Password', creatingAccount: 'Creating account...',
    signUp: 'Sign up', loggingIn: 'Logging in...', newUser: 'New user?', alreadyHaveAccount: 'Already have an account?',
    userDashboard: 'User Dashboard', backToHome: 'Back to Home', account: 'Account',
    savedSchemesLabel: 'Saved Schemes', viewSavedSchemes: 'View Saved Schemes', editProfile: 'Edit Profile',
    manageAccountInfo: 'Manage your account information.', saveChanges: 'Save Changes', back: 'Back',
    applicationForm: 'Application Form', schemeApplication: 'Scheme Application',
    applyFormSubtitle: 'Complete the form below to apply. This mirrors a real application workflow.',
    fullName: 'Full Name', phone: 'Phone', aadhaarNumber: 'Aadhaar Number',
    additionalDetails: 'Additional Details', submitApplication: 'Submit Application',
    applicationSubmitted: 'Application submitted successfully. Our team will review your details and contact you soon.',
    navHome: 'Home', navFeatures: 'Features', navHowItWorks: 'How It Works',
    landingHeroSubtitle: 'AI-powered personalized scheme recommendations',
    landingFeatureAiTitle: 'AI Recommendations',
    landingFeatureAiDesc: 'Get ranked schemes tailored to your profile with clear explanations.',
    landingFeatureFilterTitle: 'Smart Filtering',
    landingFeatureFilterDesc: 'Search and filter by category so you only see what matters.',
    landingFeatureAccessTitle: 'Easy Access',
    landingFeatureAccessDesc: 'One place to explore benefits, eligibility, and next steps.',
    landingHowItWorks: 'How It Works', landingStep1Title: 'Enter Details',
    landingStep1Desc: 'Share age, income, category, and state in a simple form.',
    landingStep2Title: 'AI Analysis', landingStep2Desc: 'Our engine matches you against scheme rules in seconds.',
    landingStep3Title: 'Get Results', landingStep3Desc: 'Review schemes, save favorites, and start applications.',
    landingBenefitsTitle: 'Benefits', landingBenefit1Title: 'Faster discovery',
    landingBenefit1Desc: 'Skip endless PDFs—see what you qualify for at a glance.',
    landingBenefit2Title: 'Clear guidance', landingBenefit2Desc: 'Plain-language summaries so you know what each scheme offers.',
    landingBenefit3Title: 'Always current', landingBenefit3Desc: 'Designed to evolve as programs and rules change.',
    landingFooterProduct: 'Product', landingFooterLegal: 'Legal', landingFooterPrivacy: 'Privacy',
    landingFooterTerms: 'Terms', landingFooterContact: 'Contact',
    landingCtaPrimary: 'Get Started', landingCtaSecondary: 'Learn More',
    landingFeaturesIntro: 'Everything you need to discover schemes with confidence.',
    landingHowIntro: 'Three simple steps from your details to actionable results.',
    errEmailInvalid: 'Please enter a valid email address.', errEmailRequired: 'Email is required.',
    errPasswordShort: 'Password must be at least 6 characters.', errPasswordRequired: 'Password is required.',
    errNameRequired: 'Please enter your name.',
    banner1Scheme: 'PM Vidyalaxmi Scheme', banner1Tag: 'Education',
    banner1Desc: 'Collateral-Free Education Loans for Students — Up to ₹7.5L with 75% Govt. Guarantee.',
    banner1Cta: 'Apply Now',
    banner2Scheme: 'Ayushman Bharat – PM-JAY', banner2Tag: 'Health',
    banner2Desc: 'Free cashless health coverage up to ₹5 Lakh for 70 crore+ beneficiaries across India.',
    banner2Cta: 'Check Eligibility',
    banner3Scheme: 'PM-KISAN Samman Nidhi', banner3Tag: 'Agriculture',
    banner3Desc: '₹6,000/year direct income support for farmers in 3 equal installments — 11 crore+ beneficiaries.',
    banner3Cta: 'Know More',
    discoverAll: 'Discover All Schemes',
  },
  hi: {
    dashboard: 'डैशबोर्ड', savedSchemes: 'सहेजी गई योजनाएं', profile: 'प्रोफाइल', logout: 'लॉग आउट',
    light: 'लाइट', dark: 'डार्क', searchSchemes: 'योजनाएं खोजें', allTypes: 'सभी प्रकार',
    education: 'शिक्षा', jobs: 'नौकरी', agriculture: 'कृषि',
    heroBadge: 'एआई आधारित पात्रता मिलान', heroTitle: 'अपने लिए पात्र सरकारी योजनाएं खोजें',
    heroSubtitle: 'एआई द्वारा संचालित व्यक्तिगत योजना सुझाव',
    getStarted: 'शुरू करें', learnMore: 'और जानें',
    featureSmartTitle: 'स्मार्ट पात्रता', featureSmartDesc: 'कुछ सवालों के जवाब दें और हम आपके लिए उपयुक्त योजनाएं मिलाते हैं।',
    featureStepsTitle: 'स्पष्ट अगले कदम', featureStepsDesc: 'आवेदन के लिए जरूरी चीजों की सरल चेकलिस्ट पाएं।',
    featureFreshTitle: 'हमेशा अपडेटेड', featureFreshDesc: 'हम योजनाओं और अपडेट्स का ट्रैक रखते हैं।',
    loadingTitle: 'उपयुक्त योजनाएं खोजी जा रही हैं', loadingSubtitle: 'पात्रता नियमों का विश्लेषण...',
    emptyTitle: 'आपकी जानकारी के लिए कोई योजना नहीं मिली',
    emptyText: 'अलग श्रेणी/राज्य चुनकर दोबारा प्रयास करें।',
    aiRecommendedTitle: 'एआई द्वारा सुझाई गई योजनाएं', resultsTitle: 'सुझाई गई योजनाएं',
    resultsSubtitle: 'आपकी दी गई जानकारी के आधार पर।', matches: 'मिलान', match: 'मिलान',
    saveScheme: 'योजना सहेजें', benefits: 'लाभ', eligibility: 'पात्रता', apply: 'आवेदन करें',
    noSearchResults: 'खोज से कोई योजना नहीं मिली।',
    footerTagline: 'एआई आधारित योजना खोज प्लेटफ़ॉर्म।', footerProduct: 'उत्पाद',
    footerBuiltForCitizens: 'नागरिकों के लिए बनाया गया',
    formTitle: 'अपनी पात्रता जांचें', formSubtitle: 'उपयुक्त योजनाएं पाने हेतु नीचे विवरण भरें।',
    formAge: 'आयु', formCategory: 'श्रेणी', formIncome: 'आय', formState: 'राज्य', formOccupation: 'व्यवसाय',
    formAgePlaceholder: 'उदाहरण: 28', formIncomePlaceholder: 'उदाहरण: 250000',
    formOccupationPlaceholder: 'उदाहरण: छात्र / किसान / स्वरोजगार',
    formSelectCategory: 'श्रेणी चुनें', formSelectState: 'राज्य चुनें', formSubmit: 'योजनाएं खोजें',
    errAgeRequired: 'आयु आवश्यक है।', errCategoryRequired: 'श्रेणी आवश्यक है।',
    errIncomeRequired: 'आय आवश्यक है।', errStateRequired: 'राज्य आवश्यक है।',
    errOccupationRequired: 'व्यवसाय आवश्यक है।',
    login: 'लॉगिन', createAccount: 'खाता बनाएं',
    signInSubtitle: 'व्यक्तिगत योजना मिलान के लिए साइन इन करें।',
    signUpSubtitle: 'व्यक्तिगत योजना सुझाव पाने के लिए साइन अप करें।',
    name: 'नाम', email: 'ईमेल', password: 'पासवर्ड', creatingAccount: 'खाता बनाया जा रहा है...',
    signUp: 'साइन अप', loggingIn: 'लॉगिन हो रहा है...', newUser: 'नए उपयोगकर्ता?', alreadyHaveAccount: 'पहले से खाता है?',
    userDashboard: 'यूज़र डैशबोर्ड', backToHome: 'होम पर जाएं', account: 'खाता',
    savedSchemesLabel: 'सहेजी गई योजनाएं', viewSavedSchemes: 'सहेजी योजनाएं देखें', editProfile: 'प्रोफाइल संपादित करें',
    manageAccountInfo: 'अपनी खाता जानकारी प्रबंधित करें।', saveChanges: 'परिवर्तन सहेजें', back: 'वापस',
    applicationForm: 'आवेदन फॉर्म', schemeApplication: 'योजना आवेदन',
    applyFormSubtitle: 'आवेदन के लिए नीचे फॉर्म भरें।',
    fullName: 'पूरा नाम', phone: 'फोन', aadhaarNumber: 'आधार नंबर',
    additionalDetails: 'अतिरिक्त विवरण', submitApplication: 'आवेदन जमा करें',
    applicationSubmitted: 'आवेदन सफलतापूर्वक जमा हो गया।',
    navHome: 'होम', navFeatures: 'विशेषताएं', navHowItWorks: 'यह कैसे काम करता है',
    landingHeroSubtitle: 'एआई द्वारा व्यक्तिगत योजना सिफारिशें',
    landingFeatureAiTitle: 'एआई सिफारिशें', landingFeatureAiDesc: 'प्रोफाइल के अनुसार योजनाएं रैंक करें।',
    landingFeatureFilterTitle: 'स्मार्ट फ़िल्टर', landingFeatureFilterDesc: 'श्रेणी के अनुसार खोजें।',
    landingFeatureAccessTitle: 'आसान पहुंच', landingFeatureAccessDesc: 'लाभ, पात्रता एक ही जगह।',
    landingHowItWorks: 'यह कैसे काम करता है', landingStep1Title: 'विवरण दर्ज करें',
    landingStep1Desc: 'सरल फॉर्म में आयु, आय, श्रेणी और राज्य बताएं।',
    landingStep2Title: 'एआई विश्लेषण', landingStep2Desc: 'कुछ ही सेकंड में योजना नियमों से मिलान।',
    landingStep3Title: 'परिणाम पाएं', landingStep3Desc: 'योजनाएं देखें और आवेदन शुरू करें।',
    landingBenefitsTitle: 'लाभ', landingBenefit1Title: 'तेज़ खोज', landingBenefit1Desc: 'पात्रता एक नज़र में।',
    landingBenefit2Title: 'स्पष्ट मार्गदर्शन', landingBenefit2Desc: 'सरल भाषा में सारांश।',
    landingBenefit3Title: 'हमेशा अपडेट', landingBenefit3Desc: 'नियमों के साथ बदलाव।',
    landingFooterProduct: 'उत्पाद', landingFooterLegal: 'कानूनी', landingFooterPrivacy: 'गोपनीयता',
    landingFooterTerms: 'शर्तें', landingFooterContact: 'संपर्क',
    landingCtaPrimary: 'शुरू करें', landingCtaSecondary: 'और जानें',
    landingFeaturesIntro: 'योजनाएं खोजने के लिए सब कुछ यहाँ।',
    landingHowIntro: 'तीन सरल चरण।',
    errEmailInvalid: 'मान्य ईमेल दर्ज करें।', errEmailRequired: 'ईमेल आवश्यक है।',
    errPasswordShort: 'पासवर्ड कम से कम 6 अक्षर का हो।', errPasswordRequired: 'पासवर्ड आवश्यक है।',
    errNameRequired: 'कृपया नाम दर्ज करें।',
    banner1Scheme: 'पीएम विद्यालक्ष्मी योजना', banner1Tag: 'शिक्षा',
    banner1Desc: 'छात्रों के लिए बिना गारंटी शिक्षा ऋण — ₹7.5 लाख तक, 75% सरकारी गारंटी।',
    banner1Cta: 'अभी आवेदन करें',
    banner2Scheme: 'आयुष्मान भारत – पीएम-जेएवाई', banner2Tag: 'स्वास्थ्य',
    banner2Desc: 'भारत में 70 करोड़+ लाभार्थियों के लिए ₹5 लाख तक नि:शुल्क कैशलेस स्वास्थ्य कवरेज।',
    banner2Cta: 'पात्रता जांचें',
    banner3Scheme: 'पीएम-किसान सम्मान निधि', banner3Tag: 'कृषि',
    banner3Desc: '₹6,000/वर्ष किसानों को 3 समान किश्तों में सीधे आय सहायता — 11 करोड़+ लाभार्थी।',
    banner3Cta: 'और जानें',
    discoverAll: 'सभी योजनाएं खोजें',
  },
  bn: {
    dashboard: 'ড্যাশবোর্ড', savedSchemes: 'সংরক্ষিত প্রকল্প', profile: 'প্রোফাইল', logout: 'লগ আউট',
    searchSchemes: 'প্রকল্প খুঁজুন', allTypes: 'সব ধরন', education: 'শিক্ষা', jobs: 'চাকরি', agriculture: 'কৃষি',
    heroBadge: 'AI-চালিত যোগ্যতা মিলান', heroTitle: 'আপনার যোগ্য সরকারি প্রকল্প খুঁজুন',
    getStarted: 'শুরু করুন', learnMore: 'আরো জানুন',
    loadingTitle: 'প্রকল্প খোঁজা হচ্ছে', loadingSubtitle: 'যোগ্যতা পরীক্ষা করা হচ্ছে...',
    emptyTitle: 'কোনো প্রকল্প পাওয়া যায়নি', emptyText: 'ভিন্ন বিভাগ বা রাজ্য চেষ্টা করুন।',
    benefits: 'সুবিধা', eligibility: 'যোগ্যতা', apply: 'আবেদন করুন',
    formTitle: 'যোগ্যতা যাচাই করুন', formAge: 'বয়স', formCategory: 'বিভাগ', formIncome: 'আয়',
    formState: 'রাজ্য', formOccupation: 'পেশা', formSelectCategory: 'বিভাগ বেছে নিন',
    formSelectState: 'রাজ্য বেছে নিন', formSubmit: 'প্রকল্প খুঁজুন',
    login: 'লগইন', createAccount: 'অ্যাকাউন্ট তৈরি করুন', navHome: 'হোম',
    navFeatures: 'বৈশিষ্ট্য', navHowItWorks: 'কীভাবে কাজ করে',
    landingHowItWorks: 'কীভাবে কাজ করে', landingStep1Title: 'তথ্য দিন',
    landingStep2Title: 'AI বিশ্লেষণ', landingStep3Title: 'ফলাফল পান',
    matches: 'মিল', match: 'মিল', saveScheme: 'সংরক্ষণ করুন',
    resultsTitle: 'প্রস্তাবিত প্রকল্প', resultsSubtitle: 'আপনার তথ্যের ভিত্তিতে।',
    noSearchResults: 'কোনো প্রকল্প খুঁজে পাওয়া যায়নি।',
    footerTagline: 'AI-চালিত প্রকল্প আবিষ্কার প্ল্যাটফর্ম।', footerProduct: 'পণ্য',
    footerBuiltForCitizens: 'নাগরিকদের জন্য তৈরি',
    formSubtitle: 'আপনার জন্য প্রকল্প খুঁজে পেতে নিচে বিবরণ পূরণ করুন।',
    formAgePlaceholder: 'যেমন: 28', formIncomePlaceholder: 'যেমন: 250000',
    formOccupationPlaceholder: 'যেমন: ছাত্র / কৃষক / স্ব-নিযুক্ত',
    errAgeRequired: 'বয়স আবশ্যক।', errCategoryRequired: 'বিভাগ আবশ্যক।',
    errIncomeRequired: 'আয় আবশ্যক।', errStateRequired: 'রাজ্য আবশ্যক।',
    errOccupationRequired: 'পেশা আবশ্যক।',
    signInSubtitle: 'ব্যক্তিগত প্রকল্প মেলানোর জন্য সাইন ইন করুন।',
    signUpSubtitle: 'ব্যক্তিগত প্রকল্প সুপারিশ পেতে সাইন আপ করুন।',
    name: 'নাম', email: 'ইমেল', password: 'পাসওয়ার্ড',
    creatingAccount: 'অ্যাকাউন্ট তৈরি হচ্ছে...', signUp: 'সাইন আপ',
    loggingIn: 'লগইন হচ্ছে...', newUser: 'নতুন ব্যবহারকারী?', alreadyHaveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    backToHome: 'হোমে ফিরুন', account: 'অ্যাকাউন্ট',
    savedSchemesLabel: 'সংরক্ষিত প্রকল্প', viewSavedSchemes: 'সংরক্ষিত প্রকল্প দেখুন',
    editProfile: 'প্রোফাইল সম্পাদনা করুন', manageAccountInfo: 'আপনার অ্যাকাউন্ট তথ্য পরিচালনা করুন।',
    saveChanges: 'পরিবর্তন সংরক্ষণ করুন', back: 'পিছনে',
    userDashboard: 'ব্যবহারকারী ড্যাশবোর্ড',
    landingFeatureAiTitle: 'AI সুপারিশ', landingFeatureAiDesc: 'আপনার প্রোফাইল অনুযায়ী প্রকল্প।',
    landingFeatureFilterTitle: 'স্মার্ট ফিল্টার', landingFeatureFilterDesc: 'বিভাগ অনুযায়ী অনুসন্ধান করুন।',
    landingFeatureAccessTitle: 'সহজ অ্যাক্সেস', landingFeatureAccessDesc: 'সুবিধা এবং যোগ্যতা এক জায়গায়।',
    landingStep1Desc: 'সহজ ফর্মে বয়স, আয়, বিভাগ এবং রাজ্য দিন।',
    landingStep2Desc: 'কয়েক সেকেন্ডে প্রকল্পের নিয়মের সাথে মেলানো।',
    landingStep3Desc: 'প্রকল্প পর্যালোচনা করুন এবং আবেদন শুরু করুন।',
    landingBenefitsTitle: 'সুবিধা', landingBenefit1Title: 'দ্রুত আবিষ্কার', landingBenefit1Desc: 'এক নজরে যোগ্যতা দেখুন।',
    landingBenefit2Title: 'স্পষ্ট নির্দেশনা', landingBenefit2Desc: 'সহজ ভাষায় সারসংক্ষেপ।',
    landingBenefit3Title: 'সর্বদা আপ-টু-ডেট', landingBenefit3Desc: 'নিয়ম পরিবর্তনের সাথে পরিবর্তিত।',
    landingCtaPrimary: 'শুরু করুন', landingCtaSecondary: 'আরো জানুন',
    landingFeaturesIntro: 'প্রকল্প আবিষ্কার করতে যা দরকার সব এখানে।',
    landingHowIntro: 'তিনটি সহজ ধাপ।',
    landingHeroSubtitle: 'AI-চালিত ব্যক্তিগত প্রকল্প সুপারিশ',
    landingFooterProduct: 'পণ্য', landingFooterLegal: 'আইনি', landingFooterPrivacy: 'গোপনীয়তা',
    landingFooterTerms: 'শর্তাবলী', landingFooterContact: 'যোগাযোগ',
    navFeatures: 'বৈশিষ্ট্য',
    errEmailInvalid: 'একটি বৈধ ইমেল ঠিকানা লিখুন।', errEmailRequired: 'ইমেল আবশ্যক।',
    errPasswordShort: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।', errPasswordRequired: 'পাসওয়ার্ড আবশ্যক।',
    errNameRequired: 'আপনার নাম লিখুন।',
    applicationForm: 'আবেদন ফর্ম', schemeApplication: 'প্রকল্প আবেদন',
    applyFormSubtitle: 'আবেদন করতে নিচের ফর্ম পূরণ করুন।',
    fullName: 'পুরো নাম', phone: 'ফোন', aadhaarNumber: 'আধার নম্বর',
    additionalDetails: 'অতিরিক্ত বিবরণ', submitApplication: 'আবেদন জমা দিন',
    applicationSubmitted: 'আবেদন সফলভাবে জমা হয়েছে।',
    aiRecommendedTitle: 'AI প্রস্তাবিত প্রকল্প', heroSubtitle: 'AI-চালিত ব্যক্তিগত প্রকল্প সুপারিশ',
    heroBadge: 'AI-চালিত যোগ্যতা মিলান', allTypes: 'সব ধরন', light: 'আলো', dark: 'অন্ধকার',
    getStarted: 'শুরু করুন', learnMore: 'আরো জানুন',
    featureSmartTitle: 'স্মার্ট যোগ্যতা', featureSmartDesc: 'কিছু প্রশ্নের উত্তর দিন এবং আমরা আপনার জন্য প্রকল্প খুঁজে দেব।',
    featureStepsTitle: 'স্পষ্ট পদক্ষেপ', featureStepsDesc: 'আবেদনের জন্য সহজ চেকলিস্ট পান।',
    featureFreshTitle: 'সর্বদা আপডেট', featureFreshDesc: 'আমরা প্রোগ্রামগুলো ট্র্যাক রাখি।',
    loadingSubtitle: 'যোগ্যতার নিয়ম স্ক্যান করা হচ্ছে...',
  },
  te: {
    dashboard: 'డ్యాష్‌బోర్డ్', savedSchemes: 'సేవ్ చేసిన పథకాలు', profile: 'ప్రొఫైల్', logout: 'లాగ్ అవుట్',
    searchSchemes: 'పథకాలు వెతకండి', allTypes: 'అన్ని రకాలు', education: 'విద్య', jobs: 'ఉద్యోగాలు', agriculture: 'వ్యవసాయం',
    heroBadge: 'AI ఆధారిత అర్హత జతచేయడం', heroTitle: 'మీకు అర్హమైన ప్రభుత్వ పథకాలను కనుగొనండి',
    getStarted: 'ప్రారంభించండి', learnMore: 'మరింత తెలుసుకోండి',
    loadingTitle: 'పథకాలు కనుగొనబడుతున్నాయి', loadingSubtitle: 'అర్హత తనిఖీ చేస్తున్నాం...',
    emptyTitle: 'పథకాలు కనుగొనబడలేదు', emptyText: 'వేరే వర్గం లేదా రాష్ట్రాన్ని ప్రయత్నించండి.',
    benefits: 'ప్రయోజనాలు', eligibility: 'అర్హత', apply: 'దరఖాస్తు చేయండి',
    formTitle: 'మీ అర్హత తనిఖీ చేయండి', formAge: 'వయసు', formCategory: 'వర్గం', formIncome: 'ఆదాయం',
    formState: 'రాష్ట్రం', formOccupation: 'వృత్తి', formSelectCategory: 'వర్గాన్ని ఎంచుకోండి',
    formSelectState: 'రాష్ట్రాన్ని ఎంచుకోండి', formSubmit: 'పథకాలు కనుగొనండి',
    login: 'లాగిన్', createAccount: 'ఖాతా తెరవండి', navHome: 'హోమ్',
    navFeatures: 'లక్షణాలు', navHowItWorks: 'ఇది ఎలా పని చేస్తుంది',
    landingHowItWorks: 'ఇది ఎలా పని చేస్తుంది', landingStep1Title: 'వివరాలు నమోదు చేయండి',
    landingStep2Title: 'AI విశ్లేషణ', landingStep3Title: 'ఫలితాలు పొందండి',
    matches: 'సరిపోలికలు', match: 'సరిపోలిక', saveScheme: 'పథకం సేవ్ చేయండి',
    resultsTitle: 'సిఫారసు చేసిన పథకాలు', resultsSubtitle: 'మీరు అందించిన వివరాల ఆధారంగా.',
  },
  mr: {
    dashboard: 'डॅशबोर्ड', savedSchemes: 'जतन केलेल्या योजना', profile: 'प्रोफाईल', logout: 'लॉग आउट',
    searchSchemes: 'योजना शोधा', allTypes: 'सर्व प्रकार', education: 'शिक्षण', jobs: 'नोकरी', agriculture: 'शेती',
    heroBadge: 'AI आधारित पात्रता जुळणी', heroTitle: 'तुमच्यासाठी पात्र सरकारी योजना शोधा',
    getStarted: 'सुरू करा', learnMore: 'अधिक जाणून घ्या',
    loadingTitle: 'योजना शोधल्या जात आहेत', loadingSubtitle: 'पात्रता तपासली जात आहे...',
    emptyTitle: 'कोणतीही योजना सापडली नाही', emptyText: 'वेगळी श्रेणी किंवा राज्य वापरून पुन्हा प्रयत्न करा.',
    benefits: 'फायदे', eligibility: 'पात्रता', apply: 'अर्ज करा',
    formTitle: 'तुमची पात्रता तपासा', formAge: 'वय', formCategory: 'श्रेणी', formIncome: 'उत्पन्न',
    formState: 'राज्य', formOccupation: 'व्यवसाय', formSelectCategory: 'श्रेणी निवडा',
    formSelectState: 'राज्य निवडा', formSubmit: 'योजना शोधा',
    login: 'लॉगिन', createAccount: 'खाते तयार करा', navHome: 'मुख्यपृष्ठ',
    navFeatures: 'वैशिष्ट्ये', navHowItWorks: 'हे कसे कार्य करते',
    landingHowItWorks: 'हे कसे कार्य करते', landingStep1Title: 'तपशील प्रविष्ट करा',
    landingStep2Title: 'AI विश्लेषण', landingStep3Title: 'निकाल मिळवा',
    matches: 'जुळणी', match: 'जुळणी', saveScheme: 'योजना जतन करा',
    resultsTitle: 'शिफारस केलेल्या योजना', resultsSubtitle: 'तुम्ही दिलेल्या माहितीवर आधारित.',
  },
  ta: {
    dashboard: 'டாஷ்போர்டு', savedSchemes: 'சேமித்த திட்டங்கள்', profile: 'சுயவிவரம்', logout: 'வெளியேறு',
    searchSchemes: 'திட்டங்களை தேடு', allTypes: 'அனைத்து வகைகள்', education: 'கல்வி', jobs: 'வேலைகள்', agriculture: 'விவசாயம்',
    heroBadge: 'AI சார்ந்த தகுதி பொருத்தம்', heroTitle: 'உங்களுக்கு தகுதியான அரசு திட்டங்களை கண்டறியுங்கள்',
    getStarted: 'தொடங்கு', learnMore: 'மேலும் அறிக',
    loadingTitle: 'திட்டங்கள் தேடப்படுகின்றன', loadingSubtitle: 'தகுதி சரிபார்க்கப்படுகிறது...',
    emptyTitle: 'திட்டங்கள் கிடைக்கவில்லை', emptyText: 'வேறு வகை அல்லது மாநிலத்தை முயற்சிக்கவும்.',
    benefits: 'நன்மைகள்', eligibility: 'தகுதி', apply: 'விண்ணப்பிக்கவும்',
    formTitle: 'உங்கள் தகுதியை சரிபார்க்கவும்', formAge: 'வயது', formCategory: 'வகை', formIncome: 'வருமானம்',
    formState: 'மாநிலம்', formOccupation: 'தொழில்', formSelectCategory: 'வகையை தேர்ந்தெடுக்கவும்',
    formSelectState: 'மாநிலத்தை தேர்ந்தெடுக்கவும்', formSubmit: 'திட்டங்களை கண்டறி',
    login: 'உள்நுழை', createAccount: 'கணக்கை உருவாக்கு', navHome: 'முகப்பு',
    navFeatures: 'அம்சங்கள்', navHowItWorks: 'இது எப்படி செயல்படுகிறது',
    landingHowItWorks: 'இது எப்படி செயல்படுகிறது', landingStep1Title: 'விவரங்களை உள்ளிடுக',
    landingStep2Title: 'AI பகுப்பாய்வு', landingStep3Title: 'முடிவுகளை பெறுக',
    matches: 'பொருத்தங்கள்', match: 'பொருத்தம்', saveScheme: 'திட்டத்தை சேமி',
    resultsTitle: 'பரிந்துரைக்கப்பட்ட திட்டங்கள்', resultsSubtitle: 'நீங்கள் வழங்கிய விவரங்களின் அடிப்படையில்.',
  },
  gu: {
    dashboard: 'ડેશબોર્ડ', savedSchemes: 'સાચવેલ યોજનાઓ', profile: 'પ્રોફાઇલ', logout: 'લૉગ આઉટ',
    searchSchemes: 'યોજનાઓ શોધો', allTypes: 'બધા પ્રકાર', education: 'શિક્ષણ', jobs: 'નોકરી', agriculture: 'કૃષિ',
    heroBadge: 'AI આધારિત પાત્રતા મેળ', heroTitle: 'તમારા માટે પાત્ર સરકારી યોજनाઓ શોધો',
    getStarted: 'શરૂ કરો', learnMore: 'વધુ જાણો',
    loadingTitle: 'યોજनाઓ શોધાઈ રહી છે', loadingSubtitle: 'પાત્રતા તપાસાઈ રહી છે...',
    emptyTitle: 'કોઈ યોજना મળી નહીં', emptyText: 'અલગ શ્રેણી અથવા રાજ્ય અજમાવો.',
    benefits: 'લાભ', eligibility: 'પાત્રતા', apply: 'અરજી કરો',
    formTitle: 'તમારી પાત્રતા તપાસો', formAge: 'ઉંમર', formCategory: 'શ્રેણી', formIncome: 'આવક',
    formState: 'રાજ્ય', formOccupation: 'વ્યવસાય', formSelectCategory: 'શ્રેણી પસંદ કરો',
    formSelectState: 'રાજ્ય પસંદ કરો', formSubmit: 'યોજनाઓ શોધો',
    login: 'લૉગિન', createAccount: 'ખાતું બનાવો', navHome: 'હોમ',
    navFeatures: 'વિશેષતા', navHowItWorks: 'આ કેવી રીતે કામ કરે છે',
    landingHowItWorks: 'આ કેવી રીતે કામ કરે છે', landingStep1Title: 'વિગતો દાખલ કરો',
    landingStep2Title: 'AI વિશ્લેષण', landingStep3Title: 'પરિणाम મેળવો',
    matches: 'મેળ', match: 'મેળ', saveScheme: 'યોજना સાચવો',
    resultsTitle: 'ભલામણ કરેલ યોજनाઓ', resultsSubtitle: 'તમે આપેલ માહિતીના આધારે.',
  },
  pa: {
    dashboard: 'ਡੈਸ਼ਬੋਰਡ', savedSchemes: 'ਸੁਰੱਖਿਅਤ ਸਕੀਮਾਂ', profile: 'ਪ੍ਰੋਫਾਈਲ', logout: 'ਲੌਗ ਆਉਟ',
    searchSchemes: 'ਸਕੀਮਾਂ ਲੱਭੋ', allTypes: 'ਸਭ ਕਿਸਮਾਂ', education: 'ਸਿੱਖਿਆ', jobs: 'ਨੌਕਰੀਆਂ', agriculture: 'ਖੇਤੀਬਾੜੀ',
    heroBadge: 'AI ਅਧਾਰਿਤ ਯੋਗਤਾ ਮੇਲ', heroTitle: 'ਆਪਣੇ ਲਈ ਯੋਗ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਲੱਭੋ',
    getStarted: 'ਸ਼ੁਰੂ ਕਰੋ', learnMore: 'ਹੋਰ ਜਾਣੋ',
    loadingTitle: 'ਸਕੀਮਾਂ ਲੱਭੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ', loadingSubtitle: 'ਯੋਗਤਾ ਜਾਂਚੀ ਜਾ ਰਹੀ ਹੈ...',
    emptyTitle: 'ਕੋਈ ਸਕੀਮ ਨਹੀਂ ਮਿਲੀ', emptyText: 'ਵੱਖ ਸ਼੍ਰੇਣੀ ਜਾਂ ਰਾਜ ਅਜ਼ਮਾਓ।',
    benefits: 'ਲਾਭ', eligibility: 'ਯੋਗਤਾ', apply: 'ਅਰਜ਼ੀ ਦਿਓ',
    formTitle: 'ਆਪਣੀ ਯੋਗਤਾ ਜਾਂਚੋ', formAge: 'ਉਮਰ', formCategory: 'ਸ਼੍ਰੇਣੀ', formIncome: 'ਆਮਦਨ',
    formState: 'ਰਾਜ', formOccupation: 'ਕਿੱਤਾ', formSelectCategory: 'ਸ਼੍ਰੇਣੀ ਚੁਣੋ',
    formSelectState: 'ਰਾਜ ਚੁਣੋ', formSubmit: 'ਸਕੀਮਾਂ ਲੱਭੋ',
    login: 'ਲੌਗਇਨ', createAccount: 'ਖਾਤਾ ਬਣਾਓ', navHome: 'ਹੋਮ',
    navFeatures: 'ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ', navHowItWorks: 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
    landingHowItWorks: 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ', landingStep1Title: 'ਵੇਰਵੇ ਦਰਜ ਕਰੋ',
    landingStep2Title: 'AI ਵਿਸ਼ਲੇਸ਼ਣ', landingStep3Title: 'ਨਤੀਜੇ ਪ੍ਰਾਪਤ ਕਰੋ',
    matches: 'ਮੇਲ', match: 'ਮੇਲ', saveScheme: 'ਸਕੀਮ ਸੁਰੱਖਿਅਤ ਕਰੋ',
    resultsTitle: 'ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਸਕੀਮਾਂ', resultsSubtitle: 'ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ।',
  },
  or: {
    dashboard: 'ଡ୍ୟାସ୍‌ବୋର୍ଡ', savedSchemes: 'ସଞ୍ଚିତ ଯୋଜନା', profile: 'ପ୍ରୋଫାଇଲ', logout: 'ଲଗ ଆଉଟ',
    searchSchemes: 'ଯୋଜନା ଖୋଜ', allTypes: 'ସମସ୍ତ ପ୍ରକାର', education: 'ଶିକ୍ଷା', jobs: 'ଚାକିରି', agriculture: 'କୃଷି',
    heroBadge: 'AI ଆଧାରିତ ଯୋଗ୍ୟତା ମିଳାଣ', heroTitle: 'ଆପଣଙ୍କ ଯୋଗ୍ୟ ସରକାରୀ ଯୋଜନା ଖୋଜ',
    getStarted: 'ଆରମ୍ଭ କରନ୍ତୁ', learnMore: 'ଅଧିକ ଜାଣ',
    loadingTitle: 'ଯୋଜନା ଖୋଜା ଯାଉଛି', loadingSubtitle: 'ଯୋଗ୍ୟତା ଯାଞ୍ଚ ହେଉଛି...',
    emptyTitle: 'କୋଣସି ଯୋଜନା ମିଳୁନାହିଁ', emptyText: 'ଅନ୍ୟ ବର୍ଗ ବା ରାଜ୍ୟ ଚେଷ୍ଟା କରନ୍ତୁ।',
    benefits: 'ଲାଭ', eligibility: 'ଯୋଗ୍ୟତା', apply: 'ଆବେଦନ କରନ୍ତୁ',
    formTitle: 'ଆପଣଙ୍କ ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ', formAge: 'ବୟସ', formCategory: 'ବର୍ଗ', formIncome: 'ଆୟ',
    formState: 'ରାଜ୍ୟ', formOccupation: 'ବୃତ୍ତି', formSelectCategory: 'ବର୍ଗ ବାଛନ୍ତୁ',
    formSelectState: 'ରାଜ୍ୟ ବାଛନ୍ତୁ', formSubmit: 'ଯୋଜନା ଖୋଜ',
    login: 'ଲଗଇନ', createAccount: 'ଖାତା ତିଆରି', navHome: 'ହୋମ',
    navFeatures: 'ବୈଶିଷ୍ଟ୍ୟ', navHowItWorks: 'ଏହା କିପରି କାର୍ଯ୍ୟ କରେ',
    landingHowItWorks: 'ଏହା କିପରି କାର୍ଯ୍ୟ କରେ', landingStep1Title: 'ବିବରଣୀ ପ୍ରବେଶ',
    landingStep2Title: 'AI ବିଶ୍ଳେଷଣ', landingStep3Title: 'ଫଳାଫଳ ପ୍ରାପ୍ତ',
    matches: 'ମିଳାଣ', match: 'ମିଳାଣ', saveScheme: 'ଯୋଜନା ସଞ୍ଚୟ',
    resultsTitle: 'ସୁପାରିଶ ଯୋଜନା', resultsSubtitle: 'ଆପଣ ଦିଆ ତଥ୍ୟ ଉପରେ ଆଧାରିତ।',
  },
  ml: {
    dashboard: 'ഡാഷ്‌ബോർഡ്', savedSchemes: 'സംരക്ഷിച്ച പദ്ധതികൾ', profile: 'പ്രൊഫൈൽ', logout: 'ലോഗ് ഔട്ട്',
    searchSchemes: 'പദ്ധതികൾ തിരയൂ', allTypes: 'എല്ലാ തരങ്ങളും', education: 'വിദ്യാഭ്യാസം', jobs: 'ജോലികൾ', agriculture: 'കൃഷി',
    heroBadge: 'AI അധിഷ്‌ഠിത യോഗ്യതാ പൊരുത്തം', heroTitle: 'നിങ്ങൾക്ക് അർഹതയുള്ള സർക്കാർ പദ്ധതികൾ കണ്ടെത്തൂ',
    getStarted: 'ആരംഭിക്കുക', learnMore: 'കൂടുതൽ അറിക',
    loadingTitle: 'പദ്ധതികൾ കണ്ടെത്തുന്നു', loadingSubtitle: 'യോഗ്യത പരിശോധിക്കുന്നു...',
    emptyTitle: 'ഒരു പദ്ധതിയും കണ്ടെത്തിയില്ല', emptyText: 'മറ്റൊരു വിഭാഗം അല്ലെങ്കിൽ സംസ്ഥാനം പരീക്ഷിക്കൂ.',
    benefits: 'ആനുകൂല്യങ്ങൾ', eligibility: 'യോഗ്യത', apply: 'അപേക്ഷിക്കുക',
    formTitle: 'നിങ്ങളുടെ യോഗ്യത പരിശോധിക്കൂ', formAge: 'പ്രായം', formCategory: 'വിഭാഗം', formIncome: 'വരുമാനം',
    formState: 'സംസ്ഥാനം', formOccupation: 'തൊഴിൽ', formSelectCategory: 'വിഭാഗം തിരഞ്ഞെടുക്കൂ',
    formSelectState: 'സംസ്ഥാനം തിരഞ്ഞെടുക്കൂ', formSubmit: 'പദ്ധതികൾ കണ്ടെത്തൂ',
    login: 'ലോഗിൻ', createAccount: 'അക്കൗണ്ട് ഉണ്ടാക്കൂ', navHome: 'ഹോം',
    navFeatures: 'സവിശേഷതകൾ', navHowItWorks: 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു',
    landingHowItWorks: 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു', landingStep1Title: 'വിവരങ്ങൾ നൽകൂ',
    landingStep2Title: 'AI വിശകലനം', landingStep3Title: 'ഫലങ്ങൾ ലഭിക്കൂ',
    matches: 'പൊരുത്തം', match: 'പൊരുത്തം', saveScheme: 'പദ്ധതി സൂക്ഷിക്കൂ',
    resultsTitle: 'ശുപാർശ ചെയ്ത പദ്ധതികൾ', resultsSubtitle: 'നിങ്ങൾ നൽകിയ വിവരങ്ങളുടെ അടിസ്ഥാനത്തിൽ.',
  },
  kn: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', savedSchemes: 'ಉಳಿಸಿದ ಯೋಜನೆಗಳು', profile: 'ಪ್ರೊಫೈಲ್', logout: 'ಲಾಗ್ ಔಟ್',
    searchSchemes: 'ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ', allTypes: 'ಎಲ್ಲ ವಿಧಗಳು', education: 'ಶಿಕ್ಷಣ', jobs: 'ಉದ್ಯೋಗ', agriculture: 'ಕೃಷಿ',
    heroBadge: 'AI ಆಧಾರಿತ ಅರ್ಹತೆ ಹೊಂದಾಣಿಕೆ', heroTitle: 'ನಿಮಗೆ ಅರ್ಹವಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ', learnMore: 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ',
    loadingTitle: 'ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ', loadingSubtitle: 'ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    emptyTitle: 'ಯಾವ ಯೋಜನೆಯೂ ಸಿಗಲಿಲ್ಲ', emptyText: 'ಬೇರೆ ವರ್ಗ ಅಥವಾ ರಾಜ್ಯ ಪ್ರಯತ್ನಿಸಿ.',
    benefits: 'ಪ್ರಯೋಜನಗಳು', eligibility: 'ಅರ್ಹತೆ', apply: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    formTitle: 'ನಿಮ್ಮ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ', formAge: 'ವಯಸ್ಸು', formCategory: 'ವರ್ಗ', formIncome: 'ಆದಾಯ',
    formState: 'ರಾಜ್ಯ', formOccupation: 'ವೃತ್ತಿ', formSelectCategory: 'ವರ್ಗ ಆಯ್ಕೆಮಾಡಿ',
    formSelectState: 'ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ', formSubmit: 'ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ',
    login: 'ಲಾಗಿನ್', createAccount: 'ಖಾತೆ ರಚಿಸಿ', navHome: 'ಮುಖಪುಟ',
    navFeatures: 'ವೈಶಿಷ್ಟ್ಯಗಳು', navHowItWorks: 'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
    landingHowItWorks: 'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ', landingStep1Title: 'ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
    landingStep2Title: 'AI ವಿಶ್ಲೇಷಣೆ', landingStep3Title: 'ಫಲಿತಾಂಶ ಪಡೆಯಿರಿ',
    matches: 'ಹೊಂದಾಣಿಕೆಗಳು', match: 'ಹೊಂದಾಣಿಕೆ', saveScheme: 'ಯೋಜನೆ ಉಳಿಸಿ',
    resultsTitle: 'ಶಿಫಾರಸು ಮಾಡಿದ ಯೋಜನೆಗಳು', resultsSubtitle: 'ನೀವು ನೀಡಿದ ವಿವರಗಳ ಆಧಾರದಲ್ಲಿ.',
  },
  as: {
    dashboard: 'ডেশবোর্ড', savedSchemes: 'সংৰক্ষিত আঁচনি', profile: 'প্ৰফাইল', logout: 'লগ আউট',
    searchSchemes: 'আঁচনি বিচাৰক', allTypes: 'সকলো ধৰণ', education: 'শিক্ষা', jobs: 'চাকৰি', agriculture: 'কৃষি',
    heroBadge: 'AI ভিত্তিক যোগ্যতা মিলোৱা', heroTitle: 'আপোনাৰ বাবে যোগ্য চৰকাৰী আঁচনি বিচাৰক',
    getStarted: 'আৰম্ভ কৰক', learnMore: 'অধিক জানক',
    loadingTitle: 'আঁচনি বিচাৰি আছে', loadingSubtitle: 'যোগ্যতা পৰীক্ষা কৰা হৈছে...',
    emptyTitle: 'কোনো আঁচনি পোৱা নগল', emptyText: 'আন শ্ৰেণী বা ৰাজ্য চেষ্টা কৰক।',
    benefits: 'সুবিধা', eligibility: 'যোগ্যতা', apply: 'আবেদন কৰক',
    formTitle: 'আপোনাৰ যোগ্যতা পৰীক্ষা কৰক', formAge: 'বয়স', formCategory: 'শ্ৰেণী', formIncome: 'আয়',
    formState: 'ৰাজ্য', formOccupation: 'পেশা', formSelectCategory: 'শ্ৰেণী বাছক',
    formSelectState: 'ৰাজ্য বাছক', formSubmit: 'আঁচনি বিচাৰক',
    login: 'লগইন', createAccount: 'একাউণ্ট বনাওক', navHome: 'হোম',
    navFeatures: 'বিশেষত্ব', navHowItWorks: 'এয়া কেনেকৈ কাম কৰে',
    landingHowItWorks: 'এয়া কেনেকৈ কাম কৰে', landingStep1Title: 'বিৱৰণ দিয়ক',
    landingStep2Title: 'AI বিশ্লেষণ', landingStep3Title: 'ফলাফল পাওক',
    matches: 'মিল', match: 'মিল', saveScheme: 'আঁচনি সংৰক্ষণ কৰক',
    resultsTitle: 'পৰামৰ্শ দিয়া আঁচনিসমূহ', resultsSubtitle: 'আপুনি দিয়া তথ্যৰ ভিত্তিত।',
  },
  ur: {
    dashboard: 'ڈیش بورڈ', savedSchemes: 'محفوظ اسکیمیں', profile: 'پروفائل', logout: 'لاگ آؤٹ',
    searchSchemes: 'اسکیمیں تلاش کریں', allTypes: 'تمام اقسام', education: 'تعلیم', jobs: 'روزگار', agriculture: 'زراعت',
    heroBadge: 'AI پر مبنی اہلیت کا تعین', heroTitle: 'اپنے لیے موزوں سرکاری اسکیمیں تلاش کریں',
    getStarted: 'شروع کریں', learnMore: 'مزید جانیں',
    loadingTitle: 'اسکیمیں تلاش کی جا رہی ہیں', loadingSubtitle: 'اہلیت کی جانچ ہو رہی ہے...',
    emptyTitle: 'کوئی اسکیم نہیں ملی', emptyText: 'مختلف زمرہ یا ریاست آزمائیں۔',
    benefits: 'فوائد', eligibility: 'اہلیت', apply: 'درخواست دیں',
    formTitle: 'اپنی اہلیت جانچیں', formAge: 'عمر', formCategory: 'زمرہ', formIncome: 'آمدنی',
    formState: 'ریاست', formOccupation: 'پیشہ', formSelectCategory: 'زمرہ منتخب کریں',
    formSelectState: 'ریاست منتخب کریں', formSubmit: 'اسکیمیں تلاش کریں',
    login: 'لاگ ان', createAccount: 'اکاؤنٹ بنائیں', navHome: 'ہوم',
    navFeatures: 'خصوصیات', navHowItWorks: 'یہ کیسے کام کرتا ہے',
    landingHowItWorks: 'یہ کیسے کام کرتا ہے', landingStep1Title: 'تفصیلات درج کریں',
    landingStep2Title: 'AI تجزیہ', landingStep3Title: 'نتائج حاصل کریں',
    matches: 'مطابقت', match: 'مطابقت', saveScheme: 'اسکیم محفوظ کریں',
    resultsTitle: 'تجویز کردہ اسکیمیں', resultsSubtitle: 'آپ کی فراہم کردہ معلومات کی بنیاد پر۔',
  },
  mai: {
    dashboard: 'डैशबोर्ड', savedSchemes: 'सुरक्षित योजना', profile: 'प्रोफाइल', logout: 'लॉग आउट',
    searchSchemes: 'योजना खोजू', allTypes: 'सब प्रकार', education: 'शिक्षा', jobs: 'नोकरी', agriculture: 'खेती',
    heroBadge: 'AI आधारित पात्रता मेल', heroTitle: 'अपनहिं लेल उचित सरकारी योजना खोजू',
    getStarted: 'शुरू करू', learnMore: 'आर जानू',
    loadingTitle: 'योजना खोजल जा रहल अछि', loadingSubtitle: 'पात्रता जँचल जा रहल अछि...',
    emptyTitle: 'कोनो योजना नहि भेटल', emptyText: 'दोसर श्रेणी वा राज्य कोशिश करू।',
    benefits: 'लाभ', eligibility: 'पात्रता', apply: 'आवेदन दिअ',
    formTitle: 'अपन पात्रता जँचू', formAge: 'उमर', formCategory: 'श्रेणी', formIncome: 'आय',
    formState: 'राज्य', formOccupation: 'व्यवसाय', formSelectCategory: 'श्रेणी चुनू',
    formSelectState: 'राज्य चुनू', formSubmit: 'योजना खोजू',
    login: 'लॉगिन', createAccount: 'खाता बनाउ', navHome: 'होम',
    navFeatures: 'विशेषता', navHowItWorks: 'ई कोना काज करैत अछि',
    landingHowItWorks: 'ई कोना काज करैत अछि', landingStep1Title: 'विवरण दिय',
    landingStep2Title: 'AI विश्लेषण', landingStep3Title: 'परिणाम लिअ',
    matches: 'मेल', match: 'मेल', saveScheme: 'योजना सुरक्षित करू',
    resultsTitle: 'अनुशंसित योजना', resultsSubtitle: 'अहाँक देल जानकारीक आधार पर।',
  },
}

/* ─── Language Picker Modal ──────────────────────────────────── */
export function LanguagePicker({ onClose }) {
  const { language, setLanguage } = useAppSettings()
  const ref = useRef(null)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div ref={ref} style={{
        background: 'var(--card-bg, #0d1126)', border: '1px solid var(--card-border, rgba(99,102,241,0.3))',
        borderRadius: 20, width: '100%', maxWidth: 480,
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--card-border, rgba(99,102,241,0.15))' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--page-color)', marginBottom: 2 }}>Select Language</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>भाषा चुनें · ভাষা বেছুন · ভাষা নির্বাচন করুন</div>
          </div>
          <button onClick={onClose} className="modal-close-btn" style={{ width: 32, height: 32, borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>

        {/* Language grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--card-border, rgba(99,102,241,0.1))' }}>
          {LANGUAGES.map(lang => {
            const isSelected = language === lang.code
            return (
              <button key={lang.code} onClick={() => { setLanguage(lang.code); onClose() }}
                style={{
                  padding: '14px 18px', textAlign: 'left', border: 'none', cursor: 'pointer',
                  background: isSelected ? 'rgba(99,102,241,0.18)' : 'var(--card-bg, #0d1126)',
                  transition: 'background 0.15s',
                  outline: isSelected ? '2px solid rgba(99,102,241,0.45)' : 'none',
                  outlineOffset: '-2px',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'var(--card-bg, #0d1126)' }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: isSelected ? 'var(--accent-text)' : 'var(--page-color)', marginBottom: 2 }}>{lang.name}</div>
                <div style={{ fontSize: 13, color: isSelected ? 'var(--accent-text)' : 'var(--text-muted)' }}>{lang.native}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ─── Provider ───────────────────────────────────────────────── */
export function AppSettingsProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('schemescout_language') || 'en'
  )
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('schemescout_dark')
    return stored !== null ? stored === 'true' : true
  })
  const [accentColor, setAccentColorState] = useState(
    () => localStorage.getItem('schemescout_accent') || '#6366f1'
  )

  const setAccentColor = useCallback((hex) => {
    setAccentColorState(hex)
    localStorage.setItem('schemescout_accent', hex)
    applyAccent(hex)
  }, [])

  useEffect(() => { localStorage.setItem('schemescout_language', language) }, [language])

  useEffect(() => {
    localStorage.setItem('schemescout_dark', String(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // Apply saved accent on first mount
  useEffect(() => { applyAccent(accentColor) }, []) // eslint-disable-line

  const value = useMemo(() => ({
    language, setLanguage, darkMode, setDarkMode,
    accentColor, setAccentColor,
    t: (key) => {
      const langTranslations = translations[language]
      if (langTranslations?.[key]) return langTranslations[key]
      return translations.en[key] || key
    },
  }), [language, darkMode, accentColor, setAccentColor])

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  )
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext)
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider')
  return ctx
}
