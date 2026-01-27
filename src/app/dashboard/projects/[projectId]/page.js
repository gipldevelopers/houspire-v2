// src\app\dashboard\projects\[projectId]\page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  Share2,
  Download,
  MoreHorizontal,
  Clock,
  MapPin,
  Square,
  Calendar,
  Eye,
  Upload,
  FileText,
  Palette,
  Receipt,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Play,
  Home,
  IndianRupee,
  Target,
  Zap,
  Brain,
  Rocket,
  Loader2,
  Building,
  User,
  DollarSign,
  FolderOpen,
  Camera,
  Layers,
  Activity,
  BarChart3,
  QrCode,
  ChevronRight,
  ExternalLink,
  Phone,
  Mail,
  Star,
  MapPin as MapPinIcon,
  Briefcase,
  Award,
  Search,
  Sparkles,
  ClipboardList,
  Check,
  Heart,
  X,
  Info,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projectService } from "@/services/project.service";
import { toast } from "sonner";
import { PROJECT_STATUS } from "@/constants/projectStatus";
import api from "@/lib/axios";

const getStatusConfig = (status) => {
  return PROJECT_STATUS[status] || PROJECT_STATUS.DRAFT;
};

const getProgressValue = (status) => {
  return getStatusConfig(status).progress;
};

// Tabs configuration - UPDATED for single room trial
const getProjectTabs = (isSingleRoomTrial) => {
  const baseTabs = [
    { id: "overview", label: "Project Overview", icon: Eye },
    { id: "renders", label: "Renders", icon: ImageIcon },
    { id: "boq", label: "Budget & BOQ", icon: Receipt },
    { id: "vendors", label: "Vendors", icon: Users },
    { id: "design", label: "Design Progress", icon: Palette },
    { id: "payments", label: "Payments", icon: IndianRupee },
  ];

  // For single room trial, remove files and questionnaire tabs
  if (isSingleRoomTrial) {
    return baseTabs;
  }

  // For regular projects, include all tabs
  return [
    { id: "overview", label: "Project Overview", icon: Eye },
    { id: "uploads", label: "Project Files", icon: Upload },
    { id: "questionnaire", label: "Questionnaires", icon: ClipboardList },
    { id: "renders", label: "Renders", icon: ImageIcon },
    { id: "boq", label: "Budget & BOQ", icon: Receipt },
    { id: "vendors", label: "Vendors", icon: Users },
    { id: "design", label: "Design Progress", icon: Palette },
    { id: "payments", label: "Payments", icon: IndianRupee },
  ];
};

// Vendor status configuration
const getVendorStatusConfig = (status) => {
  const config = {
    PENDING: {
      label: "Pending",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      description: "Waiting for your response"
    },
    SENT: {
      label: "Sent",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      description: "Vendor list sent to you"
    },
    VIEWED: {
      label: "Viewed",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      description: "You've viewed the vendor"
    },
    CONTACTED: {
      label: "Contacted",
      color: "bg-cyan-100 text-cyan-800 border-cyan-200",
      description: "You've contacted the vendor"
    },
    ACCEPTED: {
      label: "Accepted",
      color: "bg-green-100 text-green-800 border-green-200",
      description: "You've accepted this vendor"
    },
    REJECTED: {
      label: "Rejected",
      color: "bg-red-100 text-red-800 border-red-200",
      description: "You've rejected this vendor"
    },
    SHORTLISTED: {
      label: "Shortlisted",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      description: "You've shortlisted this vendor"
    },
    HIRED: {
      label: "Hired",
      color: "bg-green-100 text-green-800 border-green-200",
      description: "You've hired this vendor"
    }
  };
  return config[status] || config.PENDING;
};

// Onboarding Questionnaire questions configuration
// const ONBOARDING_QUESTIONS = [
//   {
//     id: "q1",
//     title: "How would you describe your dream home?",
//     options: [
//       "Modern & Minimal",
//       "Warm & Cozy",
//       "Luxury & Premium",
//       "Functional & Practical",
//       "Not sure yet, need inspiration",
//     ],
//   },
//   {
//     id: "q2",
//     title: "What matters most to you when planning interiors?",
//     options: [
//       "Speed (get it done quickly)",
//       "Investment Clarity (clear budgets upfront)",
//       "Aesthetics (design & style focus)",
//       "Long-term Ease of Maintenance",
//     ],
//   },
//   {
//     id: "q3",
//     title: "Which stage are you at right now?",
//     options: [
//       "Just bought my home",
//       "About to get possession",
//       "Already living in it",
//       "Renovating my current home",
//     ],
//   },
//   {
//     id: "q4",
//     title: "What is the biggest challenge you're facing with interiors?",
//     options: [
//       "Too many options, hard to decide",
//       "Unclear costs / hidden charges",
//       "Lack of time to plan properly",
//       "Coordinating with designers / contractors",
//     ],
//   },
// ];

const ONBOARDING_QUESTIONS = [
  {
    id: "q1",
    title: "What are you looking to create, and what do you need clarity on?",
    options: [
      "Calm & minimal",
      "Modern & stylish",
      "Warm & functional",
      "Simple & luxe",
    ],
  },
  {
    id: "q2",
    title: "Where are you in your interior journey right now?",
    options: [
      "Just bought / getting possession",
      "Researching & comparing options",
      "Spoken to designers but still unsure",
      "Ready to start — need final clarity",
      "In execution — need better direction",
    ],
  },
];

