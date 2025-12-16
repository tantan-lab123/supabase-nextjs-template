import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Shield,
  Smartphone,
  Settings,
  Webhook,
  Clock,
} from "lucide-react";
import AuthAwareButtons from "@/components/AuthAwareButtons";
import HomePricing from "@/components/HomePricing";
import Navbar from "@/components/Navbar";

export default function Home() {
  const productName = "LeadAlert";

  const features = [
    {
      icon: Zap,
      title: "התראות מיידיות",
      description:
        "קבל עדכון בוואטסאפ בשניה שהלקוח משאיר פרטים. אל תתן לליד לחכות אפילו רגע אחד.",
      color: "text-yellow-600",
    },
    {
      icon: Smartphone,
      title: "ישירות לנייד שלך",
      description:
        "אין צורך להיכנס למערכות מסובכות. הלידים מגיעים למקום שבו אתה נמצא כל היום - הוואטסאפ.",
      color: "text-green-600",
    },
    {
      icon: Webhook,
      title: "חיבור פשוט לכל אתר",
      description:
        "מתממשק בקלות לכל טופס, דף נחיתה או CRM באמצעות Webhook חכם ופשוט להגדרה.",
      color: "text-blue-600",
    },
    {
      icon: Settings,
      title: "הודעות מותאמות אישית",
      description:
        "עיצוב מלא של הודעת ההתראה. בחר אילו שדות להציג ואיך ההודעה תיראה.",
      color: "text-gray-600",
    },
    {
      icon: Clock,
      title: "חסוך זמן יקר",
      description:
        "במקום לבדוק מיילים כל היום, המערכת דוחפת אליך את המידע החשוב בזמן אמת.",
      color: "text-purple-600",
    },
    {
      icon: Shield,
      title: "אמינות מובטחת",
      description: "שרתים יציבים ומאובטחים מבטיחים שאף ליד לא ילך לאיבוד בדרך.",
      color: "text-red-600",
    },
  ];

  const stats = [
    { label: "זמן תגובה", value: "< 5 שניות" },
    { label: "שיפור בסגירות", value: "+300%" },
    { label: "התקנה", value: "2 דקות" },
    { label: "זמינות", value: "24/7" },
  ];

  return (
    <div className="min-h-screen" dir="rtl">
      <Navbar />

      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              הפוך כל ליד ללקוח משלם
              <span className="block text-primary-600">תוך שניות בודדות</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              קבל התראות וואטסאפ בזמן אמת על כל ליד חדש שנכנס לאתר שלך. חזור
              ללקוחות ברגע האמת וסגור יותר עסקאות.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <AuthAwareButtons />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">כל מה שאתה צריך כדי להצליח</h2>
            <p className="mt-4 text-xl text-gray-600">
              מערכת מתקדמת שנותנת לך שקט נפשי ויכולת להגיב מהר לכל הזדמנות
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
                <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomePricing />

      <section className="py-24 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            מוכן להתחיל לקבל לידים לנייד?
          </h2>
          <p className="mt-4 text-xl text-primary-100">
            הצטרף לעסקים המובילים בישראל שכבר לא מפספסים אף לקוח עם{" "}
            {productName}
          </p>
          <Link
            href="/auth/register"
            className="mt-8 inline-flex items-center px-6 py-3 rounded-lg bg-white text-primary-600 font-medium hover:bg-primary-50 transition-colors"
          >
            התחל עכשיו בחינם
            <ArrowRight className="mr-2 h-5 w-5 transform rotate-180" />
          </Link>
        </div>
      </section>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">מוצר</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="#features"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    פיצ&apos;רים
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    מחירים
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">משאבים</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    תיעוד
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">משפטי</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    פרטיות
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    תנאי שימוש
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">
              © {new Date().getFullYear()} {productName}. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
