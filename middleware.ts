import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isAdminEmail, isSupabaseConfigured } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;
  const isLogin = path.startsWith("/admin/login");
  const isAuthFlow = path.startsWith("/admin/auth");
  if (isAuthFlow) return response;

  if (!isSupabaseConfigured) {
    // CRM de demonstração (dados fictícios): liberado só enquanto o banco não está ligado
    if (isLogin || path.startsWith("/admin/crm")) return response;
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list: { name: string; value: string; options: CookieOptions }[]) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const allowed = user && isAdminEmail(user.email);

  if (!allowed && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (allowed && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
