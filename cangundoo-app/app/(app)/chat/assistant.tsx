import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { deepSeekFetch } from '@services/ai/deepseek';
import { useAuthStore } from '@store/auth-store';

export default function ChatAssistantScreen() {
  const params = useLocalSearchParams<{ propertyId: string | string[] }>();
  const propertyId = Array.isArray(params.propertyId) ? params.propertyId[0] : params.propertyId;
  const { profile } = useAuthStore();
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await deepSeekFetch({
        kind: 'chat-suggestion',
        prompt,
        context: {
          propertyId,
          user: { id: profile?.id, name: profile?.name },
        },
      });
      setSuggestions(response.suggestions);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text variant="headlineSmall">Sugestões da IA para negociação</Text>
      <Text>
        Descreva o tom ou estratégia desejada e receba sugestões de mensagens para usar com o
        vendedor.
      </Text>

      <TextInput
        mode="outlined"
        multiline
        numberOfLines={5}
        label="Prompt"
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Ex.: Quero negociar um desconto destacando que posso pagar à vista."
      />

      {errorMessage ? <HelperText type="error">{errorMessage}</HelperText> : null}

      <Button mode="contained" onPress={handleGenerate} loading={isLoading}>
        Gerar sugestões
      </Button>

      {suggestions.map((suggestion, index) => (
        <View
          key={index}
          style={{
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            padding: 16,
            backgroundColor: '#f8fafc',
          }}
        >
          <Text>{suggestion}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
