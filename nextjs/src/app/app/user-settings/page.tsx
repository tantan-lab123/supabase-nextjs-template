"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGlobal } from "@/lib/context/GlobalContext";
import { createSPASassClientAuthenticated as createSPASassClient } from "@/lib/supabase/client";
import {
  Key,
  User,
  CheckCircle,
  Phone,
  MessageSquare,
  RotateCcw,
  Copy,
} from "lucide-react";
import { MFASetup } from "@/components/MFASetup";

export default function UserSettingsPage() {
  const { user } = useGlobal();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [phone, setPhone] = useState("");
  const DEFAULT_TEMPLATE = "🎉 קיבלת ליד חדש 🎉\nשם: {{name}}\nטלפון: {{tel}}";
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  React.useEffect(() => {
    async function loadCustomerSettings() {
      if (!user?.id) return;
      try {
        const supabase = await createSPASassClient();
        const { data } = await supabase.getCustomer(user.id);
        if (data) {
          // Strip @c.us for display if present
          let displayPhone = data.chat_id || "";
          if (displayPhone.endsWith("@c.us")) {
            displayPhone = displayPhone.replace("@c.us", "");
          }
          setPhone(displayPhone);
          // If template is null/empty in DB, use DEFAULT_TEMPLATE.
          // Otherwise, use the value from DB (which might be the old default without emojis).
          if (data.template) {
            setTemplate(data.template);
          } else {
            setTemplate(DEFAULT_TEMPLATE);
          }
        } else {
          // If no record exists yet, ensure we start with the default
          setTemplate(DEFAULT_TEMPLATE);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadCustomerSettings();
  }, [user?.id]);

  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove any whitespace
    let cleanNumber = phoneNumber.replace(/\s+/g, "");

    // Remove + from start
    if (cleanNumber.startsWith("+")) {
      cleanNumber = cleanNumber.substring(1);
    }

    // Replace leading 0 with 972
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "972" + cleanNumber.substring(1);
    }

    // Append @c.us if not present
    if (!cleanNumber.endsWith("@c.us")) {
      cleanNumber = cleanNumber + "@c.us";
    }

    return cleanNumber;
  };

  const handleNotificationSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setNotificationLoading(true);
    setError("");
    setSuccess("");

    try {
      const formattedPhone = formatPhoneNumber(phone);
      const supabase = await createSPASassClient();
      const { error } = await supabase.upsertCustomer({
        secret_token: user.id,
        chat_id: formattedPhone,
        template: template,
      });

      if (error) throw error;

      setSuccess("Notification settings updated successfully");
    } catch (err: unknown) {
      console.error("Error updating settings:", err);
      let errorMessage = "Unknown error";
      if (typeof err === "object" && err !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorObj = err as any;
        errorMessage =
          errorObj.message ||
          errorObj.error_description ||
          JSON.stringify(errorObj);
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      setError(`Failed to update settings: ${errorMessage}`);
    } finally {
      setNotificationLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const supabase = await createSPASassClient();
      const client = supabase.getSupabaseClient();

      const { error } = await client.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccess("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        console.error("Error updating password:", err);
        setError(err.message);
      } else {
        console.error("Error updating password:", err);
        setError("Failed to update password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6" dir="rtl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">הגדרות משתמש</h1>
        <p className="text-muted-foreground">
          נהל את הגדרות החשבון וההתראות שלך
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4 ml-2" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                פרטי משתמש
              </CardTitle>
              <CardDescription>פרטי החשבון שלך</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div>
                <label className="text-sm font-medium text-gray-500">
                  מזהה משתמש (User ID)
                </label>
                <p className="mt-1 text-sm font-mono">{user?.id}</p>
              </div> */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  אימייל
                </label>
                <p className="mt-1 text-sm">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  קישור Webhook
                </label>
                <div
                  className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors group relative"
                  onClick={() =>
                    copyToClipboard(
                      `https://n8n.invite2you.com/webhook/7cebb2d3-3846-4b8d-bef0-20f95f21fdb4/lead-alert/${user?.id}`
                    )
                  }
                  title="לחץ להעתקה"
                >
                  <p className="text-sm font-mono break-all pr-8">
                    https://n8n.invite2you.com/webhook/7cebb2d3-3846-4b8d-bef0-20f95f21fdb4/lead-alert/
                    {user?.id}
                  </p>
                  <div className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 group-hover:text-primary-600">
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  לחץ על הקישור כדי להעתיק אותו
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                הגדרות התראות
              </CardTitle>
              <CardDescription>הגדר היכן תרצה לקבל התראות</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleNotificationSettingsUpdate}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    מספר וואטסאפ
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0500000000"
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-sm text-right"
                      dir="ltr"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    הזן מספר טלפון (לדוגמה: 0501234567)
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="template"
                      className="block text-sm font-medium text-gray-700"
                    >
                      תבנית הודעה
                    </label>
                    <button
                      type="button"
                      onClick={() => setTemplate(DEFAULT_TEMPLATE)}
                      className="text-xs text-primary-600 hover:text-primary-500 flex items-center gap-1"
                      title="שחזר ברירת מחדל"
                    >
                      <RotateCcw className="h-3 w-3" />
                      שחזר ברירת מחדל
                    </button>
                  </div>
                  <div className="mt-1 relative">
                    <textarea
                      id="template"
                      value={template}
                      onChange={(e) => setTemplate(e.target.value)}
                      rows={4}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-sm"
                      dir="rtl"
                      required
                    />
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    משתנים זמינים: {"{{name}}"}, {"{{tel}}"}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={notificationLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {notificationLoading ? "שומר..." : "שמור הגדרות"}
                </button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                שינוי סיסמה
              </CardTitle>
              <CardDescription>עדכן את סיסמת החשבון שלך</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    סיסמה חדשה
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    אימות סיסמה חדשה
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? "מעדכן..." : "עדכן סיסמה"}
                </button>
              </form>
            </CardContent>
          </Card>

          <MFASetup
            onStatusChange={() => {
              setSuccess("הגדרות אימות דו-שלבי עודכנו בהצלחה");
            }}
          />
        </div>
      </div>
    </div>
  );
}
