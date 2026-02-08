'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(userId: string, data: {
    credits_balance?: number;
    subscription_tier?: string;
    subscription_status?: string;
}) {
    const supabase = await createClient();

    // Verify admin status first for extra security
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: requesterProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (requesterProfile?.role !== 'admin') {
        throw new Error("Forbidden: Admins only");
    }

    // Perform Update
    const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId);

    if (error) throw new Error(error.message);

    revalidatePath('/admin');
    return { success: true };
}

export async function sendPasswordReset(email: string) {
    const supabase = await createClient();

    // Uses the public reset flow, which sends an email to the user
    // This is safe to call as an admin or public user
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://neato-voice.netlify.app'}/reset-password`,
    });

    if (error) throw new Error(error.message);
    return { success: true };
}
