"use client"
import React from 'react';
import { useRouter } from 'next/navigation'; // For Pages Router
// If using App Router: import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react'; // Lucide Icon import
import Footer from '@/components/dashboard/Footer';

// --- Component Start ---

const DisclaimerPolicyPage = () => {
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
    router.back();
  };

  // Function to create a section block for consistent styling
  const DisclaimerSection = ({ title, children }) => (
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
            Disclaimer Policy
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Effective Date: <strong className="font-semibold">{effectiveDate}</strong> | Last Updated: <strong className="font-semibold">{lastUpdatedDate}</strong>
          </p>
        </header>

        {/* Introductory Paragraph */}
        <div className="mb-10 text-lg text-gray-700 dark:text-gray-300 border-l-4 border-yellow-500 pl-4 py-1 bg-yellow-50 dark:bg-gray-800/50 rounded-r-md">
          This Disclaimer (“**Disclaimer**”) applies to the use of the **{companyName}** Platform operated by **{legalEntity}** (“Company”, “we”, “our”, or “us”), available at <a href={`http://${websiteUrl}`} className="text-yellow-700 dark:text-yellow-400 hover:underline font-semibold">{websiteUrl}</a>.
          <br />
          <strong className="block mt-2">By accessing or using this Platform, you acknowledge and agree to the disclaimers, limitations, and terms stated herein.</strong>
        </div>

        {/* 1. Nature of Services */}
        <DisclaimerSection title="1. Nature of Services">
          **{companyName}** is a digital design planning and budgeting platform. We assist homeowners in visualizing, estimating, and planning their home interiors before execution.
          <p className="mt-3 font-semibold text-gray-800 dark:text-gray-100">We do not:</p>
          <ul className="space-y-2 mt-2">
            <ListItem>Undertake, manage, or supervise on-site interior execution or construction work.</ListItem>
            <ListItem>Guarantee accuracy of pricing, materials, or timelines for actual project completion.</ListItem>
            <ListItem>Act as a contractor, vendor, or agent for any third-party service provider.</ListItem>
          </ul>
          <p className="mt-3 italic">All designs, layouts, and budgets shared on {companyName} are **indicative** and for informational purposes only.</p>
        </DisclaimerSection>

        {/* 2. Accuracy of Information */}
        <DisclaimerSection title="2. Accuracy of Information">
          While we make every effort to ensure the information, renders, and pricing data provided on the Platform are accurate and up-to-date, **we make no warranties or representations regarding:**
          <ul className="space-y-2 mt-2">
            <ListItem>Completeness or accuracy of cost estimates or materials shown.</ListItem>
            <ListItem>Availability or market pricing of suggested materials or finishes.</ListItem>
            <ListItem>Accuracy of vendor, contractor, or supplier listings or their services.</ListItem>
          </ul>
          Actual costs, materials, and timelines may vary depending on market conditions, vendor availability, and user preferences.
        </DisclaimerSection>

        {/* 3. Third-Party Vendors and Recommendations */}
        <DisclaimerSection title="3. Third-Party Vendors and Recommendations">
          The Platform may suggest or connect you with third-party vendors, contractors, or service providers. These third parties are **independent entities**, and **{companyName}**:
          <ul className="space-y-2 mt-2">
            <ListItem>Does not endorse, control, or guarantee their quality, pricing, timelines, or commitments.</ListItem>
            <ListItem>Shall not be responsible for any disputes, damages, or losses arising from interactions with third parties.</ListItem>
          </ul>
          Users are **strongly advised to conduct due diligence** before engaging any vendor or contractor recommended through {companyName}.
        </DisclaimerSection>

        {/* 4. No Professional or Legal Advice */}
        <DisclaimerSection title="4. No Professional or Legal Advice">
          All content, estimates, and visuals provided through **{companyName}** are for informational and conceptual purposes only. **They do not constitute:**
          <ul className="space-y-2 mt-2">
            <ListItem>Architectural, structural, or legal advice; or</ListItem>
            <ListItem>A substitute for professional consultation with licensed experts.</ListItem>
          </ul>
          Users must verify all data, designs, and estimates independently before execution.
        </DisclaimerSection>

        {/* 5. Limitation of Liability */}
        <DisclaimerSection title="5. Limitation of Liability">
          To the maximum extent permitted by law, **{legalEntity} shall not be liable for any direct, indirect, incidental, or consequential damages** arising out of:
          <ul className="space-y-2 mt-2">
            <ListItem>Use or inability to use the Platform or Services;</ListItem>
            <ListItem>Reliance on any data, design, or cost estimate provided;</ListItem>
            <ListItem>Interaction with third-party vendors or contractors; or</ListItem>
            <ListItem>Errors, omissions, or interruptions in service.</ListItem>
          </ul>
          Your **sole remedy** in case of dissatisfaction with the Platform is to discontinue its use.
        </DisclaimerSection>

        {/* 6. Intellectual Property */}
        <DisclaimerSection title="6. Intellectual Property">
          All designs, text, graphics, and software components on the Platform are owned or licensed by **{legalEntity}**. Unauthorized use, reproduction, or redistribution of Platform content is prohibited.
        </DisclaimerSection>

        {/* 7. Platform Availability */}
        <DisclaimerSection title="7. Platform Availability">
          We strive to maintain uninterrupted service but **do not guarantee** that access to the Platform will always be available, error-free, or secure. We reserve the right to suspend, modify, or discontinue services at any time without prior notice.
        </DisclaimerSection>

        {/* 8. Changes to This Disclaimer */}
        <DisclaimerSection title="8. Changes to This Disclaimer">
          We may update this Disclaimer periodically. Updates will be reflected with a new “Last Updated” date. Your continued use of the Platform after such updates constitutes acceptance of the revised terms.
        </DisclaimerSection>

        {/* 9. Governing Law */}
        <DisclaimerSection title="9. Governing Law">
          This Disclaimer shall be governed by and construed in accordance with the **laws of India**. Courts in **Hyderabad, Telangana** shall have exclusive jurisdiction over any disputes arising in connection with this Disclaimer.
        </DisclaimerSection>

        {/* 10. Contact Information */}
        <DisclaimerSection title="10. Contact Information">
          For any questions or clarifications regarding this Disclaimer, please contact:
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
        </DisclaimerSection>

        {/* Footer Separator */}
        <hr className="my-10 border-gray-200 dark:border-gray-700" />

        {/* Contact Us Block (Reusing the SaaS footer style) */}
        <div className="text-center pb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">
                Need More Clarity?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                We are available to answer any questions regarding this Disclaimer and our services.
            </p>
            <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition duration-150 ease-in-out transform hover:scale-[1.02]"
            >
                Contact Us
            </a>
        </div>

      </div>
      <Footer/>
    </div>
  );
};

export default DisclaimerPolicyPage;