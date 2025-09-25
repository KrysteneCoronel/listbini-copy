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
import styles from '../styles/EmployeeStyles';

interface EmployeeLoginScreenProps {
  navigation: any;
}

const EmployeeLoginScreen: React.FC<EmployeeLoginScreenProps> = ({ navigation }) => {
  const [employeeId, setEmployeeId] = useState('');

  const handleEmployeeIdLogin = () => {
    if (employeeId) {
      const result = login({ employeeId, userType: 'employee' });
      if (result) {
        Alert.alert('Success', 'Employee login successful!');
        // Navigate to employee dashboard
      } else {
        Alert.alert('Error', 'Invalid Employee ID');
      }
    } else {
      Alert.alert('Error', 'Please enter your Employee ID');
    }
  };

  const handleScanId = () => {
    Alert.alert('Scan ID', 'Camera functionality would be implemented here');
  };

  const handleAccessDashboard = () => {
    Alert.alert('Dashboard', 'Accessing employee dashboard...');
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Employee Login</Text>
        </View>

        <Text style={styles.subtitle}>Access your employee dashboard</Text>

        {/* Key Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.keyIcon}>
            <Text style={styles.keySymbol}>🔑</Text>
          </View>
        </View>

        <Text style={styles.verifyTitle}>Verify Your Identity</Text>
        <Text style={styles.instructions}>
          Scan your employee ID badge or enter your employee number
        </Text>

        {/* Employee ID Input */}
        <TextInput
          style={styles.employeeIdInput}
          placeholder="Enter your employee ID"
          value={employeeId}
          onChangeText={setEmployeeId}
        />

        <Text style={styles.orText}>or</Text>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.scanButton} onPress={handleScanId}>
          <Text style={styles.scanButtonText}>Scan Employee ID</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dashboardButton} onPress={handleAccessDashboard}>
          <Text style={styles.dashboardButtonText}>Access Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmployeeLoginScreen;