// Design Questionnaire steps configuration
// const DESIGN_QUESTIONNAIRE_STEPS = [
//   {
//     id: 1,
//     title: "Space Users",
//     description: "Understand who uses your space",
//     question: "Who will be primarily using each space in your home?",
//     type: "checkbox",
//     field: "spaceUsers",
//     required: true,
//     options: [
//       { value: "ADULTS", label: "Adults", description: "Primary residents and family members" },
//       { value: "KIDS", label: "Kids", description: "Children and teenagers" },
//       { value: "ELDERLY", label: "Elderly", description: "Senior family members" },
//       { value: "GUESTS", label: "Guests", description: "Regular visitors and friends" },
//       { value: "STAFF", label: "Staff", description: "Domestic help or caretakers" }
//     ]
//   },
//   {
//     id: 2,
//     title: "Home Activities",
//     description: "How you spend time at home",
//     question: "How do you usually spend time at home?",
//     type: "checkbox",
//     field: "homeActivities",
//     required: true,
//     options: [
//       { value: "ENTERTAINING_GUESTS", label: "Entertaining Guests", description: "Hosting friends and family gatherings" },
//       { value: "WORKING_FROM_HOME", label: "Working from Home", description: "Remote work and professional activities" },
//       { value: "FAMILY_TIME", label: "Family Time", description: "Quality time with family members" },
//       { value: "HOBBIES_CREATIVITY", label: "Hobbies & Creativity", description: "Pursuing personal interests and creative projects" },
//       { value: "RELAXATION", label: "Relaxation", description: "Unwinding and personal downtime" }
//     ]
//   },
//   {
//     id: 3,
//     title: "Storage Philosophy",
//     description: "Your approach to organization",
//     question: "What's your storage philosophy?",
//     type: "radio",
//     field: "storagePhilosophy",
//     required: true,
//     options: [
//       { value: "HIDDEN_MINIMAL", label: "Hidden & Minimal", description: "Clean surfaces, concealed storage" },
//       { value: "FUNCTIONAL_PRACTICAL", label: "Functional & Practical", description: "Easy access, organized systems" },
//       { value: "DISPLAY_ORIENTED", label: "Display-Oriented", description: "Showcase items, open shelving" }
//     ]
//   },
//   {
//     id: 4,
//     title: "Material Preferences",
//     description: "Elements you love and avoid",
//     question: "What materials, colors, or elements do you prefer?",
//     type: "materialPreferences",
//     field: "materialPreferences",
//     required: true,
//     sections: [
//       {
//         title: "Love:",
//         field: "love",
//         options: [
//           { value: "WOOD", label: "Wood" },
//           { value: "MARBLE_STONE", label: "Marble / Stone" },
//           { value: "BRIGHT_COLORS", label: "Bright Colors" },
//           { value: "NEUTRAL_PALETTE", label: "Neutral Palette" },
//           { value: "METAL_GLASS_ACCENTS", label: "Metal / Glass Accents" }
//         ]
//       },
//       {
//         title: "Avoid:",
//         field: "avoid",
//         options: [
//           { value: "DARK_COLORS", label: "Dark Colors" },
//           { value: "GLOSSY_FINISHES", label: "Glossy Finishes" },
//           { value: "HEAVY_WOODWORK", label: "Heavy Woodwork" },
//           { value: "CLUTTERED_DECOR", label: "Cluttered Decor" }
//         ]
//       }
//     ]
//   },
//   {
//     id: 5,
//     title: "Cultural Requirements",
//     description: "Spiritual and cultural preferences",
//     question: "Do you have any cultural, spiritual, or vastu-based requirements?",
//     type: "checkbox",
//     field: "culturalRequirements",
//     required: true,
//     options: [
//       { value: "VASTU_ALIGNMENT", label: "Yes — Vastu Alignment (rooms, kitchen, entrances)", description: "Traditional spatial arrangements" },
//       { value: "PRAYER_MEDITATION_SPACE", label: "Yes — Prayer Room / Meditation Space", description: "Dedicated spiritual area" },
//       { value: "CULTURAL_SYMBOLS", label: "Yes — Cultural Symbols (murals, artifacts, etc.)", description: "Traditional decorative elements" },
//       { value: "NO_REQUIREMENTS", label: "No specific requirements", description: "Modern approach without specific traditions" }
//     ]
//   },
//   {
//     id: 6,
//     title: "Home Mood",
//     description: "The atmosphere you want to create",
//     question: "How do you imagine the mood of your home?",
//     type: "radio",
//     field: "homeMood",
//     required: true,
//     options: [
//       { value: "BRIGHT_AIRY", label: "Bright & Airy", description: "Light-filled, spacious feeling" },
//       { value: "WARM_COZY", label: "Warm & Cozy", description: "Intimate, comfortable atmosphere" },
//       { value: "BALANCED", label: "Balanced (varies room to room)", description: "Different moods for different spaces" }
//     ]
//   },
//   {
//     id: 7,
//     title: "Furniture Preference",
//     description: "Your approach to furniture selection",
//     question: "When it comes to furniture, what's your preference?",
//     type: "radio",
//     field: "furniturePreference",
//     required: true,
//     options: [
//       { value: "TIMELESS_INVESTMENT", label: "Timeless, Investment Pieces", description: "Quality furniture that lasts for years" },
//       { value: "FLEXIBLE_REPLACEABLE", label: "Flexible, Replaceable Options", description: "Adaptable furniture that can change with trends" },
//       { value: "MIX_OF_BOTH", label: "Mix of Both", description: "Combination of investment pieces and flexible options" }
//     ]
//   },
//   {
//     id: 8,
//     title: "Lifestyle Must-Haves",
//     description: "Essential features for your daily life",
//     question: "Any lifestyle-driven must-haves?",
//     type: "checkbox",
//     field: "lifestyleMustHaves",
//     required: true,
//     options: [
//       { value: "HOME_OFFICE", label: "Home Office", description: "Dedicated workspace" },
//       { value: "KIDS_PLAY_AREA", label: "Kids' Play Area", description: "Space for children to play" },
//       { value: "PET_FRIENDLY_SPACES", label: "Pet-Friendly Spaces", description: "Areas designed for pets" },
//       { value: "GYM_FITNESS_CORNER", label: "Gym / Fitness Corner", description: "Exercise and wellness area" },
//       { value: "ENTERTAINMENT_ZONE", label: "Entertainment Zone (TV/Projector, Music, Gaming)", description: "Media and entertainment space" }
//     ]
//   },
//   {
//     id: 9,
//     title: "Maintenance Level",
//     description: "Your comfort with upkeep",
//     question: "What level of maintenance are you comfortable with?",
//     type: "radio",
//     field: "maintenanceLevel",
//     required: true,
//     options: [
//       { value: "LOW_MAINTENANCE", label: "Low Maintenance (easy-clean finishes)", description: "Minimal upkeep required" },
//       { value: "MODERATE_UPKEEP", label: "Moderate Upkeep", description: "Regular maintenance acceptable" },
//       { value: "HIGH_MAINTENANCE", label: "High Maintenance (luxury finishes, special care)", description: "Willing to maintain premium materials" }
//     ]
//   },
//   {
//     id: 10,
//     title: "First Impression",
//     description: "The feeling you want to create",
//     question: "When you imagine walking into your finished home, what's the first feeling you want?",
//     type: "radio",
//     field: "firstImpression",
//     required: true,
//     options: [
//       { value: "PEACE_CALM", label: "Peace & Calm", description: "Tranquil and serene atmosphere" },
//       { value: "PRIDE_LUXURY", label: "Pride & Luxury", description: "Elegant and impressive space" },
//       { value: "WARMTH_TOGETHERNESS", label: "Warmth & Togetherness", description: "Welcoming and family-friendly" },
//       { value: "INSPIRATION_ENERGY", label: "Inspiration & Energy", description: "Dynamic and motivating environment" }
//     ]
//   },
//   {
//     id: 11,
//     title: "Special Requirements",
//     description: "Make it uniquely yours",
//     question: "Any special requirements or must-haves for your space?",
//     type: "textarea",
//     field: "specialRequirements",
//     required: false,
//     placeholder: "Examples: Pet-friendly furniture, wheelchair accessibility, home office setup, meditation corner, specific cultural elements, entertainment system, reading nook, plant-friendly spaces..."
//   }
// ];

