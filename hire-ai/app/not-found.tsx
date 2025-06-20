import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
            <div className="max-w-2xl mx-auto text-center">
                <Card className="card-elegant border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
                    <CardContent className="p-12">
                        <div className="space-y-8">
                            {/* 404 Icon and Number */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <FileQuestion className="h-24 w-24 mx-auto text-primary/60" />
                                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-destructive rounded-full flex items-center justify-center">
                                        <span className="text-destructive-foreground text-xs font-bold">!</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-8xl font-bold text-primary/80 tracking-tight">
                                        404
                                    </h1>
                                    <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"></div>
                                </div>
                            </div>

                            {/* Error Message */}
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-foreground/90">
                                    Page Not Found
                                </h2>
                                <p className="text-lg text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
                                    Oops! The page you're looking for seems to have wandered off. 
                                    Don't worry, even the best explorers sometimes take a wrong turn.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                                <Button 
                                    asChild 
                                    className="button-elegant bg-primary text-primary-foreground hover:bg-primary/90 min-w-[160px]"
                                >
                                    <Link href="/">
                                        <Home className="mr-2 h-4 w-4" />
                                        Go Home
                                    </Link>
                                </Button>
                                
                                <Button 
                                    variant="outline" 
                                    asChild
                                    className="button-elegant border-border/60 hover:border-primary/30 hover:bg-primary/5 min-w-[160px]"
                                >
                                    <Link href="javascript:history.back()">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Go Back
                                    </Link>
                                </Button>
                            </div>

                            {/* Additional Navigation */}
                            <div className="pt-8 border-t border-border/30">
                                <p className="text-sm text-muted-foreground/60 mb-4">
                                    Or explore these popular sections:
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        asChild
                                        className="text-muted-foreground/70 hover:text-primary hover:bg-primary/5"
                                    >
                                        <Link href="/dashboard">
                                            Dashboard
                                        </Link>
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        asChild
                                        className="text-muted-foreground/70 hover:text-primary hover:bg-primary/5"
                                    >
                                        <Link href="/search">
                                            <Search className="mr-1 h-3 w-3" />
                                            Search
                                        </Link>
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        asChild
                                        className="text-muted-foreground/70 hover:text-primary hover:bg-primary/5"
                                    >
                                        <Link href="/settings">
                                            Settings
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Background decoration */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
} 