// // src\components\packges\PackegesContnet.js
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Check,
//   Star,
//   Zap,
//   Crown,
//   ArrowLeft,
//   Shield,
//   Users,
//   Loader2,
//   AlertCircle,
//   CreditCard,
//   Gift,
//   Building,
//   FolderOpen,
//   Info,
//   AlertTriangle,
//   Tag,
//   Percent,
//   IndianRupee,
//   FileText,
//   X,
//   Sparkles,
// } from "lucide-react";
// import { toast } from "sonner";
// import { packageService } from "@/services/package.service";
// import { razorpayService } from "@/services/razorpayService";
// import { projectService } from "@/services/project.service";
// import { couponService } from "@/services/coupon.service";
// import { gstService } from "@/services/gst.service";

// // GST Details Form Component (unchanged)
// const GSTDetailsForm = ({
//   onGSTDetailsChange,
//   initialData = null,
//   onClose,
// }) => {
//   const [isBusinessUser, setIsBusinessUser] = useState(
//     initialData?.isBusinessUser || false
//   );
//   const [gstNumber, setGstNumber] = useState(initialData?.gstNumber || "");
//   const [businessName, setBusinessName] = useState(
//     initialData?.businessName || ""
//   );
//   const [isValidating, setIsValidating] = useState(false);
//   const [validationStatus, setValidationStatus] = useState(null);

//   useEffect(() => {
//     if (initialData) {
//       setIsBusinessUser(initialData.isBusinessUser);
//       setGstNumber(initialData.gstNumber || "");
//       setBusinessName(initialData.businessName || "");
//     }
//   }, [initialData]);

//   const handleBusinessToggle = (checked) => {
//     setIsBusinessUser(checked);
//     if (!checked) {
//       setGstNumber("");
//       setBusinessName("");
//       setValidationStatus(null);
//     }
//   };

//   const validateGSTNumber = async () => {
//     if (!gstNumber.trim()) {
//       toast.error("Please enter GST number");
//       return;
//     }

//     if (!gstService.validateGSTFormat(gstNumber)) {
//       toast.error("Invalid GST number format");
//       setValidationStatus("INVALID");
//       return;
//     }

//     setIsValidating(true);
//     try {
//       const result = await gstService.validateGSTNumber(gstNumber);

//       if (result.success) {
//         setValidationStatus("VALID");
//         toast.success("GST number validated successfully");

//         // Auto-fill business name if available from validation
//         if (result.data.businessName && !businessName) {
//           setBusinessName(result.data.businessName);
//         }
//       } else {
//         setValidationStatus("INVALID");
//         toast.error(result.message || "GST number validation failed");
//       }
//     } catch (error) {
//       setValidationStatus("FAILED");
//       toast.error("GST validation service unavailable");
//     } finally {
//       setIsValidating(false);
//     }
//   };

//   const saveGSTDetails = async () => {
//     if (!gstNumber.trim() || !businessName.trim()) {
//       toast.error("Please fill all business details");
//       return;
//     }

//     if (validationStatus !== "VALID") {
//       toast.error("Please validate your GST number first");
//       return;
//     }

//     try {
//       const result = await gstService.saveGSTDetails({
//         gstNumber,
//         businessName,
//         isBusinessUser: true,
//       });

//       if (result.success) {
//         onGSTDetailsChange?.(result.data);
//         toast.success("GST details saved successfully");
//         onClose?.();
//       } else {
//         toast.error(result.message || "Failed to save GST details");
//       }
//     } catch (error) {
//       toast.error("Failed to save GST details");
//     }
//   };

//   const removeGSTDetails = async () => {
//     try {
//       const result = await gstService.removeGSTDetails();

//       if (result.success) {
//         onGSTDetailsChange?.(null);
//         setIsBusinessUser(false);
//         setGstNumber("");
//         setBusinessName("");
//         setValidationStatus(null);
//         toast.success("GST details removed");
//         onClose?.();
//       } else {
//         toast.error(result.message || "Failed to remove GST details");
//       }
//     } catch (error) {
//       toast.error("Failed to remove GST details");
//     }
//   };

//   const getValidationBadge = () => {
//     switch (validationStatus) {
//       case "VALID":
//         return (
//           <Badge className="bg-green-100 text-green-800 border-green-200">
//             <Check className="w-3 h-3 mr-1" /> Valid
//           </Badge>
//         );
//       case "INVALID":
//         return (
//           <Badge className="bg-red-100 text-red-800 border-red-200">
//             <X className="w-3 h-3 mr-1" /> Invalid
//           </Badge>
//         );
//       case "FAILED":
//         return (
//           <Badge className="bg-amber-100 text-amber-800 border-amber-200">
//             <AlertCircle className="w-3 h-3 mr-1" /> Validation Failed
//           </Badge>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Card className="border-slate-200">
//       <CardHeader className="pb-4">
//         <CardTitle className="text-lg flex items-center gap-2">
//           <Building className="w-5 h-5" />
//           Business Details (Optional)
//         </CardTitle>
//         <p className="text-sm text-slate-600">
//           Add GST details for business purchases and tax benefits
//         </p>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         {/* Business User Toggle */}
//         <div className="flex items-center justify-between">
//           <label
//             htmlFor="business-user"
//             className="text-sm font-medium cursor-pointer"
//           >
//             This is a business purchase
//           </label>
//           <div className="relative inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               id="business-user"
//               checked={isBusinessUser}
//               onChange={(e) => handleBusinessToggle(e.target.checked)}
//               className="sr-only"
//             />
//             <div
//               className={`w-11 h-6 rounded-full transition-colors ${
//                 isBusinessUser ? "bg-green-500" : "bg-slate-300"
//               }`}
//             >
//               <div
//                 className={`bg-white w-4 h-4 rounded-full transition-transform transform ${
//                   isBusinessUser ? "translate-x-6" : "translate-x-1"
//                 } mt-1`}
//               />
//             </div>
//           </div>
//         </div>

//         {isBusinessUser && (
//           <div className="space-y-4 border-t pt-4">
//             {/* GST Number Input */}
//             <div className="space-y-2">
//               <label htmlFor="gst-number" className="text-sm font-medium">
//                 GST Number
//               </label>
//               <div className="flex gap-2">
//                 <Input
//                   id="gst-number"
//                   placeholder="e.g., 07AABCU9603R1ZM"
//                   value={gstNumber}
//                   onChange={(e) => {
//                     setGstNumber(e.target.value.toUpperCase());
//                     setValidationStatus(null);
//                   }}
//                   className="flex-1 font-mono"
//                   maxLength={15}
//                 />
//                 <Button
//                   onClick={validateGSTNumber}
//                   disabled={!gstNumber.trim() || isValidating}
//                   variant="outline"
//                   className="whitespace-nowrap"
//                 >
//                   {isValidating ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     "Validate"
//                   )}
//                 </Button>
//               </div>
//               {getValidationBadge()}
//               <p className="text-xs text-slate-500">
//                 Format: 2-digit state code + 10-digit PAN + 1-digit entity +
//                 1-digit checksum
//               </p>
//             </div>

//             {/* Business Name */}
//             <div className="space-y-2">
//               <label htmlFor="business-name" className="text-sm font-medium">
//                 Business Name
//               </label>
//               <Input
//                 id="business-name"
//                 placeholder="Enter your registered business name"
//                 value={businessName}
//                 onChange={(e) => setBusinessName(e.target.value)}
//               />
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-2 pt-2">
//               <Button
//                 onClick={saveGSTDetails}
//                 disabled={
//                   !gstNumber || !businessName || validationStatus !== "VALID"
//                 }
//                 className="flex-1"
//               >
//                 <FileText className="w-4 h-4 mr-2" />
//                 Save Details
//               </Button>

//               {initialData && (
//                 <Button
//                   onClick={removeGSTDetails}
//                   variant="outline"
//                   className="text-red-600 border-red-200 hover:bg-red-50"
//                 >
//                   <X className="w-4 h-4 mr-2" />
//                   Remove
//                 </Button>
//               )}
//             </div>

//             {/* Benefits Info */}
//             <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//               <div className="flex items-start gap-2 text-sm text-blue-700">
//                 <IndianRupee className="w-4 h-4 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <p className="font-medium">Benefits of adding GST:</p>
//                   <ul className="mt-1 space-y-1">
//                     <li>• Input Tax Credit (ITC) available for businesses</li>
//                     <li>• Professional invoices for accounting</li>
//                     <li>• Tax-compliant documentation</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Close Button */}
//         <Button onClick={onClose} variant="outline" className="w-full mt-4">
//           Close
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };

// // Updated Order Summary Component with GST and Coupon
// const OrderSummary = ({
//   selectedPackage,
//   selectedAddons,
//   selectedProjectId,
//   userProjects,
//   packages,
//   addons,
//   onPayment,
//   isProcessing,
//   projectDetails,
//   activeTab,
//   purchasedServices,
//   gstRate,
//   couponCode,
//   setCouponCode,
//   appliedCoupon,
//   setAppliedCoupon,
//   isApplyingCoupon,
//   onApplyCoupon,
//   onRemoveCoupon,
//   pricingBreakdown,
//   is499OnlyFlow = false,
// }) => {
//   const selectedPackageDetails = packages.find(
//     (pkg) => pkg.id === selectedPackage
//   );
//   const selectedAddonDetails = addons.filter((addon) =>
//     selectedAddons.includes(addon.id)
//   );

//   const selectedProject = userProjects.find(
//     (project) => project.publicId === selectedProjectId
//   );

//   // Filter out purchased addons from selected list for display
//   const displayAddons = selectedAddonDetails.filter(
//     (addon) => !purchasedServices.addons.includes(addon.name)
//   );

//   // Get purchased addons that are currently selected (should be removed)
//   const purchasedButSelectedAddons = selectedAddonDetails.filter((addon) =>
//     purchasedServices.addons.includes(addon.name)
//   );

//   // Simple GST number state
//   const [gstNumber, setGstNumber] = useState("");

//   // GST number validation
//   const validateGSTFormat = (gst) => {
//     const gstRegex =
//       /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
//     return gstRegex.test(gst);
//   };

//   const isGSTValid = gstNumber ? validateGSTFormat(gstNumber) : true;

//   return (
//     <Card className="sticky top-8 shadow-xl border-0 bg-white">
//       <CardHeader className="pb-4 border-b">
//         <CardTitle className="text-xl font-bold text-slate-900">
//           {is499OnlyFlow
//             ? "Single Room Trial Order"
//             : activeTab === "packages"
//             ? "Package Order"
//             : "Add-ons Order"}
//         </CardTitle>
//         <p className="text-sm text-slate-600">
//           {is499OnlyFlow
//             ? "Quick design for one room - perfect for trying our service"
//             : activeTab === "packages"
//             ? "Complete interior design package with optional add-ons"
//             : "Premium add-on services to enhance your design experience"}
//         </p>
//       </CardHeader>

//       <CardContent className="space-y-4 py-4">
//         {/* Simple GST Number Field */}
//         <div className="space-y-2">
//           <label
//             htmlFor="gst-number"
//             className="text-sm font-medium text-slate-700"
//           >
//             GST Number (Optional)
//           </label>
//           <Input
//             id="gst-number"
//             placeholder="e.g., 07AABCU9603R1ZM"
//             value={gstNumber}
//             onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
//             className={`font-mono ${
//               gstNumber && !isGSTValid ? "border-red-300" : ""
//             }`}
//             maxLength={15}
//           />
//           {gstNumber && !isGSTValid && (
//             <p className="text-xs text-red-600">
//               Please enter a valid GST number format
//             </p>
//           )}
//           {gstNumber && isGSTValid && (
//             <p className="text-xs text-green-600 flex items-center gap-1">
//               <Check className="w-3 h-3" />
//               Valid GST number format
//             </p>
//           )}
//           <p className="text-xs text-slate-500">
//             Add your GST number for business purchases and tax benefits
//           </p>
//         </div>

//         {/* Coupon Code Section */}
//         {!is499OnlyFlow && (
//           <div className="space-y-3">
//             <div className="flex gap-2">
//               <Input
//                 placeholder="Enter coupon code"
//                 value={couponCode}
//                 onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
//                 disabled={!!appliedCoupon || isApplyingCoupon}
//                 className="flex-1"
//               />
//               {appliedCoupon ? (
//                 <Button
//                   onClick={onRemoveCoupon}
//                   variant="outline"
//                   disabled={isApplyingCoupon}
//                   className="whitespace-nowrap"
//                 >
//                   Remove
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={onApplyCoupon}
//                   disabled={!couponCode || isApplyingCoupon}
//                   variant="outline"
//                   className="whitespace-nowrap"
//                 >
//                   {isApplyingCoupon ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     "Apply"
//                   )}
//                 </Button>
//               )}
//             </div>

//             {appliedCoupon && (
//               <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Tag className="w-4 h-4 text-green-600" />
//                     <span className="text-sm font-medium text-green-800">
//                       {appliedCoupon.code}
//                     </span>
//                     <Badge
//                       variant="outline"
//                       className="text-green-600 border-green-300"
//                     >
//                       {appliedCoupon.discountType === "PERCENTAGE"
//                         ? `${appliedCoupon.discountValue}% OFF`
//                         : `₹${appliedCoupon.discountValue} OFF`}
//                     </Badge>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={onRemoveCoupon}
//                     className="h-6 px-2 text-green-600 hover:text-green-800"
//                   >
//                     ✕
//                   </Button>
//                 </div>
//                 {appliedCoupon.description && (
//                   <p className="text-xs text-green-700 mt-1">
//                     {appliedCoupon.description}
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Selected Package */}
//         {selectedPackageDetails && (
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="font-semibold text-slate-900">
//                 {selectedPackageDetails?.name}
//                 {purchasedServices.plan === selectedPackageDetails.name && (
//                   <Badge
//                     variant="outline"
//                     className="ml-2 text-green-600 border-green-300"
//                   >
//                     Already Purchased
//                   </Badge>
//                 )}
//               </p>
//               <p className="text-sm text-slate-500 mt-1">
//                 {selectedPackageDetails?.description}
//               </p>
//             </div>
//             <div className="text-right">
//               <div className="font-bold text-slate-900">
//                 ₹{selectedPackageDetails?.price?.toLocaleString("en-IN")}
//               </div>
//               {selectedPackageDetails?.originalPrice &&
//                 selectedPackageDetails.originalPrice >
//                   selectedPackageDetails.price && (
//                   <div className="text-slate-500 line-through text-sm">
//                     ₹
//                     {selectedPackageDetails.originalPrice.toLocaleString(
//                       "en-IN"
//                     )}
//                   </div>
//                 )}
//             </div>
//           </div>
//         )}

//         {/* Selected Addons - HIDDEN FOR 499 FLOW */}
//         {!is499OnlyFlow && displayAddons.length > 0 && (
//           <div className="space-y-2 pt-2 border-t">
//             <p className="text-sm font-medium text-slate-600">
//               {activeTab === "packages" ? "Add-ons:" : "Selected Services:"}
//             </p>
//             {displayAddons.map((addon) => (
//               <div key={addon.id} className="flex justify-between text-sm">
//                 <span className="text-slate-600">+ {addon.name}</span>
//                 <span className="text-slate-600">
//                   +₹{addon.price.toLocaleString("en-IN")}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pricing Breakdown */}
//         <div className="space-y-2 pt-3 border-t">
//           <div className="flex justify-between text-sm">
//             <span className="text-slate-600">Subtotal</span>
//             <span className="text-slate-600">
//               ₹{pricingBreakdown.subtotal.toLocaleString("en-IN")}
//             </span>
//           </div>

//           {pricingBreakdown.discountAmount > 0 && (
//             <div className="flex justify-between text-sm">
//               <span className="text-slate-600">Discount</span>
//               <span className="text-green-600">
//                 -₹{pricingBreakdown.discountAmount.toLocaleString("en-IN")}
//               </span>
//             </div>
//           )}

//           <div className="flex justify-between text-sm">
//             <span className="text-slate-600">GST ({gstRate}%)</span>
//             <span className="text-slate-600">
//               +₹{pricingBreakdown.gstAmount.toLocaleString("en-IN")}
//             </span>
//           </div>

//           <div className="flex justify-between items-center pt-2 border-t">
//             <span className="font-semibold text-lg text-slate-900">
//               Total Amount
//             </span>
//             <span className="font-bold text-xl text-slate-900">
//               ₹{pricingBreakdown.totalAmount.toLocaleString("en-IN")}
//             </span>
//           </div>
//         </div>

//         {/* Warning for purchased but selected addons - HIDDEN FOR 499 FLOW */}
//         {!is499OnlyFlow && purchasedButSelectedAddons.length > 0 && (
//           <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
//             <div className="flex items-start gap-2 text-sm text-amber-700">
//               <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
//               <div>
//                 <p className="font-medium">Already Purchased:</p>
//                 <ul className="mt-1 space-y-1">
//                   {purchasedButSelectedAddons.map((addon) => (
//                     <li key={addon.id} className="flex items-center gap-2">
//                       <span>• {addon.name}</span>
//                       <Badge
//                         variant="outline"
//                         className="text-xs text-amber-700 border-amber-300"
//                       >
//                         Already Included
//                       </Badge>
//                     </li>
//                   ))}
//                 </ul>
//                 <p className="mt-2 text-amber-600">
//                   These services are already included in your project and will
//                   be removed from your order.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Information about existing purchased services - HIDDEN FOR 499 FLOW */}
//         {!is499OnlyFlow &&
//           (purchasedServices.plan || purchasedServices.addons.length > 0) && (
//             <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//               <div className="flex items-start gap-2 text-sm text-blue-700">
//                 <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <p className="font-medium">Already in your project:</p>
//                   {purchasedServices.plan && (
//                     <p className="mt-1">• Package: {purchasedServices.plan}</p>
//                   )}
//                   {purchasedServices.addons.length > 0 && (
//                     <div className="mt-1">
//                       <p>• Add-ons: {purchasedServices.addons.join(", ")}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//         {/* Payment Button */}
//         <Button
//           onClick={() => onPayment(gstNumber)}
//           disabled={
//             isProcessing ||
//             (gstNumber && !isGSTValid) ||
//             // If in packages mode (or 499 flow), we MUST have a package selected
//             ((activeTab === "packages" || is499OnlyFlow) && !selectedPackage) ||
//             // If in addons mode, we MUST have at least one addon selected
//             (activeTab === "addons" &&
//               !is499OnlyFlow &&
//               selectedAddons.length === 0)
//           }
//           className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-md font-semibold mt-4 disabled:bg-slate-400 disabled:cursor-not-allowed"
//         >
//           {isProcessing ? (
//             <div className="flex items-center gap-2">
//               <Loader2 className="w-5 h-5 animate-spin" />
//               Processing...
//             </div>
//           ) : (
//             <div className="flex items-center gap-2">
//               {is499OnlyFlow ? "Start Single Room Trial" : "Pay"} ₹
//               {pricingBreakdown.totalAmount.toLocaleString("en-IN")}
//             </div>
//           )}
//         </Button>

