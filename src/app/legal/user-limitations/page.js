"use client"
import React from 'react';
import { useRouter } from 'next/navigation'; // For Pages Router
// If using App Router: import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react'; // Lucide Icon import
import Footer from '@/components/dashboard/Footer';

// --- Component Start ---

const UserLimitationsPolicyPage = () => {
  const router = useRouter();

  // **Dates updated as per your request**
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
  const PolicySection = ({ title, children }) => (
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
            User Limitations Policy
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Effective Date: <strong className="font-semibold">{effectiveDate}</strong> | Last Updated: <strong className="font-semibold">{lastUpdatedDate}</strong>
          </p>
        </header>

        {/* Introductory Paragraph */}
        <div className="mb-10 text-lg text-gray-700 dark:text-gray-300 border-l-4 border-indigo-500 pl-4 py-1 bg-indigo-50 dark:bg-gray-800/50 rounded-r-md">
          This User Limitations Policy outlines the acceptable and prohibited use of the **{companyName}** Platform operated by **{legalEntity}** (“Company”, “we”, “our”, or “us”). By accessing or using <a href={`http://${websiteUrl}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{websiteUrl}</a> (“Platform”), users (“you”, “your”) agree to abide by this Policy in addition to our Terms of Use and Privacy Policy.
        </div>

        {/* 1. Purpose of This Policy */}
        <PolicySection title="1. Purpose of This Policy">
          The purpose of this Policy is to ensure that all users use the Platform **responsibly, ethically, and in compliance with applicable laws**. Any misuse or violation of this Policy may result in **suspension, restriction, or termination** of user access without prior notice.
        </PolicySection>

        {/* 2. Acceptable Use */}
        <PolicySection title="2. Acceptable Use">
          You agree to use the **{companyName}** Platform:
          <ul className="space-y-2 mt-2">
            <ListItem>Solely for **personal and lawful** interior design, budgeting, or home planning purposes.</ListItem>
            <ListItem>In a manner that does not infringe on any rights of others, including intellectual property, privacy, or confidentiality.</ListItem>
            <ListItem>In compliance with applicable laws, regulations, and these Terms.</ListItem>
          </ul>
        </PolicySection>

        {/* 3. Prohibited Activities */}
        <PolicySection title="3. Prohibited Activities">
          You are **strictly prohibited** from engaging in the following activities on or through the Platform:

          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100">A. Misuse of Platform Features</h3>
          <ul className="space-y-2">
            <ListItem>Uploading, sharing, or transmitting any **false, misleading, or incomplete** information.</ListItem>
            <ListItem>Uploading any file, layout, or content that is obscene, abusive, or violates third-party rights.</ListItem>
            <ListItem>Attempting to interfere with, disable, or disrupt the Platform, servers, or connected networks.</ListItem>
            <ListItem>Attempting to access **restricted areas, source code, or back-end systems** of the Platform.</ListItem>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100">B. Unauthorized Commercial Use</h3>
          <ul className="space-y-2">
            <ListItem>Using **{companyName}** for any commercial resale, redistribution, or competitive analysis.</ListItem>
            <ListItem>Copying, replicating, or modifying **{companyName}’s proprietary tools**, UI elements, or process flow.</ListItem>
            <ListItem>Using the Platform for generating leads, marketing, or promoting third-party services without written permission.</ListItem>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100">C. Data and Security Violations</h3>
          <ul className="space-y-2">
            <ListItem>Uploading or introducing **viruses, malware, or harmful code**.</ListItem>
            <ListItem>**Scraping, data mining, or harvesting** any data from the Platform.</ListItem>
            <ListItem>Attempting to bypass or disable security or authentication mechanisms.</ListItem>
            <ListItem>Engaging in actions that could impair, overload, or damage the Platform’s infrastructure.</ListItem>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100">D. Misrepresentation and Impersonation</h3>
          <ul className="space-y-2">
            <ListItem>Impersonating any person or entity, including **{companyName}** staff, representatives, or partners.</ListItem>
            <ListItem>Creating **fake or multiple user accounts** to manipulate data, reviews, or insights.</ListItem>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100">E. Intellectual Property Infringement</h3>
          <ul className="space-y-2">
            <ListItem>Downloading, duplicating, or **redistributing any designs, renders, text, or visual content without authorization**.</ListItem>
            <ListItem>Removing or altering copyright, trademark, or proprietary notices from Platform materials.</ListItem>
          </ul>
        </PolicySection>

        {/* 4. User Responsibilities */}
        <PolicySection title="4. User Responsibilities">
          You agree to:
          <ul className="space-y-2 mt-2">
            <ListItem>Provide accurate and up-to-date information when using the Platform.</ListItem>
            <ListItem>Keep your login credentials confidential and not share them with others.</ListItem>
            <ListItem>Immediately report any unauthorized use or suspected breach to <a href={`mailto:${contactEmail}`} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">{contactEmail}</a>.</ListItem>
            <ListItem>Take full responsibility for actions performed under your account.</ListItem>
          </ul>
        </PolicySection>

        {/* 5. Monitoring and Enforcement */}
        <PolicySection title="5. Monitoring and Enforcement">
          **{companyName}** reserves the right to:
          <ul className="space-y-2 mt-2">
            <ListItem>Monitor user activity on the Platform to ensure compliance.</ListItem>
            <ListItem>Restrict or **suspend accounts that violate these limitations**.</ListItem>
            <ListItem>Take appropriate legal action for misuse, including claims for damages.</ListItem>
            <ListItem>Report illegal activities to relevant authorities.</ListItem>
          </ul>
        </PolicySection>

        {/* 6. Liability */}
        <PolicySection title="6. Liability">
          You acknowledge that:
          <ul className="space-y-2 mt-2">
            <ListItem>Violation of this Policy may result in **immediate account suspension or permanent ban**.</ListItem>
            <ListItem>Any damages caused to the Platform or Company due to your actions may be pursued legally.</ListItem>
            <ListItem>**{companyName}** assumes no liability for losses incurred due to your own misuse or breach.</ListItem>
          </ul>
        </PolicySection>

        {/* 7. Amendments */}
        <PolicySection title="7. Amendments">
          We may modify this User Limitations Policy periodically to ensure relevance and compliance with laws. Revised versions will be posted on <a href={`http://${websiteUrl}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{websiteUrl}</a> with a new “Last Updated” date.
        </PolicySection>

        {/* 8. Governing Law */}
        <PolicySection title="8. Governing Law">
          This Policy shall be governed by and construed in accordance with the **laws of India**. Courts located in **Hyderabad, Telangana** shall have exclusive jurisdiction over any disputes arising under this Policy.
        </PolicySection>

        {/* 9. Contact Information */}
        <PolicySection title="9. Contact Information">
          For any questions or clarifications regarding this Policy, please contact:
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
        
        {/* Footer Separator */}
        <hr className="my-10 border-gray-200 dark:border-gray-700" />

        {/* Action Block */}
        <div className="text-center pb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">
                Report a Violation
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Help us keep the **{companyName}** Platform safe and fair for everyone.
            </p>
            <a
                href={`mailto:${contactEmail}?subject=Report%20of%20Policy%20Violation`}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900 transition duration-150 ease-in-out transform hover:scale-[1.02]"
            >
                Report Misuse Now
            </a>
        </div>

      </div>
            <Footer/>
    </div>
  );
};

export default UserLimitationsPolicyPage;