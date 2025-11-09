import { supabase } from '@services/api/supabaseClient';
import { Chat, Message } from '@types/models';

export const fetchChats = async (userId: string) => {
  const { data, error } = await supabase
    .from('chats')
    .select('*, property:properties(id,title,price_kz,location), last_message:messages(order=created_at.desc).limit(1)')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Chat[];
};

export const fetchMessages = async (chatId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Message[];
};

export const sendMessage = async (chatId: string, senderId: string, content: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({ chat_id: chatId, sender_id: senderId, content, type: 'text' })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
};

export const ensureChat = async (propertyId: string, buyerId: string, sellerId: string) => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('property_id', propertyId)
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  if (data) return data as Chat;

  const { data: created, error: createError } = await supabase
    .from('chats')
    .insert({ property_id: propertyId, buyer_id: buyerId, seller_id: sellerId })
    .select()
    .single();

  if (createError) throw createError;
  return created as Chat;
};
