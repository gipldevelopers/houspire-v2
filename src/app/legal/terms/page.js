"use client"
import React from 'react';
import { useRouter } from 'next/navigation'; // For Pages Router
// If using App Router: import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react'; // Lucide Icon import

// --- Component Start ---

const TermsOfUsePage = () => {
  const router = useRouter();

  // **IMPORTANT:** Dates updated as per your request
  const effectiveDate = "01/11/2025";
  const lastUpdatedDate = "01/11/2025";
  const companyName = "Houspire";
  const legalEntity = "Armishq Design Private Limited";
  const contactEmail = "hello@houspire.ai";
  const companyAddress = "Plot No 67, Road No 4, Prashasan Nagar, Jubilee Hills, Hyderabad, Telangana 500033";
  const websiteUrl = "www.houspire.ai";

  // Handler for the back button
  const handleBack = () => {
    router.back();
  };

  // Function to create a section block for consistent styling
  const TermsSection = ({ title, children }) => (
    <section className="mb-8" id={`section-${title.split(' ')[0]}`}>
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

        {/* --- BACK BUTTON --- */}
        <div className="pt-4 mb-6 flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition duration-150 ease-in-out group focus:outline-none"
            aria-label="Go back to the previous page"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-medium text-base">
                Back to {companyName}
            </span>
          </button>
        </div>
        {/* --- END BACK BUTTON --- */}

        {/* Header Section */}
        <header className="text-center mb-10 pt-4 border-b pb-6 border-gray-200 dark:border-gray-700">
          <h1 className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Effective Date: <strong className="font-semibold">{effectiveDate}</strong> | Last Updated: <strong className="font-semibold">{lastUpdatedDate}</strong>
          </p>
        </header>

        {/* Introductory Paragraph */}
        <div className="mb-10 text-lg text-gray-700 dark:text-gray-300 border-l-4 border-indigo-500 pl-4 py-1 bg-indigo-50 dark:bg-gray-800/50 rounded-r-md">
          These Terms and Conditions (“**Terms**”) constitute a binding agreement between **{legalEntity}** (“Company”, “we”, “our”, “us”) and the user (“you”, “your”) governing your access to and use of the website <a href={`http://${websiteUrl}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{websiteUrl}</a> (“**Platform**”) and related services (“**Services**”).
          <br />
          <strong className="block mt-2">By using or accessing the Platform, you agree to be bound by these Terms. If you do not agree, please discontinue use immediately.</strong>
        </div>

        {/* 1. Overview of Services */}
        <TermsSection title="1. Overview of Services">
          **{companyName}** is a digital home-interiors planning platform that provides design visualization, budget estimation, and vendor recommendation services. **{companyName} does not execute or manage on-site construction or interior execution work.** All 3D visualizations, layouts, and estimates are for planning and budgeting purposes only.
        </TermsSection>

        {/* 2. Eligibility */}
        <TermsSection title="2. Eligibility">
          You must be at least **18 years old** and capable of entering into a legally binding contract under Indian law to use this Platform. By using the Platform, you confirm that all information provided by you is true, accurate, and complete.
        </TermsSection>

        {/* 3. Account Creation and Access */}
        <TermsSection title="3. Account Creation and Access">
          Users may need to create an account to access certain features. You are responsible for maintaining **confidentiality of your login credentials** and for all activities under your account. The Company reserves the right to suspend or terminate access if suspicious or fraudulent activity is detected.
        </TermsSection>

        {/* 4. Use of Platform */}
        <TermsSection title="4. Use of Platform">
          By using the Platform, you agree:
          <ul className="space-y-2 mt-2">
            <ListItem>To use the Platform only for lawful purposes.</ListItem>
            <ListItem>Not to upload or share unlawful, offensive, or **copyrighted materials**.</ListItem>
            <ListItem>Not to attempt to hack, reverse-engineer, or disrupt the Platform.</ListItem>
            <ListItem>Not to use automated scripts, crawlers, or bots to access our data.</ListItem>
          </ul>
          Violation of these terms may lead to immediate termination of access.
        </TermsSection>

        {/* 5. Payment and Fees */}
        <TermsSection title="5. Payment and Fees">
          Certain features or services may require payment. Payments are processed securely through **third-party payment gateways**. You agree to provide accurate payment details and authorize us or our partners to process payments on your behalf. Fees once paid are **non-refundable**, except under conditions mentioned in our Refund Policy.
        </TermsSection>

        {/* 6. Intellectual Property Rights */}
        <TermsSection title="6. Intellectual Property Rights">
          All **intellectual property**, including but not limited to designs, renders, layouts, text, graphics, logos, icons, and software, is owned or licensed by **{legalEntity}**. You are not permitted to copy, modify, reproduce, or distribute any Platform content or use **{companyName}**’s brand assets without prior written consent.
        </TermsSection>

        {/* 7. User-Generated Content */}
        <TermsSection title="7. User-Generated Content">
          If you upload or share any layout, image, or file:
          <ul className="space-y-2 mt-2">
            <ListItem>You grant the Company a limited, non-exclusive, royalty-free license to use such content for providing Services.</ListItem>
            <ListItem>You confirm that such content does not infringe on any third-party rights.</ListItem>
            <ListItem>You are **solely responsible** for the accuracy and legality of the content you share.</ListItem>
          </ul>
        </TermsSection>

        {/* 8. Third-Party Services */}
        <TermsSection title="8. Third-Party Services">
          The Platform may recommend or connect you with third-party contractors or vendors. **{companyName} only facilitates introductions** and bears **no responsibility** for the conduct, pricing, timelines, or quality of work of such third parties. Users are advised to verify and contract directly with vendors.
        </TermsSection>

        {/* 9. Limitation of Liability */}
        <TermsSection title="9. Limitation of Liability">
          To the fullest extent permitted by law:
          <ul className="space-y-2 mt-2">
            <ListItem>**{companyName}** shall not be liable for any indirect, incidental, or consequential damages arising from the use of the Platform.</ListItem>
            <ListItem>All designs, layouts, and cost estimates are **indicative** and subject to change based on materials, market prices, and vendor inputs.</ListItem>
            <ListItem>You agree that your sole remedy in any dispute is limited to discontinuing use of the Platform or, where applicable, requesting service review.</ListItem>
          </ul>
        </TermsSection>

        {/* 10. Indemnification */}
        <TermsSection title="10. Indemnification">
          You agree to **indemnify**, defend, and hold harmless **{legalEntity}**, its directors, employees, and affiliates from any claim, loss, or liability arising out of your use or misuse of the Platform, your breach of these Terms, or your violation of applicable law or third-party rights.
        </TermsSection>

        {/* 11. Termination */}
        <TermsSection title="11. Termination">
          The Company reserves the right to suspend or terminate user access at any time, without notice, for breach of these Terms, misuse of the Platform, or legal or technical reasons. Users may terminate their account by contacting <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">{contactEmail}</a>.
        </TermsSection>

        {/* 12. Disclaimers */}
        <TermsSection title="12. Disclaimers">
          **{companyName}** is a design and budgeting platform, **not an execution or construction service provider**. Rendered visuals and cost estimates are for conceptual understanding only. The Platform and Services are provided **“as is”** and **“as available”** without warranties of any kind.
        </TermsSection>

        {/* 13. Privacy */}
        <TermsSection title="13. Privacy">
          Use of the Platform is governed by our **Privacy Policy**, which forms part of these Terms. Please review it carefully.
        </TermsSection>

        {/* 14. Changes to Terms */}
        <TermsSection title="14. Changes to Terms">
          We may update these Terms from time to time. Updated versions will be posted on this page with a new “Last Updated” date. Your continued use of the Platform signifies acceptance of the revised Terms.
        </TermsSection>

        {/* 15. Governing Law and Jurisdiction */}
        <TermsSection title="15. Governing Law and Jurisdiction">
          These Terms are governed by and construed in accordance with the **laws of India**. Courts in **Hyderabad, Telangana** shall have exclusive jurisdiction over any disputes arising from these Terms.
        </TermsSection>

        {/* 16. Contact Information */}
        <TermsSection title="16. Contact Information">
          For any queries regarding these Terms, please contact:
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
        </TermsSection>

        {/* Footer Separator */}
        <hr className="my-10 border-gray-200 dark:border-gray-700" />

        {/* Contact Us Block (Styled for SaaS Footer/Bottom) */}
        <div className="text-center pb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">
                Questions About These Terms?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                We are happy to clarify any point regarding your rights and responsibilities.
            </p>
            <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition duration-150 ease-in-out transform hover:scale-[1.02]"
            >
                Email Our Legal Team
            </a>
        </div>

      </div>
    </div>
  );
};

export default TermsOfUsePage;