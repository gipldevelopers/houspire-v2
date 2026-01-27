'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/lp3/components/Header";
import { Footer } from "@/app/lp3/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, MessageCircle } from "lucide-react";

const Contact = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    } else if (formData.email.length > 255) {
      newErrors.email = "Email must be less than 255 characters";
    }

    if (formData.phone && !/^[0-9+\s()-]*$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length > 200) {
      newErrors.subject = "Subject must be less than 200 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Message must be less than 1000 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          full_name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || null,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        });

      if (dbError) {
        console.error("Error saving to database:", dbError);
        throw new Error(dbError.message);
      }

      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || undefined,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        },
      });

      if (error) {
        console.error("Error sending email:", error);
      }

      toast({
        title: "Message sent successfully! ✓",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later or email us at hello@houspire.ai",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@houspire.ai",
      link: "mailto:hello@houspire.ai",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 98765 43210",
      link: "tel:+919876543210",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Hyderabad, India",
      link: null,
      gradient: "from-purple-500/20 to-pink-500/20"
    },
  ];

  const features = [
    {
      title: "Quick Response",
      description: "We reply within 24 hours to all inquiries",
    },
    {
      title: "Expert Guidance",
      description: "Get personalized advice from our team",
    },
    {
      title: "Transparent Support",
      description: "Clear answers to all your questions",
    },
  ];

  return (
    <div className="lp3-landing min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.05)] via-[hsl(var(--lp3-accent)/0.03)] to-transparent" />
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[hsl(var(--lp3-primary)/0.08)] rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[hsl(var(--lp3-accent)/0.06)] rounded-full blur-3xl translate-y-1/2" />
          
          <div className="container mx-auto text-center relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--lp3-primary)/0.1)] border border-[hsl(var(--lp3-primary)/0.2)] mb-4">
              <MessageCircle className="w-4 h-4 text-[hsl(var(--lp3-primary))]" />
              <span className="text-sm font-semibold text-[hsl(var(--lp3-primary))]">Get In Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 lp3-animate-fade-in">
              We'd Love to <span className="lp3-text-gradient">Hear From You</span>
            </h1>
            <p className="text-lg text-[hsl(var(--lp3-muted-foreground))] lp3-animate-slide-up max-w-2xl mx-auto">
              Have questions about our services? Need help with your interior planning? Our team is here to assist you.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 px-4 bg-[hsl(var(--lp3-secondary)/0.2)]">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {contactInfo.map((info, index) => (
                <Card 
                  key={index} 
                  className="lp3-glass-card lp3-hover-lift text-center border border-[hsl(var(--lp3-border)/0.3)]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${info.gradient} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 border border-[hsl(var(--lp3-border)/0.3)]`}>
                      <info.icon className="w-7 h-7 text-[hsl(var(--lp3-primary))]" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg mb-2 text-[hsl(var(--lp3-foreground))]">{info.title}</h3>
                      {info.link ? (
                        <a 
                          href={info.link} 
                          className="text-[hsl(var(--lp3-muted-foreground))] hover:text-[hsl(var(--lp3-primary))] transition-colors duration-300 font-medium"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-[hsl(var(--lp3-muted-foreground))] font-medium">{info.content}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <Card className="lp3-glass-card shadow-2xl border-2 border-[hsl(var(--lp3-border)/0.3)] lp3-hover-glow">
              <CardContent className="p-8 md:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--lp3-primary)/0.1)] border border-[hsl(var(--lp3-primary)/0.2)] mb-3">
                    <Send className="w-3 h-3 text-[hsl(var(--lp3-primary))]" />
                    <span className="text-xs font-semibold text-[hsl(var(--lp3-primary))]">Send Message</span>
                  </div>
                  <h2 className="text-3xl font-black mb-3 text-[hsl(var(--lp3-foreground))]">
                    Get In Touch With Us
                  </h2>
                  <p className="text-[hsl(var(--lp3-muted-foreground))]">
                    Fill out the form below and we'll respond within 24 hours
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-bold text-[hsl(var(--lp3-foreground))]">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className={`h-12 border-2 ${errors.name ? "border-[hsl(var(--lp3-destructive))]" : "border-[hsl(var(--lp3-input))]"} focus:border-[hsl(var(--lp3-primary))] transition-colors`}
                      />
                      {errors.name && (
                        <p className="text-xs text-[hsl(var(--lp3-destructive))] font-medium">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-bold text-[hsl(var(--lp3-foreground))]">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`h-12 border-2 ${errors.email ? "border-[hsl(var(--lp3-destructive))]" : "border-[hsl(var(--lp3-input))]"} focus:border-[hsl(var(--lp3-primary))] transition-colors`}
                      />
                      {errors.email && (
                        <p className="text-xs text-[hsl(var(--lp3-destructive))] font-medium">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-bold text-[hsl(var(--lp3-foreground))]">
                        Phone Number (Optional)
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className={`h-12 border-2 ${errors.phone ? "border-[hsl(var(--lp3-destructive))]" : "border-[hsl(var(--lp3-input))]"} focus:border-[hsl(var(--lp3-primary))] transition-colors`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-[hsl(var(--lp3-destructive))] font-medium">{errors.phone}</p>
                      )}
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-bold text-[hsl(var(--lp3-foreground))]">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        className={`h-12 border-2 ${errors.subject ? "border-[hsl(var(--lp3-destructive))]" : "border-[hsl(var(--lp3-input))]"} focus:border-[hsl(var(--lp3-primary))] transition-colors`}
                      />
                      {errors.subject && (
                        <p className="text-xs text-[hsl(var(--lp3-destructive))] font-medium">{errors.subject}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-bold text-[hsl(var(--lp3-foreground))]">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      className={`min-h-[160px] resize-none border-2 ${errors.message ? "border-[hsl(var(--lp3-destructive))]" : "border-[hsl(var(--lp3-input))]"} focus:border-[hsl(var(--lp3-primary))] transition-colors`}
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center">
                      {errors.message && (
                        <p className="text-xs text-[hsl(var(--lp3-destructive))] font-medium">{errors.message}</p>
                      )}
                      <p className="text-xs text-[hsl(var(--lp3-muted-foreground))] ml-auto">
                        {formData.message.length}/1000
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[hsl(var(--lp3-primary))] hover:bg-[hsl(var(--lp3-primary)/0.9)] text-[hsl(var(--lp3-primary-foreground))] hover:shadow-[0_15px_30px_hsl(var(--lp3-primary)/0.3)] hover:scale-105 transition-all duration-300 font-bold text-base group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          Send Message
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--lp3-primary)/0.9)] to-[hsl(var(--lp3-accent)/0.9)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why Contact Section */}
        <section className="py-16 px-4 bg-[hsl(var(--lp3-secondary)/0.2)]">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--lp3-primary)/0.1)] border border-[hsl(var(--lp3-primary)/0.2)] mb-4">
              <Sparkles className="w-4 h-4 text-[hsl(var(--lp3-primary))]" />
              <span className="text-sm font-semibold text-[hsl(var(--lp3-primary))]">Why Choose Us</span>
            </div>
            <h2 className="text-3xl font-black mb-12 text-[hsl(var(--lp3-foreground))]">
              Why Reach Out to Us?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((item, index) => (
                <div key={index} className="lp3-glass-card p-6 rounded-xl border border-[hsl(var(--lp3-border)/0.3)] lp3-hover-lift">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--lp3-primary)/0.15)] to-[hsl(var(--lp3-accent)/0.15)] flex items-center justify-center mx-auto mb-4 border border-[hsl(var(--lp3-border)/0.3)]">
                    <CheckCircle2 className="w-6 h-6 text-[hsl(var(--lp3-primary))]" />
                  </div>
                  <h3 className="font-black text-lg mb-2 text-[hsl(var(--lp3-foreground))]">{item.title}</h3>
                  <p className="text-sm text-[hsl(var(--lp3-muted-foreground))]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;