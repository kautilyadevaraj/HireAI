import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get("filename");

        if (!filename) {
            return NextResponse.json(
                { error: "Filename is required" },
                { status: 400 },
            );
        }

        // In serverless environments like Vercel, files are processed in memory only
        // No actual file deletion is needed since files aren't saved to filesystem
        // This endpoint exists for compatibility with the frontend delete functionality

        return NextResponse.json({
            success: true,
            message: "File reference removed successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            {
                error: "Failed to remove file reference",
            },
            { status: 500 },
        );
    }
}
