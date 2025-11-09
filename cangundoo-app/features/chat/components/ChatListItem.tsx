import { View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { Chat } from '@types/models';
import { formatPriceKz } from '@lib/utils/format';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt';

dayjs.extend(relativeTime);
dayjs.locale('pt');

type Props = {
  chat: Chat;
  onPress: () => void;
};

export const ChatListItem = ({ chat, onPress }: Props) => {
  const lastMessage = Array.isArray((chat as any).last_message)
    ? (chat as any).last_message[0]
    : undefined;

  return (
    <TouchableRipple onPress={onPress} style={{ marginBottom: 8, borderRadius: 12 }}>
      <View
        style={{
          padding: 16,
          gap: 4,
          backgroundColor: 'white',
          borderRadius: 12,
        }}
      >
        <Text variant="titleMedium">{chat.property?.title}</Text>
        <Text variant="bodyMedium" style={{ color: '#777' }}>
          {formatPriceKz(chat.property?.price_kz ?? 0)} · {chat.property?.location}
        </Text>
        <Text variant="bodySmall" numberOfLines={1} style={{ color: '#999' }}>
          {lastMessage?.content ?? 'Sem mensagens ainda'}
        </Text>
        {lastMessage ? (
          <Text variant="bodySmall" style={{ color: '#bbb' }}>
            {dayjs(lastMessage.created_at).fromNow()}
          </Text>
        ) : null}
      </View>
    </TouchableRipple>
  );
};
