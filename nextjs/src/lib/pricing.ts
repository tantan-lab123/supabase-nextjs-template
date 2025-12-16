export interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

class PricingService {
  private static tiers: PricingTier[] = [];

  static initialize() {
    this.tiers = [
      {
        name: "בסיסי",
        price: 0,
        description: "מתאים לעסקים בתחילת הדרך",
        features: [
          "עד 50 לידים בחודש",
          "התראות וואטסאפ מיידיות",
          "חיבור למספר אחד",
        ],
        popular: false,
      },
      {
        name: "מתקדם",
        price: 49,
        description: "לעסקים בצמיחה שצריכים יותר",
        features: [
          "עד 300 לידים בחודש",
          "התראות וואטסאפ מיידיות",
          "חיבור עד 2 מספרים",
          "הודעות מותאמות אישית",
        ],
        popular: true,
      },
      {
        name: "מקצוען",
        price: 99,
        description: "לסוכנויות ועסקים גדולים",
        features: [
          "לידים ללא הגבלה",
          "התראות וואטסאפ מיידיות",
          "חיבור עד 5 מספרים",
          "הודעות מותאמות אישית",
        ],
        popular: false,
      },
    ];
  }

  static getAllTiers(): PricingTier[] {
    if (this.tiers.length === 0) {
      this.initialize();
    }
    return this.tiers;
  }

  static getCommonFeatures(): string[] {
    return ["אבטחת SSL", "עדכונים שוטפים", "שרתים מהירים"];
  }

  static formatPrice(price: number): string {
    return `₪${price}`;
  }
}

export default PricingService;
