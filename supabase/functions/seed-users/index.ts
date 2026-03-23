import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const USERS = [
  { email: "admin@ezdanny.com", name: "Admin User", role: "admin", managerId: null },
  { email: "darahas@ezdanny.com", name: "Darahas", role: "manager", managerEmail: "admin@ezdanny.com" },
  { email: "ashok@ezdanny.com", name: "Ashok", role: "manager", managerEmail: "admin@ezdanny.com" },
  { email: "hema@ezdanny.com", name: "Hema", role: "member", managerEmail: "darahas@ezdanny.com" },
  { email: "babloo@ezdanny.com", name: "Babloo", role: "member", managerEmail: "darahas@ezdanny.com" },
  { email: "chitti@ezdanny.com", name: "Chitti Naidu", role: "member", managerEmail: "darahas@ezdanny.com" },
  { email: "tarun@ezdanny.com", name: "Tarun", role: "member", managerEmail: "ashok@ezdanny.com" },
  { email: "rishi@ezdanny.com", name: "Rishi", role: "member", managerEmail: "ashok@ezdanny.com" },
  { email: "babu@ezdanny.com", name: "Babu Garu", role: "member", managerEmail: "ashok@ezdanny.com" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const results: any[] = [];
    const emailToId: Record<string, string> = {};

    // Step 1: Create all auth users and profiles (trigger handles profile creation)
    for (const user of USERS) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((u: any) => u.email === user.email);
      
      if (existing) {
        emailToId[user.email] = existing.id;
        results.push({ email: user.email, status: "already exists", id: existing.id });
        continue;
      }

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: "password123",
        email_confirm: true,
        user_metadata: { name: user.name },
      });

      if (error) {
        results.push({ email: user.email, status: "error", error: error.message });
        continue;
      }

      emailToId[user.email] = data.user.id;
      results.push({ email: user.email, status: "created", id: data.user.id });
    }

    // Step 2: Assign roles
    for (const user of USERS) {
      const userId = emailToId[user.email];
      if (!userId) continue;

      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: userId, role: user.role }, { onConflict: "user_id,role" });

      if (error) {
        results.push({ email: user.email, roleStatus: "error", error: error.message });
      }
    }

    // Step 3: Update manager relationships
    for (const user of USERS) {
      const userId = emailToId[user.email];
      if (!userId || !user.managerEmail) continue;

      const managerId = emailToId[user.managerEmail];
      if (!managerId) continue;

      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ manager_id: managerId })
        .eq("id", userId);

      if (error) {
        results.push({ email: user.email, managerStatus: "error", error: error.message });
      }
    }

    // Step 4: Seed goal bank templates
    const templates = [
      {
        title: "Improve Technical Skills",
        description: "Enhance your technical capabilities in your area of expertise",
        category: "Technical Skills",
        target_audience: "All",
        is_active: true,
      },
      {
        title: "Leadership Development",
        description: "Develop leadership skills and team management capabilities",
        category: "Leadership",
        target_audience: "Managers",
        is_active: true,
      },
      {
        title: "Customer Service Excellence",
        description: "Enhance customer service skills and customer satisfaction",
        category: "Customer Service",
        target_audience: "Customer-facing roles",
        is_active: true,
      },
    ];

    for (const template of templates) {
      const { error } = await supabaseAdmin
        .from("goal_bank")
        .upsert(template, { onConflict: "title" })
        .select();

      if (error) {
        // If upsert fails due to no unique constraint on title, just insert
        await supabaseAdmin.from("goal_bank").insert(template);
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
