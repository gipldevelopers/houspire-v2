// src/app/admin/email-templates/preview/[publicId]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Eye, 
  Mail,
  FileText,
  Copy,
  RefreshCw,
  Download,
  Send,
  Building,
  User,
  Calendar,
  Link,
  DollarSign,
  Hash
} from "lucide-react";

import { toast } from "sonner";
import api from "@/lib/axios";

export default function PreviewEmailTemplatePage() {
  const params = useParams();
  const publicId = params.publicId;
  
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState({});
  const [previewHtml, setPreviewHtml] = useState("");
  const [activeTab, setActiveTab] = useState("preview"); // preview, code, variables

  // Default preview values for different variable types
  const getDefaultPreviewValue = (variable) => {
    const defaults = {
      // User related
      userName: "Alex Johnson",
      userEmail: "alex.johnson@example.com",
      userPhone: "+91 9876543210",
      
      // Project related
      projectName: "Modern Living Room Design",
      projectId: "proj_123456",
      projectStatus: "In Progress",
      projectLink: "https://houspire.com/projects/proj_123456",
      
      // System links
      resetLink: "https://houspire.com/reset-password?token=abc123xyz",
      verificationLink: "https://houspire.com/verify-email?token=xyz789abc",
      dashboardLink: "https://houspire.com/dashboard",
      helpLink: "https://houspire.com/help",
      viewLink: "https://houspire.com/projects/proj_123456/renders",
      receiptLink: "https://houspire.com/receipts/rcpt_123456",
      statusLink: "https://houspire.com/support/ticket_123456",
      unsubscribeLink: "https://houspire.com/unsubscribe?email=user@example.com",
      reactivationLink: "https://houspire.com/reactivate-account",
      
      // Payment related
      amount: "9,999",
      paymentId: "pay_123456789",
      paymentDate: new Date().toLocaleDateString(),
      boqAmount: "1,45,000",
      
      // Counts
      renderCount: "8",
      vendorCount: "12",
      
      // Support related
      ticketId: "TKT-2024-001",
      ticketSubject: "Project Rendering Issue",
      updateMessage: "Our team has reviewed your request and is working on a solution.",
      
      // Company info
      companyName: "Houspire",
      supportEmail: "support@houspire.com",
      currentYear: new Date().getFullYear().toString(),
      
      // Content
      newsletterContent: "Check out our latest design trends and tips for modern interior design in 2024.",
      promoContent: "Get 20% off on your next project! Limited time offer for our valued customers.",
      alertMessage: "Scheduled maintenance will occur on Saturday from 2:00 AM to 4:00 AM.",
      actionRequired: "Please save your work before the maintenance window.",
      contactSupport: "Contact our support team at support@houspire.com",
      
      // Dates
      deactivationDate: new Date().toLocaleDateString(),
    };

    return defaults[variable] || `Sample ${variable}`;
  };

  // Load template data
  const loadTemplate = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/email-templates/${publicId}`);
      
      if (response.data.success) {
        const templateData = response.data.data;
        setTemplate(templateData);
        
        // Initialize preview data with default values
        const initialPreviewData = {};
        templateData.variables?.forEach(variable => {
          initialPreviewData[variable] = getDefaultPreviewValue(variable);
        });
        setPreviewData(initialPreviewData);
        
        // Generate initial preview
        await generatePreview(initialPreviewData);
      } else {
        throw new Error(response.data.message || "Failed to load template");
      }
    } catch (error) {
      console.error("Error loading template:", error);
      toast.error("Error", {
        description: error.message || "Failed to load template",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate preview with current data
  const generatePreview = async (data = previewData) => {
    try {
      const response = await api.post(`/email-templates/${publicId}/preview`, {
        variables: data
      });
      
      if (response.data.success) {
        setPreviewHtml(response.data.data.html);
      }
    } catch (error) {
      console.error("Error generating preview:", error);
      toast.error("Error", {
        description: error.message || "Failed to generate preview",
      });
    }
  };

  // Update preview data and regenerate
  const handlePreviewDataChange = (variable, value) => {
    const newData = {
      ...previewData,
      [variable]: value
    };
    setPreviewData(newData);
  };

  // Reset all preview data to defaults
  const resetPreviewData = () => {
    const defaultData = {};
    template.variables?.forEach(variable => {
      defaultData[variable] = getDefaultPreviewValue(variable);
    });
    setPreviewData(defaultData);
    generatePreview(defaultData);
    toast.success("Preview data reset", {
      description: "All preview values have been reset to defaults"
    });
  };

  // Copy HTML to clipboard
  const copyHtmlToClipboard = () => {
    navigator.clipboard.writeText(previewHtml);
    toast.success("Copied!", {
      description: "HTML content copied to clipboard"
    });
  };

  // Download HTML as file
  const downloadHtml = () => {
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Downloaded!", {
      description: "HTML file downloaded successfully"
    });
  };

  // Send test email
  const sendTestEmail = async () => {
    try {
      // You would typically have an API endpoint to send test emails
      toast.info("Test Email", {
        description: "Test email functionality would be implemented here"
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Error", {
        description: error.message || "Failed to send test email",
      });
    }
  };

  // Get variable icon based on type
  const getVariableIcon = (variable) => {
    if (variable.includes('Name') || variable.includes('user')) return <User className="w-4 h-4" />;
    if (variable.includes('Link') || variable.includes('Url')) return <Link className="w-4 h-4" />;
    if (variable.includes('Date') || variable.includes('Year')) return <Calendar className="w-4 h-4" />;
    if (variable.includes('Amount') || variable.includes('Price')) return <DollarSign className="w-4 h-4" />;
    if (variable.includes('Id') || variable.includes('Number')) return <Hash className="w-4 h-4" />;
    if (variable.includes('Company') || variable.includes('business')) return <Building className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  // Auto-generate preview when previewData changes
  useEffect(() => {
    if (template && Object.keys(previewData).length > 0) {
      const timeoutId = setTimeout(() => {
        generatePreview();
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [previewData, template]);

  useEffect(() => {
    if (publicId) {
      loadTemplate();
    }
  }, [publicId]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/email-templates">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </Link>
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-48"></div>
          </div>
        </div>
        <Card className="border-border">
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/email-templates">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </Link>
        </div>
        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Template not found
            </h3>
            <p className="text-muted-foreground mb-4">
              The template you're looking for doesn't exist.
            </p>
            <Link href="/admin/email-templates">
              <Button>Back to Templates</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/email-templates">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Preview Template
            </h1>
            <p className="text-muted-foreground mt-1">
              {template.name} - {template.category.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetPreviewData}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Data
          </Button>
          
          <Button
            variant="outline"
            onClick={copyHtmlToClipboard}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy HTML
          </Button>
          
          <Button
            variant="outline"
            onClick={downloadHtml}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          
          <Button
            onClick={sendTestEmail}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Test
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Preview Controls Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* Template Info */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Template Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Name</Label>
                <p className="font-medium">{template.name}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Category</Label>
                <Badge variant="outline" className="mt-1">
                  {template.category.replace(/_/g, ' ')}
                </Badge>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Subject</Label>
                <p className="font-medium text-sm">{template.subject}</p>
              </div>
              
              {template.description && (
                <div>
                  <Label className="text-sm text-muted-foreground">Description</Label>
                  <p className="text-sm mt-1">{template.description}</p>
                </div>
              )}
              
              <div className="flex gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant={template.isActive ? "default" : "secondary"} className="mt-1">
                    {template.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Default</Label>
                  <Badge variant={template.isDefault ? "default" : "secondary"} className="mt-1">
                    {template.isDefault ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Data Controls */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Preview Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Edit values to see how they appear in the template:
                </p>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {template.variables?.map((variable) => (
                    <div key={variable} className="space-y-2">
                      <Label htmlFor={`preview-${variable}`} className="text-xs flex items-center gap-2">
                        {getVariableIcon(variable)}
                        {variable}
                      </Label>
                      <Input
                        id={`preview-${variable}`}
                        value={previewData[variable] || ""}
                        onChange={(e) => handlePreviewDataChange(variable, e.target.value)}
                        className="text-sm"
                        placeholder={`Enter ${variable}...`}
                      />
                    </div>
                  ))}
                  
                  {(!template.variables || template.variables.length === 0) && (
                    <div className="text-center py-4 text-muted-foreground">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No variables in this template</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setActiveTab("preview")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview View
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setActiveTab("code")}
              >
                <FileText className="w-4 h-4 mr-2" />
                HTML Code
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setActiveTab("variables")}
              >
                <Hash className="w-4 h-4 mr-2" />
                Variables Info
              </Button>
              
              <Link href={`/admin/email-templates/edit/${template.publicId}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Edit Template
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Preview Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex border-b border-border">
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "preview"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("preview")}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Preview
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "code"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("code")}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  HTML Code
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === "variables"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab("variables")}
                >
                  <Hash className="w-4 h-4 inline mr-2" />
                  Variables ({template.variables?.length || 0})
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Tab Content */}
          {activeTab === "preview" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  How the email will appear to recipients
                </p>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-border rounded-lg bg-white">
                  {/* Email Header Simulation */}
                  <div className="border-b border-border p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">To: {previewData.userEmail || "recipient@example.com"}</p>
                        <p className="text-sm text-muted-foreground">Subject: {template.subject}</p>
                      </div>
                      <Badge variant="outline">Email Preview</Badge>
                    </div>
                  </div>
                  
                  {/* Email Content */}
                  <div className="p-1">
                    {previewHtml ? (
                      <iframe
                        srcDoc={previewHtml}
                        className="w-full h-[600px] border-0"
                        title="Email Preview"
                        sandbox="allow-same-origin" // For security
                      />
                    ) : (
                      <div className="flex items-center justify-center h-96 text-muted-foreground">
                        <div className="text-center">
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Generating preview...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Mobile Preview Notice */}
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> This preview shows the desktop version. 
                    The template is responsive and will adapt to mobile devices.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "code" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>HTML Source Code</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Raw HTML code with variable replacements
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={copyHtmlToClipboard}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </Button>
                  
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-[600px] overflow-y-auto">
                    {previewHtml || "// Generating HTML code..."}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "variables" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Template Variables</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Available variables and their usage in this template
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {template.variables?.map((variable) => (
                    <div key={variable} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getVariableIcon(variable)}
                          <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {'${' + variable + '}'}
                          </code>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Current: {previewData[variable] || "Not set"}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p>Used for: {getVariableDescription(variable)}</p>
                      </div>
                    </div>
                  ))}
                  
                  {(!template.variables || template.variables.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No variables defined in this template</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get variable descriptions
function getVariableDescription(variable) {
  const descriptions = {
    userName: "Recipient's full name",
    userEmail: "Recipient's email address",
    userPhone: "Recipient's phone number",
    resetLink: "Password reset URL with token",
    verificationLink: "Email verification URL",
    dashboardLink: "Link to user dashboard",
    helpLink: "Link to help documentation",
    projectName: "Name of the project",
    projectId: "Unique project identifier",
    projectStatus: "Current status of the project",
    projectLink: "Direct link to project page",
    viewLink: "Link to view renders or documents",
    receiptLink: "Link to download payment receipt",
    statusLink: "Link to check support ticket status",
    amount: "Payment amount in INR",
    paymentId: "Unique payment identifier",
    paymentDate: "Date of payment",
    boqAmount: "Total BOQ amount in INR",
    renderCount: "Number of renders generated",
    vendorCount: "Number of vendors recommended",
    ticketId: "Support ticket identifier",
    ticketSubject: "Subject of support ticket",
    updateMessage: "Latest update message",
    companyName: "Houspire company name",
    supportEmail: "Support team email",
    currentYear: "Current year for copyright",
    newsletterContent: "Content of newsletter",
    promoContent: "Promotional content",
    alertMessage: "System alert message",
    actionRequired: "Required action from user",
    contactSupport: "Support contact information",
    deactivationDate: "Account deactivation date",
    reactivationLink: "Account reactivation URL",
    unsubscribeLink: "Newsletter unsubscribe URL"
  };

  return descriptions[variable] || "Dynamic content placeholder";
}