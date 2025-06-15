import { createClient } from "@/utils/supabase/server";

export default async function RoleSetupPage() {
    const supabase = await createClient();

    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to Hire AI</h1>
                <p className="text-lg text-gray-600">You are undefined</p>
            </div>
        </div>
    );
}
