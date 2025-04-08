import { createClient } from '@supabase/supabase-js';

// These will be replaced with actual values from your Supabase project
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  area_code?: string;
  phone_number?: string;
  onboarding_completed?: boolean;
  is_admin?: boolean;
  created_at: string;
  updated_at: string;
};

export type SavedFlow = {
  id: string;
  user_id: string;
  name: string;
  date: string;
  thumbnail: string;
  data: string;
  status: 'draft' | 'published';
  order_id?: string;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  flow_id: string;
  flow_name: string;
  date_submitted: string;
  status: 'ordered' | 'development' | 'testing' | 'review' | 'ready';
  notes?: string;
  estimated_completion?: string;
  created_at: string;
  updated_at: string;
};

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

// Database helper functions
export const getFlows = async (userId: string) => {
  const { data, error } = await supabase
    .from('flows')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return { data, error };
};

export const saveFlow = async (flow: Omit<SavedFlow, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('flows')
    .insert([flow])
    .select();
  return { data, error };
};

export const updateFlow = async (id: string, updates: Partial<SavedFlow>) => {
  const { data, error } = await supabase
    .from('flows')
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
};

export const deleteFlow = async (id: string) => {
  const { error } = await supabase
    .from('flows')
    .delete()
    .eq('id', id);
  return { error };
};

export const getOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select();
  return { data, error };
};

export const updateOrder = async (id: string, updates: Partial<Order>) => {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
};

// Admin functions (will be protected by RLS policies in Supabase)
export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:user_id (email, full_name, company_name)
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};