//         {/* Security Features */}
//         <div className="text-center space-y-2 pt-2">
//           <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
//             <div className="flex items-center gap-1">
//               <Shield className="w-3 h-3" />
//               <span>Secure Razorpay payment</span>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default function PackagesContentPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // ✅ Detect if it's ₹499-only flow
//   const is499OnlyFlow = searchParams.get("type") === "499-only";

//   const [activeTab, setActiveTab] = useState("packages");
//   const [selectedPackage, setSelectedPackage] = useState("");
//   const [selectedAddons, setSelectedAddons] = useState([]);
//   const [selectedProjectId, setSelectedProjectId] = useState("");
//   const [userProjects, setUserProjects] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [packages, setPackages] = useState([]);
//   const [addons, setAddons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [projectsLoading, setProjectsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [projectDetails, setProjectDetails] = useState(null);

//   // ✅ Get URL parameters
//   const urlProjectId = searchParams.get("projectId");
//   const purchaseType = searchParams.get("type");
//   const pr = searchParams.get("pr");

//   // GST State
//   const [gstRate, setGstRate] = useState(18.0);
//   const [loadingGST, setLoadingGST] = useState(false);

//   // Coupon State
//   const [couponCode, setCouponCode] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

//   // Pricing State
//   const [pricingBreakdown, setPricingBreakdown] = useState({
//     subtotal: 0,
//     discountAmount: 0,
//     amountAfterDiscount: 0,
//     gstAmount: 0,
//     totalAmount: 0,
//   });

//   // Purchased services state
//   const [purchasedServices, setPurchasedServices] = useState({
//     plan: null,
//     addons: [],
//   });
//   const [loadingPurchased, setLoadingPurchased] = useState(false);

//   // GST Details State
//   const [gstDetails, setGstDetails] = useState(null);
//   const [showGSTForm, setShowGSTForm] = useState(false);

//   // ✅ Function to update URL when package is selected
//   const updateUrlWithPackageType = (packagePrice) => {
//     if (!urlProjectId) return;

//     // Map package price to type parameter
//     let typeParam = "";
//     switch (packagePrice) {
//       case 499:
//         typeParam = "499-only";
//         break;
//       case 4999:
//         typeParam = "4999";
//         break;
//       case 9999:
//         typeParam = "9999";
//         break;
//       case 14999:
//         typeParam = "14999";
//         break;
//       default:
//         // For other prices, use the price as type
//         typeParam = packagePrice.toString();
//     }

//     // Update URL without reloading the page using shallow routing[citation:6]
//     const newUrl = `/packages?type=${typeParam}&projectId=${urlProjectId}`;
//     // Use router.replace with shallow: true to prevent a full page reload[citation:6]
//     router.replace(newUrl, undefined, { shallow: true });
//   };

//   // ✅ MODIFIED: Determine which tabs to show based on context
//   const getVisibleTabs = () => {
//     // If it's 499-only flow, only show packages tab
//     if (is499OnlyFlow) {
//       return ["packages"];
//     }

//     const tabs = [];

//     // New project creation flow - only show packages
//     if (purchaseType === "new-project" || pr === "new-project") {
//       tabs.push("packages");
//     }
//     // Add-ons only purchase flow - only show addons
//     else if (purchaseType === "addons-only" || purchaseType === "addon") {
//       tabs.push("addons");
//     }
//     // If type is a number (like 4999, 9999), show packages tab
//     else if (!isNaN(parseInt(purchaseType))) {
//       tabs.push("packages");
//     }
//     // Default flow - show both tabs
//     else {
//       tabs.push("packages", "addons");
//     }

//     return tabs;
//   };

//   const visibleTabs = getVisibleTabs();

//   // ✅ MODIFIED: Auto-select appropriate tab based on context
//   useEffect(() => {
//     if (is499OnlyFlow) {
//       setActiveTab("packages");
//     } else if (purchaseType === "new-project" || pr === "new-project") {
//       setActiveTab("packages");
//     } else if (purchaseType === "addons-only" || purchaseType === "addon") {
//       setActiveTab("addons");
//       loadUserProjects();
//     } else if (urlProjectId) {
//       setActiveTab("packages");
//     }
//   }, [purchaseType, pr, urlProjectId, is499OnlyFlow]);

//   // Load user GST details
//   const loadUserGSTDetails = async () => {
//     try {
//       const result = await gstService.getUserGSTDetails();
//       if (result.success && result.data) {
//         setGstDetails(result.data);
//       }
//     } catch (error) {
//       console.error("Error loading GST details:", error);
//     }
//   };

//   const handleUrlProjectId = async (projectId) => {
//     try {
//       setLoading(true);
//       // Verify project exists and belongs to user
//       const projectResult = await projectService.getProject(projectId);
//       if (projectResult.success && projectResult.data?.project) {
//         const project = projectResult.data.project;
//         setProjectDetails({
//           projectId: project.id,
//           projectType: project.projectType,
//           city: project.city,
//           areaSqFt: project.areaSqFt,
//           title: project.title,
//         });

//         // Load purchased services (with error handling)
//         try {
//           await loadPurchasedServices(project.id);
//         } catch (purchasedError) {
//           console.warn(
//             "⚠️ Could not load purchased services, continuing anyway:",
//             purchasedError
//           );
//           // Continue even if purchased services fail to load
//         }

//         // Load packages and addons
//         await loadPackagesAndAddons();

//         toast.success(`Please select a package for: ${project.title}`);
//       } else {
//         console.error("❌ Project not found or access denied:", projectResult);
//         throw new Error("Project not found or you don't have access");
//       }
//     } catch (error) {
//       console.error("❌ Error handling URL project:", error);
//       toast.error("Project not found or access denied");
//       // Fallback to regular flow
//       loadPackagesAndAddons();
//       loadProjectDetails();
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUserGSTDetails();

//     if (urlProjectId) {
//       handleUrlProjectId(urlProjectId);
//     } else if (purchaseType === "addons-only" || purchaseType === "addon") {
//       setActiveTab("addons");
//       loadUserProjects();
//       loadPackagesAndAddons();
//     } else {
//       loadPackagesAndAddons();
//       loadProjectDetails();
//     }
//   }, [searchParams, urlProjectId, purchaseType]);

//   // Load GST settings
//   const loadGSTSettings = async () => {
//     try {
//       setLoadingGST(true);
//       const result = await packageService.getGSTSettings();
//       if (result.success && result.data?.rate) {
//         setGstRate(result.data.rate);
//       }
//     } catch (error) {
//       console.error("Error loading GST settings:", error);
//       setGstRate(18.0);
//     } finally {
//       setLoadingGST(false);
//     }
//   };

//   // Calculate pricing breakdown
//   const calculatePricing = () => {
//     let subtotal = 0;

//     if (activeTab === "packages") {
//       const selectedPackageDetails = packages.find(
//         (pkg) => pkg.id === selectedPackage
//       );

//       // For 499-only flow, only include package price
//       if (is499OnlyFlow) {
//         subtotal = selectedPackageDetails?.price || 0;
//       } else {
//         const selectedAddonDetails = addons.filter((addon) =>
//           getFilteredAddonsForPayment().includes(addon.id)
//         );

//         const packagePrice = selectedPackageDetails?.price || 0;
//         const addonsTotal = selectedAddonDetails.reduce(
//           (total, addon) => total + addon.price,
//           0
//         );
//         subtotal = packagePrice + addonsTotal;
//       }
//     } else {
//       const selectedAddonDetails = addons.filter((addon) =>
//         getFilteredAddonsForPayment().includes(addon.id)
//       );
//       subtotal = selectedAddonDetails.reduce(
//         (total, addon) => total + addon.price,
//         0
//       );
//     }

//     const breakdown = packageService.calculatePricing(
//       subtotal,
//       gstRate,
//       appliedCoupon?.discountValue || 0,
//       appliedCoupon?.discountType
//     );

//     setPricingBreakdown(breakdown);
//   };

//   // Apply coupon code
//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) return;

//     setIsApplyingCoupon(true);
//     try {
//       const subtotal = calculateSubtotal();
//       const selectedPackageDetails = packages.find(
//         (pkg) => pkg.id === selectedPackage
//       );

//       const result = await couponService.validateCoupon(
//         couponCode,
//         subtotal,
//         selectedPackageDetails?.id,
//         getFilteredAddonsForPayment()
//       );

//       if (result.success) {
//         setAppliedCoupon(result.data.coupon);
//         toast.success("Coupon applied successfully!");
//         calculatePricing();
//       } else {
//         toast.error(result.message || "Invalid coupon code");
//       }
//     } catch (error) {
//       console.error("Error applying coupon:", error);
//       toast.error("Failed to apply coupon");
//     } finally {
//       setIsApplyingCoupon(false);
//     }
//   };

//   // Remove coupon
//   const handleRemoveCoupon = () => {
//     setAppliedCoupon(null);
//     setCouponCode("");
//     calculatePricing();
//     toast.info("Coupon removed");
//   };

//   // Calculate subtotal for coupon validation
//   const calculateSubtotal = () => {
//     let subtotal = 0;

//     if (activeTab === "packages") {
//       const selectedPackageDetails = packages.find(
//         (pkg) => pkg.id === selectedPackage
//       );

//       if (is499OnlyFlow) {
//         subtotal = selectedPackageDetails?.price || 0;
//       } else {
//         const selectedAddonDetails = addons.filter((addon) =>
//           getFilteredAddonsForPayment().includes(addon.id)
//         );

//         const packagePrice = selectedPackageDetails?.price || 0;
//         const addonsTotal = selectedAddonDetails.reduce(
//           (total, addon) => total + addon.price,
//           0
//         );
//         subtotal = packagePrice + addonsTotal;
//       }
//     } else {
//       const selectedAddonDetails = addons.filter((addon) =>
//         getFilteredAddonsForPayment().includes(addon.id)
//       );
//       subtotal = selectedAddonDetails.reduce(
//         (total, addon) => total + addon.price,
//         0
//       );
//     }

//     return subtotal;
//   };

//   // Update pricing when dependencies change
//   useEffect(() => {
//     calculatePricing();
//   }, [
//     selectedPackage,
//     selectedAddons,
//     activeTab,
//     gstRate,
//     appliedCoupon,
//     packages,
//     addons,
//     is499OnlyFlow,
//   ]);

//   // Load GST settings on component mount
//   useEffect(() => {
//     loadGSTSettings();
//   }, []);

//   // Load purchased services for a specific project
//   const loadPurchasedServices = async (projectId) => {
//     try {
//       setLoadingPurchased(true);
//       const projectResponse = await projectService.getProject(projectId);
//       if (projectResponse.success && projectResponse.data?.project) {
//         const projectData = projectResponse.data.project;

//         // ✅ Use the correct property names from your response
//         const purchasedPlan = projectData.selectedPlan;
//         const purchasedAddons = projectData.selectedAddons || [];
//         setPurchasedServices({
//           plan: purchasedPlan,
//           addons: purchasedAddons,
//         });

//         // Show notification about existing services
//         if (purchasedPlan || purchasedAddons.length > 0) {
//           const existingServices = [];
//           if (purchasedPlan) {
//             existingServices.push(`package: ${purchasedPlan}`);
//           }
//           if (purchasedAddons.length > 0) {
//             existingServices.push(`${purchasedAddons.length} addon(s)`);
//           }

//           toast.info("Existing services found", {
//             description: `Your project already has: ${existingServices.join(
//               " and "
//             )}`,
//             duration: 5000,
//           });
//         }
//       } else {
//         console.warn("⚠️ No project data found for purchased services");
//         // Reset if no project data
//         setPurchasedServices({
//           plan: null,
//           addons: [],
//         });
//       }
//     } catch (error) {
//       console.error("❌ Error loading purchased services:", error);
//       // Don't show error toast for new projects (they won't have purchased services)
//       if (!projectId.includes("new")) {
//         toast.error("Failed to load project services");
//       }
//       setPurchasedServices({
//         plan: null,
//         addons: [],
//       });
//     } finally {
//       setLoadingPurchased(false);
//     }
//   };

//   // Load user projects
//   const loadUserProjects = async () => {
//     try {
//       setProjectsLoading(true);
//       const result = await projectService.getUserProjects();

//       if (result.success) {
//         const projects = result.data?.projects || [];
//         setUserProjects(projects);

//         if (projects.length > 0) {
//           setSelectedProjectId(projects[0].publicId);
//         } else {
//           toast.error("No projects found", {
//             description: "Please create a project first to purchase add-ons",
//             action: {
//               label: "Create Project",
//               onClick: () => router.push("/dashboard/projects/new"),
//             },
//           });
//         }
//       } else {
//         throw new Error(result.message || "Failed to load projects");
//       }
//     } catch (error) {
//       console.error("Error loading user projects:", error);
//       toast.error("Failed to load your projects");
//     } finally {
//       setProjectsLoading(false);
//     }
//   };

//   // Load purchased services when project changes
//   useEffect(() => {
//     if (activeTab === "addons" && selectedProjectId) {
//       loadPurchasedServices(selectedProjectId);
//     } else if (activeTab === "packages" && projectDetails?.projectId) {
//       loadPurchasedServices(projectDetails.projectId);
//     }
//   }, [selectedProjectId, activeTab, projectDetails]);

//   // ✅ MODIFIED: Load packages and filter for 499-only flow
//   const loadPackagesAndAddons = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // ✅ FIX: For 499-only flow, include single room packages
//       const includeSingleRoom = is499OnlyFlow;
//       const [packagesResponse, addonsResponse] = await Promise.all([
//         packageService.getPackages(true, includeSingleRoom),
//         packageService.getAddons(true),
//       ]);

//       if (packagesResponse.success) {
//         let packagesData = packagesResponse.data.packages || [];
//         // ✅ FIX: For 499-only flow, filter to only show single room packages
//         if (is499OnlyFlow) {
//           packagesData = packagesData.filter((pkg) => {
//             const name = pkg.name.toLowerCase();
//             const isSingleRoom =
//               name.includes("single room") || name.includes("room trial");
//             const is499Price = pkg.price === 499;
//             return isSingleRoom || is499Price;
//           });
//           if (packagesData.length === 0) {
//             console.error("❌ No single room packages found in API response");
//             toast.error("Single Room Trial package is currently unavailable");
//             // Don't fallback to all packages for 499 flow - show error instead
//             throw new Error("Single Room Trial package not available");
//           }
//         }

//         setPackages(packagesData);

//         // NEW CRITICAL LOGIC: Update URL based on auto-selected package
//         const updateUrlBasedOnAutoSelectedPackage = (selectedPackageId) => {
//           const selectedPkg = packagesData.find(
//             (p) => p.id === selectedPackageId
//           );
//           if (selectedPkg && selectedPkg.price && urlProjectId) {
//             updateUrlWithPackageType(selectedPkg.price);
//           }
//         };

//         // Auto-select logic
//         let autoSelectedPackageId = null;

//         if (is499OnlyFlow && packagesData.length > 0) {
//           // Auto-select the single room package
//           const singleRoomPlan = packagesData.find(
//             (pkg) =>
//               pkg.name.toLowerCase().includes("single room") ||
//               pkg.name.toLowerCase().includes("room trial") ||
//               pkg.price === 499
//           );
//           if (singleRoomPlan) {
//             autoSelectedPackageId = singleRoomPlan.id;
//           } else {
//             // Fallback to first available package
//             autoSelectedPackageId = packagesData[0].id;
//           }
//         } else {
//           // ✅ Check if URL has a type parameter that's a number (like 4999, 9999)
//           if (!isNaN(parseInt(purchaseType))) {
//             const numericType = parseInt(purchaseType);
//             const matchingPackage = packagesData.find(
//               (pkg) => pkg.price === numericType
//             );
//             if (matchingPackage) {
//               autoSelectedPackageId = matchingPackage.id;
//             } else {
//               // Fallback to premium or popular package
//               const premiumPlan = packagesData.find(
//                 (pkg) =>
//                   pkg.name.toLowerCase().includes("premium") || pkg.isPopular
//               );
//               if (premiumPlan) {
//                 autoSelectedPackageId = premiumPlan.id;
//               } else if (packagesData.length > 0) {
//                 autoSelectedPackageId = packagesData[0].id;
//               }
//             }
//           } else {
//             // Original auto-select logic
//             const premiumPlan = packagesData.find(
//               (pkg) =>
//                 pkg.name.toLowerCase().includes("premium") || pkg.isPopular
//             );
//             if (premiumPlan) {
//               autoSelectedPackageId = premiumPlan.id;
//             } else if (packagesData.length > 0) {
//               autoSelectedPackageId = packagesData[0].id;
//             }
//           }
//         }

//         if (autoSelectedPackageId) {
//           setSelectedPackage(autoSelectedPackageId);
//           // CRITICAL: Update the URL immediately after setting the state
//           // Use a small timeout to ensure state is updated before URL change
//           setTimeout(() => {
//             updateUrlBasedOnAutoSelectedPackage(autoSelectedPackageId);
//           }, 0);
//         }
//       } else {
//         throw new Error(packagesResponse.message || "Failed to load packages");
//       }

//       if (addonsResponse.success) {
//         const uniqueAddons = Array.from(
//           new Map(
//             (addonsResponse.data.addons || []).map((addon) => [addon.id, addon])
//           ).values()
//         );
//         setAddons(uniqueAddons);
//       } else {
//         console.warn("Failed to load addons:", addonsResponse.message);
//         setAddons([]);
//       }
//     } catch (error) {
//       console.error("Error loading packages:", error);
//       setError(error.message);
//       toast.error(error.message || "Failed to load packages");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadProjectDetails = () => {
//     const paymentData = localStorage.getItem("projectPaymentData");
//     if (paymentData) {
//       try {
//         const data = JSON.parse(paymentData);
//         setProjectDetails({
//           projectType: data.projectType,
//           city: data.city,
//           areaSqFt: data.areaSqFt,
//           projectId: data.projectId,
//           title: data.title || "Current Project",
//         });

