import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button, Text, TextInput } from 'react-native-paper';
import { useChatMessages } from '@features/chat/hooks';
import { useAuthStore } from '@store/auth-store';

export default function ChatScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { profile } = useAuthStore();
  const { data, isLoading, sendMessage, isSending } = useChatMessages(id ?? '');
  const [message, setMessage] = useState('');

  if (!id) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Chat não encontrado.</Text>
      </View>
    );
  }

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage(message.trim());
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <FlatList
        contentContainerStyle={{ padding: 16, gap: 8 }}
        data={data ?? []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isMine = item.sender_id === profile?.id;
          return (
            <View
              style={{
                alignSelf: isMine ? 'flex-end' : 'flex-start',
                backgroundColor: isMine ? '#F97316' : '#E2E8F0',
                padding: 12,
                borderRadius: 16,
                maxWidth: '80%',
              }}
            >
              <Text style={{ color: isMine ? '#fff' : '#000' }}>{item.content}</Text>
            </View>
          );
        }}
        ListEmptyComponent={
          isLoading ? (
            <View style={{ padding: 32, alignItems: 'center' }}>
              <Text>Carregando conversas...</Text>
            </View>
          ) : (
            <View style={{ padding: 32, alignItems: 'center' }}>
              <Text>Envie a primeira mensagem para iniciar a negociação.</Text>
            </View>
          )
        }
      />
      <View style={{ flexDirection: 'row', padding: 16, gap: 8 }}>
        <TextInput
          style={{ flex: 1 }}
          placeholder="Escreva sua mensagem"
          value={message}
          onChangeText={setMessage}
        />
        <Button mode="contained" onPress={handleSend} loading={isSending}>
          Enviar
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
