import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  showCheck?: boolean;
  showPasswordToggle?: boolean;
  onPasswordToggle?: () => void;
  secureTextEntry?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  showCheck,
  showPasswordToggle,
  onPasswordToggle,
  secureTextEntry,
  ...textInputProps
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          style={styles.input}
          placeholderTextColor="#B0B0B0"
          secureTextEntry={secureTextEntry}
          {...textInputProps}
        />
        {showCheck && (
          <Ionicons 
            name="checkmark" 
            size={20} 
            color="#000000" 
            style={styles.checkIcon} 
          />
        )}
        {showPasswordToggle && (
          <TouchableOpacity onPress={onPasswordToggle} style={styles.eyeIcon}>
            <Ionicons
              name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#000000"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 2,
    fontWeight: '400',
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222222',
    paddingVertical: 6,
  },
  checkIcon: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 14,
    bottom: 14,
  },
});

export default CustomTextInput;