//         if (data.projectId) {
//           loadPurchasedServices(data.projectId);
//         }
//       } catch (error) {
//         console.error("Error parsing project details:", error);
//       }
//     }
//   };

//   // Enhanced addon toggle
//   const handleAddonToggle = (addonId) => {
//     // ✅ DISABLE ADDONS FOR 499 FLOW
//     if (is499OnlyFlow) return;

//     const addon = addons.find((a) => a.id === addonId);

//     if (!addon) return;

//     if (purchasedServices.addons.includes(addon.name)) {
//       toast.error(`Already Purchased`, {
//         description: `"${addon.name}" is already included in your project and cannot be purchased again.`,
//         duration: 4000,
//         icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
//       });
//       return;
//     }

//     if (selectedAddons.includes(addonId)) {
//       setSelectedAddons((prev) => prev.filter((id) => id !== addonId));
//       toast.info("Add-on removed", {
//         description: `"${addon.name}" removed from selection`,
//         duration: 2000,
//       });
//     } else {
//       setSelectedAddons((prev) => [...prev, addonId]);
//       toast.success("Add-on added", {
//         description: `"${addon.name}" added to your selection`,
//         duration: 2000,
//       });
//     }
//   };

//   // ✅ MODIFIED: Enhanced package selection - updates URL when package is selected
//   const handlePackageSelect = (pkg) => {
//     if (purchasedServices.plan === pkg.name) {
//       toast.error(`Already Purchased`, {
//         description: `You already have the "${pkg.name}" package for this project. Please select a different package.`,
//         duration: 4000,
//         icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
//       });
//       return;
//     }

//     setSelectedPackage(pkg.id);

//     // ✅ Update URL with the package price as type parameter
//     if (pkg.price) {
//       updateUrlWithPackageType(pkg.price);
//     }

//     toast.success("Package selected", {
//       description: `"${pkg.name}" selected`,
//       duration: 2000,
//     });
//   };

//   // Filter out purchased addons before payment
//   const getFilteredAddonsForPayment = () => {
//     // ✅ NO ADDONS FOR 499 FLOW
//     if (is499OnlyFlow) return [];

//     return selectedAddons.filter((addonId) => {
//       const addon = addons.find((a) => a.id === addonId);
//       return !purchasedServices.addons.includes(addon?.name);
//     });
//   };

//   // Auto-remove purchased addons from selection
//   useEffect(() => {
//     if (is499OnlyFlow) {
//       // Clear any selected addons for 499 flow
//       setSelectedAddons([]);
//       return;
//     }

//     if (purchasedServices.addons.length > 0 && selectedAddons.length > 0) {
//       const filteredAddons = selectedAddons.filter((addonId) => {
//         const addon = addons.find((a) => a.id === addonId);
//         return !purchasedServices.addons.includes(addon?.name);
//       });

//       if (filteredAddons.length !== selectedAddons.length) {
//         setSelectedAddons(filteredAddons);
//         const removedCount = selectedAddons.length - filteredAddons.length;
//         if (removedCount > 0) {
//           toast.info("Auto-removed purchased services", {
//             description: `${removedCount} already purchased service(s) were removed from your selection.`,
//             duration: 4000,
//           });
//         }
//       }
//     }
//   }, [purchasedServices.addons, addons, is499OnlyFlow]);

//   const handlePayment = async (gstNumber = "") => {
//     setIsProcessing(true);

//     try {
//       let packageData = {};
//       let addonsData = [];
//       let receiptPrefix = "rcpt";
//       let description = "";

//       let projectIdForPayment =
//         urlProjectId || projectDetails?.projectId || selectedProjectId;

//       if (!projectIdForPayment) {
//         throw new Error("Project ID not found. Please start over.");
//       }

//       // ✅ FOR 499 FLOW: No addons allowed
//       const payableAddons = is499OnlyFlow ? [] : getFilteredAddonsForPayment();

//       // Final validation before payment
//       if (activeTab === "packages") {
//         const selectedPackageDetails = packages.find(
//           (pkg) => pkg.id === selectedPackage
//         );

//         if (!selectedPackageDetails) {
//           throw new Error("Please select a package");
//         }

//         if (purchasedServices.plan === selectedPackageDetails.name) {
//           throw new Error(
//             `You already have the "${selectedPackageDetails.name}" package for this project. Please select a different package.`
//           );
//         }

//         const selectedAddonDetails = addons.filter((addon) =>
//           payableAddons.includes(addon.id)
//         );

//         // Prepare package data
//         packageData = {
//           planId: selectedPackageDetails.id,
//           plan: selectedPackageDetails.name,
//           price: selectedPackageDetails.price,
//           originalPrice: selectedPackageDetails.originalPrice,
//           totalAmount: pricingBreakdown.totalAmount,
//         };

//         // Prepare addons data - empty for 499 flow
//         addonsData = is499OnlyFlow
//           ? []
//           : selectedAddonDetails.map((addon) => ({
//               id: addon.id,
//               name: addon.name,
//               price: addon.price,
//             }));

//         receiptPrefix = is499OnlyFlow ? "single_room" : "pkg";
//         description = is499OnlyFlow
//           ? `Payment for Single Room Trial`
//           : `Payment for ${selectedPackageDetails.name} Package`;

//         // Store selection data
//         const selectionData = {
//           type: is499OnlyFlow ? "SINGLE_ROOM" : "PACKAGE",
//           plan: selectedPackageDetails.name,
//           planId: selectedPackageDetails.id,
//           price: selectedPackageDetails.price,
//           originalPrice: selectedPackageDetails.originalPrice,
//           features: selectedPackageDetails.features,
//           addons: addonsData,
//           addonsTotal: selectedAddonDetails.reduce(
//             (total, addon) => total + addon.price,
//             0
//           ),
//           totalAmount: pricingBreakdown.totalAmount,
//           gstAmount: pricingBreakdown.gstAmount,
//           discountAmount: pricingBreakdown.discountAmount,
//           couponCode: appliedCoupon?.code,
//           gstNumber: gstNumber,
//           timestamp: new Date().toISOString(),
//           projectDetails: projectDetails,
//           projectId: projectIdForPayment,
//           isSingleRoomPlan: is499OnlyFlow,
//         };

//         localStorage.setItem("packageSelection", JSON.stringify(selectionData));
//       } else {
//         // Addons-only purchase flow - NOT ALLOWED FOR 499 FLOW
//         if (is499OnlyFlow) {
//           throw new Error("Add-ons are not available for Single Room Trial");
//         }

//         const selectedAddonDetails = addons.filter((addon) =>
//           payableAddons.includes(addon.id)
//         );

//         if (selectedAddonDetails.length === 0) {
//           throw new Error(
//             "Please select at least one add-on that is not already purchased"
//           );
//         }

//         if (!selectedProjectId) {
//           throw new Error("Please select a project for your add-ons");
//         }

//         // Prepare addons data
//         addonsData = selectedAddonDetails.map((addon) => ({
//           id: addon.id,
//           name: addon.name,
//           price: addon.price,
//         }));

//         receiptPrefix = "addon";
//         description = `Payment for ${addonsData.length} add-on${
//           addonsData.length > 1 ? "s" : ""
//         }`;

//         // Store selection data
//         const selectionData = {
//           type: "ADDON",
//           addons: addonsData,
//           totalAmount: pricingBreakdown.totalAmount,
//           gstAmount: pricingBreakdown.gstAmount,
//           discountAmount: pricingBreakdown.discountAmount,
//           couponCode: appliedCoupon?.code,
//           gstNumber: gstNumber,
//           projectId: selectedProjectId,
//           timestamp: new Date().toISOString(),
//         };

//         localStorage.setItem(
//           "addonPurchaseData",
//           JSON.stringify(selectionData)
//         );
//       }

//       // Final validation before payment
//       const finalPayableAddons = addonsData.map((addon) => addon.name);
//       const alreadyOwnedAddons = purchasedServices.addons.filter((addon) =>
//         finalPayableAddons.includes(addon)
//       );

//       if (alreadyOwnedAddons.length > 0) {
//         throw new Error(
//           `The following services are already in your project: ${alreadyOwnedAddons.join(
//             ", "
//           )}. Please remove them and try again.`
//         );
//       }

//       // Validate GST format if provided
//       if (gstNumber && !validateGSTFormat(gstNumber)) {
//         throw new Error("Please enter a valid GST number format");
//       }

//       // Load Razorpay script
//       const scriptLoaded = await loadRazorpayScript();
//       if (!scriptLoaded) {
//         throw new Error(
//           "Razorpay SDK failed to load. Please check your internet connection."
//         );
//       }

//       // Generate receipt
//       const timestamp = Date.now().toString().slice(-8);
//       const receipt = `${receiptPrefix}_${timestamp}`;

//       // Create order on backend with GST and coupon data
//       const orderResponse = await razorpayService.createOrder(
//         pricingBreakdown.totalAmount,
//         receipt,
//         "INR",
//         projectIdForPayment,
//         packageData,
//         addonsData,
//         appliedCoupon?.code,
//         pricingBreakdown.gstAmount,
//         pricingBreakdown.discountAmount,
//         gstNumber
//       );

//       if (!orderResponse.success) {
//         throw new Error(
//           orderResponse.error || "Failed to create payment order"
//         );
//       }

//       // Get user profile data
//       const userProfile = JSON.parse(
//         localStorage.getItem("userProfile") || "{}"
//       );

//       // Razorpay options
//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: orderResponse.order.amount,
//         currency: orderResponse.order.currency,
//         name: "Houspire",
//         description: description,
//         image: "/logo.png",
//         order_id: orderResponse.order.id,
//         handler: async function (response) {
//           try {
//             const verificationResult = await razorpayService.verifyPayment({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               projectId: projectIdForPayment,
//               packageData: packageData,
//               addonsData: addonsData,
//               purchaseType: activeTab,
//               couponCode: appliedCoupon?.code,
//               gstAmount: pricingBreakdown.gstAmount,
//               couponDiscount: pricingBreakdown.discountAmount,
//               gstNumber: gstNumber,
//               isSingleRoomPlan: is499OnlyFlow,
//             });

//             if (verificationResult.success) {
//               if (activeTab === "packages") {
//                 await packageService.processPayment(projectIdForPayment, {
//                   selectedPlan: packageData.plan,
//                   selectedAddons: addonsData.map((addon) => addon.name),
//                   paymentStatus: "COMPLETED",
//                   status: "PAYMENT_COMPLETED",
//                   paymentId: response.razorpay_payment_id,
//                   amount: pricingBreakdown.totalAmount,
//                   gstAmount: pricingBreakdown.gstAmount,
//                   couponDiscount: pricingBreakdown.discountAmount,
//                   couponCode: appliedCoupon?.code,
//                   gstNumber: gstNumber,
//                   isSingleRoomPlan: is499OnlyFlow,
//                 });
//               }

//               // AUTO-START PROGRESS FOR SINGLE ROOM PLANS
//               if (is499OnlyFlow) {
//                 try {
//                   await projectService.initializeProjectProgress(projectIdForPayment);
//                 } catch (error) {
//                   console.error("Progress initialization failed:", error);
//                   // Continue anyway - progress can be started manually
//                 }
//               }

//               if (gstNumber) {
//                 try {
//                   await gstService.saveGSTDetails({
//                     gstNumber,
//                     isBusinessUser: true,
//                   });
//                 } catch (error) {
//                   console.log(
//                     "Could not save GST to profile, but payment successful"
//                   );
//                 }
//               }

//               // Update project phase after payment completion
//               await projectService.updateProjectPhase(projectIdForPayment, {
//                 completedPhase: "PAYMENT",
//                 currentPhase: "DESIGN_QUESTIONNAIRE",
//               });

//               // Store payment data
//               const paymentData = {
//                 type: activeTab,
//                 amount: pricingBreakdown.totalAmount,
//                 gstAmount: pricingBreakdown.gstAmount,
//                 discountAmount: pricingBreakdown.discountAmount,
//                 couponCode: appliedCoupon?.code,
//                 gstNumber: gstNumber,
//                 customer: {
//                   name: userProfile?.name || "Customer",
//                   email: userProfile?.email || "customer@example.com",
//                 },
//                 timestamp: new Date().toISOString(),
//                 paymentId: response.razorpay_payment_id,
//                 orderId: response.razorpay_order_id,
//                 projectId: projectIdForPayment,
//                 isSingleRoomPlan: is499OnlyFlow,
//                 ...(activeTab === "packages" && {
//                   plan: packageData.plan,
//                   originalPrice: packageData.originalPrice,
//                   addons: addonsData,
//                 }),
//                 ...(activeTab === "addons" && {
//                   addons: addonsData,
//                 }),
//               };

//               localStorage.setItem("paymentData", JSON.stringify(paymentData));
//               localStorage.setItem("paymentCompleted", "true");

//               // Clear temporary data
//               localStorage.removeItem("projectPaymentData");
//               localStorage.removeItem("packageSelection");
//               localStorage.removeItem("addonPurchaseData");

//               toast.success("Payment Successful!", {
//                 description: is499OnlyFlow
//                   ? "Your Single Room Trial has been activated!"
//                   : activeTab === "packages"
//                   ? "Your interior planning package has been activated."
//                   : "Your add-ons have been activated successfully.",
//               });

//               // Redirect to success page
//               setTimeout(() => {
//                 router.push(
//                   `/payment/success?payment_id=${
//                     response.razorpay_payment_id
//                   }&order_id=${response.razorpay_order_id}&amount=${
//                     pricingBreakdown.totalAmount
//                   }&type=${activeTab}&projectId=${projectIdForPayment}${
//                     is499OnlyFlow ? "&singleRoom=true" : ""
//                   }`
//                 );
//               }, 1500);
//             } else {
//               toast.error("Payment Verification Failed", {
//                 description: "Please contact support with your payment ID.",
//               });
//             }
//           } catch (error) {
//             console.error("Payment verification error:", error);
//             toast.error("Payment Processing Error", {
//               description: "Please contact support.",
//             });
//           }
//         },
//         prefill: {
//           name: userProfile?.name || "Customer Name",
//           email: userProfile?.email || "customer@example.com",
//           contact: userProfile?.phone || "9999999999",
//         },
//         notes: {
//           purchaseType: activeTab,
//           ...(activeTab === "packages" && { package: packageData?.plan }),
//           ...(activeTab === "addons" && {
//             addons: addonsData.map((a) => a.name).join(", "),
//           }),
//           ...(appliedCoupon && { coupon: appliedCoupon.code }),
//           gstAmount: pricingBreakdown.gstAmount,
//           discountAmount: pricingBreakdown.discountAmount,
//           ...(gstNumber && { gstNumber: gstNumber }),
//           ...(is499OnlyFlow && { singleRoomTrial: true }),
//         },
//         theme: {
//           color: "#3399cc",
//         },
//         modal: {
//           ondismiss: function () {
//             setIsProcessing(false);
//             toast.info("Payment cancelled");
//           },
//         },
//       };

