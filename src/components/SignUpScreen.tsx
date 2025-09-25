import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { signUp } from '../database/authDatabase';
import Logo from './Logo';
import styles from '../styles/SignUpStyles';

interface UserSignUpScreenProps {
  navigation: any;
}

const UserSignUpScreen: React.FC<UserSignUpScreenProps> = ({ navigation }) => {
  const [userType, setUserType] = useState<'customer' | 'employee'>('customer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    if (firstName && lastName && email && password) {
      const result = signUp({ firstName, lastName, email, password, userType });
      if (result) {
        Alert.alert('Success', 'User registered successfully!');
        navigation.navigate('UserLogin');
      } else {
        Alert.alert('Error', 'User registration failed.');
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
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
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          
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

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity onPress={() => navigation.navigate('UserLogin')}>
          <Text style={styles.loginLink}>Already have an account? <Text style={styles.loginLinkHighlight}>Log In</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserSignUpScreen;