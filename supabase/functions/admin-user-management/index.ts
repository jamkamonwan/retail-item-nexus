import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CreateUserRequest {
  email: string;
  fullName: string;
  userType: "internal" | "external";
  roles: string[];
  departments?: string[];
  supplierId?: string;
  permissions?: string[];
}

interface UpdateUserRequest {
  userId: string;
  fullName?: string;
  userType?: "internal" | "external";
  status?: "active" | "inactive" | "locked";
  roles?: string[];
  departments?: string[];
  supplierId?: string;
  permissions?: string[];
}

interface ResetPasswordRequest {
  userId: string;
}

// Generate a secure temporary password
function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Create client with user's token to verify they're admin
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub as string;

    // Check if user is admin using server-side function
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: isAdmin } = await adminClient.rpc("is_admin", { _user_id: userId });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Forbidden - Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (req.method === "POST" && action === "create-user") {
      const body: CreateUserRequest = await req.json();
      
      // Validate required fields
      if (!body.email || !body.fullName || !body.roles?.length) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate temporary password
      const tempPassword = generateTempPassword();

      // Create user with admin API
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email: body.email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm email for admin-created users
        user_metadata: {
          full_name: body.fullName,
          role: body.roles[0], // Primary role for the trigger
        },
      });

      if (createError) {
        console.error("Create user error:", createError);
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const newUserId = newUser.user.id;

      // Update profile with additional fields and set must_change_password flag
      await adminClient
        .from("profiles")
        .update({
          full_name: body.fullName,
          user_type: body.userType,
          status: "active",
          must_change_password: true, // Force password change on first login
        })
        .eq("user_id", newUserId);

      // Add additional roles (first role added by trigger)
      for (let i = 1; i < body.roles.length; i++) {
        await adminClient
          .from("user_roles")
          .insert({ user_id: newUserId, role: body.roles[i] });
      }

      // Add departments if internal user
      if (body.userType === "internal" && body.departments?.length) {
        for (const deptCode of body.departments) {
          await adminClient
            .from("user_departments")
            .insert({ user_id: newUserId, department_code: deptCode });
        }
      }

      // Add supplier if external user
      if (body.userType === "external" && body.supplierId) {
        await adminClient
          .from("user_suppliers")
          .insert({ user_id: newUserId, supplier_id: body.supplierId });
      }

      // Add permissions
      if (body.permissions?.length) {
        for (const perm of body.permissions) {
          await adminClient
            .from("user_permissions")
            .insert({ user_id: newUserId, permission: perm });
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          userId: newUserId,
          tempPassword,
          message: "User created successfully. Please share the temporary password securely.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "POST" && action === "update-user") {
      const body: UpdateUserRequest = await req.json();

      if (!body.userId) {
        return new Response(
          JSON.stringify({ error: "User ID required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update profile
      const profileUpdates: Record<string, unknown> = {};
      if (body.fullName) profileUpdates.full_name = body.fullName;
      if (body.userType) profileUpdates.user_type = body.userType;
      if (body.status) profileUpdates.status = body.status;

      if (Object.keys(profileUpdates).length > 0) {
        await adminClient
          .from("profiles")
          .update(profileUpdates)
          .eq("user_id", body.userId);
      }

      // Update roles if provided
      if (body.roles) {
        // Remove existing roles
        await adminClient
          .from("user_roles")
          .delete()
          .eq("user_id", body.userId);

        // Add new roles
        for (const role of body.roles) {
          await adminClient
            .from("user_roles")
            .insert({ user_id: body.userId, role });
        }
      }

      // Update departments if provided
      if (body.departments !== undefined) {
        await adminClient
          .from("user_departments")
          .delete()
          .eq("user_id", body.userId);

        for (const deptCode of body.departments) {
          await adminClient
            .from("user_departments")
            .insert({ user_id: body.userId, department_code: deptCode });
        }
      }

      // Update supplier if provided
      if (body.supplierId !== undefined) {
        await adminClient
          .from("user_suppliers")
          .delete()
          .eq("user_id", body.userId);

        if (body.supplierId) {
          await adminClient
            .from("user_suppliers")
            .insert({ user_id: body.userId, supplier_id: body.supplierId });
        }
      }

      // Update permissions if provided
      if (body.permissions !== undefined) {
        await adminClient
          .from("user_permissions")
          .delete()
          .eq("user_id", body.userId);

        for (const perm of body.permissions) {
          await adminClient
            .from("user_permissions")
            .insert({ user_id: body.userId, permission: perm });
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: "User updated successfully" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "POST" && action === "reset-password") {
      const body: ResetPasswordRequest = await req.json();

      if (!body.userId) {
        return new Response(
          JSON.stringify({ error: "User ID required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const tempPassword = generateTempPassword();

      const { error } = await adminClient.auth.admin.updateUserById(body.userId, {
        password: tempPassword,
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          tempPassword,
          message: "Password reset successfully. Please share the new password securely.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