//       const razorpayInstance = new window.Razorpay(options);
//       razorpayInstance.open();
//     } catch (error) {
//       console.error("Payment error:", error);
//       toast.error("Payment Failed", {
//         description: error.message || "Please try again.",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Add GST validation function
//   const validateGSTFormat = (gst) => {
//     const gstRegex =
//       /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
//     return gstRegex.test(gst);
//   };

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       if (window.Razorpay) {
//         resolve(true);
//         return;
//       }

//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const getSavings = (pkg) => {
//     if (!pkg.originalPrice || pkg.originalPrice <= pkg.price) return 0;
//     return pkg.originalPrice - pkg.price;
//   };

//   const getPackageIcon = (pkg) => {
//     if (
//       pkg.name.toLowerCase().includes("single room") ||
//       pkg.name.toLowerCase().includes("room trial")
//     )
//       return Sparkles;
//     if (pkg.name.toLowerCase().includes("essential")) return Zap;
//     if (pkg.name.toLowerCase().includes("premium")) return Star;
//     if (pkg.name.toLowerCase().includes("luxury")) return Crown;
//     return Zap;
//   };

//   const getPackageColor = (pkg) => {
//     if (
//       pkg.name.toLowerCase().includes("single room") ||
//       pkg.name.toLowerCase().includes("room trial")
//     )
//       return "from-blue-400 to-purple-500";
//     if (pkg.name.toLowerCase().includes("essential"))
//       return "from-blue-500 to-cyan-500";
//     if (pkg.name.toLowerCase().includes("premium"))
//       return "from-purple-500 to-pink-500";
//     if (pkg.name.toLowerCase().includes("luxury"))
//       return "from-amber-500 to-orange-500";
//     return "from-blue-500 to-cyan-500";
//   };

//   if (loading && !(activeTab === "addons" && projectsLoading)) {
//     return (
//       <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400 mb-4" />
//               <p className="text-slate-600">
//                 {activeTab === "addons"
//                   ? "Loading your projects..."
//                   : "Loading packages..."}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <Card className="border-red-200 bg-red-50">
//             <CardContent className="p-6 text-center">
//               <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-red-900 mb-2">
//                 Failed to Load Packages
//               </h3>
//               <p className="text-red-700 mb-4">{error}</p>
//               <Button onClick={loadPackagesAndAddons} variant="outline">
//                 Try Again
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <Button
//             variant="ghost"
//             onClick={() => {
//               if (is499OnlyFlow) {
//                 // Redirect to landing page and scroll to pricing section
//                 router.push("/#pricing");
//               } else {
//                 router.back();
//               }
//             }}
//             className="mb-6 text-slate-600 hover:text-slate-900"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             {is499OnlyFlow ? "Back to Pricing" : "Back to Dashboard"}
//           </Button>

//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-slate-900 mb-4">
//               {is499OnlyFlow
//                 ? "Single Room Trial - ₹499"
//                 : activeTab === "packages"
//                 ? "Choose Your Interior Planning Package"
//                 : "Premium Add-on Services"}
//             </h1>
//             <p className="text-lg text-slate-600 mb-4">
//               {is499OnlyFlow
//                 ? "Quick design for one room - perfect for trying our service • GST 18% applicable"
//                 : activeTab === "packages"
//                 ? ` • All plans include planning-only services • GST ${gstRate}% applicable`
//                 : "Enhance your design experience with our premium services"}
//             </p>

//             {/* Existing services banner - HIDDEN FOR 499 FLOW */}
//             {!is499OnlyFlow &&
//               (purchasedServices.plan ||
//                 purchasedServices.addons.length > 0) && (
//                 <div className="max-w-2xl mx-auto mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                     <div className="text-left">
//                       <p className="font-semibold text-blue-900">
//                         Project Status
//                       </p>
//                       <p className="text-sm text-blue-700">
//                         {purchasedServices.plan &&
//                           `Current package: ${purchasedServices.plan}`}
//                         {purchasedServices.plan &&
//                           purchasedServices.addons.length > 0 &&
//                           " • "}
//                         {purchasedServices.addons.length > 0 &&
//                           `${purchasedServices.addons.length} add-on(s) purchased`}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//           </div>
//         </div>

//         {/* Tabs for Packages vs Addons - HIDDEN FOR 499 FLOW */}
//         {!is499OnlyFlow && (
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
//             <TabsList className="grid w-full grid-cols-2">
//               {visibleTabs.includes("packages") && (
//                 <TabsTrigger value="packages">Packages</TabsTrigger>
//               )}
//               {visibleTabs.includes("addons") && (
//                 <TabsTrigger value="addons">Add-ons</TabsTrigger>
//               )}
//             </TabsList>

//             {/* Packages Tab */}
//             {visibleTabs.includes("packages") && (
//               <TabsContent value="packages" className="mt-6">
//                 {packages.length === 0 ? (
//                   <Card className="text-center py-12">
//                     <CardContent>
//                       <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                       <h3 className="text-xl font-semibold text-slate-900 mb-2">
//                         No Packages Available
//                       </h3>
//                       <p className="text-slate-600">
//                         Please check back later for available packages.
//                       </p>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//                     {/* Left Column - Packages & Addons */}
//                     <div className="lg:col-span-3 space-y-8">
//                       {/* Packages Section */}
//                       <div>
//                         <h2 className="text-2xl font-bold text-slate-900 mb-6">
//                           Select Your Plan
//                           {purchasedServices.plan && (
//                             <Badge
//                               variant="secondary"
//                               className="ml-2 bg-green-100 text-green-800"
//                             >
//                               Current: {purchasedServices.plan}
//                             </Badge>
//                           )}
//                         </h2>
//                         <div className="space-y-4">
//                           {packages.map((pkg) => {
//                             const isSelected = selectedPackage === pkg.id;
//                             const isPurchased =
//                               purchasedServices.plan === pkg.name;
//                             const savings = getSavings(pkg);
//                             const Icon = getPackageIcon(pkg);
//                             const colorClass = getPackageColor(pkg);

//                             return (
//                               <Card
//                                 key={pkg.id}
//                                 className={`relative transition-all duration-300 ${
//                                   isSelected
//                                     ? "ring-2 ring-purple-500 shadow-lg border-purple-200"
//                                     : isPurchased
//                                     ? "ring-2 ring-green-500 shadow-lg border-green-200 bg-green-50"
//                                     : "hover:shadow-md border-slate-200"
//                                 } ${
//                                   isPurchased
//                                     ? "cursor-not-allowed"
//                                     : "cursor-pointer"
//                                 }`}
//                                 onClick={() =>
//                                   !isPurchased && handlePackageSelect(pkg)
//                                 }
//                               >
//                                 {pkg.isPopular && (
//                                   <Badge className="absolute -top-3 left-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//                                     Most Popular
//                                   </Badge>
//                                 )}

//                                 {isPurchased && (
//                                   <Badge className="absolute -top-3 right-6 bg-green-500 text-white">
//                                     <Check className="w-3 h-3 mr-1" />
//                                     Purchased
//                                   </Badge>
//                                 )}

//                                 <CardContent className="p-6">
//                                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//                                     {/* Package Info */}
//                                     <div className="flex-1">
//                                       <div className="flex items-center gap-4 mb-3">
//                                         <div
//                                           className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center ${
//                                             isPurchased ? "opacity-50" : ""
//                                           }`}
//                                         >
//                                           <Icon className="w-6 h-6 text-white" />
//                                         </div>
//                                         <div>
//                                           <h3
//                                             className={`text-xl font-bold ${
//                                               isPurchased
//                                                 ? "text-green-700"
//                                                 : "text-slate-900"
//                                             }`}
//                                           >
//                                             {pkg.name}
//                                             {isPurchased && (
//                                               <Check className="w-5 h-5 text-green-500 inline ml-2" />
//                                             )}
//                                           </h3>
//                                           <p className="text-slate-600 text-sm mt-1">
//                                             {pkg.description}
//                                           </p>
//                                         </div>
//                                       </div>

//                                       <ul className="space-y-2 text-sm text-slate-700 ml-16">
//                                         {pkg.features?.map((feature, index) => (
//                                           <li
//                                             key={index}
//                                             className="flex items-start gap-2"
//                                           >
//                                             <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                             <span>{feature}</span>
//                                           </li>
//                                         ))}
//                                       </ul>
//                                     </div>

//                                     {/* Price & Select Button */}
//                                     <div className="text-center md:text-right">
//                                       <div className="mb-4">
//                                         <div className="text-2xl font-bold text-slate-900">
//                                           ₹{pkg.price?.toLocaleString("en-IN")}
//                                         </div>
//                                         {pkg.originalPrice &&
//                                           pkg.originalPrice > pkg.price && (
//                                             <>
//                                               <div className="text-slate-500 line-through text-sm">
//                                                 ₹
//                                                 {pkg.originalPrice.toLocaleString(
//                                                   "en-IN"
//                                                 )}
//                                               </div>
//                                               <div className="text-green-600 font-medium text-sm mt-1">
//                                                 Save ₹
//                                                 {savings.toLocaleString(
//                                                   "en-IN"
//                                                 )}
//                                               </div>
//                                             </>
//                                           )}
//                                       </div>
//                                       <Button
//                                         className={`${
//                                           isSelected
//                                             ? "bg-slate-900 hover:bg-slate-800 text-white"
//                                             : isPurchased
//                                             ? "bg-green-100 text-green-700 border-green-200 cursor-not-allowed"
//                                             : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
//                                         }`}
//                                         disabled={isPurchased}
//                                       >
//                                         {isPurchased ? (
//                                           <>
//                                             <Check className="w-4 h-4 mr-2" />
//                                             Purchased
//                                           </>
//                                         ) : isSelected ? (
//                                           "Selected"
//                                         ) : (
//                                           "Select Plan"
//                                         )}
//                                       </Button>
//                                     </div>
//                                   </div>
//                                 </CardContent>
//                               </Card>
//                             );
//                           })}
//                         </div>
//                       </div>

//                       {/* Addons Section for Packages */}
//                       {addons.length > 0 && (
//                         <div>
//                           <h2 className="text-2xl font-bold text-slate-900 mb-6">
//                             Enhance Your Package (Optional Add-ons)
//                             {purchasedServices.addons.length > 0 && (
//                               <Badge
//                                 variant="secondary"
//                                 className="ml-2 bg-green-100 text-green-800"
//                               >
//                                 {purchasedServices.addons.length} purchased
//                               </Badge>
//                             )}
//                           </h2>
//                           <Card className="border-slate-200">
//                             <CardContent className="p-6">
//                               {loadingPurchased ? (
//                                 <div className="flex items-center justify-center py-8">
//                                   <Loader2 className="w-6 h-6 animate-spin text-slate-400 mr-2" />
//                                   <span className="text-slate-600">
//                                     Checking purchased services...
//                                   </span>
//                                 </div>
//                               ) : (
//                                 <>
//                                   <div className="space-y-3">
//                                     {addons.map((addon) => {
//                                       const isSelected =
//                                         selectedAddons.includes(addon.id);
//                                       const isPurchased =
//                                         purchasedServices.addons.includes(
//                                           addon.name
//                                         );

//                                       return (
//                                         <div
//                                           key={addon.id}
//                                           className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
//                                             isSelected
//                                               ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
//                                               : isPurchased
//                                               ? "ring-2 ring-green-500 bg-green-50 border-green-200 cursor-not-allowed"
//                                               : "hover:bg-slate-50 border-slate-200 cursor-pointer"
//                                           }`}
//                                           onClick={() =>
//                                             !isPurchased &&
//                                             handleAddonToggle(addon.id)
//                                           }
//                                         >
//                                           <div className="flex items-center gap-4">
//                                             <div
//                                               className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
//                                                 isSelected
//                                                   ? "bg-blue-500 border-blue-500"
//                                                   : isPurchased
//                                                   ? "bg-green-500 border-green-500"
//                                                   : "border-slate-300"
//                                               }`}
//                                             >
//                                               {(isSelected || isPurchased) && (
//                                                 <Check className="w-3 h-3 text-white" />
//                                               )}
//                                             </div>
//                                             <div>
//                                               <span
//                                                 className={`font-medium ${
//                                                   isSelected
//                                                     ? "text-blue-900"
//                                                     : isPurchased
//                                                     ? "text-green-900"
//                                                     : "text-slate-900"
//                                                 }`}
//                                               >
//                                                 {addon.name}
//                                                 {isPurchased && (
//                                                   <Badge
//                                                     variant="outline"
//                                                     className="ml-2 text-green-600 border-green-300"
//                                                   >
//                                                     Purchased
//                                                   </Badge>
//                                                 )}
//                                               </span>
//                                               <p className="text-sm text-slate-600 mt-1">
//                                                 {addon.description}
//                                               </p>
//                                             </div>
//                                           </div>
//                                           <div className="flex items-center gap-3">
//                                             {isPurchased ? (
//                                               <Check className="w-5 h-5 text-green-500" />
//                                             ) : (
//                                               <span className="font-semibold text-slate-900">
//                                                 +₹
//                                                 {addon.price?.toLocaleString(
//                                                   "en-IN"
//                                                 )}
//                                               </span>
//                                             )}
//                                           </div>
//                                         </div>
//                                       );
//                                     })}
//                                   </div>

//                                   {/* Information Box */}
//                                   {purchasedServices.addons.length > 0 && (
//                                     <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                                       <div className="flex items-center gap-2 text-sm text-blue-700">
//                                         <Info className="w-4 h-4" />
//                                         <span>
//                                           Purchased addons are already included
//                                           in your project and cannot be selected
//                                           again.
//                                         </span>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </>
//                               )}
//                             </CardContent>
//                           </Card>
//                         </div>
//                       )}
//                     </div>

//                     {/* Right Column - Fixed Order Summary */}
//                     <div className="lg:col-span-1">
//                       <OrderSummary
//                         selectedPackage={selectedPackage}
//                         selectedAddons={selectedAddons}
//                         selectedProjectId={selectedProjectId}
//                         userProjects={userProjects}
//                         packages={packages}
//                         addons={addons}
//                         onPayment={handlePayment}
//                         isProcessing={isProcessing}
//                         projectDetails={projectDetails}
//                         activeTab={activeTab}
//                         purchasedServices={purchasedServices}
//                         gstRate={gstRate}
//                         couponCode={couponCode}
//                         setCouponCode={setCouponCode}
//                         appliedCoupon={appliedCoupon}
//                         setAppliedCoupon={setAppliedCoupon}
//                         isApplyingCoupon={isApplyingCoupon}
//                         onApplyCoupon={handleApplyCoupon}
//                         onRemoveCoupon={handleRemoveCoupon}
//                         pricingBreakdown={pricingBreakdown}
//                         is499OnlyFlow={false}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </TabsContent>
//             )}

//             {/* Addons Tab */}
//             {visibleTabs.includes("addons") && (
//               <TabsContent value="addons" className="mt-6">
//                 {addons.length === 0 ? (
//                   <Card className="text-center py-12">
//                     <CardContent>
//                       <Gift className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                       <h3 className="text-xl font-semibold text-slate-900 mb-2">
//                         No Add-ons Available
//                       </h3>
//                       <p className="text-slate-600">
//                         Please check back later for available add-on services.
//                       </p>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//                     {/* Left Column - Addons */}
//                     <div className="lg:col-span-3 space-y-8">
//                       {/* Project Selection for Addons */}
//                       <div>
//                         <h2 className="text-2xl font-bold text-slate-900 mb-6">
//                           Select Project for Add-ons
//                         </h2>
//                         <Card className="border-slate-200">
//                           <CardContent className="p-6">
//                             {projectsLoading ? (
//                               <div className="flex items-center justify-center py-8">
//                                 <Loader2 className="w-6 h-6 animate-spin text-slate-400 mr-2" />
//                                 <span className="text-slate-600">
//                                   Loading your projects...
//                                 </span>
//                               </div>
//                             ) : userProjects.length === 0 ? (
//                               <div className="text-center py-8">
//                                 <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                                 <h4 className="text-lg font-semibold text-slate-900 mb-2">
//                                   No Projects Found
//                                 </h4>
//                                 <p className="text-slate-600 mb-4">
//                                   You need to create a project first to purchase
//                                   add-ons.
//                                 </p>
//                                 <Button
//                                   onClick={() =>
//                                     router.push("/dashboard/projects/new")
//                                   }
//                                   className="bg-blue-600 hover:bg-blue-700"
//                                 >
//                                   <Building className="w-4 h-4 mr-2" />
//                                   Create New Project
//                                 </Button>
//                               </div>
//                             ) : (
//                               <div className="space-y-3">
//                                 <p className="text-sm text-slate-600 mb-4">
//                                   Select which project you want to apply these
//                                   add-ons to:
//                                 </p>
//                                 {userProjects.map((project) => {
//                                   const isSelected =
//                                     selectedProjectId === project.id;
//                                   return (
//                                     <div
//                                       key={project.id}
//                                       className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
//                                         isSelected
//                                           ? "ring-2 ring-green-500 bg-green-50 border-green-200"
//                                           : "hover:bg-slate-50 border-slate-200"
//                                       }`}
//                                       onClick={() =>
//                                         setSelectedProjectId(project.id)
//                                       }
//                                     >
//                                       <div className="flex items-center gap-4">
//                                         <div
//                                           className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
//                                             isSelected
//                                               ? "bg-green-500 border-green-500"
//                                               : "border-slate-300"
//                                           }`}
//                                         >
//                                           {isSelected && (
//                                             <Check className="w-3 h-3 text-white" />
//                                           )}
//                                         </div>
//                                         <div>
//                                           <span
//                                             className={`font-medium ${
//                                               isSelected
//                                                 ? "text-green-900"
//                                                 : "text-slate-900"
//                                             }`}
//                                           >
//                                             {project.title}
//                                           </span>
//                                           <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
//                                             <span>{project.projectType}</span>
//                                             {project.areaSqFt && (
//                                               <span>
//                                                 • {project.areaSqFt} sq ft
//                                               </span>
//                                             )}
//                                             {project.city && (
//                                               <span>• {project.city}</span>
//                                             )}
//                                           </div>
//                                         </div>
//                                       </div>
//                                       <Badge
//                                         variant={
//                                           isSelected ? "default" : "secondary"
//                                         }
//                                       >
//                                         {project.status}
//                                       </Badge>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}
//                           </CardContent>
//                         </Card>
//                       </div>

//                       {/* Addons Selection */}
//                       <div>
//                         <h2 className="text-2xl font-bold text-slate-900 mb-6">
//                           Select Add-on Services
//                           {purchasedServices.addons.length > 0 && (
//                             <Badge
//                               variant="secondary"
//                               className="ml-2 bg-green-100 text-green-800"
//                             >
//                               {purchasedServices.addons.length} purchased
//                             </Badge>
//                           )}
//                         </h2>
//                         <Card className="border-slate-200">
//                           <CardContent className="p-6">
//                             {loadingPurchased ? (
//                               <div className="flex items-center justify-center py-8">
//                                 <Loader2 className="w-6 h-6 animate-spin text-slate-400 mr-2" />
//                                 <span className="text-slate-600">
//                                   Checking purchased services...
//                                 </span>
//                               </div>
//                             ) : (
//                               <>
//                                 <div className="space-y-3">
//                                   {addons.map((addon) => {
//                                     const isSelected = selectedAddons.includes(
//                                       addon.id
//                                     );
//                                     const isPurchased =
//                                       purchasedServices.addons.includes(
//                                         addon.name
//                                       );

//                                     return (
//                                       <div
//                                         key={addon.id}
//                                         className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
//                                           isSelected
//                                             ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
//                                             : isPurchased
//                                             ? "ring-2 ring-green-500 bg-green-50 border-green-200 cursor-not-allowed"
//                                             : "hover:bg-slate-50 border-slate-200 cursor-pointer"
//                                         }`}
//                                         onClick={() =>
//                                           !isPurchased &&
//                                           handleAddonToggle(addon.id)
//                                         }
//                                       >
//                                         <div className="flex items-center gap-4">
//                                           <div
//                                             className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
//                                               isSelected
//                                                 ? "bg-blue-500 border-blue-500"
//                                                 : isPurchased
//                                                 ? "bg-green-500 border-green-500"
//                                                 : "border-slate-300"
//                                             }`}
//                                           >
//                                             {(isSelected || isPurchased) && (
//                                               <Check className="w-3 h-3 text-white" />
//                                             )}
//                                           </div>
//                                           <div>
//                                             <span
//                                               className={`font-medium ${
//                                                 isSelected
//                                                   ? "text-blue-900"
//                                                   : isPurchased
//                                                   ? "text-green-900"
//                                                   : "text-slate-900"
//                                               }`}
//                                             >
//                                               {addon.name}
//                                               {isPurchased && (
//                                                 <Badge
//                                                   variant="outline"
//                                                   className="ml-2 text-green-600 border-green-300"
//                                                 >
//                                                   Purchased
//                                                 </Badge>
//                                               )}
//                                             </span>
//                                             <p className="text-sm text-slate-600 mt-1">
//                                               {addon.description}
//                                             </p>
//                                           </div>
//                                         </div>
//                                         <div className="flex items-center gap-3">
//                                           {isPurchased ? (
//                                             <Check className="w-5 h-5 text-green-500" />
//                                           ) : (
//                                             <span className="font-semibold text-slate-900">
//                                               +₹
//                                               {addon.price?.toLocaleString(
//                                                 "en-IN"
//                                               )}
//                                             </span>
//                                           )}
//                                         </div>
//                                       </div>
//                                     );
//                                   })}
//                                 </div>

//                                 {/* Information Box */}
//                                 {purchasedServices.addons.length > 0 && (
//                                   <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                                     <div className="flex items-center gap-2 text-sm text-blue-700">
//                                       <Info className="w-4 h-4" />
//                                       <span>
//                                         Purchased addons are already included in
//                                         your project and cannot be selected
//                                         again.
//                                       </span>
//                                     </div>
//                                   </div>
//                                 )}
//                               </>
//                             )}
//                           </CardContent>
//                         </Card>
//                       </div>
//                     </div>

//                     {/* Right Column - Fixed Order Summary */}
//                     <div className="lg:col-span-1">
//                       <OrderSummary
//                         selectedPackage={null}
//                         selectedAddons={selectedAddons}
//                         selectedProjectId={selectedProjectId}
//                         userProjects={userProjects}
//                         packages={[]}
//                         addons={addons}
//                         onPayment={handlePayment}
//                         isProcessing={isProcessing}
//                         projectDetails={null}
//                         activeTab={activeTab}
//                         purchasedServices={purchasedServices}
//                         gstRate={gstRate}
//                         couponCode={couponCode}
//                         setCouponCode={setCouponCode}
//                         appliedCoupon={appliedCoupon}
//                         setAppliedCoupon={setAppliedCoupon}
//                         isApplyingCoupon={isApplyingCoupon}
//                         onApplyCoupon={handleApplyCoupon}
//                         onRemoveCoupon={handleRemoveCoupon}
//                         pricingBreakdown={pricingBreakdown}
//                         is499OnlyFlow={false}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </TabsContent>
//             )}
//           </Tabs>
//         )}

//         {/* ✅ SINGLE ROOM TRIAL LAYOUT (499-only flow) */}
//         {is499OnlyFlow && (
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//             {/* Left Column - Single Room Package Only */}
//             <div className="lg:col-span-3 space-y-8">
//               <div>
//                 <h2 className="text-2xl font-bold text-slate-900 mb-6">
//                   Single Room Trial Package
//                 </h2>
//                 <div className="space-y-4">
//                   {packages.map((pkg) => {
//                     const isSelected = selectedPackage === pkg.id;
//                     const savings = getSavings(pkg);
//                     const Icon = getPackageIcon(pkg);
//                     const colorClass = getPackageColor(pkg);

//                     return (
//                       <Card
//                         key={pkg.id}
//                         className={`relative transition-all duration-300 ${
//                           isSelected
//                             ? "ring-2 ring-purple-500 shadow-lg border-purple-200"
//                             : "hover:shadow-md border-slate-200 cursor-pointer"
//                         }`}
//                         onClick={() => handlePackageSelect(pkg)}
//                       >
//                         <CardContent className="p-6">
//                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//                             {/* Package Info */}
//                             <div className="flex-1">
//                               <div className="flex items-center gap-4 mb-3">
//                                 <div
//                                   className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center`}
//                                 >
//                                   <Icon className="w-6 h-6 text-white" />
//                                 </div>
//                                 <div>
//                                   <h3 className="text-xl font-bold text-slate-900">
//                                     {pkg.name}
//                                   </h3>
//                                   <p className="text-slate-600 text-sm mt-1">
//                                     {pkg.description}
//                                   </p>
//                                 </div>
//                               </div>

//                               <ul className="space-y-2 text-sm text-slate-700 ml-16">
//                                 {pkg.features?.map((feature, index) => (
//                                   <li
//                                     key={index}
//                                     className="flex items-start gap-2"
//                                   >
//                                     <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                     <span>{feature}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>

//                             {/* Price & Select Button */}
//                             <div className="text-center md:text-right">
//                               <div className="mb-4">
//                                 <div className="text-2xl font-bold text-slate-900">
//                                   ₹{pkg.price?.toLocaleString("en-IN")}
//                                 </div>
//                                 {pkg.originalPrice &&
//                                   pkg.originalPrice > pkg.price && (
//                                     <>
//                                       <div className="text-slate-500 line-through text-sm">
//                                         ₹
//                                         {pkg.originalPrice.toLocaleString(
//                                           "en-IN"
//                                         )}
//                                       </div>
//                                       <div className="text-green-600 font-medium text-sm mt-1">
//                                         Save ₹{savings.toLocaleString("en-IN")}
//                                       </div>
//                                     </>
//                                   )}
//                               </div>
//                               <Button
//                                 className={`${
//                                   isSelected
//                                     ? "bg-slate-900 hover:bg-slate-800 text-white"
//                                     : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
//                                 }`}
//                               >
//                                 {isSelected ? "Selected" : "Select Plan"}
//                               </Button>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* No Addons Section for 499 Flow */}
//               <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center">
//                 <h3 className="text-lg font-semibold text-slate-700 mb-2">
//                   Single Room Trial - All Inclusive
//                 </h3>
//                 <p className="text-slate-600">
//                   This package includes everything you need for a single room
//                   design. Add-ons are not available with the trial package.
//                 </p>
//               </div>
//             </div>

//             {/* Right Column - Fixed Order Summary */}
//             <div className="lg:col-span-1">
//               <OrderSummary
//                 selectedPackage={selectedPackage}
//                 selectedAddons={[]}
//                 selectedProjectId={selectedProjectId}
//                 userProjects={userProjects}
//                 packages={packages}
//                 addons={[]}
//                 onPayment={handlePayment}
//                 isProcessing={isProcessing}
//                 projectDetails={projectDetails}
//                 activeTab={activeTab}
//                 purchasedServices={purchasedServices}
//                 gstRate={gstRate}
//                 couponCode={""}
//                 setCouponCode={() => {}}
//                 appliedCoupon={null}
//                 setAppliedCoupon={() => {}}
//                 isApplyingCoupon={false}
//                 onApplyCoupon={() => {}}
//                 onRemoveCoupon={() => {}}
//                 pricingBreakdown={pricingBreakdown}
//                 is499OnlyFlow={true}
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* GST Form Modal */}
//       {showGSTForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <GSTDetailsForm
//               onGSTDetailsChange={(details) => {
//                 setGstDetails(details);
//                 setShowGSTForm(false);
//               }}
//               initialData={gstDetails}
//               onClose={() => setShowGSTForm(false)}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  Star,
  Zap,
  Crown,
  ArrowLeft,
  Shield,
  Users,
  Loader2,
  AlertCircle,
  CreditCard,
  Gift,
  Building,
  FolderOpen,
  Info,
  AlertTriangle,
  Tag,
  Percent,
  IndianRupee,
  FileText,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { packageService } from "@/services/package.service";
