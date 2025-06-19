import { createClient } from "@/utils/supabase/server";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { redirect } from "next/navigation";
import { Header } from "./header";
import { getUserRole } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CandidateSidebar } from "@/components/candidate-sidebar";

export default async function CandidateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        redirect("/login");
    }

    if ((await getUserRole(supabase)) != "candidate") {
        redirect("/");
    }

    return (
        <div>
            <div>
                <SidebarProvider>
                    <div className="flex min-h-screen w-full">
                        <CandidateSidebar />
                        <div className="flex-1 flex flex-col">
                            <Header />
                            <main className="flex-1 p-6 bg-background">
                                {children}
                            </main>
                        </div>
                    </div>
                </SidebarProvider>
            </div>
        </div>
    );
}
