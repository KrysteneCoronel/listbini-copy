import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { login } from '../database/authDatabase';
import Logo from './Logo';
import styles from '../styles/LoginStyles';

interface UserLoginScreenProps {
  navigation: any;
}

const UserLoginScreen: React.FC<UserLoginScreenProps> = ({ navigation }) => {
  const [userType, setUserType] = useState<'customer' | 'employee'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (email && password) {
      const result = login({ email, password, userType });
      if (result) {
        Alert.alert('Success', 'Login successful!');
        // Navigate to main app or dashboard
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };

  const handleEmployeeLogin = () => {
    navigation.navigate('EmployeeLogin');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section with Grid Background */}
        <View style={styles.headerSection}>
          <Logo />
          <Text style={styles.title}>Get Started now</Text>
          <Text style={styles.subtitle}>Scan, shop, and save with ease.</Text>
        </View>

        {/* User Type Selector */}
        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'customer' && styles.userTypeButtonActive
            ]}
            onPress={() => setUserType('customer')}
          >
            <Text style={styles.userTypeIcon}>👤</Text>
            <Text style={[
              styles.userTypeText,
              userType === 'customer' && styles.userTypeTextActive
            ]}>
              Customer
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'employee' && styles.userTypeButtonActive
            ]}
            onPress={() => setUserType('employee')}
          >
            <Text style={styles.userTypeIcon}>🛡️</Text>
            <Text style={[
              styles.userTypeText,
              userType === 'employee' && styles.userTypeTextActive
            ]}>
              Employee
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Set Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                key={showPassword ? 'visible' : 'hidden'}
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity onPress={() => navigation.navigate('UserSignUp')}>
          <Text style={styles.signUpLink}>Don't have an account? <Text style={styles.signUpLinkHighlight}>Sign Up</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserLoginScreen;
