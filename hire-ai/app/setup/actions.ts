"use server";

import { revalidatePath } from "next/cache";

export async function revalidateJugad() {
    //idk why this isn't working i will cry
    revalidatePath("/", "layout");
}
