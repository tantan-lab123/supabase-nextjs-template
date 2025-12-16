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
import { Key, User, CheckCircle, Trash2 } from "lucide-react";
import { MFASetup } from "@/components/MFASetup";
import { useRouter } from "next/navigation";

export default function UserSettingsPage() {
  const { user } = useGlobal();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("הסיסמאות החדשות אינן תואמות");
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

      setSuccess("הסיסמה עודכנה בהצלחה");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        console.error("Error updating password:", err);
        setError(err.message);
      } else {
        console.error("Error updating password:", err);
        setError("עדכון הסיסמה נכשל");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו אינה הפיכה וכל הנתונים שלך יימחקו."
      )
    ) {
      return;
    }

    setDeleteLoading(true);
    setError("");

    try {
      const supabase = await createSPASassClient();
      const { error } = await supabase.deleteUserAccount();

      if (error) throw error;

      await supabase.logout();
      router.push("/auth/login");
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        console.error("Error deleting account:", err);
        setError(err.message);
      } else {
        console.error("Error deleting account:", JSON.stringify(err));
        setError("מחיקת החשבון נכשלה: " + JSON.stringify(err));
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6" dir="rtl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">הגדרות משתמש</h1>
        <p className="text-muted-foreground">
          נהל את הגדרות האבטחה והחשבון שלך
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
              <div>
                <label className="text-sm font-medium text-gray-500">
                  אימייל
                </label>
                <p className="mt-1 text-sm">{user?.email}</p>
              </div>
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

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                מחיקת חשבון
              </CardTitle>
              <CardDescription>
                מחיקת החשבון היא פעולה סופית ואינה הפיכה
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {deleteLoading ? "מוחק..." : "מחק חשבון לצמיתות"}
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
