import { useState } from 'react';
import { View } from 'react-native';
import { Button, SegmentedButtons, TextInput } from 'react-native-paper';
import { PropertyFilters } from '../api';

type Props = {
  onApplyFilters: (filters: PropertyFilters) => void;
};

const propertyTypes = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'outro', label: 'Outro' },
];

export const FiltersBar = ({ onApplyFilters }: Props) => {
  const [filters, setFilters] = useState<PropertyFilters>({});

  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <View style={{ gap: 12, marginBottom: 16 }}>
      <TextInput
        label="Cidade"
        value={filters.city}
        onChangeText={value => setFilters(current => ({ ...current, city: value }))}
      />
      <SegmentedButtons
        value={filters.propertyType}
        onValueChange={value =>
          setFilters(current => ({ ...current, propertyType: value || undefined }))
        }
        buttons={propertyTypes}
      />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          style={{ flex: 1 }}
          label="Preço mínimo (Kz)"
          keyboardType="numeric"
          value={filters.minPrice?.toString() ?? ''}
          onChangeText={value =>
            setFilters(current => ({
              ...current,
              minPrice: value ? Number(value.replace(/\D/g, '')) : undefined,
            }))
          }
        />
        <TextInput
          style={{ flex: 1 }}
          label="Preço máximo (Kz)"
          keyboardType="numeric"
          value={filters.maxPrice?.toString() ?? ''}
          onChangeText={value =>
            setFilters(current => ({
              ...current,
              maxPrice: value ? Number(value.replace(/\D/g, '')) : undefined,
            }))
          }
        />
      </View>
      <Button mode="contained-tonal" onPress={handleApply}>
        Filtrar
      </Button>
    </View>
  );
};
