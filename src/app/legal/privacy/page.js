"use client" // <-- Import for Pages Router
import React from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/dashboard/Footer';
// For App Router (Next.js 13+), you would use: import { useRouter } from 'next/navigation';
// And you would call router.back() instead of router.push(router.basePath)

const PrivacyPolicyPage = () => {
  const router = useRouter();

  // **IMPORTANT:** Update these dates!
  const effectiveDate = "01/11/2025";
  const lastUpdatedDate = "01/11/2025";
  const companyName = "Houspire";
  const legalEntity = "Armishq Design Private Limited";
  const contactEmail = "hello@houspire.ai";
  const companyAddress = "Plot No 67, Road No 4, Prashasan Nagar, Jubilee Hills, Hyderabad, Telangana 500033";
  const websiteUrl = "www.houspire.ai";

  // Handler for the back button
  const handleBack = () => {
    // For Pages Router: This takes the user back one step in the browser history.
    router.back(); 
    // If router.back() isn't working as expected (e.g., you navigated directly to this page), 
    // you might use: router.push('/'); or router.push(router.basePath || '/');
  };

  // Function to create a section block for consistent styling
  const PolicySection = ({ title, children }) => (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-50 border-b pb-2 border-gray-200 dark:border-gray-700">
        {title}
      </h2>
      <div className="text-gray-700 dark:text-gray-300 space-y-3 leading-relaxed">
        {children}
      </div>
    </section>
  );

  // Function for nested list items
  const ListItem = ({ children }) => (
    <li className="ml-6 list-disc marker:text-indigo-500">{children}</li>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 sm:p-8 md:p-12">
      <div className="max-w-4xl mx-auto">

        {/* --- BACK BUTTON (NEW SECTION) --- */}
        <div className="pt-4 mb-6 flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition duration-150 ease-in-out group focus:outline-none"
            aria-label="Go back to the previous page"
          >
            {/* Lucide Icon Placeholder: You can replace this SVG with the actual Lucide 'ArrowLeft' icon component */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 transition-transform group-hover:-translate-x-0.5">
                <path d="m15 18-6-6 6-6"/>
            </svg>
            <span className="font-medium text-base">
                Back to {companyName}
            </span>
          </button>
        </div>
        {/* --- END BACK BUTTON --- */}

        {/* Header Section */}
        <header className="text-center mb-10 pt-4 border-b pb-6 border-gray-200 dark:border-gray-700">
          <h1 className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Effective Date: <strong className="font-semibold">{effectiveDate}</strong> | Last Updated: <strong className="font-semibold">{lastUpdatedDate}</strong>
          </p>
        </header>

        {/* Introductory Paragraph */}
        <div className="mb-10 text-lg text-gray-700 dark:text-gray-300 border-l-4 border-indigo-500 pl-4 py-1 bg-indigo-50 dark:bg-gray-800/50 rounded-r-md">
          This Privacy Policy describes how **{companyName}**, operated by **{legalEntity}** ("Company", "we", "our", "us"), collects, uses, and protects your information when you access or use <a href={`http://${websiteUrl}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{websiteUrl}</a> (the "Platform") or any services offered through it.
          <br />
          <strong className="block mt-2">By using our Platform, you consent to the terms of this Privacy Policy.</strong>
        </div>

        {/* 1. Information We Collect */}
        <PolicySection title="1. Information We Collect">
          We collect personal and non-personal information to enhance your user experience and deliver our services effectively.

          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100">1.1 Personal Information:</h3>
          <ul className="space-y-2">
            <ListItem>Name, email address, and phone number</ListItem>
            <ListItem>City and location</ListItem>
            <ListItem>Uploaded apartment layouts, drawings, or files</ListItem>
            <ListItem>Design preferences and investment range</ListItem>
            <ListItem>Payment details (processed via secure third-party gateways)</ListItem>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100">1.2 Non-Personal Information:</h3>
          <ul className="space-y-2">
            <ListItem>Browser type, operating system, device information, and IP address</ListItem>
            <ListItem>Session data, cookies, and browsing activity on our Platform</ListItem>
          </ul>
        </PolicySection>

        {/* 2. Purpose of Data Collection */}
        <PolicySection title="2. Purpose of Data Collection">
          We collect data for the following purposes:
          <ul className="space-y-2 mt-2">
            <ListItem>To provide design, visualization, and budgeting services</ListItem>
            <ListItem>To process online payments securely</ListItem>
            <ListItem>To personalize your experience on the Platform</ListItem>
            <ListItem>To recommend suitable vendors or service providers (with your consent)</ListItem>
            <ListItem>To send relevant communication and updates</ListItem>
            <ListItem>To comply with legal and regulatory obligations</ListItem>
          </ul>
        </PolicySection>

        {/* 3. Legal Basis for Processing */}
        <PolicySection title="3. Legal Basis for Processing">
          We process your data under:
          <ul className="space-y-2 mt-2">
            <ListItem>Your consent</ListItem>
            <ListItem>Contractual necessity for providing requested services</ListItem>
            <ListItem>Legitimate business interests, such as service improvement</ListItem>
            <ListItem>Legal obligations as per Indian laws</ListItem>
          </ul>
          You may withdraw consent anytime by emailing us at <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">{contactEmail}</a>.
        </PolicySection>

        {/* 4. Data Retention */}
        <PolicySection title="4. Data Retention">
          We retain your information only as long as necessary for the purposes outlined or as required by law. Once no longer needed, your data will be securely deleted or anonymized.
        </PolicySection>

        {/* 5. Information Sharing */}
        <PolicySection title="5. Information Sharing">
          We may share your information with:
          <ul className="space-y-2 mt-2">
            <ListItem>Service providers for technical or operational support</ListItem>
            <ListItem>Payment gateways for transaction processing</ListItem>
            <ListItem>Recommended vendors or contractors, only with your consent</ListItem>
            <ListItem>Legal authorities, if required by applicable law</ListItem>
          </ul>
          We **do not sell or rent** your personal information.
        </PolicySection>

        {/* 6. Cookies and Tracking */}
        <PolicySection title="6. Cookies and Tracking">
          We use cookies and similar technologies to:
          <ul className="space-y-2 mt-2">
            <ListItem>Track Platform performance</ListItem>
            <ListItem>Analyze traffic patterns</ListItem>
            <ListItem>Personalize user experience</ListItem>
          </ul>
          You may disable cookies through your browser settings, but certain features may not function properly.
        </PolicySection>

        {/* 7. Data Security */}
        <PolicySection title="7. Data Security">
          We maintain administrative, technical, and physical safeguards to protect your data. While we use industry-standard practices, no online platform is completely risk-free. Users share information at their own discretion.
        </PolicySection>

        {/* 8. Your Rights Under the DPDP Act, 2023 */}
        <PolicySection title="8. Your Rights Under the DPDP Act, 2023 (India)">
          You have the right to:
          <ul className="space-y-2 mt-2">
            <ListItem>Access your personal data</ListItem>
            <ListItem>Correct inaccurate or outdated data</ListItem>
            <ListItem>Withdraw consent for data use</ListItem>
            <ListItem>Request deletion ("Right to be Forgotten")</ListItem>
            <ListItem>Lodge a complaint with the Data Protection Board of India</ListItem>
          </ul>
          Requests can be sent to <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">{contactEmail}</a>.
        </PolicySection>

        {/* 9. Third-Party Links */}
        <PolicySection title="9. Third-Party Links">
          Our Platform may contain external links. We are not responsible for third-party privacy practices or content. Please review their policies separately.
        </PolicySection>

        {/* 10. Children's Privacy */}
        <PolicySection title="10. Children's Privacy">
          Our Platform is intended for users above 18 years of age. We do not knowingly collect personal data from minors.
        </PolicySection>

        {/* 11. Updates to This Policy */}
        <PolicySection title="11. Updates to This Policy">
          We may revise this Privacy Policy periodically. Updates will be posted on this page with a revised "Last Updated" date. Continued use of the Platform implies acceptance of changes.
        </PolicySection>

        {/* 12. Contact Information */}
        <PolicySection title="12. Contact Information">
          For questions or requests related to this Privacy Policy, please contact:
          <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">
                {legalEntity}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{companyAddress}</p>
            <p className="mt-2 text-sm">
                Email: <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{contactEmail}</a>
            </p>
            <p className="text-sm">
                Website: <a href={`http://${websiteUrl}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">{websiteUrl}</a>
            </p>
          </div>
        </PolicySection>

        {/* 13. Governing Law */}
        <PolicySection title="13. Governing Law">
          This Privacy Policy shall be governed by and construed in accordance with the laws of **India**, with exclusive jurisdiction of courts in **Hyderabad, Telangana**.
        </PolicySection>

        {/* Footer Separator */}
        <hr className="my-10 border-gray-200 dark:border-gray-700" />

        {/* Contact Us Block (Styled for SaaS Footer/Bottom) */}
        <div className="text-center pb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">
                Need to Talk?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                We are here to help with any privacy concerns or questions about your data.
            </p>
            <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition duration-150 ease-in-out transform hover:scale-[1.02]"
            >
                Contact Support Directly
            </a>
        </div>

      </div>
            <Footer/>
    </div>
  );
};

export default PrivacyPolicyPage;