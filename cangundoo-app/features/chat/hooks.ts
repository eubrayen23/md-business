import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@services/api/supabaseClient';
import { useAuthStore } from '@store/auth-store';
import { fetchChats, fetchMessages, sendMessage, ensureChat } from './api';

export const useChatList = () => {
  const { profile } = useAuthStore();

  return useQuery({
    queryKey: ['chats'],
    queryFn: () => fetchChats(profile?.id ?? ''),
    enabled: Boolean(profile?.id),
  });
};

export const useChatMessages = (chatId: string) => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  const query = useQuery({
    queryKey: ['chat-messages', chatId],
    queryFn: () => fetchMessages(chatId),
    enabled: Boolean(chatId),
  });

  useEffect(() => {
    if (!chatId) return;

    const channel = supabase
      .channel(`messages:${chatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        payload => {
          queryClient.setQueryData(['chat-messages', chatId], (old: any) => {
            if (!old) return [payload.new];
            return [...old, payload.new];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, queryClient]);

  const mutation = useMutation({
    mutationFn: (content: string) => sendMessage(chatId, profile?.id ?? '', content),
    onMutate: async message => {
      await queryClient.cancelQueries({ queryKey: ['chat-messages', chatId] });
      const previous = queryClient.getQueryData(['chat-messages', chatId]);

      queryClient.setQueryData(['chat-messages', chatId], (old: any) => [
        ...(old ?? []),
        {
          id: Math.random().toString(36),
          chat_id: chatId,
          sender_id: profile?.id,
          content: message,
          created_at: new Date().toISOString(),
          type: 'text',
        },
      ]);

      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['chat-messages', chatId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', chatId] });
    },
  });

  return { ...query, sendMessage: mutation.mutateAsync, isSending: mutation.isPending };
};

export const useEnsureChat = () => {
  const { profile } = useAuthStore();

  return useMutation({
    mutationFn: async ({ propertyId, sellerId }: { propertyId: string; sellerId: string }) => {
      if (!profile?.id) throw new Error('Usuário não autenticado');
      return ensureChat(propertyId, profile.id, sellerId);
    },
  });
};
