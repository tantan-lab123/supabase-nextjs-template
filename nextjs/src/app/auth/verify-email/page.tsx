"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createSPASassClient } from "@/lib/supabase/client";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resendVerificationEmail = async () => {
    if (!email) {
      setError("אנא הזן את כתובת האימייל שלך");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const supabase = await createSPASassClient();
      const { error } = await supabase.resendVerificationEmail(email);
      if (error) {
        setError(error.message);
        return;
      }
      setSuccess(true);
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("אירעה שגיאה לא ידועה");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          בדוק את האימייל שלך
        </h2>

        <p className="text-gray-600 mb-8">
          שלחנו לך אימייל עם קישור לאימות. אנא בדוק את תיבת הדואר שלך ולחץ על
          הקישור לאימות החשבון.
        </p>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            לא קיבלת את האימייל? בדוק את תיבת הספאם או הזן את כתובת האימייל שלך
            לשליחה חוזרת:
          </p>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-md p-3">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 rounded-md p-3">
              אימייל לאימות נשלח מחדש בהצלחה.
            </div>
          )}

          <div className="mt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="הזן את כתובת האימייל שלך"
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-sm"
            />
          </div>

          <button
            className="text-primary-600 hover:text-primary-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={resendVerificationEmail}
            disabled={loading}
          >
            {loading ? "שולח..." : "לחץ כאן לשליחה חוזרת"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            חזרה לכניסה
          </Link>
        </div>
      </div>
    </div>
  );
}
