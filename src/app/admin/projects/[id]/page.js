// src/app/admin/projects/[projectId]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Building,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Image,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Edit,
  Send,
  BarChart3,
  FolderOpen,
  Camera,
  Layers,
  Activity,
  Bell,
  QrCode,
  ClipboardList,
  Check,
  Heart,
  X,
  Package,
  Star,
  Zap,
  Mail,
  Phone,
  PlayCircle,
  Loader2,
  Users,
  UserPlus,
  Ruler,
  Box,
  File,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Progress } from "@/components/ui/progress";

// File type configuration for consistent display
const fileTypeConfig = {
  image: { 
    label: 'Image', 
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    icon: Image
  },
  pdf: { 
    label: 'PDF', 
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    icon: FileText
  },
  cad: { 
    label: 'CAD', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    icon: Ruler
  },
  sketchup: { 
    label: 'SketchUp', 
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    icon: Box
  },
  other: { 
    label: 'File', 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    icon: File
  }
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.projectId || params.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [progress, setProgress] = useState({
    overall: 0,
    renders: 0,
    budget: 0,
    vendors: 0,
  });
  const [timeLeft, setTimeLeft] = useState({
    overall: { hours: 0, minutes: 0, seconds: 0 },
    renders: { hours: 0, minutes: 0, seconds: 0 },
    budget: { hours: 0, minutes: 0, seconds: 0 },
    vendors: { hours: 0, minutes: 0, seconds: 0 },
  });

  // const QUESTIONS = [
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

  const QUESTIONS = [
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

  // const questionnaireSteps = [
  //   {
  //     id: 1,
  //     title: "Space Users",
  //     description: "Understand who uses your space",
  //     question: "Who will be primarily using each space in your home?",
  //     type: "checkbox",
  //     field: "spaceUsers",
  //     required: true,
  //     options: [
  //       {
  //         value: "ADULTS",
  //         label: "Adults",
  //         description: "Primary residents and family members",
  //       },
  //       { value: "KIDS", label: "Kids", description: "Children and teenagers" },
  //       {
  //         value: "ELDERLY",
  //         label: "Elderly",
  //         description: "Senior family members",
  //       },
  //       {
  //         value: "GUESTS",
  //         label: "Guests",
  //         description: "Regular visitors and friends",
  //       },
  //       {
  //         value: "STAFF",
  //         label: "Staff",
  //         description: "Domestic help or caretakers",
  //       },
  //     ],
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
  //       {
  //         value: "ENTERTAINING_GUESTS",
  //         label: "Entertaining Guests",
  //         description: "Hosting friends and family gatherings",
  //       },
  //       {
  //         value: "WORKING_FROM_HOME",
  //         label: "Working from Home",
  //         description: "Remote work and professional activities",
  //       },
  //       {
  //         value: "FAMILY_TIME",
  //         label: "Family Time",
  //         description: "Quality time with family members",
  //       },
  //       {
  //         value: "HOBBIES_CREATIVITY",
  //         label: "Hobbies & Creativity",
  //         description: "Pursuing personal interests and creative projects",
  //       },
  //       {
  //         value: "RELAXATION",
  //         label: "Relaxation",
  //         description: "Unwinding and personal downtime",
  //       },
  //     ],
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
  //       {
  //         value: "HIDDEN_MINIMAL",
  //         label: "Hidden & Minimal",
  //         description: "Clean surfaces, concealed storage",
  //       },
  //       {
  //         value: "FUNCTIONAL_PRACTICAL",
  //         label: "Functional & Practical",
  //         description: "Easy access, organized systems",
  //       },
  //       {
  //         value: "DISPLAY_ORIENTED",
  //         label: "Display-Oriented",
  //         description: "Showcase items, open shelving",
  //       },
  //     ],
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
  //           { value: "METAL_GLASS_ACCENTS", label: "Metal / Glass Accents" },
  //         ],
  //       },
  //       {
  //         title: "Avoid:",
  //         field: "avoid",
  //         options: [
  //           { value: "DARK_COLORS", label: "Dark Colors" },
  //           { value: "GLOSSY_FINISHES", label: "Glossy Finishes" },
  //           { value: "HEAVY_WOODWORK", label: "Heavy Woodwork" },
  //           { value: "CLUTTERED_DECOR", label: "Cluttered Decor" },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     id: 5,
  //     title: "Cultural Requirements",
  //     description: "Spiritual and cultural preferences",
  //     question:
  //       "Do you have any cultural, spiritual, or vastu-based requirements?",
  //     type: "checkbox",
  //     field: "culturalRequirements",
  //     required: true,
  //     options: [
  //       {
  //         value: "VASTU_ALIGNMENT",
  //         label: "Yes — Vastu Alignment (rooms, kitchen, entrances)",
  //         description: "Traditional spatial arrangements",
  //       },
  //       {
  //         value: "PRAYER_MEDITATION_SPACE",
  //         label: "Yes — Prayer Room / Meditation Space",
  //         description: "Dedicated spiritual area",
  //       },
  //       {
  //         value: "CULTURAL_SYMBOLS",
  //         label: "Yes — Cultural Symbols (murals, artifacts, etc.)",
  //         description: "Traditional decorative elements",
  //       },
  //       {
  //         value: "NO_REQUIREMENTS",
  //         label: "No specific requirements",
  //         description: "Modern approach without specific traditions",
  //       },
  //     ],
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
  //       {
  //         value: "BRIGHT_AIRY",
  //         label: "Bright & Airy",
  //         description: "Light-filled, spacious feeling",
  //       },
  //       {
  //         value: "WARM_COZY",
  //         label: "Warm & Cozy",
  //         description: "Intimate, comfortable atmosphere",
  //       },
  //       {
  //         value: "BALANCED",
  //         label: "Balanced (varies room to room)",
  //         description: "Different moods for different spaces",
  //       },
  //     ],
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
  //       {
  //         value: "TIMELESS_INVESTMENT",
  //         label: "Timeless, Investment Pieces",
  //         description: "Quality furniture that lasts for years",
  //       },
  //       {
  //         value: "FLEXIBLE_REPLACEABLE",
  //         label: "Flexible, Replaceable Options",
  //         description: "Adaptable furniture that can change with trends",
  //       },
  //       {
  //         value: "MIX_OF_BOTH",
  //         label: "Mix of Both",
  //         description: "Combination of investment pieces and flexible options",
  //       },
  //     ],
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
  //       {
  //         value: "HOME_OFFICE",
  //         label: "Home Office",
  //         description: "Dedicated workspace",
  //       },
  //       {
  //         value: "KIDS_PLAY_AREA",
  //         label: "Kids' Play Area",
  //         description: "Space for children to play",
  //       },
  //       {
  //         value: "PET_FRIENDLY_SPACES",
  //         label: "Pet-Friendly Spaces",
  //         description: "Areas designed for pets",
  //       },
  //       {
  //         value: "GYM_FITNESS_CORNER",
  //         label: "Gym / Fitness Corner",
  //         description: "Exercise and wellness area",
  //       },
  //       {
  //         value: "ENTERTAINMENT_ZONE",
  //         label: "Entertainment Zone (TV/Projector, Music, Gaming)",
  //         description: "Media and entertainment space",
  //       },
  //     ],
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
  //       {
  //         value: "LOW_MAINTENANCE",
  //         label: "Low Maintenance (easy-clean finishes)",
  //         description: "Minimal upkeep required",
  //       },
  //       {
  //         value: "MODERATE_UPKEEP",
  //         label: "Moderate Upkeep",
  //         description: "Regular maintenance acceptable",
  //       },
  //       {
  //         value: "HIGH_MAINTENANCE",
  //         label: "High Maintenance (luxury finishes, special care)",
  //         description: "Willing to maintain premium materials",
  //       },
  //     ],
  //   },
  //   {
  //     id: 10,
  //     title: "First Impression",
  //     description: "The feeling you want to create",
  //     question:
  //       "When you imagine walking into your finished home, what's the first feeling you want?",
  //     type: "radio",
  //     field: "firstImpression",
  //     required: true,
  //     options: [
  //       {
  //         value: "PEACE_CALM",
  //         label: "Peace & Calm",
  //         description: "Tranquil and serene atmosphere",
  //       },
  //       {
  //         value: "PRIDE_LUXURY",
  //         label: "Pride & Luxury",
  //         description: "Elegant and impressive space",
  //       },
  //       {
  //         value: "WARMTH_TOGETHERNESS",
  //         label: "Warmth & Togetherness",
  //         description: "Welcoming and family-friendly",
  //       },
  //       {
  //         value: "INSPIRATION_ENERGY",
  //         label: "Inspiration & Energy",
  //         description: "Dynamic and motivating environment",
  //       },
  //     ],
  //   },
  //   {
  //     id: 11,
  //     title: "Special Requirements",
  //     description: "Make it uniquely yours",
  //     question: "Any special requirements or must-haves for your space?",
  //     type: "textarea",
  //     field: "specialRequirements",
  //     required: false,
  //     placeholder:
  //       "Examples: Pet-friendly furniture, wheelchair accessibility, home office setup, meditation corner, specific cultural elements, entertainment system, reading nook, plant-friendly spaces...",
  //   },
  // ];

  const questionnaireSteps = [
  {
    id: 1,
    title: "Space Users & Lifestyle",
    description: "Understand who uses your space",
    question: "Who will be using the space, and how do you usually spend time at home?",
    type: "radio",
    field: "spaceUsersLifestyle",
    required: true,
    options: [
      {
        value: "JUST_ME",
        label: "Just me — simple routines",
        description: "Individual living with minimal needs",
      },
      {
        value: "COUPLE",
        label: "Couple — relaxed, functional living",
        description: "Shared space for two with practical needs",
      },
      {
        value: "FAMILY_WITH_KIDS",
        label: "Family with kids — active, storage-heavy",
        description: "Active household with children requiring ample storage",
      },
      {
        value: "MULTIGENERATIONAL",
        label: "Multigenerational home — shared needs",
        description: "Multiple generations living together with diverse requirements",
      },
      {
        value: "FREQUENT_TRAVELER",
        label: "I travel a lot — low-maintenance living",
        description: "Requires easy maintenance and minimal upkeep",
      },
    ],
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
      {
        value: "CALM_MINIMAL",
        label: "Calm & minimal",
        description: "Peaceful and uncluttered space",
      },
      {
        value: "WARM_COZY",
        label: "Warm & cozy",
        description: "Comfortable and inviting atmosphere",
      },
      {
        value: "MODERN_STYLISH",
        label: "Modern & stylish",
        description: "Contemporary and fashionable design",
      },
      {
        value: "SIMPLE_LUXE",
        label: "Simple & luxe",
        description: "Elegant luxury with simplicity",
      },
      {
        value: "FUNCTIONAL_PRACTICAL",
        label: "Functional & practical",
        description: "Practical and efficient living space",
      },
    ],
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
      {
        value: "WARM_WOODS_NEUTRALS",
        label: "Warm woods & neutrals",
        description: "Natural wood tones and neutral colors",
      },
      {
        value: "MODERN_FINISHES",
        label: "Modern finishes, glass & metal",
        description: "Contemporary materials like glass and metal accents",
      },
      {
        value: "LIGHT_WOODS_SOFT_PASTELS",
        label: "Light woods & soft pastels",
        description: "Light-colored woods and gentle pastel shades",
      },
      {
        value: "RICH_TONES_PREMIUM_TEXTURES",
        label: "Rich tones & premium textures",
        description: "Deep colors and luxurious textures",
      },
      {
        value: "SIMPLE_DURABLE_MATERIALS",
        label: "Simple & durable materials",
        description: "Practical materials that last long",
      },
    ],
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
      {
        value: "MINIMAL_ESSENTIALS",
        label: "Minimal — just the essentials",
        description: "Only keep what is absolutely necessary",
      },
      {
        value: "CLEAN_CONCEALED",
        label: "Clean & concealed",
        description: "Everything hidden away for a clean look",
      },
      {
        value: "FUNCTIONAL_EVERYWHERE",
        label: "Functional — storage everywhere",
        description: "Maximize storage in all possible areas",
      },
      {
        value: "MAXIMIZE_EVERY_INCH",
        label: "Maximise every inch",
        description: "Utilize every available space for storage",
      },
    ],
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
      {
        value: "STRICT_VASTU",
        label: "Yes, strict Vastu",
        description: "Need strict adherence to Vastu principles",
      },
      {
        value: "PREFER_VASTU_FLEXIBLE",
        label: "Prefer Vastu but flexible",
        description: "Prefer Vastu but open to adjustments",
      },
      {
        value: "CULTURAL_SPIRITUAL_NEEDS",
        label: "Cultural/spiritual needs",
        description: "Specific cultural or spiritual requirements",
      },
      {
        value: "NO_REQUIREMENTS",
        label: "No specific requirements",
        description: "Modern approach without specific traditions",
      },
      {
        value: "NOT_SURE_YET",
        label: "Not sure yet",
        description: "Still exploring options and preferences",
      },
    ],
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
      {
        value: "LOW_MAINTENANCE_MATERIALS",
        label: "Low-maintenance materials",
        description: "Materials that require minimal upkeep",
      },
      {
        value: "PET_KID_FRIENDLY",
        label: "Pet-friendly / kid-friendly choices",
        description: "Durable and safe options for pets and children",
      },
      {
        value: "SMART_HOME_FEATURES",
        label: "Smart home features",
        description: "Automation and smart technology integration",
      },
      {
        value: "SPECIFIC_FURNITURE_PREFERENCES",
        label: "Specific furniture preferences",
        description: "Particular furniture styles or pieces",
      },
      {
        value: "HIGH_DURABILITY_FINISHES",
        label: "High-durability finishes",
        description: "Finishes that withstand heavy use",
      },
      {
        value: "NOTHING_SPECIFIC",
        label: "Nothing specific",
        description: "No particular requirements",
      },
    ],
  },
  {
    id: 7,
    title: "Special Requirements",
    description: "Make it uniquely yours",
    question: "Any special requirements or must-haves for your space?",
    type: "textarea",
    field: "specialRequirements",
    required: false,
    placeholder:
      "Examples: Pet-friendly furniture, wheelchair accessibility, home office setup, meditation corner, specific cultural elements, entertainment system, reading nook, plant-friendly spaces...",
  },
];

  // Helper functions for file handling
  const getFileDisplay = (file) => {
    const fileName = file.fileName || '';
    const fileType = file.fileType || '';
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'heic', 'heif'].includes(extension) || 
        fileType.includes('image')) {
      return fileTypeConfig.image;
    } 
    else if (['pdf'].includes(extension) || fileType.includes('pdf')) {
      return fileTypeConfig.pdf;
    }
    else if (['dwg', 'dxf'].includes(extension)) {
      return fileTypeConfig.cad;
    }
    else if (['skp'].includes(extension)) {
      return fileTypeConfig.sketchup;
    }
    else {
      return fileTypeConfig.other;
    }
  };

  const getFileUrl = (file) => {
    const staticBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (file.fileUrl?.startsWith('/uploads/')) {
      return `${staticBaseUrl}${file.fileUrl}`;
    }

    if (file.fileUrl) {
      const projectId = file.projectId || projectId;
      return `${staticBaseUrl}/uploads/${projectId}/${file.fileUrl}`;
    }

    if (file.thumbnailUrl) {
      if (file.thumbnailUrl.startsWith('http')) {
        return file.thumbnailUrl;
      }
      if (file.thumbnailUrl.startsWith('/uploads/')) {
        return `${staticBaseUrl}${file.thumbnailUrl}`;
      }
      return `${staticBaseUrl}/uploads/${file.thumbnailUrl}`;
    }

    return null;
  };

 const formatFileSize = (input) => {
  if (!input) return '0.00 KB';

  let bytes = 0;

  // If input is numeric
  if (!isNaN(input) && input !== '') {
    bytes = parseFloat(input);
  } else if (typeof input === 'string') {
    // Extract numeric value
    const numericValue = parseFloat(input.replace(/[^\d.-]/g, ''));
    if (isNaN(numericValue)) return '0.00 KB';

    const lower = input.toLowerCase();

    // Convert to bytes depending on unit
    if (lower.includes('kb')) bytes = numericValue * 1024;
    else if (lower.includes('mb')) bytes = numericValue * 1024 * 1024;
    else if (lower.includes('gb')) bytes = numericValue * 1024 * 1024 * 1024;
    else bytes = numericValue; // assume bytes
  }

  // Decide which unit to use
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  } else if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } else if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${bytes.toFixed(2)} B`;
  }
};

  // const handleDownload = async (file) => {
  //   try {
  //     const fileUrl = getFileUrl(file);
  //     if (!fileUrl) {
  //       toast.error("Download failed", {
  //         description: "File URL not available"
  //       });
  //       return;
  //     }

  //     // Create a temporary anchor element to trigger download
  //     const link = document.createElement('a');
  //     link.href = fileUrl;
  //     link.download = file.fileName || 'download';
  //     link.target = '_blank';
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     toast.success("Download started", {
  //       description: `Downloading ${file.fileName || 'file'}`
  //     });
  //   } catch (error) {
  //     console.error('Download error:', error);
  //     toast.error("Download failed", {
  //       description: "Failed to download file"
  //     });
  //   }
  // };

  const handleDownload = async (file) => {
  try {
    const fileUrl = getFileUrl(file);
    if (!fileUrl) {
      toast.error("Download failed", {
        description: "File URL not available"
      });
      return;
    }

    // Fetch the file and create a blob URL for direct download
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = file.fileName || 'download';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);

    toast.success("Download started", {
      description: `Downloading ${file.fileName || 'file'}`
    });
  } catch (error) {
    console.error('Download error:', error);
    
    // Fallback: direct link approach if blob fails
    const fileUrl = getFileUrl(file);
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.fileName || 'download';
      link.target = '_blank';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started", {
        description: `Downloading ${file.fileName || 'file'}`
      });
    } else {
      toast.error("Download failed", {
        description: "Failed to download file"
      });
    }
  }
};

  const handleViewFile = (file) => {
    const fileUrl = getFileUrl(file);
    if (fileUrl) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error("Cannot open file", {
        description: "File URL not available"
      });
    }
  };

  const getFilePreview = (file) => {
    const fileName = file.fileName || 'Uploaded File';
    const fileExtension = fileName.split('.').pop()?.toUpperCase() || 'FILE';
    const fileDisplay = getFileDisplay(file);
    const FileIcon = fileDisplay.icon;

    if (fileDisplay === fileTypeConfig.image) {
      const imageUrl = getFileUrl(file);
      return (
        <div className="relative w-full h-full">
          <img 
            src={imageUrl}
            alt={fileName}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Failed to load image:', file.fileUrl);
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <div className="text-center p-4">
              <FileIcon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100 block">
                {fileDisplay.label}
              </span>
              <span className="text-xs text-blue-700 dark:text-blue-300 block">
                {fileExtension} File
              </span>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <div className="text-center p-4">
          <FileIcon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
          <div className="space-y-1">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100 block">
              {fileDisplay.label}
            </span>
            <span className="text-xs text-blue-700 dark:text-blue-300 block">
              {fileExtension} File
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 block">
              {formatFileSize(file.fileSize)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  // Determine if project is single room plan (48 hours)
  const isSingleRoomPlan = (project) => {
    return project?.selectedPlan === 'Single Room Trial' || 
           project?.selectedPlan?.toLowerCase().includes('single room') ||
           project?.selectedPlan?.toLowerCase().includes('499') ||
           project?.isSingleRoomPlan === true;
  };

  const calculateTimes = () => {
    if (!project?.designStartTime) return;

    const now = new Date().getTime();
    const designStart = new Date(project.designStartTime).getTime();
    
    // Dynamic duration based on plan type
    const isSingleRoom = isSingleRoomPlan(project);
    const totalDuration = isSingleRoom ? 48 * 60 * 60 * 1000 : 72 * 60 * 60 * 1000; // 48h or 72h
    const phaseHours = isSingleRoom ? 16 : 24; // 16h per phase for single room, 24h for regular
    const phaseDuration = phaseHours * 60 * 60 * 1000;

    // Overall progress
    const elapsed = now - designStart;
    const overallRemaining = Math.max(0, totalDuration - elapsed);
    const overallProgress = Math.min(100, (elapsed / totalDuration) * 100);

    // Phase times
    const rendersStart = project.rendersStartTime
      ? new Date(project.rendersStartTime).getTime()
      : designStart;

    const budgetStart = project.budgetStartTime
      ? new Date(project.budgetStartTime).getTime()
      : rendersStart + phaseDuration;

    const vendorsStart = project.vendorsStartTime
      ? new Date(project.vendorsStartTime).getTime()
      : budgetStart + phaseDuration;

    // Calculate remaining time for each phase
    const rendersRemaining = Math.max(0, budgetStart - now);
    const budgetRemaining = Math.max(0, vendorsStart - now);
    const vendorsRemaining = Math.max(0, designStart + totalDuration - now);

    // Calculate phase progress
    const rendersProgress =
      project.rendersStatus === "COMPLETED"
        ? 100
        : Math.min(100, ((now - rendersStart) / phaseDuration) * 100);

    const budgetProgress =
      project.boqStatus === "APPROVED" || project.boqStatus === "SENT"
        ? 100
        : project.boqStatus === "DRAFT"
        ? Math.min(100, ((now - budgetStart) / phaseDuration) * 100)
        : 0;

    const vendorsProgress =
      project.vendorStatus === "APPROVED" || project.vendorStatus === "SENT"
        ? 100
        : project.vendorStatus === "DRAFT"
        ? Math.min(100, ((now - vendorsStart) / phaseDuration) * 100)
        : 0;

    setTimeLeft({
      overall: formatTime(overallRemaining),
      renders: formatTime(rendersRemaining),
      budget: formatTime(budgetRemaining),
      vendors: formatTime(vendorsRemaining),
    });

    setProgress({
      overall: overallProgress,
      renders: rendersProgress,
      budget: budgetProgress,
      vendors: vendorsProgress,
    });
  };

  const formatTimeString = (time) => {
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      return "Time's up!";
    }
    return `${time.hours}h ${time.minutes
      .toString()
      .padStart(2, "0")}m ${time.seconds.toString().padStart(2, "0")}s`;
  };

  const calculateProgress = (progressData) => {
    // Calculate progress based on provided data
    if (!progressData) return;

    const now = new Date().getTime();
    const designStart = new Date(project.designStartTime).getTime();
    const totalDuration = 72 * 60 * 60 * 1000;

    const elapsed = now - designStart;
    const overallProgress = Math.min(100, (elapsed / totalDuration) * 100);

    setProgress({
      overall: overallProgress,
      renders: progressData.renders || 0,
      budget: progressData.budget || 0,
      vendors: progressData.vendors || 0,
    });
  };

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/projects/${projectId}`);

      if (response.data.success) {
        setProject(response.data.data.project);
      } else {
        throw new Error(response.data.message || "Failed to load project");
      }
    } catch (error) {
      console.error("Error loading project:", error);
      toast.error("Error", {
        description: error.message || "Failed to load project details",
      });
    } finally {
      setLoading(false);
    }
  };


  const completePhase = async (phase) => {
    try {
      setLoading(true);
      const response = await api.post(
        `/admin/projects/${projectId}/complete-phase`,
        {
          phase,
        }
      );

      if (response.data.success) {
        toast.success(`${phase} phase completed successfully`);
        loadProject(); // Reload project to get updated data
      } else {
        throw new Error(
          response.data.message || `Failed to complete ${phase} phase`
        );
      }
    } catch (error) {
      console.error(`Error completing ${phase} phase:`, error);
      toast.error("Error", {
        description: error.message || `Failed to complete ${phase} phase`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  // Update times every second
  useEffect(() => {
    calculateTimes();

    const interval = setInterval(() => {
      calculateTimes();
    }, 1000);

    return () => clearInterval(interval);
  }, [project]);

  const getPhaseStatus = (phase) => {
    switch (phase) {
      case "renders":
        return project?.rendersStatus || "PENDING";
      case "budget":
        return project?.boqStatus || "PENDING";
      case "vendors":
        return project?.vendorStatus || "PENDING";
      default:
        return "PENDING";
    }
  };

  const isPhaseActive = (phase) => {
    const status = getPhaseStatus(phase);
    return status === "PROCESSING" || status === "DRAFT";
  };

  const isPhaseCompleted = (phase) => {
    const status = getPhaseStatus(phase);
    return status === "COMPLETED" || status === "APPROVED" || status === "SENT";
  };

  // Check if timeline is completed (all three phases are sent)
  // Matches the logic from projects listing page
  const isTimelineCompleted = () => {
    if (!project) return false;
    const rendersStatus = project.rendersStatus;
    const vendorStatus = project.vendorStatus;
    const boqStatus = project.boqStatus;
    
    // Check if all three statuses are "SENT" (renders: COMPLETED means SENT, BOQ/Vendors: SENT or COMPLETED)
    const isRendersComplete = rendersStatus === "COMPLETED"; // COMPLETED means sent to user
    const isVendorComplete = vendorStatus === "SENT" || vendorStatus === "COMPLETED";
    const isBoqComplete = boqStatus === "SENT" || boqStatus === "COMPLETED";
    
    return isRendersComplete && isVendorComplete && isBoqComplete;
  };

  const canCompletePhase = (phase) => {
    if (loading) return false;

    switch (phase) {
      case "renders":
        return isPhaseActive("renders") && progress.renders >= 95;
      case "budget":
        return (
          isPhaseActive("budget") &&
          progress.budget >= 95 &&
          isPhaseCompleted("renders")
        );
      case "vendors":
        return (
          isPhaseActive("vendors") &&
          progress.vendors >= 95 &&
          isPhaseCompleted("budget")
        );
      default:
        return false;
    }
  };

  // Status badges configuration
  const getStatusBadge = (status) => {
    const statusConfig = {
      DRAFT: {
        label: "Draft",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      },
      STYLE_SELECTED: {
        label: "Style Selected",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      QUESTIONNAIRE_COMPLETED: {
        label: "Questionnaire Completed",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      DESIGN_QUESTIONNAIRE_COMPLETED: {
        label: "Design Questionnaire Completed",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      UPLOADED: {
        label: "Files Uploaded",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
      PAYMENT_COMPLETED: {
        label: "Payment Completed",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      },
      RENDER_IN_PROGRESS: {
        label: "Renders in Progress",
        color: "bg-amber-100 text-amber-800 border-amber-200",
      },
      RENDER_COMPLETED: {
        label: "Renders Completed",
        color: "bg-teal-100 text-teal-800 border-teal-200",
      },
      BOQ_GENERATED: {
        label: "BOQ Generated",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      },
      COMPLETED: {
        label: "Completed",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      CANCELLED: {
        label: "Cancelled",
        color: "bg-red-100 text-red-800 border-red-200",
      },
    };

    return (
      statusConfig[status] || {
        label: status,
        color: "bg-gray-100 text-gray-800 border-gray-200",
      }
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        label: "Pending",
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: Clock,
      },
      PROCESSING: {
        label: "Processing",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
      },
      COMPLETED: {
        label: "Completed",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle2,
      },
      FAILED: {
        label: "Failed",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      },
      REFUNDED: {
        label: "Refunded",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: XCircle,
      },
    };

    return (
      statusConfig[status] || {
        label: status,
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: AlertCircle,
      }
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-2"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Project Not Found
            </h3>
            <p className="text-muted-foreground mb-4">
              The project you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Link href="/admin/projects">
              <Button>Back to Projects</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <Link href="/admin/projects">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
      </Link>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">
                {project.title || "Untitled Project"}
              </h1>
              <Badge
                variant="outline"
                className={getStatusBadge(project.status).color}
              >
                {getStatusBadge(project.status).label}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Project ID: {project.publicId || projectId} • Created{" "}
              {formatDate(project.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/admin/renders/upload?project=${
              project.publicId || projectId
            }`}
          >
            <Button variant="outline" size="sm">
              <Image className="w-4 h-4 mr-2" />
              Upload Renders
            </Button>
          </Link>
          <Link href={`/admin/projects/${project.publicId || projectId}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {project._stats?.totalRenders || project.renders?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Renders</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {project._stats?.totalRoomPhotos ||
                project.roomPhotos?.length ||
                0}
            </div>
            <div className="text-sm text-muted-foreground">Room Photos</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {project._stats?.totalFloorPlans ||
                project.floorPlans?.length ||
                0}
            </div>
            <div className="text-sm text-muted-foreground">Floor Plans</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {project._stats?.totalPayments || project.payments?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Payments</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Files & Media</TabsTrigger>
          <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
          <TabsTrigger value="renders">Renders</TabsTrigger>
          <TabsTrigger value="boq">BOQ</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Project Type
                      </label>
                      <p className="text-foreground">
                        {project.projectType?.replace(/_/g, " ") ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Area
                      </label>
                      <p className="text-foreground">
                        {project.areaSqFt
                          ? `${project.areaSqFt} sq. ft.`
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Budget Range
                      </label>
                      <p className="text-foreground">
                        {project.budgetRange || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Timeline
                      </label>
                      <p className="text-foreground">
                        {project.timeline || "Not specified"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Selected Style
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        {project.selectedStyle ? (
                          <>
                            {/* <img
                              src={project.selectedStyle.imageUrl}
                              alt={project.selectedStyle.name}
                              className="w-8 h-8 rounded object-cover"
                            /> */}
                            <span className="text-foreground">
                              {project.selectedStyle.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {project.selectedStyle.category?.replace(
                                /_/g,
                                " "
                              )}
                            </Badge>
                          </>
                        ) : (
                          <span className="text-muted-foreground">
                            No style selected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selected Plan & Addons */}
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Selected Plan
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span className="text-foreground font-medium">
                          {project.selectedPlan || "No plan selected"}
                        </span>
                        {project.payments?.[0]?.plan?.price && (
                          <Badge variant="secondary" className="ml-2">
                            {formatCurrency(project.payments[0].plan.price)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {project.selectedAddons &&
                      project.selectedAddons.length > 0 && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Selected Addons
                          </label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.selectedAddons.map((addon, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
                              >
                                <Zap className="w-3 h-3" />
                                {addon}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Requirements */}
                    {project.requirements &&
                      project.requirements.length > 0 && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Requirements
                          </label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.requirements.map((req, index) => (
                              <Badge key={index} variant="secondary">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-foreground">
                      {project.address || "No address provided"}
                    </p>
                    <p className="text-muted-foreground">
                      {[project.city, project.state, project.country]
                        .filter(Boolean)
                        .join(", ") || "No location details"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {project.description && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{project.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Timeline */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {isSingleRoomPlan(project) ? '48' : '72'}-Hour Delivery Timeline
                  </CardTitle>
                  <CardDescription>
                    Project delivery progress with {isSingleRoomPlan(project) ? '16' : '24'}-hour phases
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.designStartTime ? (
                    <>
                      {/* Overall Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Overall Progress
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {isTimelineCompleted() ? (
                              <span className="text-green-600 font-medium">Completed</span>
                            ) : (
                              `${formatTimeString(timeLeft.overall)} remaining`
                            )}
                          </span>
                        </div>
                        <Progress 
                          value={isTimelineCompleted() ? 100 : progress.overall} 
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Started: {formatDate(project.designStartTime)}
                          </span>
                          <span>
                            {isTimelineCompleted() ? (
                              <span className="text-green-600 font-medium">100% Complete</span>
                            ) : (
                              `${Math.round(progress.overall)}% Complete`
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Phase Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Renders Phase */}
                        {/* <Card
                          className={`border-l-4 ${
                            isPhaseCompleted("renders")
                              ? "border-l-green-500 bg-green-50"
                              : isPhaseActive("renders")
                              ? "border-l-blue-500 bg-blue-50"
                              : "border-l-gray-300 bg-gray-50"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <Image
                                className={`w-5 h-5 ${
                                  isPhaseCompleted("renders")
                                    ? "text-green-600"
                                    : isPhaseActive("renders")
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }`}
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">
                                  3D Renders
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {isPhaseCompleted("renders")
                                    ? "Completed"
                                    : isPhaseActive("renders")
                                    ? `${formatTimeString(
                                        timeLeft.renders
                                      )} remaining`
                                    : "24h remaining"}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Progress
                                value={progress.renders}
                                className="h-1"
                              />
                              <div className="flex justify-between items-center">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    isPhaseCompleted("renders")
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : isPhaseActive("renders")
                                      ? "bg-blue-100 text-blue-800 border-blue-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }`}
                                >
                                  {getPhaseStatus("renders")}
                                </Badge>

                                {canCompletePhase("renders") && (
                                  <Button
                                    size="sm"
                                    className="h-6 text-xs"
                                    onClick={() => completePhase("renders")}
                                    disabled={loading}
                                  >
                                    {loading ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      "Complete"
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>

                            {project.rendersCompletedAt && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Completed:{" "}
                                {formatDate(project.rendersCompletedAt)}
                              </p>
                            )}
                            {project.rendersStartTime &&
                              !project.rendersCompletedAt && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Started:{" "}
                                  {formatDate(project.rendersStartTime)}
                                </p>
                              )}
                          </CardContent>
                        </Card> */}

                        {/* BOQ Phase */}
                        {/* <Card
                          className={`border-l-4 ${
                            isPhaseCompleted("budget")
                              ? "border-l-green-500 bg-green-50"
                              : isPhaseActive("budget")
                              ? "border-l-blue-500 bg-blue-50"
                              : "border-l-gray-300 bg-gray-50"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText
                                className={`w-5 h-5 ${
                                  isPhaseCompleted("budget")
                                    ? "text-green-600"
                                    : isPhaseActive("budget")
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }`}
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">
                                  Budget & BOQ
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {isPhaseCompleted("budget")
                                    ? "Completed"
                                    : isPhaseActive("budget")
                                    ? `${formatTimeString(
                                        timeLeft.budget
                                      )} remaining`
                                    : !isPhaseCompleted("renders")
                                    ? "Waiting for renders"
                                    : "24h remaining"}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Progress
                                value={progress.budget}
                                className="h-1"
                              />
                              <div className="flex justify-between items-center">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    isPhaseCompleted("budget")
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : isPhaseActive("budget")
                                      ? "bg-blue-100 text-blue-800 border-blue-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }`}
                                >
                                  {getPhaseStatus("budget")}
                                </Badge>

                                {canCompletePhase("budget") && (
                                  <Button
                                    size="sm"
                                    className="h-6 text-xs"
                                    onClick={() => completePhase("budget")}
                                    disabled={loading}
                                  >
                                    {loading ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      "Complete"
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>

                            {project.budgetCompletedAt && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Completed:{" "}
                                {formatDate(project.budgetCompletedAt)}
                              </p>
                            )}
                            {project.budgetStartTime &&
                              !project.budgetCompletedAt && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Started: {formatDate(project.budgetStartTime)}
                                </p>
                              )}
                          </CardContent>
                        </Card> */}

                        {/* Vendors Phase */}
                        {/* <Card
                          className={`border-l-4 ${
                            isPhaseCompleted("vendors")
                              ? "border-l-green-500 bg-green-50"
                              : isPhaseActive("vendors")
                              ? "border-l-blue-500 bg-blue-50"
                              : "border-l-gray-300 bg-gray-50"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <Users
                                className={`w-5 h-5 ${
                                  isPhaseCompleted("vendors")
                                    ? "text-green-600"
                                    : isPhaseActive("vendors")
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }`}
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">
                                  Vendor Matching
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {isPhaseCompleted("vendors")
                                    ? "Completed"
                                    : isPhaseActive("vendors")
                                    ? `${formatTimeString(
                                        timeLeft.vendors
                                      )} remaining`
                                    : !isPhaseCompleted("budget")
                                    ? "Waiting for BOQ"
                                    : "24h remaining"}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Progress
                                value={progress.vendors}
                                className="h-1"
                              />
                              <div className="flex justify-between items-center">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    isPhaseCompleted("vendors")
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : isPhaseActive("vendors")
                                      ? "bg-blue-100 text-blue-800 border-blue-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }`}
                                >
                                  {getPhaseStatus("vendors")}
                                </Badge>

                                {canCompletePhase("vendors") && (
                                  <Button
                                    size="sm"
                                    className="h-6 text-xs"
                                    onClick={() => completePhase("vendors")}
                                    disabled={loading}
                                  >
                                    {loading ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      "Complete"
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>

                            {project.vendorsCompletedAt && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Completed:{" "}
                                {formatDate(project.vendorsCompletedAt)}
                              </p>
                            )}
                            {project.vendorsStartTime &&
                              !project.vendorsCompletedAt && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Started:{" "}
                                  {formatDate(project.vendorsStartTime)}
                                </p>
                              )}
                          </CardContent>
                        </Card> */}
                      </div>

                      {/* Timeline Info */}
                      <div className={`text-center p-3 rounded-lg border ${
                        isTimelineCompleted() 
                          ? "bg-green-50 border-green-200" 
                          : "bg-blue-50 border-blue-200"
                      }`}>
                        {isTimelineCompleted() ? (
                          <>
                            <p className="text-sm text-green-800 font-medium">
                              <strong>✓ Timeline Completed</strong>
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              All phases (Renders, BOQ, Vendors) have been sent to the user
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-blue-800">
                              <strong>{isSingleRoomPlan(project) ? '48' : '72'}-Hour Timeline started:</strong>{" "}
                              {formatDate(project.designStartTime)}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Each phase has {isSingleRoomPlan(project) ? '16' : '24'} hours to complete • Overall:{" "}
                              {Math.round(progress.overall)}% Complete
                            </p>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <h4 className="font-semibold text-foreground mb-2">
                        {isSingleRoomPlan(project) ? '48' : '72'}-Hour Timeline Not Started
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        The {isSingleRoomPlan(project) ? '48' : '72'}-hour delivery timeline will begin once the
                        project enters the design phase.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Client Information */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Name
                    </label>
                    <p className="text-foreground">
                      {project.user?.name || "Not available"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p className="text-foreground">
                      {project.user?.email || "Not available"}
                    </p>
                  </div>
                  {project.user?.phone && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Phone
                      </label>
                      <p className="text-foreground">{project.user.phone}</p>
                    </div>
                  )}
                  {project.user?.avatar && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Avatar
                      </label>
                      <div className="mt-1">
                        <img
                          src={project.user.avatar}
                          alt={project.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Timeline */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Project Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Created</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                  {project.questionnaireCompletedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Questionnaire Completed
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(project.questionnaireCompletedAt)}
                      </span>
                    </div>
                  )}
                  {project.paymentCompletedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Payment Completed
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(project.paymentCompletedAt)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Last Updated</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(project.updatedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Project Status */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Project Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Status</span>
                    <Badge
                      variant="outline"
                      className={getStatusBadge(project.status).color}
                    >
                      {getStatusBadge(project.status).label}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Renders Status</span>
                    <Badge
                      variant="outline"
                      className={
                        project.rendersStatus === "COMPLETED"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-amber-100 text-amber-800 border-amber-200"
                      }
                    >
                      {project.rendersStatus || "PENDING"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">BOQ Status</span>
                    <Badge
                      variant="outline"
                      className={
                        project.boqStatus === "APPROVED"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : project.boqStatus === "SENT"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-amber-100 text-amber-800 border-amber-200"
                      }
                    >
                      {project.boqStatus || "DRAFT"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Payment Status</span>
                    <Badge
                      variant="outline"
                      className={
                        getPaymentStatusBadge(project.paymentStatus).color
                      }
                    >
                      {getPaymentStatusBadge(project.paymentStatus).label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    href={`/admin/renders/project/${
                      project.publicId || projectId
                    }`}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start mb-2"
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Manage Renders
                    </Button>
                  </Link>
                  {project.boqs?.length > 0 && (
                    <Link
                      href={`/admin/boq-management/${project.boqs[0].id}`}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Manage BOQ
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Renders Tab */}
        <TabsContent value="renders" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Renders ({project.renders?.length || 0})
                </div>
                <Link
                  href={`/admin/renders/upload?project=${
                    project.publicId || projectId
                  }`}
                >
                  <Button size="sm">
                    <Image className="w-4 h-4 mr-2" />
                    Upload Renders
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.renders && project.renders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.renders.map((render) => (
                    <Card
                      key={render.id}
                      className="border-border overflow-hidden"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={
                            process.env.NEXT_PUBLIC_SERVER_URL + render.imageUrl
                          }
                          alt={render.roomName}
                          className="w-full h-full object-cover"
                        />
                        <Badge
                          variant="outline"
                          className={`absolute top-2 right-2 ${
                            render.status === "COMPLETED"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}
                        >
                          {render.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-foreground capitalize">
                          {render.roomName}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {render.styleApplied}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(render.createdAt)}
                          </span>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Renders Yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Upload renders to get started with this project.
                  </p>
                  <Link
                    href={`/admin/renders/upload?project=${
                      project.publicId || projectId
                    }`}
                  >
                    <Button>
                      <Image className="w-4 h-4 mr-2" />
                      Upload First Render
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files & Media Tab */}
        <TabsContent value="files" className="space-y-6">
          {/* Room Photos */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Room Photos ({project.roomPhotos?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.roomPhotos && project.roomPhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {project.roomPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      <div className="aspect-square relative">
                        <img
                          src={
                            process.env.NEXT_PUBLIC_SERVER_URL + photo.fileUrl
                          }
                          alt={photo.fileName}
                          className="w-full h-full object-cover"
                        />
                        {photo.isPrimary && (
                          <Badge className="absolute top-2 left-2 bg-blue-600">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-foreground capitalize">
                          {photo.roomName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(photo.fileSize)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No room photos uploaded</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Floor Plans */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Floor Plans ({project.floorPlans?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.floorPlans && project.floorPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.floorPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      <div className="aspect-video relative bg-muted">
                        {getFilePreview(plan)}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-foreground">
                          {plan.fileName}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(plan.fileSize)}
                          </p>
                          {plan.roomCount && (
                            <Badge variant="outline" className="text-xs">
                              {plan.roomCount} rooms
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No floor plans uploaded</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                File Uploads ({project.fileUploads?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.fileUploads && project.fileUploads.length > 0 ? (
                <div className="space-y-3">
                  {project.fileUploads.map((file) => {
                    const fileDisplay = getFileDisplay(file);
                    const FileIcon = fileDisplay.icon;
                    
                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileIcon className="w-8 h-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">
                              {file.fileName}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>
                                {file.type?.replace("_", " ") || "File"}
                              </span>
                              <span>•</span>
                              <span>{formatFileSize(file.fileSize)}</span>
                              {file.roomType && (
                                <>
                                  <span>•</span>
                                  <span className="capitalize">
                                    {file.roomType.replace("_", " ")}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{file.status}</Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewFile(file)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownload(file)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No file uploads</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOQ Tab */}
        <TabsContent value="boq" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Bill of Quantities ({project.boqs?.length || 0})
                </div>
                {(project.boqs?.[0]?.status === "DRAFT" ||
                  project.boqs?.[0]?.status === "PENDING") && (
                  <Link
                    href={`/admin/boq-management/create?project=${
                      project.publicId || projectId
                    }`}
                  >
                    <Button size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate BOQ
                    </Button>
                  </Link>
                )}
                {(project.boqs?.[0]?.status === "SENT" ||
                  project.boqs?.[0]?.status === "APPROVED") && (
                  <Link href={`/admin/boq-management/${project.boqs?.[0].id}`}>
                    <Button size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.boqs?.length > 0 &&
              project.boqs[0].status !== "DRAFT" &&
              project.boqs[0].status !== "PENDING" ? (
                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-md">
                    <thead className="bg-muted-foreground/10">
                      <tr>
                        <th className="p-3 text-left font-medium">Item</th>
                        <th className="p-3 text-left font-medium">Quantity</th>
                        <th className="p-3 text-left font-medium">Unit</th>
                        <th className="p-3 text-left font-medium">Rate</th>
                        <th className="p-3 text-left font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.boqs[0].items?.map((item) => (
                        <tr key={item.id} className="border-t border-border">
                          <td className="p-3">{item.description}</td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3">{item.unit}</td>
                          <td className="p-3">
                            ₹{item.rate?.toLocaleString() || "0"}
                          </td>
                          <td className="p-3 font-semibold">
                            ₹{item.amount?.toLocaleString() || "0"}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t border-border font-semibold">
                        <td colSpan={4} className="p-3 text-right">
                          Total
                        </td>
                        <td className="p-3">
                          ₹
                          {project.boqs[0].totalAmount?.toLocaleString() || "0"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No BOQ Generated
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Generate a Bill of Quantities for this project.
                  </p>
                  <Link
                    href={`/admin/boq-management/create?project=${
                      project.publicId || projectId
                    }`}
                  >
                    <Button>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate BOQ
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payments ({project.payments?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.payments && project.payments.length > 0 ? (
                <div className="space-y-4">
                  {project.payments.map((payment) => {
                    const paymentStatus = getPaymentStatusBadge(payment.status);
                    const StatusIcon = paymentStatus.icon;

                    return (
                      <Card key={payment.id} className="border-border">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h4 className="font-semibold text-foreground text-lg">
                                  {payment.plan?.name || "Plan"} -{" "}
                                  {formatCurrency(payment.totalAmount)}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={paymentStatus.color}
                                >
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {paymentStatus.label}
                                </Badge>
                              </div>

                              {/* Payment Breakdown */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Plan Price:
                                    </span>
                                    <span className="font-medium">
                                      {formatCurrency(payment.plan?.price || 0)}
                                    </span>
                                  </div>

                                  {payment.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">
                                        Discount:
                                      </span>
                                      <span className="font-medium text-green-600">
                                        -{formatCurrency(payment.discount)}
                                      </span>
                                    </div>
                                  )}

                                  {payment.taxAmount > 0 && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">
                                        Tax:
                                      </span>
                                      <span className="font-medium">
                                        {formatCurrency(payment.taxAmount)}
                                      </span>
                                    </div>
                                  )}

                                  <div className="flex justify-between text-sm font-semibold border-t pt-2">
                                    <span>Total Amount:</span>
                                    <span>
                                      {formatCurrency(payment.totalAmount)}
                                    </span>
                                  </div>
                                </div>

                                {/* Addons Section */}
                                {payment.addons &&
                                  payment.addons.length > 0 && (
                                    <div>
                                      <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-yellow-600" />
                                        Addons:
                                      </h5>
                                      <div className="space-y-2">
                                        {payment.addons.map((addon, index) => (
                                          <div
                                            key={index}
                                            className="flex justify-between text-sm"
                                          >
                                            <span className="text-muted-foreground">
                                              {addon.name}{" "}
                                              {addon.quantity > 1
                                                ? `(×${addon.quantity})`
                                                : ""}
                                            </span>
                                            <span className="font-medium">
                                              {formatCurrency(addon.total)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>

                              {/* Payment Metadata */}
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Building className="w-3 h-3" />
                                  {payment.gateway || "Unknown"}
                                </span>
                                <span>•</span>
                                <span>
                                  Created: {formatDate(payment.createdAt)}
                                </span>
                                {payment.paidAt && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      Paid: {formatDate(payment.paidAt)}
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Customer Information */}
                              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                                <h5 className="font-medium text-foreground mb-2">
                                  Customer Details
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">
                                      Name:
                                    </span>
                                    <span className="ml-2 text-foreground">
                                      {payment.customerName || "Not available"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Email:
                                    </span>
                                    <span className="ml-2 text-foreground">
                                      {payment.customerEmail || "Not available"}
                                    </span>
                                  </div>
                                  {payment.customerPhone && (
                                    <div>
                                      <span className="text-muted-foreground">
                                        Phone:
                                      </span>
                                      <span className="ml-2 text-foreground">
                                        {payment.customerPhone}
                                      </span>
                                    </div>
                                  )}
                                  {payment.billingAddress && (
                                    <div className="md:col-span-2">
                                      <span className="text-muted-foreground">
                                        Billing Address:
                                      </span>
                                      <span className="ml-2 text-foreground">
                                        {payment.billingAddress}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
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
                  <p className="text-muted-foreground">
                    No payment records found for this project.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questionnaire Tab */}
        <TabsContent value="questionnaire" className="space-y-6">
          {/* Onboarding Questionnaire */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Onboarding Questionnaire
                {project.questionnaireCompletedAt && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 ml-2">
                    Completed
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.questionnaireAnswers ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {QUESTIONS.map((q) => (
                      <div
                        key={q.id}
                        className="border border-border rounded-lg p-4"
                      >
                        <h4 className="font-semibold text-foreground mb-2">
                          {q.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {project.questionnaireAnswers[q.id] ||
                            "No answer provided"}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">
                          Completion Status:
                        </span>
                        <p className="text-foreground">
                          {project.questionnaire?.isCompleted
                            ? "Completed"
                            : "Incomplete"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">
                          Completed At:
                        </span>
                        <p className="text-foreground">
                          {project.questionnaireCompletedAt
                            ? formatDate(project.questionnaireCompletedAt)
                            : "Not completed"}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">
                          Last Updated:
                        </span>
                        <p className="text-foreground">
                          {formatDate(project.questionnaire?.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Questionnaire Data
                  </h3>
                  <p className="text-muted-foreground">
                    Questionnaire has not been completed yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Design Questionnaire */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Design Questionnaire
                {project.designQuestionnaires?.[0]?.status === "COMPLETED" && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 ml-2">
                    Completed
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.designQuestionnaires &&
              project.designQuestionnaires.length > 0 ? (
                project.designQuestionnaires.map(
                  (designQuestionnaire, index) => (
                    <div key={designQuestionnaire.id} className="space-y-6">
                      {index > 0 && <hr className="border-border" />}

                      <div className="space-y-6">
                        {questionnaireSteps.map((step) => {
                          const answers = designQuestionnaire.answers || {};
                          const stepAnswer = answers[step.field];

                          return (
                            <div
                              key={step.id}
                              className="border border-border rounded-lg p-4"
                            >
                              <div className="flex items-start gap-3 mb-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                  {step.id}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground mb-1">
                                    {step.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {step.description}
                                  </p>
                                  <p className="font-medium text-foreground mb-3">
                                    {step.question}
                                  </p>

                                  {/* Display Answers */}
                                  {stepAnswer ? (
                                    <div className="space-y-2">
                                      {step.type === "checkbox" &&
                                        Array.isArray(stepAnswer) && (
                                          <div className="space-y-2">
                                            {stepAnswer.map((value) => {
                                              const option = step.options?.find(
                                                (opt) => opt.value === value
                                              );
                                              return (
                                                <div
                                                  key={value}
                                                  className="flex items-center gap-2 text-sm"
                                                >
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
                                        )}

                                      {step.type === "radio" && (
                                        <div className="flex items-center gap-2 text-sm">
                                          <Check className="w-4 h-4 text-green-500" />
                                          <span className="text-foreground">
                                            {step.options?.find(
                                              (opt) => opt.value === stepAnswer
                                            )?.label || stepAnswer}
                                          </span>
                                          {step.options?.find(
                                            (opt) => opt.value === stepAnswer
                                          )?.description && (
                                            <span className="text-muted-foreground text-xs">
                                              (
                                              {
                                                step.options.find(
                                                  (opt) =>
                                                    opt.value === stepAnswer
                                                )?.description
                                              }
                                              )
                                            </span>
                                          )}
                                        </div>
                                      )}

                                      {step.type === "materialPreferences" &&
                                        stepAnswer &&
                                        typeof stepAnswer === "object" && (
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Love Section */}
                                            <div>
                                              <h5 className="font-medium text-foreground mb-2">
                                                Love:
                                              </h5>
                                              <div className="space-y-1">
                                                {stepAnswer.love &&
                                                Array.isArray(
                                                  stepAnswer.love
                                                ) &&
                                                stepAnswer.love.length > 0 ? (
                                                  stepAnswer.love.map(
                                                    (value) => {
                                                      const option =
                                                        step.sections?.[0]?.options?.find(
                                                          (opt) =>
                                                            opt.value === value
                                                        );
                                                      return (
                                                        <div
                                                          key={value}
                                                          className="flex items-center gap-2 text-sm"
                                                        >
                                                          <Heart className="w-4 h-4 text-red-500" />
                                                          <span className="text-foreground">
                                                            {option?.label ||
                                                              value}
                                                          </span>
                                                        </div>
                                                      );
                                                    }
                                                  )
                                                ) : (
                                                  <p className="text-sm text-muted-foreground">
                                                    None selected
                                                  </p>
                                                )}
                                              </div>
                                            </div>

                                            {/* Avoid Section */}
                                            <div>
                                              <h5 className="font-medium text-foreground mb-2">
                                                Avoid:
                                              </h5>
                                              <div className="space-y-1">
                                                {stepAnswer.avoid &&
                                                Array.isArray(
                                                  stepAnswer.avoid
                                                ) &&
                                                stepAnswer.avoid.length > 0 ? (
                                                  stepAnswer.avoid.map(
                                                    (value) => {
                                                      const option =
                                                        step.sections?.[1]?.options?.find(
                                                          (opt) =>
                                                            opt.value === value
                                                        );
                                                      return (
                                                        <div
                                                          key={value}
                                                          className="flex items-center gap-2 text-sm"
                                                        >
                                                          <X className="w-4 h-4 text-gray-500" />
                                                          <span className="text-foreground">
                                                            {option?.label ||
                                                              value}
                                                          </span>
                                                        </div>
                                                      );
                                                    }
                                                  )
                                                ) : (
                                                  <p className="text-sm text-muted-foreground">
                                                    None selected
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                      {step.type === "textarea" && (
                                        <div className="bg-muted/50 rounded-lg p-3">
                                          <p className="text-foreground whitespace-pre-wrap">
                                            {stepAnswer}
                                          </p>
                                        </div>
                                      )}

                                      {/* Fallback for unexpected data types */}
                                      {![
                                        "checkbox",
                                        "radio",
                                        "materialPreferences",
                                        "textarea",
                                      ].includes(step.type) && (
                                        <div className="bg-muted/50 rounded-lg p-3">
                                          <p className="text-foreground">
                                            {typeof stepAnswer === "object"
                                              ? JSON.stringify(
                                                  stepAnswer,
                                                  null,
                                                  2
                                                )
                                              : String(stepAnswer)}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <X className="w-4 h-4" />
                                      Not answered
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Design Questionnaire Metadata */}
                      <div className="border-t border-border pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-muted-foreground">
                              Status:
                            </span>
                            <p className="text-foreground">
                              {designQuestionnaire.status === "COMPLETED"
                                ? "Completed"
                                : "Draft"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">
                              Completed At:
                            </span>
                            <p className="text-foreground">
                              {designQuestionnaire.completedAt
                                ? formatDate(designQuestionnaire.completedAt)
                                : "Not completed"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">
                              Last Updated:
                            </span>
                            <p className="text-foreground">
                              {formatDate(designQuestionnaire.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="text-center py-8">
                  <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Design Questionnaire Not Submitted
                  </h3>
                  <p className="text-muted-foreground">
                    The design questionnaire has not been completed yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activity Log ({project.activityLogs?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.activityLogs && project.activityLogs.length > 0 ? (
                <div className="space-y-4">
                  {project.activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 border border-border rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-foreground">{log.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {log.activityType?.replace(/_/g, " ") || "Activity"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(log.createdAt)}
                          </span>
                        </div>
                        {log.metadata &&
                          Object.keys(log.metadata).length > 0 && (
                            <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Activity Yet
                  </h3>
                  <p className="text-muted-foreground">
                    No activity logs found for this project.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications ({project.notifications?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.notifications && project.notifications.length > 0 ? (
                <div className="space-y-3">
                  {project.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 border rounded-lg ${
                        notification.isRead
                          ? "border-border bg-muted/20"
                          : "border-blue-200 bg-blue-50"
                      }`}
                    >
                      <Bell
                        className={`w-5 h-5 mt-0.5 ${
                          notification.isRead
                            ? "text-muted-foreground"
                            : "text-blue-600"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`font-semibold ${
                              notification.isRead
                                ? "text-foreground"
                                : "text-blue-900"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p
                          className={`text-sm mb-2 ${
                            notification.isRead
                              ? "text-muted-foreground"
                              : "text-blue-700"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatDate(notification.createdAt)}</span>
                          {notification.readAt && (
                            <>
                              <span>•</span>
                              <span>
                                Read: {formatDate(notification.readAt)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Vendors ({project.vendors?.length || 0})
                </div>
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.vendors && project.vendors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.vendors.map((vendor) => (
                    <Card
                      key={vendor.id}
                      className="border-border overflow-hidden"
                    >
                      <div className="aspect-video relative bg-muted">
                        {vendor.avatar ? (
                          <img
                            src={
                              process.env.NEXT_PUBLIC_SERVER_URL + vendor.avatar
                            }
                            alt={vendor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <User className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                        <Badge
                          variant="outline"
                          className={`absolute top-2 right-2 ${
                            vendor.isVerified
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}
                        >
                          {vendor.isVerified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-foreground">
                          {vendor.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {vendor.companyName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {vendor.category} • {vendor.specialization}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-medium">
                              {vendor.rating || "N/A"}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Vendors Assigned
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Assign vendors to this project to get started.
                  </p>
                  <Link
                    href={`/admin/vendors/assignment?project=${
                      project.publicId || projectId
                    }`}
                  >
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign First Vendor
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}