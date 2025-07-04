import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getUserRole } from "@/lib/utils";
import type { User } from "@/types/user";

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const supabase = createClient();
                const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
                
                if (authError || !authUser) {
                    setError("Failed to fetch user");
                    setLoading(false);
                    return;
                }

                const userRole = await getUserRole(supabase);
                
                // Extract display name and split into first and last name
                const displayName = authUser.user_metadata?.display_name || "";
                const nameParts = displayName.split(" ");
                const firstName = nameParts[0] || "";
                const lastName = nameParts.slice(1).join(" ") || "";

                const userData: User = {
                    id: authUser.id,
                    email: authUser.email || "",
                    firstName,
                    lastName,
                    role: userRole as any,
                    avatar: authUser.user_metadata?.avatar_url,
                };

                setUser(userData);
                setError(null);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Failed to fetch user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

        // Listen for auth changes
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            fetchUser();
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, loading, error };
} 