// src/app/admin/email-templates/edit/[publicId]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  RefreshCw,
  Mail,
  FileText,
  Users,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";

// Default templates structure for each category
const defaultTemplates = {
  PASSWORD_RESET: {
    name: "Password Reset",
    subject: "Reset Your Password - Houspire",
    content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
    .content { padding: 30px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>Hello \${userName},</p>
      <p>You requested to reset your password for your Houspire account. Click the button below to create a new password:</p>
      
      <a href="\${resetLink}" class="button">Reset Password</a>
      
      <p>Or copy and paste this link in your browser:</p>
      <p><a href="\${resetLink}">\${resetLink}</a></p>
      
      <p><strong>This link will expire in 1 hour.</strong></p>
      
      <p>If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
      
      <p>Best regards,<br>The Houspire Team</p>
    </div>
    <div class="footer">
      <p>&copy; \${currentYear} Houspire. All rights reserved.</p>
      <p>Transform your space with powered interior design</p>
    </div>
  </div>
</body>
</html>`,
    variables: ["userName", "resetLink", "currentYear"]
  },
  WELCOME_EMAIL: {
    name: "Welcome to Houspire",
    subject: "Welcome to Houspire - Start Your Design Journey!",
    content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
    .content { padding: 30px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Houspire!</h1>
    </div>
    <div class="content">
      <h2>Hello \${userName}!</h2>
      <p>Welcome to Houspire - where your interior design dreams come to life!</p>
      
      <p>We're excited to have you on board. Here's what you can do:</p>
      <ul>
        <li>Create stunning powered interior designs</li>
        <li>Get personalized vendor recommendations</li>
        <li>Manage your projects seamlessly</li>
        <li>Receive detailed BOQs and cost estimates</li>
      </ul>
      
      <a href="\${dashboardLink}" class="button">Start Your First Project</a>
      
      <p>Need help getting started? Check out our <a href="\${helpLink}">getting started guide</a>.</p>
      
      <p>Best regards,<br>The Houspire Team</p>
    </div>
    <div class="footer">
      <p>&copy; \${currentYear} Houspire. All rights reserved.</p>
      <p>Transform your space with powered interior design</p>
    </div>
  </div>
</body>
</html>`,
    variables: ["userName", "dashboardLink", "helpLink", "currentYear"]
  },
  // Add more default templates for other categories...
};

export default function EditEmailTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const publicId = params.publicId;
  
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewData, setPreviewData] = useState({});
  
  // Available variables based on category
  const categoryVariables = {
    PASSWORD_RESET: ["userName", "resetLink", "currentYear", "companyName", "supportEmail"],
    WELCOME_EMAIL: ["userName", "dashboardLink", "helpLink", "currentYear", "companyName"],
    EMAIL_VERIFICATION: ["userName", "verificationLink", "currentYear", "companyName"],
    PROJECT_STATUS_UPDATE: ["userName", "projectName", "projectStatus", "projectLink", "currentYear"],
    PAYMENT_CONFIRMATION: ["userName", "amount", "paymentId", "projectName", "receiptLink", "currentYear"],
    RENDER_READY: ["userName", "projectName", "renderCount", "viewLink", "currentYear"],
    BOQ_READY: ["userName", "projectName", "boqAmount", "viewLink", "currentYear"],
    VENDOR_LIST_SENT: ["userName", "projectName", "vendorCount", "viewLink", "currentYear"],
    SUPPORT_TICKET_CREATED: ["userName", "ticketId", "ticketSubject", "statusLink", "currentYear"],
    SUPPORT_TICKET_UPDATED: ["userName", "ticketId", "ticketSubject", "updateMessage", "statusLink", "currentYear"],
    ACCOUNT_DEACTIVATED: ["userName", "deactivationDate", "reactivationLink", "currentYear"],
    NEWSLETTER: ["userName", "newsletterContent", "unsubscribeLink", "currentYear"],
    PROMOTIONAL: ["userName", "promoContent", "actionLink", "currentYear"],
    SYSTEM_ALERT: ["userName", "alertMessage", "actionRequired", "contactSupport", "currentYear"]
  };

  // Load template data
  const loadTemplate = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/email-templates/${publicId}`);
      
      if (response.data.success) {
        const templateData = response.data.data;
        setTemplate(templateData);
        
        // Set default preview data based on category
        const defaultPreview = {};
        const variables = categoryVariables[templateData.category] || [];
        variables.forEach(variable => {
          switch (variable) {
            case 'userName':
              defaultPreview[variable] = 'John Doe';
              break;
            case 'resetLink':
              defaultPreview[variable] = 'https://houspire.com/reset-password?token=abc123';
              break;
            case 'verificationLink':
              defaultPreview[variable] = 'https://houspire.com/verify-email?token=xyz789';
              break;
            case 'dashboardLink':
              defaultPreview[variable] = 'https://houspire.com/dashboard';
              break;
            case 'helpLink':
              defaultPreview[variable] = 'https://houspire.com/help';
              break;
            case 'projectName':
              defaultPreview[variable] = 'Modern Living Room Design';
              break;
            case 'currentYear':
              defaultPreview[variable] = new Date().getFullYear().toString();
              break;
            case 'companyName':
              defaultPreview[variable] = 'Houspire';
              break;
            case 'supportEmail':
              defaultPreview[variable] = 'support@houspire.com';
              break;
            default:
              defaultPreview[variable] = `Sample ${variable}`;
          }
        });
        setPreviewData(defaultPreview);
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

  // Reset to default template structure
  const resetToDefault = () => {
    if (template && defaultTemplates[template.category]) {
      const defaultTemplate = defaultTemplates[template.category];
      setTemplate(prev => ({
        ...prev,
        name: defaultTemplate.name,
        subject: defaultTemplate.subject,
        content: defaultTemplate.content,
        variables: defaultTemplate.variables
      }));
      toast.success("Reset to default structure", {
        description: "Template has been reset to default structure"
      });
    }
  };

  // Update template
  const handleUpdate = async () => {
    try {
      setSaving(true);
      
      const updateData = {
        name: template.name,
        subject: template.subject,
        description: template.description,
        content: template.content,
        variables: template.variables
      };

      const response = await api.patch(`/email-templates/${publicId}`, updateData);
      
      if (response.data.success) {
        toast.success("Template Updated", {
          description: "Email template has been updated successfully",
        });
        router.push("/admin/email-templates");
      }
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("Error", {
        description: error.message || "Failed to update template",
      });
    } finally {
      setSaving(false);
    }
  };

  // Preview template
  const handlePreview = async () => {
    try {
      const response = await api.post(`/email-templates/${publicId}/preview`, {
        variables: previewData
      });
      
      if (response.data.success) {
        // Open preview in new window
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(response.data.data.html);
        previewWindow.document.close();
      }
    } catch (error) {
      console.error("Error previewing template:", error);
      toast.error("Error", {
        description: error.message || "Failed to preview template",
      });
    }
  };

  // Extract variables from content
  const extractVariables = (content) => {
    const variableRegex = /\$\{([^}]+)\}/g;
    const matches = content.matchAll(variableRegex);
    const variables = new Set();
    
    for (const match of matches) {
      variables.add(match[1]);
    }
    
    return Array.from(variables);
  };

  // Update content and extract variables
  const handleContentChange = (content) => {
    const variables = extractVariables(content);
    setTemplate(prev => ({
      ...prev,
      content,
      variables
    }));
  };

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
              Edit Email Template
            </h1>
            <p className="text-muted-foreground mt-1">
              Update template for {template.category.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetToDefault}
            disabled={!defaultTemplates[template.category]}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          
          <Button
            variant="outline"
            onClick={handlePreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          
          <Button
            onClick={handleUpdate}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={template.name || ""}
                    onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={template.category}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={template.subject || ""}
                  onChange={(e) => setTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject line"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={template.description || ""}
                  onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter template description"
                />
              </div>
            </CardContent>
          </Card>

          {/* HTML Content Editor */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>HTML Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Email Template HTML</Label>
                  <div className="text-sm text-muted-foreground">
                    Use {"${variableName}"} for dynamic content
                  </div>
                </div>
                
                <textarea
                  id="content"
                  value={template.content || ""}
                  onChange={(e) => handleContentChange(e.target.value)}
                  rows={20}
                  className="w-full p-3 border border-border rounded-lg font-mono text-sm bg-background text-foreground resize-vertical"
                  placeholder="Enter HTML content for the email template..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Available Variables */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Available Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Use these variables in your template:
                </p>
                
                <div className="space-y-2">
                  {categoryVariables[template.category]?.map(variable => (
                    <div key={variable} className="flex items-center justify-between p-2 bg-muted rounded">
                      <code className="text-sm">{"${" + variable + "}"}</code>
                      <Badge variant="outline" className="text-xs">
                        {template.variables?.includes(variable) ? "Used" : "Available"}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Variables will be replaced with actual values when sending emails.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Data */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Preview Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Set sample data for preview:
                </p>
                
                <div className="space-y-2">
                  {Object.keys(previewData).map(variable => (
                    <div key={variable} className="space-y-1">
                      <Label htmlFor={`preview-${variable}`} className="text-xs">
                        {variable}
                      </Label>
                      <Input
                        id={`preview-${variable}`}
                        value={previewData[variable]}
                        onChange={(e) => setPreviewData(prev => ({
                          ...prev,
                          [variable]: e.target.value
                        }))}
                        className="text-xs"
                        placeholder={`Enter sample ${variable}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Info */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={template.isActive ? "default" : "secondary"}>
                    {template.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Default:</span>
                  <Badge variant={template.isDefault ? "default" : "secondary"}>
                    {template.isDefault ? "Yes" : "No"}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span>v{template.version}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created By:</span>
                  <span>{template.createdBy}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}