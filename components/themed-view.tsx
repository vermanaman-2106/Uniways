import { View, type ViewProps } from 'react-native';
import { Colors } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  variant?: 'default' | 'alt';
};

export function ThemedView({ style, variant = 'default', ...otherProps }: ThemedViewProps) {
  const backgroundColor = variant === 'alt' ? Colors.backgroundAlt : Colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

