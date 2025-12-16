"use client";

import { createSPASassClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SSOButtons from "@/components/SSOButtons";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!acceptedTerms) {
      setError("עליך לאשר את תנאי השימוש ומדיניות הפרטיות");
      return;
    }

    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phone);
      const supabase = await createSPASassClient();
      const { error } = await supabase.registerEmail(
        email,
        password,
        formattedPhone
      );

      if (error) throw error;

      router.push("/auth/verify-email");
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
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            כתובת אימייל
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            מספר טלפון
          </label>
          <div className="mt-1">
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              placeholder="0501234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 text-left"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            סיסמה
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            אימות סיסמה
          </label>
          <div className="mt-1">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <div className="mr-3 text-sm">
              <label htmlFor="terms" className="text-gray-600">
                אני מסכים ל
                <Link
                  href="/legal/terms"
                  className="font-medium text-primary-600 hover:text-primary-500 mx-1"
                  target="_blank"
                >
                  תנאי השימוש
                </Link>
                ול
                <Link
                  href="/legal/privacy"
                  className="font-medium text-primary-600 hover:text-primary-500 mx-1"
                  target="_blank"
                >
                  מדיניות הפרטיות
                </Link>
              </label>
            </div>
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "יוצר חשבון..." : "צור חשבון"}
          </button>
        </div>
      </form>

      <SSOButtons onError={setError} />

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">כבר יש לך חשבון?</span>{" "}
        <Link
          href="/auth/login"
          className="font-medium text-primary-600 hover:text-primary-500"
        >
          התחבר
        </Link>
      </div>
    </div>
  );
}
