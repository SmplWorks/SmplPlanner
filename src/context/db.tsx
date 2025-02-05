import { createClient, type User } from "@supabase/supabase-js";

export interface DB {
    getUser(): Promise<User | null>;
    signIn(email: string, password: string): Promise<User | null>;
    signOut(): Promise<boolean>;

    getTest(): Promise<any>;
    putTest(): Promise<any>;
}

const supabase = createClient(import.meta.env.VITE_DB_HOST, import.meta.env.VITE_DB_PUBLIC_KEY);

export function createDB(): DB {
    return {
        getUser: async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error !== null) {
                console.error(`[db - getUser] ${error.code}: ${error.message}`);
                return null;
            }

            return user;
        },

        signIn: async (email, password) => {
            const { data: { user: signInUser }, error: signInError } = await supabase.auth.signInWithPassword({email, password});
            if (signInUser !== null) {
                return signInUser;
            }

            // The user may not exist, try signing up instead
            if (signInError!.code === "invalid_credentials") {
                console.warn("[db - signIn] Trying to sign up");
                const { data: { user: signUpUser }, error: signUpError } = await supabase.auth.signUp({email, password});
                if (signUpUser !== null) {
                    return signUpUser;
                }

                console.error(`[db - signIn] Error signing up, ${signUpError!.code}: ${signUpError!.message}`);
                return null;
            }

            // TODO: Handle email_not_confirmed

            console.error(`[db - signIn] ${signInError!.code}: ${signInError!.message}`);
            return null;
        },
        signOut: async () => {
            const { error } = await supabase.auth.signOut();
            if (error === null) {
                return true;
            }

            console.error(`[db - signOut] ${error}`)
            return false;
        },

        getTest: async () => {
            console.log(await supabase.from("test").select()); // TODO: https://supabase.com/docs/guides/database/postgres/row-level-security#add-filters-to-every-query
        },
        putTest: async () => {
            console.log(await supabase.from("test").insert([
                { content: "foo" },
            ]));
        },
    }
}
