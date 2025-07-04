import { getUserRole } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SetupForm from "./setup-form";

export default async function RoleSetupPage() {
    const supabase = await createClient();

    const user_role = await getUserRole(supabase);
    if (user_role != "undefined") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <SetupForm />
            </div>
        </div>
    );
}
