import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/admin/settings - Fetch all system settings
export async function GET() {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all settings
    const { data: settings, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Convert to Record<string, any> for easier access
    const settingsMap: Record<string, any> = {};
    settings?.forEach(setting => {
        // Parse jsonb value
        settingsMap[setting.setting_key] = setting.setting_value;
    });

    return NextResponse.json({ settings: settingsMap, raw: settings });
}

// POST /api/admin/settings - Update a setting
export async function POST(request: Request) {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
        return NextResponse.json({ error: 'Missing key or value' }, { status: 400 });
    }

    // Update setting
    const { data, error } = await supabase
        .from('system_settings')
        .update({
            setting_value: JSON.stringify(value),
            updated_at: new Date().toISOString(),
            updated_by: user.id
        })
        .eq('setting_key', key)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, setting: data });
}
