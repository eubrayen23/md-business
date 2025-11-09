import { FlatList, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useChatList } from '@features/chat/hooks';
import { ChatListItem } from '@features/chat/components/ChatListItem';

export default function ChatsScreen() {
  const router = useRouter();
  const { data, isLoading } = useChatList();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={data ?? []}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <ChatListItem
          chat={item}
          onPress={() => router.push({ pathname: '/(app)/chat/[id]', params: { id: item.id } })}
        />
      )}
      ListEmptyComponent={
        <View style={{ alignItems: 'center', padding: 32 }}>
          <Text>Sem conversas por enquanto. Inicie uma negociação em um imóvel.</Text>
        </View>
      }
    />
  );
}
