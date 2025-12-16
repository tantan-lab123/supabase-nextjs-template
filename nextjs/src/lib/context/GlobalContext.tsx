// src/lib/context/GlobalContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';


type User = {
    email: string;
    id: string;
    registered_at: Date;
};

interface GlobalContextType {
    loading: boolean;
    user: User | null;  // Add this
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);  // Add this

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

    useEffect(() => {
        async function loadData() {
            try {
                const supabase = await createSPASassClient();
                const client = supabase.getSupabaseClient();

                // Get user data
                const { data: { user } } = await client.auth.getUser();
                if (user) {
                    setUser({
                        email: user.email!,
                        id: user.id,
                        registered_at: new Date(user.created_at)
                    });

                    // Ensure customer record exists (Self-healing if trigger failed)
                    const { data: customer } = await supabase.getCustomer(user.id);
                    if (!customer) {
                        const phone = user.user_metadata?.phone;
                        if (phone) {
                            const formattedPhone = formatPhoneNumber(phone);
                            await supabase.upsertCustomer({
                                secret_token: user.id,
                                chat_id: formattedPhone,
                                template: "🎉 קיבלת ליד חדש 🎉\nשם: {{name}}\nטלפון: {{tel}}"
                            });
                            console.log("Created missing customer record from user metadata");
                        }
                    }

                } else {
                    throw new Error('User not found');
                }

            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <GlobalContext.Provider value={{ loading, user }}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
};