import { razorpayService } from "@/services/razorpayService";
import { projectService } from "@/services/project.service";
import { couponService } from "@/services/coupon.service";
import { gstService } from "@/services/gst.service";

// GST Details Form Component (unchanged)
const GSTDetailsForm = ({
  onGSTDetailsChange,
  initialData = null,
  onClose,
}) => {
  const [isBusinessUser, setIsBusinessUser] = useState(
    initialData?.isBusinessUser || false
  );
  const [gstNumber, setGstNumber] = useState(initialData?.gstNumber || "");
  const [businessName, setBusinessName] = useState(
    initialData?.businessName || ""
  );
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);

  useEffect(() => {
    if (initialData) {
      setIsBusinessUser(initialData.isBusinessUser);
      setGstNumber(initialData.gstNumber || "");
      setBusinessName(initialData.businessName || "");
    }
  }, [initialData]);

  const handleBusinessToggle = (checked) => {
    setIsBusinessUser(checked);
    if (!checked) {
      setGstNumber("");
      setBusinessName("");
      setValidationStatus(null);
    }
  };

  const validateGSTNumber = async () => {
    if (!gstNumber.trim()) {
      toast.error("Please enter GST number");
      return;
    }

    if (!gstService.validateGSTFormat(gstNumber)) {
      toast.error("Invalid GST number format");
      setValidationStatus("INVALID");
      return;
    }

    setIsValidating(true);
    try {
      const result = await gstService.validateGSTNumber(gstNumber);

      if (result.success) {
        setValidationStatus("VALID");
        toast.success("GST number validated successfully");

        // Auto-fill business name if available from validation
        if (result.data.businessName && !businessName) {
          setBusinessName(result.data.businessName);
        }
      } else {
        setValidationStatus("INVALID");
        toast.error(result.message || "GST number validation failed");
      }
    } catch (error) {
      setValidationStatus("FAILED");
      toast.error("GST validation service unavailable");
    } finally {
      setIsValidating(false);
    }
  };

  const saveGSTDetails = async () => {
    if (!gstNumber.trim() || !businessName.trim()) {
      toast.error("Please fill all business details");
      return;
    }

    if (validationStatus !== "VALID") {
      toast.error("Please validate your GST number first");
      return;
    }

    try {
      const result = await gstService.saveGSTDetails({
        gstNumber,
        businessName,
        isBusinessUser: true,
      });

      if (result.success) {
        onGSTDetailsChange?.(result.data);
        toast.success("GST details saved successfully");
        onClose?.();
      } else {
        toast.error(result.message || "Failed to save GST details");
      }
    } catch (error) {
      toast.error("Failed to save GST details");
    }
  };

  const removeGSTDetails = async () => {
    try {
      const result = await gstService.removeGSTDetails();

      if (result.success) {
        onGSTDetailsChange?.(null);
        setIsBusinessUser(false);
        setGstNumber("");
        setBusinessName("");
        setValidationStatus(null);
        toast.success("GST details removed");
        onClose?.();
      } else {
        toast.error(result.message || "Failed to remove GST details");
      }
    } catch (error) {
      toast.error("Failed to remove GST details");
    }
  };

  const getValidationBadge = () => {
    switch (validationStatus) {
      case "VALID":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Check className="w-3 h-3 mr-1" /> Valid
          </Badge>
        );
      case "INVALID":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <X className="w-3 h-3 mr-1" /> Invalid
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <AlertCircle className="w-3 h-3 mr-1" /> Validation Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building className="w-5 h-5" />
          Business Details (Optional)
        </CardTitle>
        <p className="text-sm text-slate-600">
          Add GST details for business purchases and tax benefits
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Business User Toggle */}
        <div className="flex items-center justify-between">
          <label
            htmlFor="business-user"
            className="text-sm font-medium cursor-pointer"
          >
            This is a business purchase
          </label>
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="business-user"
              checked={isBusinessUser}
              onChange={(e) => handleBusinessToggle(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors ${
                isBusinessUser ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full transition-transform transform ${
                  isBusinessUser ? "translate-x-6" : "translate-x-1"
                } mt-1`}
              />
            </div>
          </div>
        </div>

        {isBusinessUser && (
          <div className="space-y-4 border-t pt-4">
            {/* GST Number Input */}
            <div className="space-y-2">
              <label htmlFor="gst-number" className="text-sm font-medium">
                GST Number
              </label>
              <div className="flex gap-2">
                <Input
                  id="gst-number"
                  placeholder="e.g., 07AABCU9603R1ZM"
                  value={gstNumber}
                  onChange={(e) => {
                    setGstNumber(e.target.value.toUpperCase());
                    setValidationStatus(null);
                  }}
                  className="flex-1 font-mono"
                  maxLength={15}
                />
                <Button
                  onClick={validateGSTNumber}
                  disabled={!gstNumber.trim() || isValidating}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  {isValidating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Validate"
                  )}
                </Button>
              </div>
              {getValidationBadge()}
              <p className="text-xs text-slate-500">
                Format: 2-digit state code + 10-digit PAN + 1-digit entity +
                1-digit checksum
              </p>
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <label htmlFor="business-name" className="text-sm font-medium">
                Business Name
              </label>
              <Input
                id="business-name"
                placeholder="Enter your registered business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={saveGSTDetails}
                disabled={
                  !gstNumber || !businessName || validationStatus !== "VALID"
                }
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Save Details
              </Button>

              {initialData && (
                <Button
                  onClick={removeGSTDetails}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>

            {/* Benefits Info */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2 text-sm text-blue-700">
                <IndianRupee className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Benefits of adding GST:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Input Tax Credit (ITC) available for businesses</li>
                    <li>• Professional invoices for accounting</li>
                    <li>• Tax-compliant documentation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <Button onClick={onClose} variant="outline" className="w-full mt-4">
          Close
        </Button>
      </CardContent>
    </Card>
  );
};

// Updated Order Summary Component with GST and Coupon
const OrderSummary = ({
  selectedPackage,
  selectedAddons,
  selectedProjectId,
  userProjects,
  packages,
  addons,
  onPayment,
  isProcessing,
  projectDetails,
  activeTab,
  purchasedServices,
  gstRate,
  couponCode,
  setCouponCode,
  appliedCoupon,
  setAppliedCoupon,
  isApplyingCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  pricingBreakdown,
  is499OnlyFlow = false,
}) => {
  const selectedPackageDetails = packages.find(
    (pkg) => pkg.id === selectedPackage
  );
  const selectedAddonDetails = addons.filter((addon) =>
    selectedAddons.includes(addon.id)
  );

  const selectedProject = userProjects.find(
    (project) => project.publicId === selectedProjectId
  );

  // Filter out purchased addons from selected list for display
  const displayAddons = selectedAddonDetails.filter(
    (addon) => !purchasedServices.addons.includes(addon.name)
  );

  // Get purchased addons that are currently selected (should be removed)
  const purchasedButSelectedAddons = selectedAddonDetails.filter((addon) =>
    purchasedServices.addons.includes(addon.name)
  );

  // Simple GST number state
  const [gstNumber, setGstNumber] = useState("");

  // GST number validation
  const validateGSTFormat = (gst) => {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const isGSTValid = gstNumber ? validateGSTFormat(gstNumber) : true;

  return (
    <Card className="sticky top-8 shadow-xl border-0 bg-white">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-xl font-bold text-slate-900">
          {is499OnlyFlow
            ? "Single Room Trial Order"
            : activeTab === "packages"
            ? "Package Order"
            : "Add-ons Order"}
        </CardTitle>
        <p className="text-sm text-slate-600">
          {is499OnlyFlow
            ? "Quick design for one room - perfect for trying our service"
            : activeTab === "packages"
            ? "Complete interior design package with optional add-ons"
            : "Premium add-on services to enhance your design experience"}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 py-4">
        {/* Simple GST Number Field */}
        <div className="space-y-2">
          <label
            htmlFor="gst-number"
            className="text-sm font-medium text-slate-700"
          >
            GST Number (Optional)
          </label>
          <Input
            id="gst-number"
            placeholder="e.g., 07AABCU9603R1ZM"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
            className={`font-mono ${
              gstNumber && !isGSTValid ? "border-red-300" : ""
            }`}
            maxLength={15}
          />
          {gstNumber && !isGSTValid && (
            <p className="text-xs text-red-600">
              Please enter a valid GST number format
            </p>
          )}
          {gstNumber && isGSTValid && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Valid GST number format
            </p>
          )}
          <p className="text-xs text-slate-500">
            Add your GST number for business purchases and tax benefits
          </p>
        </div>

        {/* Coupon Code Section */}
        {!is499OnlyFlow && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={!!appliedCoupon || isApplyingCoupon}
                className="flex-1"
              />
              {appliedCoupon ? (
                <Button
                  onClick={onRemoveCoupon}
                  variant="outline"
                  disabled={isApplyingCoupon}
                  className="whitespace-nowrap"
                >
                  Remove
                </Button>
              ) : (
                <Button
                  onClick={onApplyCoupon}
                  disabled={!couponCode || isApplyingCoupon}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  {isApplyingCoupon ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              )}
            </div>

            {appliedCoupon && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {appliedCoupon.code}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-300"
                    >
                      {appliedCoupon.discountType === "PERCENTAGE"
                        ? `${appliedCoupon.discountValue}% OFF`
                        : `₹${appliedCoupon.discountValue} OFF`}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRemoveCoupon}
                    className="h-6 px-2 text-green-600 hover:text-green-800"
                  >
                    ✕
                  </Button>
                </div>
                {appliedCoupon.description && (
                  <p className="text-xs text-green-700 mt-1">
                    {appliedCoupon.description}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Selected Package */}
        {selectedPackageDetails && (
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-slate-900">
                {selectedPackageDetails?.name}
                {purchasedServices.plan === selectedPackageDetails.name && (
                  <Badge
                    variant="outline"
                    className="ml-2 text-green-600 border-green-300"
                  >
                    Already Purchased
                  </Badge>
                )}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {selectedPackageDetails?.description}
              </p>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">
                ₹{selectedPackageDetails?.price?.toLocaleString("en-IN")}
              </div>
              {selectedPackageDetails?.originalPrice &&
                selectedPackageDetails.originalPrice >
                  selectedPackageDetails.price && (
                  <div className="text-slate-500 line-through text-sm">
                    ₹
                    {selectedPackageDetails.originalPrice.toLocaleString(
                      "en-IN"
                    )}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Selected Addons - HIDDEN FOR 499 FLOW */}
        {!is499OnlyFlow && displayAddons.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-sm font-medium text-slate-600">
              {activeTab === "packages" ? "Add-ons:" : "Selected Services:"}
            </p>
            {displayAddons.map((addon) => (
              <div key={addon.id} className="flex justify-between text-sm">
                <span className="text-slate-600">+ {addon.name}</span>
                <span className="text-slate-600">
                  +₹{addon.price.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="space-y-2 pt-3 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Subtotal</span>
            <span className="text-slate-600">
              ₹{pricingBreakdown.subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          {pricingBreakdown.discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Discount</span>
              <span className="text-green-600">
                -₹{pricingBreakdown.discountAmount.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-slate-600">GST ({gstRate}%)</span>
            <span className="text-slate-600">
              +₹{pricingBreakdown.gstAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-semibold text-lg text-slate-900">
              Total Amount
            </span>
            <span className="font-bold text-xl text-slate-900">
              ₹{pricingBreakdown.totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Warning for purchased but selected addons - HIDDEN FOR 499 FLOW */}
        {!is499OnlyFlow && purchasedButSelectedAddons.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2 text-sm text-amber-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Already Purchased:</p>
                <ul className="mt-1 space-y-1">
                  {purchasedButSelectedAddons.map((addon) => (
                    <li key={addon.id} className="flex items-center gap-2">
                      <span>• {addon.name}</span>
                      <Badge
                        variant="outline"
                        className="text-xs text-amber-700 border-amber-300"
                      >
                        Already Included
                      </Badge>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-amber-600">
                  These services are already included in your project and will
                  be removed from your order.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Information about existing purchased services - HIDDEN FOR 499 FLOW */}
        {!is499OnlyFlow &&
          (purchasedServices.plan || purchasedServices.addons.length > 0) && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2 text-sm text-blue-700">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Already in your project:</p>
                  {purchasedServices.plan && (
                    <p className="mt-1">• Package: {purchasedServices.plan}</p>
                  )}
                  {purchasedServices.addons.length > 0 && (
                    <div className="mt-1">
                      <p>• Add-ons: {purchasedServices.addons.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        {/* Payment Button */}
        <Button
          onClick={() => onPayment(gstNumber)}
          disabled={
            isProcessing ||
            (gstNumber && !isGSTValid) ||
            // If in packages mode (or 499 flow), we MUST have a package selected
            ((activeTab === "packages" || is499OnlyFlow) && !selectedPackage) ||
            // If in addons mode, we MUST have at least one addon selected
            (activeTab === "addons" &&
              !is499OnlyFlow &&
              selectedAddons.length === 0)
          }
          className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-md font-semibold mt-4 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {is499OnlyFlow ? "Start Single Room Trial" : "Pay"} ₹
              {pricingBreakdown.totalAmount.toLocaleString("en-IN")}
            </div>
          )}
        </Button>

        {/* Security Features */}
        <div className="text-center space-y-2 pt-2">
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Secure Razorpay payment</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function PackagesContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Detect if it's ₹499-only flow
  const is499OnlyFlow = searchParams.get("type") === "499-only";

  const [activeTab, setActiveTab] = useState("packages");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [userProjects, setUserProjects] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);

  // ✅ Get URL parameters
  const urlProjectId = searchParams.get("projectId");
  const purchaseType = searchParams.get("type");
  const pr = searchParams.get("pr");
  
  // ✅ NEW: Store the selected plan from landing page
  const [selectedPlanFromLanding, setSelectedPlanFromLanding] = useState(null);
  // ✅ Track if user has manually selected a package (prevents auto-selection override)
  const hasManuallySelected = useRef(false);

  // GST State
  const [gstRate, setGstRate] = useState(18.0);
  const [loadingGST, setLoadingGST] = useState(false);

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Pricing State
  const [pricingBreakdown, setPricingBreakdown] = useState({
    subtotal: 0,
    discountAmount: 0,
    amountAfterDiscount: 0,
    gstAmount: 0,
    totalAmount: 0,
  });

  // Purchased services state
  const [purchasedServices, setPurchasedServices] = useState({
    plan: null,
    addons: [],
  });
  const [loadingPurchased, setLoadingPurchased] = useState(false);

  // GST Details State
  const [gstDetails, setGstDetails] = useState(null);
  const [showGSTForm, setShowGSTForm] = useState(false);

  // ✅ NEW: Function to get stored plan from landing page
  const getPlanFromLandingPage = () => {
    // First check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const typeFromUrl = urlParams.get('type');
    
    // Map URL types to plan IDs
    const planMapping = {
      '499-only': 499,
      '4999': 4999,
      '9999': 9999,
      '14999': 14999,
    };
    
    if (typeFromUrl && planMapping[typeFromUrl]) {
      return planMapping[typeFromUrl];
    }
    
    // Fallback to localStorage if URL doesn't have it
    const storedPlan = localStorage.getItem('selectedPlanFromLanding');
    if (storedPlan) {
      try {
        const planData = JSON.parse(storedPlan);
        return planData.price;
      } catch (error) {
        console.error('Error parsing stored plan:', error);
      }
    }
    
    return null;
  };

  // ✅ NEW: Function to update URL when package is selected
  const updateUrlWithPackageType = (packagePrice) => {
    if (!urlProjectId) return;

    // Map package price to type parameter
    let typeParam = "";
    switch (packagePrice) {
      case 499:
        typeParam = "499-only";
        break;
      case 4999:
        typeParam = "4999";
        break;
      case 9999:
        typeParam = "9999";
        break;
      case 14999:
        typeParam = "14999";
        break;
      default:
        // For other prices, use the price as type
        typeParam = packagePrice.toString();
    }

    // Update URL without reloading the page (using modern Next.js App Router API)
    const newUrl = `/packages?type=${typeParam}&projectId=${urlProjectId}`;
    router.replace(newUrl, { scroll: false });
  };

  // ✅ MODIFIED: Determine which tabs to show based on context
  const getVisibleTabs = () => {
    // If it's 499-only flow, only show packages tab
    if (is499OnlyFlow) {
      return ["packages"];
    }

    const tabs = [];

    // New project creation flow - only show packages
    if (purchaseType === "new-project" || pr === "new-project") {
      tabs.push("packages");
    }
    // Add-ons only purchase flow - only show addons
    else if (purchaseType === "addons-only" || purchaseType === "addon") {
      tabs.push("addons");
    }
    // If type is a number (like 4999, 9999), show packages tab
    else if (!isNaN(parseInt(purchaseType))) {
      tabs.push("packages");
    }
    // Default flow - show both tabs
    else {
      tabs.push("packages", "addons");
    }

    return tabs;
  };

  const visibleTabs = getVisibleTabs();

  // ✅ MODIFIED: Auto-select appropriate tab based on context
  useEffect(() => {
    if (is499OnlyFlow) {
      setActiveTab("packages");
    } else if (purchaseType === "new-project" || pr === "new-project") {
      setActiveTab("packages");
    } else if (purchaseType === "addons-only" || purchaseType === "addon") {
      setActiveTab("addons");
      loadUserProjects();
    } else if (!isNaN(parseInt(purchaseType))) {
      // Handle numeric types (4999, 9999, 14999) from landing page
      setActiveTab("packages");
    } else if (urlProjectId) {
      setActiveTab("packages");
    }
  }, [purchaseType, pr, urlProjectId, is499OnlyFlow]);

  // ✅ NEW: Get selected plan from landing page on component mount
  useEffect(() => {
    const planPrice = getPlanFromLandingPage();
    if (planPrice) {
      setSelectedPlanFromLanding(planPrice);
    }
  }, []);

  // Load user GST details
  const loadUserGSTDetails = async () => {
    try {
      const result = await gstService.getUserGSTDetails();
      if (result.success && result.data) {
        setGstDetails(result.data);
      }
    } catch (error) {
      console.error("Error loading GST details:", error);
    }
  };

  const handleUrlProjectId = async (projectId) => {
    try {
      setLoading(true);
      // Verify project exists and belongs to user
      const projectResult = await projectService.getProject(projectId);
      if (projectResult.success && projectResult.data?.project) {
        const project = projectResult.data.project;
        setProjectDetails({
          projectId: project.id,
          projectType: project.projectType,
          city: project.city,
          areaSqFt: project.areaSqFt,
          title: project.title,
        });

        // Load purchased services (with error handling)
        try {
          await loadPurchasedServices(project.id);
        } catch (purchasedError) {
          console.warn(
            "⚠️ Could not load purchased services, continuing anyway:",
            purchasedError
          );
          // Continue even if purchased services fail to load
        }

        // Load packages and addons
        await loadPackagesAndAddons();

        toast.success(`Please select a package for: ${project.title}`);
      } else {
        console.error("❌ Project not found or access denied:", projectResult);
        throw new Error("Project not found or you don't have access");
      }
    } catch (error) {
      console.error("❌ Error handling URL project:", error);
      toast.error("Project not found or access denied");
      // Fallback to regular flow
      loadPackagesAndAddons();
      loadProjectDetails();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserGSTDetails();

    if (urlProjectId) {
      handleUrlProjectId(urlProjectId);
    } else if (purchaseType === "addons-only" || purchaseType === "addon") {
      setActiveTab("addons");
      loadUserProjects();
      loadPackagesAndAddons();
    } else {
      loadPackagesAndAddons();
      loadProjectDetails();
    }
  }, [searchParams, urlProjectId, purchaseType]);

  // Load GST settings
  const loadGSTSettings = async () => {
    try {
      setLoadingGST(true);
      const result = await packageService.getGSTSettings();
      if (result.success && result.data?.rate) {
        setGstRate(result.data.rate);
      }
    } catch (error) {
      console.error("Error loading GST settings:", error);
      setGstRate(18.0);
    } finally {
      setLoadingGST(false);
    }
  };

  // Calculate pricing breakdown
  const calculatePricing = () => {
    let subtotal = 0;

    if (activeTab === "packages") {
      const selectedPackageDetails = packages.find(
        (pkg) => pkg.id === selectedPackage
      );

      // For 499-only flow, only include package price
      if (is499OnlyFlow) {
        subtotal = selectedPackageDetails?.price || 0;
      } else {
        const selectedAddonDetails = addons.filter((addon) =>
          getFilteredAddonsForPayment().includes(addon.id)
        );

        const packagePrice = selectedPackageDetails?.price || 0;
        const addonsTotal = selectedAddonDetails.reduce(
          (total, addon) => total + addon.price,
          0
        );
        subtotal = packagePrice + addonsTotal;
      }
    } else {
      const selectedAddonDetails = addons.filter((addon) =>
        getFilteredAddonsForPayment().includes(addon.id)
      );
      subtotal = selectedAddonDetails.reduce(
        (total, addon) => total + addon.price,
        0
      );
    }

    const breakdown = packageService.calculatePricing(
      subtotal,
      gstRate,
      appliedCoupon?.discountValue || 0,
      appliedCoupon?.discountType
    );

    setPricingBreakdown(breakdown);
  };

  // Apply coupon code
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    try {
      const subtotal = calculateSubtotal();
      const selectedPackageDetails = packages.find(
        (pkg) => pkg.id === selectedPackage
      );

      const result = await couponService.validateCoupon(
        couponCode,
        subtotal,
        selectedPackageDetails?.id,
        getFilteredAddonsForPayment()
      );

      if (result.success) {
        setAppliedCoupon(result.data.coupon);
        toast.success("Coupon applied successfully!");
        calculatePricing();
      } else {
        toast.error(result.message || "Invalid coupon code");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    calculatePricing();
    toast.info("Coupon removed");
  };

  // Calculate subtotal for coupon validation
  const calculateSubtotal = () => {
    let subtotal = 0;

    if (activeTab === "packages") {
      const selectedPackageDetails = packages.find(
        (pkg) => pkg.id === selectedPackage
      );

      if (is499OnlyFlow) {
        subtotal = selectedPackageDetails?.price || 0;
      } else {
        const selectedAddonDetails = addons.filter((addon) =>
          getFilteredAddonsForPayment().includes(addon.id)
        );

        const packagePrice = selectedPackageDetails?.price || 0;
        const addonsTotal = selectedAddonDetails.reduce(
          (total, addon) => total + addon.price,
          0
        );
        subtotal = packagePrice + addonsTotal;
      }
    } else {
      const selectedAddonDetails = addons.filter((addon) =>
        getFilteredAddonsForPayment().includes(addon.id)
      );
      subtotal = selectedAddonDetails.reduce(
        (total, addon) => total + addon.price,
        0
      );
    }

    return subtotal;
  };

  // Update pricing when dependencies change
  useEffect(() => {
    calculatePricing();
  }, [
    selectedPackage,
    selectedAddons,
    activeTab,
    gstRate,
    appliedCoupon,
    packages,
    addons,
    is499OnlyFlow,
  ]);

  // Load GST settings on component mount
  useEffect(() => {
    loadGSTSettings();
  }, []);

  // Load purchased services for a specific project
  const loadPurchasedServices = async (projectId) => {
    try {
      setLoadingPurchased(true);
      const projectResponse = await projectService.getProject(projectId);
      if (projectResponse.success && projectResponse.data?.project) {
        const projectData = projectResponse.data.project;

        // ✅ Use the correct property names from your response
        const purchasedPlan = projectData.selectedPlan;
        const purchasedAddons = projectData.selectedAddons || [];
        setPurchasedServices({
          plan: purchasedPlan,
          addons: purchasedAddons,
        });

        // Show notification about existing services
        if (purchasedPlan || purchasedAddons.length > 0) {
          const existingServices = [];
          if (purchasedPlan) {
            existingServices.push(`package: ${purchasedPlan}`);
          }
          if (purchasedAddons.length > 0) {
            existingServices.push(`${purchasedAddons.length} addon(s)`);
          }

          toast.info("Existing services found", {
            description: `Your project already has: ${existingServices.join(
              " and "
            )}`,
            duration: 5000,
          });
        }
      } else {
        console.warn("⚠️ No project data found for purchased services");
        // Reset if no project data
        setPurchasedServices({
          plan: null,
          addons: [],
        });
      }
    } catch (error) {
      console.error("❌ Error loading purchased services:", error);
      // Don't show error toast for new projects (they won't have purchased services)
      if (!projectId.includes("new")) {
        toast.error("Failed to load project services");
      }
      setPurchasedServices({
        plan: null,
        addons: [],
      });
    } finally {
      setLoadingPurchased(false);
    }
  };

  // Load user projects
  const loadUserProjects = async () => {
    try {
      setProjectsLoading(true);
      const result = await projectService.getUserProjects();

      if (result.success) {
        const projects = result.data?.projects || [];
        setUserProjects(projects);

        if (projects.length > 0) {
          setSelectedProjectId(projects[0].publicId);
        } else {
          toast.error("No projects found", {
            description: "Please create a project first to purchase add-ons",
            action: {
              label: "Create Project",
              onClick: () => router.push("/dashboard/projects/new"),
            },
          });
        }
      } else {
        throw new Error(result.message || "Failed to load projects");
      }
    } catch (error) {
      console.error("Error loading user projects:", error);
      toast.error("Failed to load your projects");
    } finally {
      setProjectsLoading(false);
    }
  };

  // Load purchased services when project changes
  useEffect(() => {
    if (activeTab === "addons" && selectedProjectId) {
      loadPurchasedServices(selectedProjectId);
    } else if (activeTab === "packages" && projectDetails?.projectId) {
      loadPurchasedServices(projectDetails.projectId);
    }
  }, [selectedProjectId, activeTab, projectDetails]);

  // ✅ MODIFIED: Load packages with enhanced auto-selection logic
  const loadPackagesAndAddons = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ For 499-only flow, include single room packages
      const includeSingleRoom = is499OnlyFlow;
      const [packagesResponse, addonsResponse] = await Promise.all([
        packageService.getPackages(true, includeSingleRoom),
        packageService.getAddons(true),
      ]);

      if (packagesResponse.success) {
        let packagesData = packagesResponse.data.packages || [];
        
        // ✅ For 499-only flow, filter to only show single room packages
        if (is499OnlyFlow) {
          packagesData = packagesData.filter((pkg) => {
            const name = pkg.name.toLowerCase();
            const isSingleRoom =
              name.includes("single room") || name.includes("room trial");
            const is499Price = pkg.price === 499;
            return isSingleRoom || is499Price;
          });
          
          if (packagesData.length === 0) {
            console.error("❌ No single room packages found in API response");
            toast.error("Single Room Trial package is currently unavailable");
            throw new Error("Single Room Trial package not available");
          }
        }

        setPackages(packagesData);

        // ✅ ENHANCED: Auto-select logic with priority
        let autoSelectedPackageId = null;
        
        // Priority 1: Check URL parameter
        if (!isNaN(parseInt(purchaseType))) {
          const numericType = parseInt(purchaseType);
          const matchingPackage = packagesData.find(
            (pkg) => pkg.price === numericType
          );
          if (matchingPackage) {
            autoSelectedPackageId = matchingPackage.id;
            console.log(`🎯 Auto-selected from URL: ${numericType}`);
          }
        }
        
        // Priority 2: Check stored plan from landing page
        if (!autoSelectedPackageId && selectedPlanFromLanding) {
          const matchingPackage = packagesData.find(
            (pkg) => pkg.price === selectedPlanFromLanding
          );
          if (matchingPackage) {
            autoSelectedPackageId = matchingPackage.id;
            console.log(`🎯 Auto-selected from landing page: ${selectedPlanFromLanding}`);
            
            // Update URL to reflect the selected plan
            updateUrlWithPackageType(selectedPlanFromLanding);
          }
        }
        
        // Priority 3: Restore last selected package from localStorage (but not for 499 plan)
        if (!autoSelectedPackageId && !is499OnlyFlow) {
          const lastSelected = localStorage.getItem('lastSelectedPackage');
          if (lastSelected) {
            try {
              const lastSelectedData = JSON.parse(lastSelected);
              // Verify the package still exists and is not 499
              const matchingPackage = packagesData.find(
                (pkg) => pkg.id === lastSelectedData.packageId && pkg.price !== 499
              );
              if (matchingPackage) {
                autoSelectedPackageId = matchingPackage.id;
                console.log(`🎯 Restored last selected package: ${lastSelectedData.packageName}`);
                
                // Update URL to reflect the restored package
                if (matchingPackage.price && urlProjectId) {
                  updateUrlWithPackageType(matchingPackage.price);
                }
              }
            } catch (error) {
              console.error('Error parsing last selected package:', error);
            }
          }
        }
        
        // Priority 4: Check for Premium package (9999)
        if (!autoSelectedPackageId) {
          const premiumPackage = packagesData.find(
            (pkg) => pkg.price === 9999
          );
          if (premiumPackage) {
            autoSelectedPackageId = premiumPackage.id;
            console.log(`🎯 Auto-selected Premium (9999) as default`);
          }
        }
        
        // Priority 5: Check for Most Popular flag
        if (!autoSelectedPackageId) {
          const popularPackage = packagesData.find(
            (pkg) => pkg.isPopular
          );
          if (popularPackage) {
            autoSelectedPackageId = popularPackage.id;
            console.log(`🎯 Auto-selected Most Popular package`);
          }
        }
        
        // Priority 6: Fallback to first available package
        if (!autoSelectedPackageId && packagesData.length > 0) {
          autoSelectedPackageId = packagesData[0].id;
          console.log(`🎯 Auto-selected first available package`);
        }

        if (autoSelectedPackageId) {
          setSelectedPackage(autoSelectedPackageId);
          // Update URL to reflect the selected package
          const selectedPkg = packagesData.find(p => p.id === autoSelectedPackageId);
          if (selectedPkg && selectedPkg.price && urlProjectId) {
            updateUrlWithPackageType(selectedPkg.price);
          }
        }
      } else {
        throw new Error(packagesResponse.message || "Failed to load packages");
      }

      if (addonsResponse.success) {
        const uniqueAddons = Array.from(
          new Map(
            (addonsResponse.data.addons || []).map((addon) => [addon.id, addon])
          ).values()
        );
        setAddons(uniqueAddons);
      } else {
        console.warn("Failed to load addons:", addonsResponse.message);
        setAddons([]);
      }
    } catch (error) {
      console.error("Error loading packages:", error);
      setError(error.message);
      toast.error(error.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDetails = () => {
    const paymentData = localStorage.getItem("projectPaymentData");
    if (paymentData) {
      try {
        const data = JSON.parse(paymentData);
        setProjectDetails({
          projectType: data.projectType,
          city: data.city,
          areaSqFt: data.areaSqFt,
          projectId: data.projectId,
          title: data.title || "Current Project",
        });

        if (data.projectId) {
          loadPurchasedServices(data.projectId);
        }
      } catch (error) {
        console.error("Error parsing project details:", error);
      }
    }
  };

  // Enhanced addon toggle
  const handleAddonToggle = (addonId) => {
    // ✅ DISABLE ADDONS FOR 499 FLOW
    if (is499OnlyFlow) return;

    const addon = addons.find((a) => a.id === addonId);

    if (!addon) return;

    if (purchasedServices.addons.includes(addon.name)) {
      toast.error(`Already Purchased`, {
        description: `"${addon.name}" is already included in your project and cannot be purchased again.`,
        duration: 4000,
        icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      });
      return;
    }

    if (selectedAddons.includes(addonId)) {
      setSelectedAddons((prev) => prev.filter((id) => id !== addonId));
      toast.info("Add-on removed", {
        description: `"${addon.name}" removed from selection`,
        duration: 2000,
      });
    } else {
      setSelectedAddons((prev) => [...prev, addonId]);
      toast.success("Add-on added", {
        description: `"${addon.name}" added to your selection`,
        duration: 2000,
      });
    }
  };

  // ✅ MODIFIED: Enhanced package selection - updates URL when package is selected
  const handlePackageSelect = (pkg) => {
    if (purchasedServices.plan === pkg.name) {
      toast.error(`Already Purchased`, {
        description: `You already have the "${pkg.name}" package for this project. Please select a different package.`,
        duration: 4000,
        icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      });
      return;
    }

    // ✅ Mark that user has manually selected a package
    hasManuallySelected.current = true;
    
    setSelectedPackage(pkg.id);

    // ✅ Clear selectedPlanFromLanding when user manually selects a package
    // This prevents the landing page selection from overriding manual choices
    if (selectedPlanFromLanding && pkg.price !== selectedPlanFromLanding) {
      setSelectedPlanFromLanding(null);
      console.log(`🔄 Cleared landing page selection - user manually selected ${pkg.price}`);
    }

    // ✅ Store selected package in localStorage (but not for 499 plan)
    if (pkg.price !== 499) {
      localStorage.setItem('lastSelectedPackage', JSON.stringify({
        packageId: pkg.id,
        packagePrice: pkg.price,
        packageName: pkg.name,
        timestamp: Date.now()
      }));
    }

    // ✅ Update URL with the package price as type parameter
    if (pkg.price) {
      updateUrlWithPackageType(pkg.price);
    }

    toast.success("Package selected", {
      description: `"${pkg.name}" selected`,
      duration: 2000,
    });
  };

  // Filter out purchased addons before payment
  const getFilteredAddonsForPayment = () => {
    // ✅ NO ADDONS FOR 499 FLOW
    if (is499OnlyFlow) return [];

    return selectedAddons.filter((addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      return !purchasedServices.addons.includes(addon?.name);
    });
  };

  // Auto-remove purchased addons from selection
  useEffect(() => {
    if (is499OnlyFlow) {
      // Clear any selected addons for 499 flow
      setSelectedAddons([]);
      return;
    }

    if (purchasedServices.addons.length > 0 && selectedAddons.length > 0) {
      const filteredAddons = selectedAddons.filter((addonId) => {
        const addon = addons.find((a) => a.id === addonId);
        return !purchasedServices.addons.includes(addon?.name);
      });

      if (filteredAddons.length !== selectedAddons.length) {
        setSelectedAddons(filteredAddons);
        const removedCount = selectedAddons.length - filteredAddons.length;
        if (removedCount > 0) {
          toast.info("Auto-removed purchased services", {
            description: `${removedCount} already purchased service(s) were removed from your selection.`,
            duration: 4000,
          });
        }
      }
    }
  }, [purchasedServices.addons, addons, is499OnlyFlow]);

  // ✅ NEW: Update loadPackagesAndAddons when selectedPlanFromLanding changes
  // Only auto-select if user hasn't manually selected a package yet (initial load only)
  useEffect(() => {
    if (selectedPlanFromLanding && packages.length > 0 && !hasManuallySelected.current) {
      const matchingPackage = packages.find(
        (pkg) => pkg.price === selectedPlanFromLanding
      );
      if (matchingPackage && selectedPackage !== matchingPackage.id) {
        setSelectedPackage(matchingPackage.id);
        console.log(`🔄 Updated selection based on landing page plan: ${selectedPlanFromLanding}`);
      }
    }
  }, [selectedPlanFromLanding, packages, selectedPackage]);

  const handlePayment = async (gstNumber = "") => {
  setIsProcessing(true);

  try {
    let packageData = {};
    let addonsData = [];
    let receiptPrefix = "rcpt";
    let description = "";

    let projectIdForPayment =
      urlProjectId || projectDetails?.projectId || selectedProjectId;

    if (!projectIdForPayment) {
      throw new Error("Project ID not found. Please start over.");
    }

    // ✅ FOR 499 FLOW: No addons allowed
    const payableAddons = is499OnlyFlow ? [] : getFilteredAddonsForPayment();

    // Final validation before payment
    if (activeTab === "packages") {
      const selectedPackageDetails = packages.find(
        (pkg) => pkg.id === selectedPackage
      );

      if (!selectedPackageDetails) {
        throw new Error("Please select a package");
      }

      if (purchasedServices.plan === selectedPackageDetails.name) {
        throw new Error(
          `You already have the "${selectedPackageDetails.name}" package for this project. Please select a different package.`
        );
      }

      const selectedAddonDetails = addons.filter((addon) =>
        payableAddons.includes(addon.id)
      );

      // Prepare package data
      packageData = {
        planId: selectedPackageDetails.id,
        plan: selectedPackageDetails.name,
        price: selectedPackageDetails.price,
        originalPrice: selectedPackageDetails.originalPrice,
        totalAmount: pricingBreakdown.totalAmount,
      };

      // Prepare addons data - empty for 499 flow
      addonsData = is499OnlyFlow
        ? []
        : selectedAddonDetails.map((addon) => ({
            id: addon.id,
            name: addon.name,
            price: addon.price,
          }));

      receiptPrefix = is499OnlyFlow ? "single_room" : "pkg";
      description = is499OnlyFlow
        ? `Payment for Single Room Trial`
        : `Payment for ${selectedPackageDetails.name} Package`;
    } else {
      // Addons-only purchase flow - NOT ALLOWED FOR 499 FLOW
      if (is499OnlyFlow) {
        throw new Error("Add-ons are not available for Single Room Trial");
      }

      const selectedAddonDetails = addons.filter((addon) =>
        payableAddons.includes(addon.id)
      );

      if (selectedAddonDetails.length === 0) {
        throw new Error(
          "Please select at least one add-on that is not already purchased"
        );
      }

      if (!selectedProjectId) {
        throw new Error("Please select a project for your add-ons");
      }

      // Prepare addons data
      addonsData = selectedAddonDetails.map((addon) => ({
        id: addon.id,
        name: addon.name,
        price: addon.price,
      }));

      receiptPrefix = "addon";
      description = `Payment for ${addonsData.length} add-on${
        addonsData.length > 1 ? "s" : ""
      }`;
    }

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error(
        "Razorpay SDK failed to load. Please check your internet connection."
      );
    }

    // Generate receipt
    const timestamp = Date.now().toString().slice(-8);
    const receipt = `${receiptPrefix}_${timestamp}`;

    // Create order on backend with GST and coupon data
    const orderResponse = await razorpayService.createOrder(
      pricingBreakdown.totalAmount,
      receipt,
      "INR",
      projectIdForPayment,
      packageData,
      addonsData,
      appliedCoupon?.code,
      pricingBreakdown.gstAmount,
      pricingBreakdown.discountAmount,
      gstNumber
    );

    if (!orderResponse.success) {
      throw new Error(
        orderResponse.error || "Failed to create payment order"
      );
    }

    // Get user profile data
    const userProfile = JSON.parse(
      localStorage.getItem("userProfile") || "{}"
    );

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // 🔥 TRACKING: PAYMENT INITIATED
    window.dataLayer.push({
      event: "razorpay_payment_initiated",
      value: pricingBreakdown.totalAmount,
      currency: "INR",
      package_price: activeTab === "packages" ? packageData?.price : 0,
      package_type: is499OnlyFlow ? "single_room" : 
                   activeTab === "packages" ? "package" : "addon",
      transaction_id: orderResponse.order.id,
      coupon_code: appliedCoupon?.code || null,
      discount_amount: pricingBreakdown.discountAmount,
      gst_amount: pricingBreakdown.gstAmount
    });

    // Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderResponse.order.amount,
      currency: orderResponse.order.currency,
      name: "Houspire",
      description: description,
      image: "/logo.png",
      order_id: orderResponse.order.id,
      handler: async function (response) {
        try {
          const verificationResult = await razorpayService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            projectId: projectIdForPayment,
            packageData: packageData,
            addonsData: addonsData,
            purchaseType: activeTab,
            couponCode: appliedCoupon?.code,
            gstAmount: pricingBreakdown.gstAmount,
            couponDiscount: pricingBreakdown.discountAmount,
            gstNumber: gstNumber,
            isSingleRoomPlan: is499OnlyFlow,
          });

          if (verificationResult.success) {
            // ✅ TRACKING: RAZORPAY PAYMENT SUCCESS
            window.dataLayer.push({
              event: "razorpay_payment_success",
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              value: pricingBreakdown.totalAmount,
              currency: "INR"
            });

            // ✅ TRACKING: PURCHASE SUCCESS (For GTM - Meta/GA4)
            window.dataLayer.push({
              event: "purchase_success",
              transaction_id: response.razorpay_order_id,
              value: pricingBreakdown.totalAmount,
              currency: "INR",
              package_price: activeTab === "packages" ? packageData?.price : 0,
              package_name: activeTab === "packages" ? packageData?.plan : "addon_purchase",
              addons_count: addonsData.length,
              addons_total: addonsData.reduce((sum, addon) => sum + addon.price, 0),
              coupon_code: appliedCoupon?.code || null,
              discount_amount: pricingBreakdown.discountAmount,
              gst_amount: pricingBreakdown.gstAmount,
              is_single_room: is499OnlyFlow,
              project_id: projectIdForPayment
            });

            if (activeTab === "packages") {
              await packageService.processPayment(projectIdForPayment, {
                selectedPlan: packageData.plan,
                selectedAddons: addonsData.map((addon) => addon.name),
                paymentStatus: "COMPLETED",
                status: "PAYMENT_COMPLETED",
                paymentId: response.razorpay_payment_id,
                amount: pricingBreakdown.totalAmount,
                gstAmount: pricingBreakdown.gstAmount,
                couponDiscount: pricingBreakdown.discountAmount,
                couponCode: appliedCoupon?.code,
                gstNumber: gstNumber,
                isSingleRoomPlan: is499OnlyFlow,
              });
            }

            // AUTO-START PROGRESS FOR SINGLE ROOM PLANS
            if (is499OnlyFlow) {
              try {
                await projectService.initializeProjectProgress(projectIdForPayment);
              } catch (error) {
                console.error("Progress initialization failed:", error);
                // Continue anyway - progress can be started manually
              }
            }

            if (gstNumber) {
              try {
                await gstService.saveGSTDetails({
                  gstNumber,
                  isBusinessUser: true,
                });
              } catch (error) {
                console.log(
                  "Could not save GST to profile, but payment successful"
                );
              }
            }

            // Update project phase after payment completion
            await projectService.updateProjectPhase(projectIdForPayment, {
              completedPhase: "PAYMENT",
              currentPhase: "DESIGN_QUESTIONNAIRE",
            });

            // Store payment data
            const paymentData = {
              type: activeTab,
              amount: pricingBreakdown.totalAmount,
              gstAmount: pricingBreakdown.gstAmount,
              discountAmount: pricingBreakdown.discountAmount,
              couponCode: appliedCoupon?.code,
              gstNumber: gstNumber,
              customer: {
                name: userProfile?.name || "Customer",
                email: userProfile?.email || "customer@example.com",
              },
              timestamp: new Date().toISOString(),
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              projectId: projectIdForPayment,
              isSingleRoomPlan: is499OnlyFlow,
              ...(activeTab === "packages" && {
                plan: packageData.plan,
                originalPrice: packageData.originalPrice,
                addons: addonsData,
              }),
              ...(activeTab === "addons" && {
                addons: addonsData,
              }),
            };

            localStorage.setItem("paymentData", JSON.stringify(paymentData));
            localStorage.setItem("paymentCompleted", "true");

            // Clear temporary data
            localStorage.removeItem("projectPaymentData");
            localStorage.removeItem("packageSelection");
            localStorage.removeItem("addonPurchaseData");
            // ✅ Clear selected plan from landing page after payment
            localStorage.removeItem("selectedPlanFromLanding");
            localStorage.removeItem("lastSelectedPackage");

            toast.success("Payment Successful!", {
              description: is499OnlyFlow
                ? "Your Single Room Trial has been activated!"
                : activeTab === "packages"
                ? "Your interior planning package has been activated."
                : "Your add-ons have been activated successfully.",
            });

            // Redirect to success page
            setTimeout(() => {
              router.push(
                `/payment/success?payment_id=${
                  response.razorpay_payment_id
                }&order_id=${response.razorpay_order_id}&amount=${
                  pricingBreakdown.totalAmount
                }&type=${activeTab}&projectId=${projectIdForPayment}${
                  is499OnlyFlow ? "&singleRoom=true" : ""
                }`
              );
            }, 1500);
          } else {
            // ❌ TRACKING: PAYMENT VERIFICATION FAILED
            window.dataLayer.push({
              event: "payment_verification_failed",
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              error_reason: "verification_failed"
            });

            toast.error("Payment Verification Failed", {
              description: "Please contact support with your payment ID.",
            });
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          
          // ❌ TRACKING: PAYMENT PROCESSING ERROR
          window.dataLayer.push({
            event: "payment_processing_error",
            error_message: error.message,
            error_type: "verification_error"
          });

          toast.error("Payment Processing Error", {
            description: "Please contact support.",
          });
        }
      },
      prefill: {
        name: userProfile?.name || "Customer Name",
        email: userProfile?.email || "customer@example.com",
        contact: userProfile?.phone || "9999999999",
      },
      notes: {
        purchaseType: activeTab,
        ...(activeTab === "packages" && { package: packageData?.plan }),
        ...(activeTab === "addons" && {
          addons: addonsData.map((a) => a.name).join(", "),
        }),
        ...(appliedCoupon && { coupon: appliedCoupon.code }),
        gstAmount: pricingBreakdown.gstAmount,
        discountAmount: pricingBreakdown.discountAmount,
        ...(gstNumber && { gstNumber: gstNumber }),
        ...(is499OnlyFlow && { singleRoomTrial: true }),
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          
          // ❌ TRACKING: PAYMENT CANCELLED/CLOSED
          window.dataLayer.push({
            event: "razorpay_payment_closed",
            order_id: orderResponse.order.id,
            amount: pricingBreakdown.totalAmount
          });

          toast.info("Payment cancelled");
        }
      }
    };

    // Add payment.failed event listener
    options.handler = (function(originalHandler) {
      return async function(response) {
        try {
          const rzpInstance = this;
          
          // Add failed payment tracking
          rzpInstance.on("payment.failed", function (failedResponse) {
            window.dataLayer.push({
              event: "razorpay_payment_failed",
              error_code: failedResponse.error?.code || "unknown",
              error_description: failedResponse.error?.description || "Payment failed",
              error_reason: failedResponse.error?.reason || "unknown",
              order_id: failedResponse.error?.metadata?.order_id || orderResponse.order.id,
              payment_id: failedResponse.error?.metadata?.payment_id || response.razorpay_payment_id,
              amount: pricingBreakdown.totalAmount
            });
          });

          // Call original handler
          return originalHandler.call(this, response);
        } catch (error) {
          console.error("Error in payment handler:", error);
        }
      };
    })(options.handler);

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  } catch (error) {
    console.error("Payment error:", error);
    
    // ❌ TRACKING: PAYMENT INITIATION ERROR
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "payment_initiation_error",
      error_message: error.message,
      error_type: "pre_payment_error"
    });

    toast.error("Payment Failed", {
      description: error.message || "Please try again.",
    });
  } finally {
    setIsProcessing(false);
  }
};

  // Add GST validation function
  const validateGSTFormat = (gst) => {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getSavings = (pkg) => {
    if (!pkg.originalPrice || pkg.originalPrice <= pkg.price) return 0;
    return pkg.originalPrice - pkg.price;
  };

  const getPackageIcon = (pkg) => {
    if (
      pkg.name.toLowerCase().includes("single room") ||
      pkg.name.toLowerCase().includes("room trial")
    )
      return Sparkles;
    if (pkg.name.toLowerCase().includes("essential")) return Zap;
    if (pkg.name.toLowerCase().includes("premium")) return Star;
    if (pkg.name.toLowerCase().includes("luxury")) return Crown;
    return Zap;
  };

  const getPackageColor = (pkg) => {
    if (
      pkg.name.toLowerCase().includes("single room") ||
      pkg.name.toLowerCase().includes("room trial")
    )
      return "from-blue-400 to-purple-500";
    if (pkg.name.toLowerCase().includes("essential"))
      return "from-blue-500 to-cyan-500";
    if (pkg.name.toLowerCase().includes("premium"))
      return "from-purple-500 to-pink-500";
    if (pkg.name.toLowerCase().includes("luxury"))
      return "from-amber-500 to-orange-500";
    return "from-blue-500 to-cyan-500";
  };

  if (loading && !(activeTab === "addons" && projectsLoading)) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600">
                {activeTab === "addons"
                  ? "Loading your projects..."
                  : "Loading packages..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Failed to Load Packages
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              <Button onClick={loadPackagesAndAddons} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              if (is499OnlyFlow) {
                // Redirect to landing page and scroll to pricing section
                router.push("/#pricing");
              } else {
                router.back();
              }
            }}
            className="mb-6 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {is499OnlyFlow ? "Back to Pricing" : "Back to Dashboard"}
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              {is499OnlyFlow
                ? "Single Room Trial - ₹499"
                : activeTab === "packages"
                ? "Choose Your Interior Planning Package"
                : "Premium Add-on Services"}
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              {is499OnlyFlow
                ? "Quick design for one room - perfect for trying our service • GST 18% applicable"
                : activeTab === "packages"
                ? ` • All plans include planning-only services • GST ${gstRate}% applicable`
                : "Enhance your design experience with our premium services"}
            </p>

            {/* Existing services banner - HIDDEN FOR 499 FLOW */}
            {!is499OnlyFlow &&
              (purchasedServices.plan ||
                purchasedServices.addons.length > 0) && (
                <div className="max-w-2xl mx-auto mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-semibold text-blue-900">
                        Project Status
                      </p>
                      <p className="text-sm text-blue-700">
                        {purchasedServices.plan &&
                          `Current package: ${purchasedServices.plan}`}
                        {purchasedServices.plan &&
                          purchasedServices.addons.length > 0 &&
                          " • "}
                        {purchasedServices.addons.length > 0 &&
                          `${purchasedServices.addons.length} add-on(s) purchased`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Tabs for Packages vs Addons - HIDDEN FOR 499 FLOW */}
        {!is499OnlyFlow && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              {visibleTabs.includes("packages") && (
                <TabsTrigger value="packages">Packages</TabsTrigger>
              )}
              {visibleTabs.includes("addons") && (
                <TabsTrigger value="addons">Add-ons</TabsTrigger>
              )}
            </TabsList>

            {/* Packages Tab */}
            {visibleTabs.includes("packages") && (
              <TabsContent value="packages" className="mt-6">
                {packages.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        No Packages Available
                      </h3>
                      <p className="text-slate-600">
                        Please check back later for available packages.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column - Packages & Addons */}
                    <div className="lg:col-span-3 space-y-8">
                      {/* Packages Section */}
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                          Select Your Plan
                          {purchasedServices.plan && (
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-green-100 text-green-800"
                            >
                              Current: {purchasedServices.plan}
                            </Badge>
                          )}
                        </h2>
                        <div className="space-y-4">
                          {packages.map((pkg) => {
                            const isSelected = selectedPackage === pkg.id;
                            const isPurchased =
                              purchasedServices.plan === pkg.name;
                            const savings = getSavings(pkg);
                            const Icon = getPackageIcon(pkg);
                            const colorClass = getPackageColor(pkg);

                            return (
                              <Card
                                key={pkg.id}
                                className={`relative transition-all duration-300 ${
                                  isSelected
                                    ? "ring-2 ring-purple-500 shadow-lg border-purple-200"
                                    : isPurchased
                                    ? "ring-2 ring-green-500 shadow-lg border-green-200 bg-green-50"
                                    : "hover:shadow-md border-slate-200"
                                } ${
                                  isPurchased
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                                onClick={() =>
                                  !isPurchased && handlePackageSelect(pkg)
                                }
                              >
                                {pkg.isPopular && (
                                  <Badge className="absolute -top-3 left-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    Most Popular
                                  </Badge>
                                )}

                                {isPurchased && (
                                  <Badge className="absolute -top-3 right-6 bg-green-500 text-white">
                                    <Check className="w-3 h-3 mr-1" />
                                    Purchased
                                  </Badge>
                                )}

                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    {/* Package Info */}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-4 mb-3">
                                        <div
                                          className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center ${
                                            isPurchased ? "opacity-50" : ""
                                          }`}
                                        >
                                          <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                          <h3
                                            className={`text-xl font-bold ${
                                              isPurchased
                                                ? "text-green-700"
                                                : "text-slate-900"
                                            }`}
                                          >
                                            {pkg.name}
                                            {isPurchased && (
                                              <Check className="w-5 h-5 text-green-500 inline ml-2" />
                                            )}
                                          </h3>
                                          <p className="text-slate-600 text-sm mt-1">
                                            {pkg.description}
                                          </p>
                                        </div>
                                      </div>

                                      <ul className="space-y-2 text-sm text-slate-700 ml-16">
                                        {pkg.features?.map((feature, index) => (
                                          <li
                                            key={index}
                                            className="flex items-start gap-2"
                                          >
                                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    {/* Price & Select Button */}
                                    <div className="text-center md:text-right">
                                      <div className="mb-4">
                                        <div className="text-2xl font-bold text-slate-900">
                                          ₹{pkg.price?.toLocaleString("en-IN")}
                                        </div>
                                        {pkg.originalPrice &&
                                          pkg.originalPrice > pkg.price && (
                                            <>
                                              <div className="text-slate-500 line-through text-sm">
                                                ₹
                                                {pkg.originalPrice.toLocaleString(
                                                  "en-IN"
                                                )}
                                              </div>
                                              <div className="text-green-600 font-medium text-sm mt-1">
                                                Save ₹
                                                {savings.toLocaleString(
                                                  "en-IN"
                                                )}
                                              </div>
                                            </>
                                          )}
                                      </div>
                                      <Button
                                        className={`${
                                          isSelected
                                            ? "bg-slate-900 hover:bg-slate-800 text-white"
                                            : isPurchased
                                            ? "bg-green-100 text-green-700 border-green-200 cursor-not-allowed"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                                        }`}
                                        disabled={isPurchased}
                                      >
                                        {isPurchased ? (
                                          <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Purchased
                                          </>
                                        ) : isSelected ? (
                                          "Selected"
                                        ) : (
                                          "Select Plan"
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>

                      {/* Addons Section for Packages */}
                      {addons.length > 0 && (
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Enhance Your Package (Optional Add-ons)
                            {purchasedServices.addons.length > 0 && (
                              <Badge
                                variant="secondary"
                                className="ml-2 bg-green-100 text-green-800"
                              >
                                {purchasedServices.addons.length} purchased
                              </Badge>
                            )}
                          </h2>
                          <Card className="border-slate-200">
                            <CardContent className="p-6">
                              {loadingPurchased ? (
                                <div className="flex items-center justify-center py-8">
                                  <Loader2 className="w-6 h-6 animate-spin text-slate-400 mr-2" />
                                  <span className="text-slate-600">
                                    Checking purchased services...
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <div className="space-y-3">
                                    {addons.map((addon) => {
                                      const isSelected =
                                        selectedAddons.includes(addon.id);
                                      const isPurchased =
                                        purchasedServices.addons.includes(
                                          addon.name
                                        );

                                      return (
                                        <div
                                          key={addon.id}
                                          className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                                            isSelected
                                              ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                                              : isPurchased
                                              ? "ring-2 ring-green-500 bg-green-50 border-green-200 cursor-not-allowed"
                                              : "hover:bg-slate-50 border-slate-200 cursor-pointer"
                                          }`}
                                          onClick={() =>
                                            !isPurchased &&
                                            handleAddonToggle(addon.id)
                                          }
                                        >
                                          <div className="flex items-center gap-4">
                                            <div
                                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                isSelected
                                                  ? "bg-blue-500 border-blue-500"
                                                  : isPurchased
                                                  ? "bg-green-500 border-green-500"
                                                  : "border-slate-300"
                                              }`}
                                            >
                                              {(isSelected || isPurchased) && (
                                                <Check className="w-3 h-3 text-white" />
                                              )}
                                            </div>
                                            <div>
                                              <span
                                                className={`font-medium ${
                                                  isSelected
                                                    ? "text-blue-900"
                                                    : isPurchased
                                                    ? "text-green-900"
                                                    : "text-slate-900"
                                                }`}
                                              >
                                                {addon.name}
                                                {isPurchased && (
                                                  <Badge
                                                    variant="outline"
                                                    className="ml-2 text-green-600 border-green-300"
                                                  >
                                                    Purchased
                                                  </Badge>
                                                )}
                                              </span>
                                              <p className="text-sm text-slate-600 mt-1">
                                                {addon.description}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            {isPurchased ? (
                                              <Check className="w-5 h-5 text-green-500" />
                                            ) : (
                                              <span className="font-semibold text-slate-900">
                                                +₹
                                                {addon.price?.toLocaleString(
                                                  "en-IN"
                                                )}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Information Box */}
                                  {purchasedServices.addons.length > 0 && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                      <div className="flex items-center gap-2 text-sm text-blue-700">
                                        <Info className="w-4 h-4" />
                                        <span>
                                          Purchased addons are already included
                                          in your project and cannot be selected
                                          again.
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Fixed Order Summary */}
                    <div className="lg:col-span-1">
                      <OrderSummary
                        selectedPackage={selectedPackage}
                        selectedAddons={selectedAddons}
                        selectedProjectId={selectedProjectId}
                        userProjects={userProjects}
                        packages={packages}
                        addons={addons}
                        onPayment={handlePayment}
                        isProcessing={isProcessing}
                        projectDetails={projectDetails}
                        activeTab={activeTab}
                        purchasedServices={purchasedServices}
                        gstRate={gstRate}
                        couponCode={couponCode}
                        setCouponCode={setCouponCode}
                        appliedCoupon={appliedCoupon}
                        setAppliedCoupon={setAppliedCoupon}
                        isApplyingCoupon={isApplyingCoupon}
                        onApplyCoupon={handleApplyCoupon}
                        onRemoveCoupon={handleRemoveCoupon}
                        pricingBreakdown={pricingBreakdown}
                        is499OnlyFlow={false}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>
            )}

            {/* Addons Tab */}
            {visibleTabs.includes("addons") && (
              <TabsContent value="addons" className="mt-6">
                {addons.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Gift className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        No Add-ons Available
                      </h3>
                      <p className="text-slate-600">
                        Please check back later for available add-on services.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column - Addons */}
                    <div className="lg:col-span-3 space-y-8">
                      {/* Project Selection for Addons */}
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                          Select Project for Add-ons
                        </h2>
                        <Card className="border-slate-200">
                          <CardContent className="p-6">
                            {projectsLoading ? (
                              <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-400 mr-2" />
                                <span className="text-slate-600">
                                  Loading your projects...
                                </span>
                              </div>
                            ) : userProjects.length === 0 ? (
                              <div className="text-center py-8">
                                <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                                  No Projects Found
                                </h4>
                                <p className="text-slate-600 mb-4">
                                  You need to create a project first to purchase
                                  add-ons.
                                </p>
                                <Button
                                  onClick={() =>
                                    router.push("/dashboard/projects/new")
                                  }
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Building className="w-4 h-4 mr-2" />
                                  Create New Project
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <p className="text-sm text-slate-600 mb-4">
                                  Select which project you want to apply these
                                  add-ons to:
                                </p>
                                {userProjects.map((project) => {
                                  const isSelected =
                                    selectedProjectId === project.id;
                                  return (
                                    <div
                                      key={project.id}
                                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                                        isSelected
                                          ? "ring-2 ring-green-500 bg-green-50 border-green-200"
                                          : "hover:bg-slate-50 border-slate-200"
                                      }`}
                                      onClick={() =>
                                        setSelectedProjectId(project.id)
                                      }
                                    >
                                      <div className="flex items-center gap-4">
                                        <div
                                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                            isSelected
                                              ? "bg-green-500 border-green-500"
                                              : "border-slate-300"
                                          }`}
                                        >
                                          {isSelected && (
                                            <Check className="w-3 h-3 text-white" />
                                          )}
                                        </div>
                                        <div>
                                          <span
                                            className={`font-medium ${
                                              isSelected
                                                ? "text-green-900"
                                                : "text-slate-900"
                                            }`}
                                          >
                                            {project.title}
                                          </span>
                                          <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                            <span>{project.projectType}</span>
                                            {project.areaSqFt && (
                                              <span>
                                                • {project.areaSqFt} sq ft
                                              </span>
                                            )}
                                            {project.city && (
                                              <span>• {project.city}</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <Badge
                                        variant={
                                          isSelected ? "default" : "secondary"
                                        }
                                      >
                                        {project.status}
                                      </Badge>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      {/* Addons Selection */}
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                          Select Add-on Services
                          {purchasedServices.addons.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-green-100 text-green-800"
                            >
                              {purchasedServices.addons.length} purchased
                            </Badge>
                          )}
                        </h2>
                        <Card className="border-slate-200">
                          <CardContent className="p-6">
                            {loadingPurchased ? (
                              <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-400 mr-2" />
                                <span className="text-slate-600">
                                  Checking purchased services...
                                </span>
                              </div>
                            ) : (
                              <>
                                <div className="space-y-3">
                                  {addons.map((addon) => {
                                    const isSelected = selectedAddons.includes(
                                      addon.id
                                    );
                                    const isPurchased =
                                      purchasedServices.addons.includes(
                                        addon.name
                                      );

                                    return (
                                      <div
                                        key={addon.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                                          isSelected
                                            ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                                            : isPurchased
                                            ? "ring-2 ring-green-500 bg-green-50 border-green-200 cursor-not-allowed"
                                            : "hover:bg-slate-50 border-slate-200 cursor-pointer"
                                        }`}
                                        onClick={() =>
                                          !isPurchased &&
                                          handleAddonToggle(addon.id)
                                        }
                                      >
                                        <div className="flex items-center gap-4">
                                          <div
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                              isSelected
                                                ? "bg-blue-500 border-blue-500"
                                                : isPurchased
                                                ? "bg-green-500 border-green-500"
                                                : "border-slate-300"
                                            }`}
                                          >
                                            {(isSelected || isPurchased) && (
                                              <Check className="w-3 h-3 text-white" />
                                            )}
                                          </div>
                                          <div>
                                            <span
                                              className={`font-medium ${
                                                isSelected
                                                  ? "text-blue-900"
                                                  : isPurchased
                                                  ? "text-green-900"
                                                  : "text-slate-900"
                                              }`}
                                            >
                                              {addon.name}
                                              {isPurchased && (
                                                <Badge
                                                  variant="outline"
                                                  className="ml-2 text-green-600 border-green-300"
                                                >
                                                  Purchased
                                                </Badge>
                                              )}
                                            </span>
                                            <p className="text-sm text-slate-600 mt-1">
                                              {addon.description}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          {isPurchased ? (
                                            <Check className="w-5 h-5 text-green-500" />
                                          ) : (
                                            <span className="font-semibold text-slate-900">
                                              +₹
                                              {addon.price?.toLocaleString(
                                                "en-IN"
                                              )}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Information Box */}
                                {purchasedServices.addons.length > 0 && (
                                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-blue-700">
                                      <Info className="w-4 h-4" />
                                      <span>
                                        Purchased addons are already included in
                                        your project and cannot be selected
                                        again.
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Right Column - Fixed Order Summary */}
                    <div className="lg:col-span-1">
                      <OrderSummary
                        selectedPackage={null}
                        selectedAddons={selectedAddons}
                        selectedProjectId={selectedProjectId}
                        userProjects={userProjects}
                        packages={[]}
                        addons={addons}
                        onPayment={handlePayment}
                        isProcessing={isProcessing}
                        projectDetails={null}
                        activeTab={activeTab}
                        purchasedServices={purchasedServices}
                        gstRate={gstRate}
                        couponCode={couponCode}
                        setCouponCode={setCouponCode}
                        appliedCoupon={appliedCoupon}
                        setAppliedCoupon={setAppliedCoupon}
                        isApplyingCoupon={isApplyingCoupon}
                        onApplyCoupon={handleApplyCoupon}
                        onRemoveCoupon={handleRemoveCoupon}
                        pricingBreakdown={pricingBreakdown}
                        is499OnlyFlow={false}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        )}

        {/* ✅ SINGLE ROOM TRIAL LAYOUT (499-only flow) */}
        {is499OnlyFlow && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Single Room Package Only */}
            <div className="lg:col-span-3 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Single Room Trial Package
                </h2>
                <div className="space-y-4">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackage === pkg.id;
                    const savings = getSavings(pkg);
                    const Icon = getPackageIcon(pkg);
                    const colorClass = getPackageColor(pkg);

                    return (
                      <Card
                        key={pkg.id}
                        className={`relative transition-all duration-300 ${
                          isSelected
                            ? "ring-2 ring-purple-500 shadow-lg border-purple-200"
                            : "hover:shadow-md border-slate-200 cursor-pointer"
                        }`}
                        onClick={() => handlePackageSelect(pkg)}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            {/* Package Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-3">
                                <div
                                  className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center`}
                                >
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-slate-900">
                                    {pkg.name}
                                  </h3>
                                  <p className="text-slate-600 text-sm mt-1">
                                    {pkg.description}
                                  </p>
                                </div>
                              </div>

                              <ul className="space-y-2 text-sm text-slate-700 ml-16">
                                {pkg.features?.map((feature, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Price & Select Button */}
                            <div className="text-center md:text-right">
                              <div className="mb-4">
                                <div className="text-2xl font-bold text-slate-900">
                                  ₹{pkg.price?.toLocaleString("en-IN")}
                                </div>
                                {pkg.originalPrice &&
                                  pkg.originalPrice > pkg.price && (
                                    <>
                                      <div className="text-slate-500 line-through text-sm">
                                        ₹
                                        {pkg.originalPrice.toLocaleString(
                                          "en-IN"
                                        )}
                                      </div>
                                      <div className="text-green-600 font-medium text-sm mt-1">
                                        Save ₹{savings.toLocaleString("en-IN")}
                                      </div>
                                    </>
                                  )}
                              </div>
                              <Button
                                className={`${
                                  isSelected
                                    ? "bg-slate-900 hover:bg-slate-800 text-white"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                                }`}
                              >
                                {isSelected ? "Selected" : "Select Plan"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* No Addons Section for 499 Flow */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Single Room Trial - All Inclusive
                </h3>
                <p className="text-slate-600">
                  This package includes everything you need for a single room
                  design. Add-ons are not available with the trial package.
                </p>
              </div>
            </div>

            {/* Right Column - Fixed Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                selectedPackage={selectedPackage}
                selectedAddons={[]}
                selectedProjectId={selectedProjectId}
                userProjects={userProjects}
                packages={packages}
                addons={[]}
                onPayment={handlePayment}
                isProcessing={isProcessing}
                projectDetails={projectDetails}
                activeTab={activeTab}
                purchasedServices={purchasedServices}
                gstRate={gstRate}
                couponCode={""}
                setCouponCode={() => {}}
                appliedCoupon={null}
                setAppliedCoupon={() => {}}
                isApplyingCoupon={false}
                onApplyCoupon={() => {}}
                onRemoveCoupon={() => {}}
                pricingBreakdown={pricingBreakdown}
                is499OnlyFlow={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* GST Form Modal */}
      {showGSTForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <GSTDetailsForm
              onGSTDetailsChange={(details) => {
                setGstDetails(details);
                setShowGSTForm(false);
              }}
              initialData={gstDetails}
              onClose={() => setShowGSTForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}