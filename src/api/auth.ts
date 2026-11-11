import { supabase } from "@/integrations/supabase/client";
import type { User } from "@/types";
type AuthIdentity = { id: string; email?: string; created_at?: string; user_metadata?: Record<string, unknown> };
export function toAppUser(authUser: AuthIdentity): User { const metadataName = authUser.user_metadata?.["display_name"]; const email = authUser.email ?? ""; return { id: authUser.id, name: typeof metadataName === "string" && metadataName.trim() ? metadataName.trim() : email.split("@")[0] || "Bạn", email, createdAt: authUser.created_at ?? new Date().toISOString() }; }
export async function getCurrentUser(): Promise<User | null> { const { data, error } = await supabase.auth.getUser(); if (error || !data.user) return null; return toAppUser(data.user); }
export async function register(input: { name: string; email: string; password: string }) { const { data, error } = await supabase.auth.signUp({ email: input.email.trim(), password: input.password, options: { data: { display_name: input.name.trim() }, emailRedirectTo: window.location.origin } }); if (error) throw error; return data.user && data.session ? toAppUser(data.user) : null; }
export async function login(input: { email: string; password: string }) { const { data, error } = await supabase.auth.signInWithPassword({ email: input.email.trim(), password: input.password }); if (error) throw error; return data.user ? toAppUser(data.user) : null; }
export async function logout() { const { error } = await supabase.auth.signOut(); if (error) throw error; }