// Design Questionnaire steps configuration - UPDATED
const DESIGN_QUESTIONNAIRE_STEPS = [
  {
    id: 1,
    title: "Space Users & Lifestyle",
    description: "Understand who uses your space",
    question: "Who will be using the space, and how do you usually spend time at home?",
    type: "radio",
    field: "spaceUsersLifestyle",
    required: true,
    options: [
      { value: "JUST_ME", label: "Just me — simple routines", description: "Individual living with minimal needs" },
      { value: "COUPLE", label: "Couple — relaxed, functional living", description: "Shared space for two with practical needs" },
      { value: "FAMILY_WITH_KIDS", label: "Family with kids — active, storage-heavy", description: "Active household with children requiring ample storage" },
      { value: "MULTIGENERATIONAL", label: "Multigenerational home — shared needs", description: "Multiple generations living together with diverse requirements" },
      { value: "FREQUENT_TRAVELER", label: "I travel a lot — low-maintenance living", description: "Requires easy maintenance and minimal upkeep" }
    ]
  },
  {
    id: 2,
    title: "Home Atmosphere",
    description: "The feeling you want to create",
    question: "How do you want your home to feel when you walk in?",
    type: "radio",
    field: "homeAtmosphere",
    required: true,
    options: [
      { value: "CALM_MINIMAL", label: "Calm & minimal", description: "Peaceful and uncluttered space" },
      { value: "WARM_COZY", label: "Warm & cozy", description: "Comfortable and inviting atmosphere" },
      { value: "MODERN_STYLISH", label: "Modern & stylish", description: "Contemporary and fashionable design" },
      { value: "SIMPLE_LUXE", label: "Simple & luxe", description: "Elegant luxury with simplicity" },
      { value: "FUNCTIONAL_PRACTICAL", label: "Functional & practical", description: "Practical and efficient living space" }
    ]
  },
  {
    id: 3,
    title: "Material Preferences",
    description: "Elements you love",
    question: "What materials, colours or styles are you drawn to?",
    type: "checkbox",
    field: "materialPreferences",
    required: true,
    options: [
      { value: "WARM_WOODS_NEUTRALS", label: "Warm woods & neutrals", description: "Natural wood tones and neutral colors" },
      { value: "MODERN_FINISHES", label: "Modern finishes, glass & metal", description: "Contemporary materials like glass and metal accents" },
      { value: "LIGHT_WOODS_SOFT_PASTELS", label: "Light woods & soft pastels", description: "Light-colored woods and gentle pastel shades" },
      { value: "RICH_TONES_PREMIUM_TEXTURES", label: "Rich tones & premium textures", description: "Deep colors and luxurious textures" },
      { value: "SIMPLE_DURABLE_MATERIALS", label: "Simple & durable materials", description: "Practical materials that last long" }
    ]
  },
  {
    id: 4,
    title: "Storage Style",
    description: "Your approach to organization",
    question: "What's your storage style?",
    type: "radio",
    field: "storageStyle",
    required: true,
    options: [
      { value: "MINIMAL_ESSENTIALS", label: "Minimal — just the essentials", description: "Only keep what is absolutely necessary" },
      { value: "CLEAN_CONCEALED", label: "Clean & concealed", description: "Everything hidden away for a clean look" },
      { value: "FUNCTIONAL_EVERYWHERE", label: "Functional — storage everywhere", description: "Maximize storage in all possible areas" },
      { value: "MAXIMIZE_EVERY_INCH", label: "Maximise every inch", description: "Utilize every available space for storage" }
    ]
  },
  {
    id: 5,
    title: "Cultural Requirements",
    description: "Spiritual and cultural preferences",
    question: "Any cultural, spiritual or Vastu requirements?",
    type: "radio",
    field: "culturalRequirements",
    required: true,
    options: [
      { value: "STRICT_VASTU", label: "Yes, strict Vastu", description: "Need strict adherence to Vastu principles" },
      { value: "PREFER_VASTU_FLEXIBLE", label: "Prefer Vastu but flexible", description: "Prefer Vastu but open to adjustments" },
      { value: "CULTURAL_SPIRITUAL_NEEDS", label: "Cultural/spiritual needs", description: "Specific cultural or spiritual requirements" },
      { value: "NO_REQUIREMENTS", label: "No specific requirements", description: "Modern approach without specific traditions" },
      { value: "NOT_SURE_YET", label: "Not sure yet", description: "Still exploring options and preferences" }
    ]
  },
  {
    id: 6,
    title: "Lifestyle Must-Haves",
    description: "Essential features for your daily life",
    question: "Any lifestyle must-haves we should know about?",
    type: "checkbox",
    field: "lifestyleMustHaves",
    required: true,
    options: [
      { value: "LOW_MAINTENANCE_MATERIALS", label: "Low-maintenance materials", description: "Materials that require minimal upkeep" },
      { value: "PET_KID_FRIENDLY", label: "Pet-friendly / kid-friendly choices", description: "Durable and safe options for pets and children" },
      { value: "SMART_HOME_FEATURES", label: "Smart home features", description: "Automation and smart technology integration" },
      { value: "SPECIFIC_FURNITURE_PREFERENCES", label: "Specific furniture preferences", description: "Particular furniture styles or pieces" },
      { value: "HIGH_DURABILITY_FINISHES", label: "High-durability finishes", description: "Finishes that withstand heavy use" },
      { value: "NOTHING_SPECIFIC", label: "Nothing specific", description: "No particular requirements" }
    ]
  },
  {
    id: 7,
    title: "Special Requirements",
    description: "Make it uniquely yours",
    question: "Any special requirements or must-haves for your space?",
    type: "textarea",
    field: "specialRequirements",
    required: false,
    placeholder: "Examples: Pet-friendly furniture, wheelchair accessibility, home office setup, meditation corner, specific cultural elements, entertainment system, reading nook, plant-friendly spaces..."
  }
];

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId;

  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState(null);
  const [vendors, setVendors] = useState(null);
  const [designQuestionnaire, setDesignQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [designQuestionnaireLoading, setDesignQuestionnaireLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if project is single room trial
  const isSingleRoomTrial = project?.selectedPlan === '499' || project?.isSingleRoomPlan;

  // Get tabs based on project type
  const projectTabs = getProjectTabs(isSingleRoomTrial);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError(null);

      const projectResponse = await projectService.getProjectDetails(projectId);

      if (projectResponse.success) {
        const projectData = projectResponse.data.project;
        
        // Extract database ID from nested objects
        const databaseId = projectData.roomPhotos?.[0]?.projectId || 
                          projectData.renders?.[0]?.projectId || 
                          projectData.boqs?.[0]?.projectId ||
                          projectData.payments?.[0]?.projectId;

        // Check if it's a single room trial
      const isSingleRoomPlan = projectData.selectedPlan === 'Single Room Trial' || 
                        projectData.selectedPlan === '499' ||
                        projectData.packageType === '499' ||
                        projectData.isSingleRoomPlan;

        // Enhance project data with calculated fields
        const enhancedProject = {
          ...projectData,
          databaseId: databaseId, // Store database ID separately
          // Keep the original id field as publicId for URLs
          publicId: projectData.id || projectData.publicId,
          isSingleRoomPlan: isSingleRoomPlan,
          paymentCompleted:
            projectData.payments &&
            projectData.payments.some((p) => p.status === "COMPLETED"),
          designPreferencesCompleted:
            projectData.status === "DESIGN_QUESTIONNAIRE_COMPLETED" ||
            projectData.status === "RENDER_IN_PROGRESS" ||
            projectData.status === "RENDER_COMPLETED" ||
            projectData.status === "BOQ_GENERATED" ||
            projectData.status === "COMPLETED",
          progress: getProgressValue(projectData.status),
          designStartTime: projectData.designStartTime || null,
          fileCounts: projectData._count || {
            floorPlans: projectData.floorPlans?.length || 0,
            roomPhotos: projectData.roomPhotos?.length || 0,
            renders: projectData.renders?.length || 0,
            boqs: projectData.boqs?.length || 0,
            fileUploads: projectData.fileUploads?.length || 0,
          },
        };
        setProject(enhancedProject);
      } else {
        throw new Error(projectResponse.message || "Failed to load project");
      }
    } catch (error) {
      console.error("❌ Error loading project:", error);
      setError(error.message || "Failed to load project data");
      toast.error("Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  const loadDesignQuestionnaire = async () => {
    if (!projectId || isSingleRoomTrial) return;
    
    try {
      setDesignQuestionnaireLoading(true);
      
      const response = await api.get(`/projects/${projectId}/design-questionnaire`);
      
      if (response.data.success) {
        setDesignQuestionnaire(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to load design questionnaire");
      }
    } catch (error) {
      console.error("❌ Error loading design questionnaire:", error);
      // Don't show toast for this as it's optional data
    } finally {
      setDesignQuestionnaireLoading(false);
    }
  };

  const loadVendorsData = async () => {
    if (!projectId || !project) return;
    
    try {
      setVendorsLoading(true);
      
      // Use the database ID (project.databaseId) instead of publicId
      const response = await api.get(`/projects-vendor/user/projects/${project.databaseId}`);
      
      if (response.data.success) {
        setVendors(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to load vendors");
      }
    } catch (error) {
      console.error("❌ Error loading vendors:", error);
      toast.error("Failed to load vendor data");
    } finally {
      setVendorsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  useEffect(() => {
    if (activeTab === "vendors" && project && project.databaseId) {
      loadVendorsData();
    }
    
    if (activeTab === "questionnaire" && !isSingleRoomTrial) {
      loadDesignQuestionnaire();
    }
  }, [activeTab, project, isSingleRoomTrial]);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateRelative = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(dateString);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Status badges
  const getPaymentStatusBadge = (status) => {
    const config = {
      PENDING: {
        label: "Pending",
        color: "bg-amber-100 text-amber-800 border-amber-200",
      },
      PROCESSING: {
        label: "Processing",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      COMPLETED: {
        label: "Completed",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      FAILED: {
        label: "Failed",
        color: "bg-red-100 text-red-800 border-red-200",
      },
      REFUNDED: {
        label: "Refunded",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      },
    };
    return config[status] || config.PENDING;
  };

  const getRenderStatusBadge = (status) => {
    const config = {
      PENDING: {
        label: "Pending",
        color: "bg-amber-100 text-amber-800 border-amber-200",
      },
      PROCESSING: {
        label: "Processing",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      COMPLETED: {
        label: "Completed",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      FAILED: {
        label: "Failed",
        color: "bg-red-100 text-red-800 border-red-200",
      },
    };
    return config[status] || config.PENDING;
  };

  // Generate timeline milestones - UPDATED for single room trial
  const generateMilestones = () => {
    if (!project) return [];

    const milestones = [
      {
        id: 1,
        title: "Project Created",
        status: "completed",
        date: project.createdAt,
        description: "Project setup and basic information",
        icon: CheckCircle2,
      },
    ];

    // For single room trial, show simplified milestones
    if (isSingleRoomTrial) {
      // Room image upload
      if (project.fileCounts.roomPhotos > 0) {
        milestones.push({
          id: 2,
          title: "Room Image Uploaded",
          status: "completed",
          date: project.updatedAt,
          description: "Single room photo uploaded",
          icon: CheckCircle2,
        });
      }

      // Payment
      if (project.paymentCompleted) {
        milestones.push({
          id: 3,
          title: "Payment Processed",
          status: "completed",
          date: project.paymentCompletedAt,
          description: "Single room trial activated",
          icon: CheckCircle2,
        });
      }

      // Current milestone based on status
      let currentMilestone = null;
      if (project.status === "RENDER_IN_PROGRESS") {
        currentMilestone = {
          id: milestones.length + 1,
          title: "Design Generation",
          status: "current",
          date: project.designStartTime,
          description: "is creating your single room design",
          icon: Rocket,
          progress: project.progress,
        };
      } else if (project.status === "RENDER_COMPLETED") {
        currentMilestone = {
          id: milestones.length + 1,
          title: "3D Render Ready",
          status: "completed",
          date: project.updatedAt,
          description: "Single room render generated",
          icon: CheckCircle2,
        };
      } else if (project.status === "BOQ_GENERATED") {
        currentMilestone = {
          id: milestones.length + 1,
          title: "Budget Breakdown Ready",
          status: "completed",
          date: project.updatedAt,
          description: "Basic budget breakdown ready",
          icon: CheckCircle2,
        };
      }

      if (currentMilestone) {
        milestones.push(currentMilestone);
      }

      // Add upcoming milestones
      if (!["RENDER_COMPLETED", "BOQ_GENERATED", "COMPLETED"].includes(project.status)) {
        milestones.push({
          id: milestones.length + 1,
          title: "3D Render",
          status: "upcoming",
          date: "",
          description: "Single room design visualization",
          icon: Clock,
        });
      }

      if (!["BOQ_GENERATED", "COMPLETED"].includes(project.status)) {
        milestones.push({
          id: milestones.length + 1,
          title: "Budget Breakdown",
          status: "upcoming",
          date: "",
          description: "Basic cost breakdown",
          icon: Clock,
        });
      }

      return milestones;
    }

    // Regular project milestones (existing code)
    // Style selection
    if (project.selectedStyle) {
      milestones.push({
        id: 2,
        title: "Style Selected",
        status: "completed",
        date: project.updatedAt,
        description: `Selected: ${project.selectedStyle?.name}`,
        icon: CheckCircle2,
      });
    }

    // Questionnaire
    if (project.questionnaire?.isCompleted) {
      milestones.push({
        id: 3,
        title: "Questionnaire Completed",
        status: "completed",
        date: project.questionnaireCompletedAt,
        description: "Basic preferences submitted",
        icon: CheckCircle2,
      });
    }

    // File uploads
    if (
      project.fileCounts.floorPlans > 0 ||
      project.fileCounts.roomPhotos > 0
    ) {
      milestones.push({
        id: 4,
        title: "Files Uploaded",
        status: "completed",
        date: project.updatedAt,
        description: `${
          project.fileCounts.floorPlans + project.fileCounts.roomPhotos
        } files uploaded`,
        icon: CheckCircle2,
      });
    }

    // Payment
    if (project.paymentCompleted) {
      milestones.push({
        id: 5,
        title: "Payment Processed",
        status: "completed",
        date: project.paymentCompletedAt,
        description: "Project package activated",
        icon: CheckCircle2,
      });
    }

    // Current milestone based on status
    let currentMilestone = null;
    if (project.status === "RENDER_IN_PROGRESS") {
      currentMilestone = {
        id: milestones.length + 1,
        title: "Design Generation",
        status: "current",
        date: project.designStartTime,
        description: "is creating your 3D renders",
        icon: Rocket,
        progress: project.progress,
      };
    } else if (project.status === "RENDER_COMPLETED") {
      currentMilestone = {
        id: milestones.length + 1,
        title: "3D Renders Ready",
        status: "completed",
        date: project.updatedAt,
        description: `${project.fileCounts.renders} renders generated`,
        icon: CheckCircle2,
      };
    } else if (project.status === "BOQ_GENERATED") {
      currentMilestone = {
        id: milestones.length + 1,
        title: "BOQ Generated",
        status: "completed",
        date: project.updatedAt,
        description: "Detailed budget breakdown ready",
        icon: CheckCircle2,
      };
    }

    if (currentMilestone) {
      milestones.push(currentMilestone);
    }

    // Add upcoming milestones
    if (
      !["RENDER_COMPLETED", "BOQ_GENERATED", "COMPLETED"].includes(
        project.status
      )
    ) {
      milestones.push({
        id: milestones.length + 1,
        title: "3D Renders",
        status: "upcoming",
        date: "",
        description: "generated design visualizations",
        icon: Clock,
      });
    }

    if (!["BOQ_GENERATED", "COMPLETED"].includes(project.status)) {
      milestones.push({
        id: milestones.length + 1,
        title: "BOQ Generation",
        status: "upcoming",
        date: "",
        description: "Detailed cost breakdown",
        icon: Clock,
      });
    }

    return milestones;
  };

  // Quick stats for overview
  const quickStats = [
    {
      label: "Project Value",
      value: project?.budgetRange ? formatCurrency(project.budgetRange) : "N/A",
      icon: IndianRupee,
      color: "text-green-600",
      description: "Estimated budget",
    },
    {
      label: "Timeline",
      value: project?.timeline || "N/A",
      icon: Clock,
      color: "text-blue-600",
      description: "Project timeline",
    },
    {
      label: "Area",
      value: project?.areaSqFt ? `${project.areaSqFt} sq ft` : "N/A",
      icon: Home,
      color: "text-purple-600",
      description: "Total area",
    },
    {
      label: "Status",
      value: getStatusConfig(project?.status)?.label || "N/A",
      icon: Zap,
      color: "text-amber-600",
      description: "Current phase",
    },
  ];

  // Helper function to render design questionnaire answers
  const renderDesignQuestionnaireAnswer = (step, answers) => {
    const answer = answers[step.field];
    
    if (!answer) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <X className="w-4 h-4" />
          Not answered
        </div>
      );
    }

    switch (step.type) {
      case 'radio':
        const radioOption = step.options.find(opt => opt.value === answer);
        return (
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-foreground">
              {radioOption?.label || answer}
            </span>
            {radioOption?.description && (
              <span className="text-muted-foreground text-xs">
                ({radioOption.description})
              </span>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {Array.isArray(answer) && answer.map((value) => {
              const option = step.options.find(opt => opt.value === value);
              return (
                <div key={value} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-foreground">
                    {option?.label || value}
                  </span>
                  {option?.description && (
                    <span className="text-muted-foreground text-xs">
                      ({option.description})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );

      case 'materialPreferences':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Love Section */}
            <div>
              <h5 className="font-medium text-foreground mb-2">Love:</h5>
              <div className="space-y-1">
                {answer.love && Array.isArray(answer.love) && answer.love.length > 0 ? (
                  answer.love.map((value) => {
                    const option = step.sections?.[0]?.options?.find(opt => opt.value === value);
                    return (
                      <div key={value} className="flex items-center gap-2 text-sm">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-foreground">
                          {option?.label || value}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">None selected</p>
                )}
              </div>
            </div>

            {/* Avoid Section */}
            <div>
              <h5 className="font-medium text-foreground mb-2">Avoid:</h5>
              <div className="space-y-1">
                {answer.avoid && Array.isArray(answer.avoid) && answer.avoid.length > 0 ? (
                  answer.avoid.map((value) => {
                    const option = step.sections?.[1]?.options?.find(opt => opt.value === value);
                    return (
                      <div key={value} className="flex items-center gap-2 text-sm">
                        <X className="w-4 h-4 text-gray-500" />
                        <span className="text-foreground">
                          {option?.label || value}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">None selected</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-foreground whitespace-pre-wrap">
              {answer}
            </p>
          </div>
        );

      default:
        return (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-foreground">
              {typeof answer === "object" ? JSON.stringify(answer, null, 2) : String(answer)}
            </p>
          </div>
        );
    }
  };

  // Generate design stages - UPDATED for single room trial
  const generateDesignStages = () => {
    if (isSingleRoomTrial) {
      return [
        {
          stage: "Project Setup",
          status: "completed",
          description: "Basic information and room image",
          required: true,
        },
        {
          stage: "Payment Processing",
          status: project.paymentCompleted
            ? "completed"
            : project.status === "PAYMENT_COMPLETED"
            ? "completed"
            : "pending",
          description: "Single room trial payment",
          required: true,
        },
        {
          stage: "Design Generation",
          status: [
            "RENDER_IN_PROGRESS",
            "RENDER_COMPLETED",
            "BOQ_GENERATED",
            "COMPLETED",
          ].includes(project.status)
            ? "completed"
            : "current",
          description: "Creating single room design and budget",
          required: true,
        },
        {
          stage: "Review & Approval",
          status: ["BOQ_GENERATED", "COMPLETED"].includes(
            project.status
          )
            ? "completed"
            : "upcoming",
          description: "Final review and adjustments",
          required: false,
        },
      ];
    }

    // Regular project stages
    return [
      {
        stage: "Project Setup",
        status: "completed",
        description: "Basic information and preferences",
        required: true,
      },
      {
        stage: "Style Selection",
        status: project.selectedStyle ? "completed" : "pending",
        description: "Design style chosen",
        required: true,
      },
      {
        stage: "File Upload",
        status:
          project.fileCounts.floorPlans > 0 ||
          project.fileCounts.roomPhotos > 0
            ? "completed"
            : "pending",
        description: "Floor plans and room photos",
        required: true,
      },
      {
        stage: "Payment Processing",
        status: project.paymentCompleted
          ? "completed"
          : project.status === "PAYMENT_COMPLETED"
          ? "completed"
          : "pending",
        description: "Project package payment",
        required: true,
      },
      {
        stage: "Design Questionnaire",
        status: project.designPreferencesCompleted
          ? "completed"
          : "pending",
        description: "Detailed design preferences",
        required: true,
      },
      {
        stage: "Design Generation",
        status: [
          "RENDER_IN_PROGRESS",
          "RENDER_COMPLETED",
          "BOQ_GENERATED",
          "COMPLETED",
        ].includes(project.status)
          ? "completed"
          : "current",
        description: "Creating 3D renders and BOQ",
        required: true,
      },
      {
        stage: "Review & Approval",
        status: ["BOQ_GENERATED", "COMPLETED"].includes(
          project.status
        )
          ? "completed"
          : "upcoming",
        description: "Final review and adjustments",
        required: false,
      },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {error ? "Error Loading Project" : "Project Not Found"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || "The project you're looking for doesn't exist."}
          </p>
          <Link href="/dashboard/projects">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusConfig(project.status);
  const milestones = generateMilestones();
  const designStages = generateDesignStages();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/projects">
                <Button variant="ghost" size="sm" className="hover:bg-accent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                    {project.title}
                  </h1>
                  {isSingleRoomTrial && (
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                      Single Room Trial
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {/* Project ID: {project.publicId} • Created{" "} */}
                  Project ID: {project.displayId} • Created{" "}
                  {formatDateRelative(project.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* Tab Navigation */}
          <div className="overflow-x-auto">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground min-w-max">
              {projectTabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                  >
                    <TabIcon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Project Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-primary" />
                      Project Summary
                      {isSingleRoomTrial && (
                        <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-700 border-orange-200">
                          ₹499 Single Room Plan
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {isSingleRoomTrial 
                        ? "Single room design project details" 
                        : "Complete details about your interior design project"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                      {project.description || "No description provided."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Location
                          </span>
                        </div>
                        <p className="text-foreground font-medium">
                          {project.address || "N/A"}
                          {project.city && `, ${project.city}`}
                          {project.state && `, ${project.state}`}
                        </p>

                        <div className="flex items-center gap-2 text-sm">
                          <Home className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {isSingleRoomTrial ? "Room Type" : "Property Type"}
                          </span>
                        </div>
                        <p className="text-foreground font-medium">
                          {isSingleRoomTrial 
                            ? "Single Room" 
                            : project.projectType?.replace(/_/g, " ") || "N/A"
                          }
                        </p>
                      </div>

                      <div className="space-y-3">
                        {!isSingleRoomTrial && (
                          <>
                            <div className="flex items-center gap-2 text-sm">
                              <Square className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Area</span>
                            </div>
                            <p className="text-foreground font-medium">
                              {project.areaSqFt
                                ? `${project.areaSqFt} sq ft`
                                : "N/A"}
                            </p>
                          </>
                        )}

                        <div className="flex items-center gap-2 text-sm">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Timeline
                          </span>
                        </div>
                        <p className="text-foreground font-medium">
                          {project.timeline || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Selected Style - Only show for regular projects */}
                    {!isSingleRoomTrial && project.selectedStyle && (
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-sm mb-3">
                          <Palette className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Selected Style
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <img
                            src={project.selectedStyle.imageUrl}
                            alt={project.selectedStyle.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-foreground">
                              {project.selectedStyle.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {project.selectedStyle.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Single Room Trial Info */}
                    {isSingleRoomTrial && (
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-sm mb-3">
                          <Info className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Single Room Trial Features
                          </span>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              <span>1 room 3D design</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              <span>Randomly selected style</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              <span>Basic budget breakdown</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              <span>3 vendor recommendations</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              <span>100% refund if unsatisfied</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Project Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Project Timeline
                    </CardTitle>
                    <CardDescription>
                      Track your project progress from start to finish
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {milestones.map((milestone, index) => {
                        const isCompleted = milestone.status === "completed";
                        const isCurrent = milestone.status === "current";
                        const isUpcoming = milestone.status === "upcoming";

                        const Icon = milestone.icon;

                        return (
                          <div
                            key={milestone.id}
                            className="flex items-start gap-4"
                          >
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                isCompleted
                                  ? "bg-green-100 text-green-600"
                                  : isCurrent
                                  ? "bg-blue-100 text-blue-600 animate-pulse"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-foreground">
                                  {milestone.title}
                                </h4>
                                <span className="text-sm text-muted-foreground">
                                  {milestone.date
                                    ? formatDate(milestone.date)
                                    : "Pending"}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {milestone.description}
                              </p>
                              {milestone.progress && (
                                <div className="flex items-center gap-2 pt-2">
                                  <Progress
                                    value={milestone.progress}
                                    className="h-2 flex-1"
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    {milestone.progress}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                 {!isSingleRoomTrial && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {quickStats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={stat.label}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-background rounded-lg">
                              <Icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {stat.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {stat.description}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {stat.value}
                          </span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
                 )}

                {/* Quick Actions */}
                 {!isSingleRoomTrial && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* {!project.paymentCompleted && (
                      <Button className="w-full justify-start" asChild>
                        <Link
                          href={`/packages?type=new-project&projectId=${project.publicId}`}
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Complete Payment
                        </Link>
                      </Button>
                    )} */}
                    
                    {/* Only show file management for regular projects */}
                   
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                        asChild
                      >
                        <Link
                          href={`/dashboard/projects/${project.publicId}/uploads`}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Manage Files
                        </Link>
                      </Button>
                   
                    
                    {project.fileCounts.renders > 0 && (
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                        asChild
                      >
                        <Link
                          href={`/dashboard/renders/${project.publicId}`}
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          View Renders
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
                 )}

                {/* Package Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Package Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Plan
                      </span>
                      <span className="font-medium text-foreground">
                        {isSingleRoomTrial ? "Single Room Trial" : project.selectedPlan || "Basic Plan"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
                      <Badge
                        variant={
                          project.paymentCompleted ? "default" : "outline"
                        }
                        className={
                          project.paymentCompleted
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {project.paymentCompleted
                          ? "Active"
                          : "Pending Payment"}
                      </Badge>
                    </div>
                    {isSingleRoomTrial && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Type
                        </span>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          Quick Design
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Project Files Tab - Only for regular projects */}
          {!isSingleRoomTrial && (
            <TabsContent value="uploads" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-primary" />
                    Project Files
                  </CardTitle>
                  <CardDescription>
                    Manage your uploaded floor plans, photos, and documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Room Photos */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Camera className="w-4 h-4" />
                          Room Photos ({project.fileCounts.roomPhotos})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {project.roomPhotos && project.roomPhotos.length > 0 ? (
                          <div className="space-y-3">
                            {project.roomPhotos.slice(0, 3).map((photo) => (
                              <div
                                key={photo.id}
                                className="flex items-center gap-3 p-2 border rounded-lg"
                              >
                                <img
                                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}${photo.fileUrl}`}
                                  alt={photo.fileName}
                                  className="w-12 h-12 rounded object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {photo.roomType?.replace(/_/g, " ") ||
                                      "Room Photo"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(photo.fileSize)} •{" "}
                                    {formatDate(photo.uploadDate)}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {project.roomPhotos.length > 3 && (
                              <Button
                                variant="outline"
                                className="w-full"
                                asChild
                              >
                                <Link
                                  href={`/dashboard/projects/${project.publicId}/uploads`}
                                >
                                  View all {project.roomPhotos.length} photos
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            <Camera className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">No room photos uploaded</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              asChild
                            >
                              <Link
                                href={`/dashboard/projects/${project.publicId}/uploads`}
                              >
                                Upload Photos
                              </Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Floor Plans */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Layers className="w-4 h-4" />
                          Floor Plans ({project.fileCounts.floorPlans})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {project.floorPlans && project.floorPlans.length > 0 ? (
                          <div className="space-y-3">
                            {project.floorPlans.slice(0, 3).map((plan) => (
                              <div
                                key={plan.id}
                                className="flex items-center gap-3 p-2 border rounded-lg"
                              >
                                <img
                                  src={plan.fileUrl}
                                  alt={plan.fileName}
                                  className="w-12 h-12 rounded object-cover bg-muted"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {plan.fileName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(plan.fileSize)} •{" "}
                                    {plan.roomCount
                                      ? `${plan.roomCount} rooms`
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {project.floorPlans.length > 3 && (
                              <Button
                                variant="outline"
                                className="w-full"
                                asChild
                              >
                                <Link
                                  href={`/dashboard/projects/${project.publicId}/uploads`}
                                >
                                  View all {project.floorPlans.length} plans
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            <Layers className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">No floor plans uploaded</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              asChild
                            >
                              <Link
                                href={`/dashboard/projects/${project.publicId}/uploads`}
                              >
                                Upload Plans
                              </Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-3 mt-6 pt-6 border-t">
                    <Button asChild>
                      <Link
                        href={`/dashboard/projects/${project.publicId}/uploads`}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Manage All Files
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Questionnaire Tab - Only for regular projects */}
          {!isSingleRoomTrial && (
            <TabsContent value="questionnaire" className="space-y-6">
              {/* Onboarding Questionnaire Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" />
                    Onboarding Questionnaire
                    {project.questionnaireCompletedAt && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 ml-2">
                        Completed
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Initial project preferences and requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {project.questionnaireAnswers ? (
                    <div className="space-y-6">
                      {/* Questionnaire Status */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <CheckCircle2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="font-semibold text-foreground">Status</p>
                          <p className="text-sm text-muted-foreground">
                            {project.questionnaire?.isCompleted ? "Completed" : "In Progress"}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="font-semibold text-foreground">Completed At</p>
                          <p className="text-sm text-muted-foreground">
                            {project.questionnaireCompletedAt 
                              ? formatDate(project.questionnaireCompletedAt)
                              : "Not completed"}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <ClipboardList className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="font-semibold text-foreground">Questions</p>
                          <p className="text-sm text-muted-foreground">
                            {Object.keys(project.questionnaireAnswers).length} answered
                          </p>
                        </div>
                      </div>

                      {/* Questionnaire Answers */}
                      <div className="space-y-6">
                        {ONBOARDING_QUESTIONS.map((question) => {
                          const answer = project.questionnaireAnswers[question.id];
                          
                          return (
                            <Card key={question.id} className="border-border">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-foreground">
                                  {question.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  {/* User's Answer */}
                                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="flex items-start gap-2">
                                      <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                      <div>
                                        <p className="font-medium text-green-800 dark:text-green-200">
                                          Your Answer
                                        </p>
                                        <p className="text-green-700 dark:text-green-300 mt-1">
                                          {answer || "No answer provided"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* All Options */}
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                      Available options:
                                    </p>
                                    {question.options.map((option) => (
                                      <div
                                        key={option}
                                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                                          option === answer
                                            ? "bg-primary/10 border-primary/30"
                                            : "bg-muted/30 border-border"
                                        }`}
                                      >
                                        <div
                                          className={`w-3 h-3 rounded-full flex items-center justify-center ${
                                            option === answer
                                              ? "bg-primary text-primary-foreground"
                                              : "bg-muted border border-border"
                                          }`}
                                        >
                                          {option === answer && (
                                            <Check className="w-2 h-2" />
                                          )}
                                        </div>
                                        <span
                                          className={`text-sm ${
                                            option === answer
                                              ? "text-foreground font-medium"
                                              : "text-muted-foreground"
                                          }`}
                                        >
                                          {option}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      {/* Questionnaire Metadata */}
                      {project.questionnaire && (
                        <Card className="border-border">
                          <CardHeader>
                            <CardTitle>Questionnaire Details</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-muted-foreground">
                                  Completion Status:
                                </span>
                                <p className="text-foreground">
                                  {project.questionnaire.isCompleted ? "Completed" : "Incomplete"}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">
                                  Completed At:
                                </span>
                                <p className="text-foreground">
                                  {project.questionnaire.completedAt
                                    ? formatDateTime(project.questionnaire.completedAt)
                                    : "Not completed"}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">
                                  Last Updated:
                                </span>
                                <p className="text-foreground">
                                  {formatDateTime(project.questionnaire.updatedAt)}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">
                                  Questions Answered:
                                </span>
                                <p className="text-foreground">
                                  {Object.keys(project.questionnaireAnswers).length} of {ONBOARDING_QUESTIONS.length}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Onboarding Questionnaire Not Started
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Complete the onboarding questionnaire to help us understand your preferences and create personalized design recommendations for your project.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild>
                          <Link href={`/dashboard/projects/${project.publicId}/onboarding`}>
                            <ClipboardList className="w-4 h-4 mr-2" />
                            Start Questionnaire
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/support">
                            <Phone className="w-4 h-4 mr-2" />
                            Get Help
                          </Link>
                        </Button>
                      </div>
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 max-w-md mx-auto">
                        <div className="flex items-center gap-3">
                          <Info className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-800 dark:text-blue-200 text-sm">
                              Why complete the questionnaire?
                            </p>
                            <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                              Your answers help us personalize styles, layouts, and budgets specifically for your space and preferences.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Design Questionnaire Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Design Preferences Questionnaire
                    {designQuestionnaire?.questionnaire?.status === "COMPLETED" && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 ml-2">
                        Completed
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Detailed design preferences for personalized recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {designQuestionnaireLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
                      <p className="text-muted-foreground">Loading design questionnaire...</p>
                    </div>
                  ) : designQuestionnaire?.questionnaire ? (
                    <div className="space-y-6">
                      {/* Design Questionnaire Status */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <CheckCircle2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="font-semibold text-foreground">Status</p>
                          <p className="text-sm text-muted-foreground">
                            {designQuestionnaire.questionnaire.status === "COMPLETED" ? "Completed" : "In Progress"}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="font-semibold text-foreground">Completed At</p>
                          <p className="text-sm text-muted-foreground">
                            {designQuestionnaire.questionnaire.completedAt
                              ? formatDate(designQuestionnaire.questionnaire.completedAt)
                              : "Not completed"}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="font-semibold text-foreground">Questions</p>
                          <p className="text-sm text-muted-foreground">
                            {DESIGN_QUESTIONNAIRE_STEPS.length} detailed questions
                          </p>
                        </div>
                      </div>

                      {/* Design Questionnaire Answers */}
                      <div className="space-y-6">
                        {DESIGN_QUESTIONNAIRE_STEPS.map((step) => {
                          const answers = designQuestionnaire.questionnaire.answers || {};
                          
                          return (
                            <Card key={step.id} className="border-border">
                              <CardHeader className="pb-3">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                    {step.id}
                                  </div>
                                  <div className="flex-1">
                                    <CardTitle className="text-lg text-foreground">
                                      {step.title}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                      {step.description}
                                    </CardDescription>
                                    <p className="font-medium text-foreground mt-2">
                                      {step.question}
                                      {step.required && (
                                        <span className="text-destructive ml-1">*</span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                {renderDesignQuestionnaireAnswer(step, answers)}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      {/* Design Questionnaire Metadata */}
                      <Card className="border-border">
                        <CardHeader>
                          <CardTitle>Questionnaire Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">
                                Status:
                              </span>
                              <p className="text-foreground">
                                {designQuestionnaire.questionnaire.status === "COMPLETED" ? "Completed" : "Draft"}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                Completed At:
                              </span>
                              <p className="text-foreground">
                                {designQuestionnaire.questionnaire.completedAt
                                  ? formatDateTime(designQuestionnaire.questionnaire.completedAt)
                                  : "Not completed"}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                Last Updated:
                              </span>
                              <p className="text-foreground">
                                {formatDateTime(designQuestionnaire.questionnaire.updatedAt)}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                Project Status:
                              </span>
                              <p className="text-foreground">
                                {designQuestionnaire.project?.status || "N/A"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {project.designQuestionnaireCompleted ? "Design Questionnaire Completed" : "Design Questionnaire Not Available"}
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        {project.designQuestionnaireCompleted 
                          ? "Your design preferences have been saved and the design process has started."
                          : "Complete your payment to unlock the design preferences questionnaire for personalized recommendations."}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {!project.paymentCompleted && (
                          <Button asChild>
                            <Link href={`/packages?type=new-project&projectId=${project.publicId}`}>
                              <DollarSign className="w-4 h-4 mr-2" />
                              Complete Payment
                            </Link>
                          </Button>
                        )}
                        {project.paymentCompleted && !project.designQuestionnaireCompleted && (
                          <Button asChild>
                            <Link href={`/dashboard/projects/${project.publicId}/design-questionnaire`}>
                              <Brain className="w-4 h-4 mr-2" />
                              Start Design Questionnaire
                            </Link>
                          </Button>
                        )}
                        <Button variant="outline" asChild>
                          <Link href="/support">
                            <Phone className="w-4 h-4 mr-2" />
                            Contact Support
                          </Link>
                        </Button>
                      </div>
                      {project.designStartTime && (
                        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 max-w-md mx-auto">
                          <div className="flex items-center gap-3">
                            <Rocket className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-800 dark:text-green-200 text-sm">
                                Design Process Started
                              </p>
                              <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                                Your 72-hour design timeline began on {formatDate(project.designStartTime)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Design Progress Tab */}
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Design Progress
                </CardTitle>
                <CardDescription>
                  Track the design generation process and timeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-foreground">
                      Current Phase
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {statusInfo.label}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-foreground">Progress</p>
                    <p className="text-sm text-muted-foreground">
                      {project.progress}% Complete
                    </p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <Rocket className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="font-semibold text-foreground">Status</p>
                    <p className="text-sm text-muted-foreground">
                      {project.status.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>

                {/* Design Stages */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">
                    Design Stages
                  </h4>
                  <div className="space-y-3">
                    {designStages.map((stage, index) => (
                      <div
                        key={stage.stage}
                        className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            stage.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : stage.status === "current"
                              ? "bg-blue-100 text-blue-600 animate-pulse"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {stage.status === "completed" ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-sm font-medium">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {stage.stage}
                            </p>
                            {stage.required && (
                              <Badge variant="outline" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {stage.description}
                          </p>
                        </div>
                        <Badge
                          variant={
                            stage.status === "completed"
                              ? "default"
                              : stage.status === "current"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {stage.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons - Only show relevant actions for single room trial */}
                {!isSingleRoomTrial && (
                  <div className="flex gap-3 pt-4 border-t">
                    {!project.selectedStyle && (
                      <Button asChild>
                        <Link
                          href={`/dashboard/styles?project=${project.publicId}`}
                        >
                          <Palette className="w-4 h-4 mr-2" />
                          Select Style
                        </Link>
                      </Button>
                    )}
                    {/* {!project.paymentCompleted && (
                      <Button asChild>
                        <Link
                          href={`/dashboard/projects/${project.publicId}/payment`}
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Complete Payment
                        </Link>
                      </Button>
                    )} */}
                    {project.paymentCompleted &&
                      !project.designPreferencesCompleted && (
                        <Button asChild>
                          <Link
                            href={`/dashboard/projects/${project.publicId}/design-questionnaire`}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Complete Design Questionnaire
                          </Link>
                        </Button>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget & BOQ Tab */}
          <TabsContent value="boq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" />
                  {isSingleRoomTrial ? "Budget Breakdown" : "Budget & BOQ"}
                </CardTitle>
                <CardDescription>
                  {isSingleRoomTrial 
                    ? "Basic cost breakdown for your single room" 
                    : "Detailed cost breakdown and Bill of Quantities"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Budget Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">
                        Budget Overview
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Budget Range
                          </span>
                          <span className="font-semibold text-foreground">
                            {project.budgetRange || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Timeline
                          </span>
                          <span className="text-foreground">
                            {project.timeline || "N/A"}
                          </span>
                        </div>
                        {!isSingleRoomTrial && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Area</span>
                            <span className="text-foreground">
                              {project.areaSqFt
                                ? `${project.areaSqFt} sq ft`
                                : "N/A"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">
                        Project Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">
                            {isSingleRoomTrial ? "Plan Type" : "Property Type"}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {isSingleRoomTrial 
                              ? "Single Room Trial" 
                              : project.projectType?.replace(/_/g, " ") || "N/A"
                            }
                          </span>
                        </div>
                        {!isSingleRoomTrial && project.selectedStyle && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">
                              Design Style
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {project.selectedStyle?.name || "N/A"}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">
                            Package
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {isSingleRoomTrial ? "Single Room Trial" : project.selectedPlan || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOQ Status */}
                  {project.boqs && project.boqs.length > 0 ? (
                    project.boqs.map((boq) => (
                      <div key={boq.id} className="space-y-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-800 dark:text-green-200">
                                {isSingleRoomTrial ? "Budget Breakdown Ready" : "BOQ Ready for Review"}
                              </p>
                              <p className="text-sm text-green-700 dark:text-green-300">
                                {isSingleRoomTrial 
                                  ? "Your basic budget breakdown is available for review."
                                  : "Your detailed Bill of Quantities is available for review and download."
                                }
                                {boq.totalAmount &&
                                  ` Total amount: ${formatCurrency(
                                    boq.totalAmount
                                  )}`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* BOQ Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              Total Amount
                            </p>
                            <p className="text-lg font-bold text-foreground">
                              {formatCurrency(boq.totalAmount)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              Status
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {boq.status}
                            </Badge>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              Version
                            </p>
                            <p className="text-lg font-bold text-foreground">
                              v{boq.version}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              Last Updated
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {formatDate(boq.updatedAt)}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button asChild>
                            <Link href={`/dashboard/boq/${boq.publicId}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View {isSingleRoomTrial ? "Budget Breakdown" : "Detailed BOQ"}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="font-medium text-amber-800 dark:text-amber-200">
                            {isSingleRoomTrial ? "Budget Breakdown in Progress" : "BOQ Generation in Progress"}
                          </p>
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            {isSingleRoomTrial
                              ? "Your basic budget breakdown will be available once design generation is complete."
                              : "Your detailed Bill of Quantities will be available once design generation is complete."
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 3D Renders Tab */}
          <TabsContent value="renders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  {isSingleRoomTrial ? "3D Render" : "3D Renders"} ({project.fileCounts.renders})
                </CardTitle>
                <CardDescription>
                  {isSingleRoomTrial 
                    ? "generated design visualization of your room" 
                    : "generated design visualizations of your space"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.renders && project.renders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {project.renders.map((render) => {
                      const statusBadge = getRenderStatusBadge(render.status);

                      return (
                        <Card
                          key={render.id}
                          className="overflow-hidden border-border"
                        >
                          <div className="aspect-video relative">
                            <img
                              src={`${process.env.NEXT_PUBLIC_SERVER_URL}${render.imageUrl}`}
                              alt={render.roomType}
                              className="w-full h-full object-cover"
                            />
                            <Badge
                              variant="outline"
                              className={`absolute top-2 right-2 ${statusBadge.color}`}
                            >
                              {statusBadge.label}
                            </Badge>
                            {render.isFinal && (
                              <Badge className="absolute top-2 left-2 bg-blue-600">
                                Final
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-foreground capitalize">
                                {render.roomType?.replace(/_/g, " ")}
                              </h4>
                              {render.generatedAt && (
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(render.generatedAt)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {render.styleApplied || "Design style"}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {project.status === "RENDER_IN_PROGRESS"
                        ? "Render in Progress"
                        : isSingleRoomTrial ? "Render Coming Soon" : "Renders Coming Soon"}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {project.status === "RENDER_IN_PROGRESS"
                        ? `Your ${isSingleRoomTrial ? 'single room design' : '3D renders'} are currently being processed and will be available soon.`
                        : `Your ${isSingleRoomTrial ? 'single room design' : '3D renders'} will be available here once the design phase is complete.`
                      }
                    </p>
                    {project.designStartTime && (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                          Estimated delivery:{" "}
                          {formatDateTime(
                            new Date(project.designStartTime).getTime() +
                              72 * 60 * 60 * 1000
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Payments ({project.payments?.length || 0})
                </CardTitle>
                <CardDescription>
                  Payment history and transaction details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.payments && project.payments.length > 0 ? (
                  <div className="space-y-4">
                    {project.payments.map((payment) => {
                      const statusBadge = getPaymentStatusBadge(payment.status);

                      return (
                        <Card key={payment.id} className="border-border">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-foreground">
                                    {isSingleRoomTrial ? "Single Room Trial" : payment.plan?.name || "Project Payment"} -{" "}
                                    {formatCurrency(payment.totalAmount)}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className={statusBadge.color}
                                  >
                                    {statusBadge.label}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{payment.gateway}</span>
                                  <span>•</span>
                                  <span>
                                    Created: {formatDateTime(payment.createdAt)}
                                  </span>
                                  {payment.paidAt && (
                                    <>
                                      <span>•</span>
                                      <span>
                                        Paid: {formatDateTime(payment.paidAt)}
                                      </span>
                                    </>
                                  )}
                                </div>
                                {payment.razorpayOrderId && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Order ID: {payment.razorpayOrderId}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Payment Addons */}
                            {payment.addons && payment.addons.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-sm font-medium text-foreground mb-2">
                                  Addons:
                                </p>
                                <div className="space-y-1">
                                  {payment.addons.map((addon) => (
                                    <div
                                      key={addon.id}
                                      className="flex justify-between text-sm"
                                    >
                                      <span className="text-muted-foreground">
                                        {addon.addon.name} × {addon.quantity}
                                      </span>
                                      <span className="font-medium">
                                        {formatCurrency(
                                          addon.price * addon.quantity
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Payments Yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Complete your payment to activate the design process.
                    </p>
                    <Button asChild>
                      <Link
                        href={`/packages?type=new-project&projectId=${project.publicId}`}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Make Payment
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {isSingleRoomTrial ? "Recommended Vendors" : "Assigned Vendors"}
                  </div>
                  {!isSingleRoomTrial && (
                    <Link
                      href={`/admin/vendors/assignment?project=${
                        project.publicId || projectId
                      }`}
                    >
                      <Button size="sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Assign Vendor
                      </Button>
                    </Link>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vendorsLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
                    <p className="text-muted-foreground">Loading vendors...</p>
                  </div>
                ) : vendors && vendors.vendors && Object.values(vendors.vendors).flat().length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(vendors.vendors).map(([status, vendorList]) => {
                      if (!vendorList || vendorList.length === 0) return null;

                      const statusConfig = getVendorStatusConfig(status);

                      return (
                        <div key={status} className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              {vendorList.length} vendor{vendorList.length !== 1 ? 's' : ''}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vendorList.map((vendor) => (
                              <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                  {/* Vendor Header */}
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                      {vendor.logoUrl ? (
                                        <img
                                          src={vendor.logoUrl}
                                          alt={vendor.businessName}
                                          className="w-12 h-12 rounded-lg object-cover"
                                        />
                                      ) : (
                                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                          <Briefcase className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                      )}
                                      <div>
                                        <h4 className="font-semibold text-foreground">
                                          {vendor.businessName}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {vendor.name}
                                        </p>
                                      </div>
                                    </div>
                                    {vendor.isVerified && (
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        <Award className="w-3 h-3 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                  </div>

                                  {/* Vendor Details */}
                                  <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                      <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-foreground">
                                        {vendor.city}, {vendor.state}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Phone className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-foreground">
                                        {vendor.phone || "Not provided"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Mail className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-foreground">
                                        {vendor.email}
                                      </span>
                                    </div>
                                    {vendor.rating && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <span className="text-foreground">
                                          {vendor.rating} ({vendor.reviewCount} reviews)
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Specialization */}
                                  {vendor.categories && vendor.categories.length > 0 && (
                                    <div className="mb-4">
                                      <p className="text-sm font-medium text-foreground mb-2">
                                        Specializations:
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {vendor.categories.slice(0, 3).map((category, index) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            {category}
                                          </Badge>
                                        ))}
                                        {vendor.categories.length > 3 && (
                                          <Badge variant="outline" className="text-xs">
                                            +{vendor.categories.length - 3} more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Timestamps */}
                                  <div className="text-xs text-muted-foreground space-y-1">
                                    {vendor.assignedAt && (
                                      <p>Assigned: {formatDateRelative(vendor.assignedAt)}</p>
                                    )}
                                    {vendor.respondedAt && (
                                      <p>Last action: {formatDateRelative(vendor.respondedAt)}</p>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {isSingleRoomTrial ? "Vendor Recommendations Coming Soon" : "Vendors Coming Soon"}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {project.vendorListStatus === "SENT" 
                        ? "Our team is carefully curating the best vendors for your project. You'll receive vendor recommendations shortly."
                        : isSingleRoomTrial
                        ? "For your single room trial, we'll provide 3 vendor recommendations to help you get started with your project."
                        : "Our expert team is hand-picking the perfect vendors for your project based on your requirements and preferences."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button asChild>
                        <Link href="/dashboard/vendors">
                          <Search className="w-4 h-4 mr-2" />
                          Browse All Vendors
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/dashboard/support">
                          <Phone className="w-4 h-4 mr-2" />
                          Contact Support
                        </Link>
                      </Button>
                    </div>
                    {project.vendorListStatus === "SENT" && (
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-800 dark:text-blue-200">
                              Vendor Assignment in Progress
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              Our team is actively working on selecting the best vendors for your project. 
                              You should see vendor recommendations within 24-48 hours.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}