import { createClient } from "@supabase/supabase-js";

export interface DB {
    getUser(): Promise<void>;
    signIn(email: string, password: string): Promise<boolean>;
    signOut(): Promise<void>;

    getTest(): Promise<any>;
    putTest(): Promise<any>;
}

const supabase = createClient(import.meta.env.VITE_DB_HOST, import.meta.env.VITE_DB_PUBLIC_KEY);

export function createDB(): DB {
    return {
        getUser: async () => {
            console.log(await supabase.auth.getUser());
        },

        signIn: async (email, password) => {
            let { data, error } = await supabase.auth.signInWithPassword({email, password});
            if (error !== null && error.code === "invalid_credentials") {
                let { data, error } = await supabase.auth.signUp({email, password});
                console.log("signUp", {data, error});
            } else {
                console.log("signIn", {data, error});
            }

            return false;
        },
        signOut: async () => {
            console.log(await supabase.auth.signOut());
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
