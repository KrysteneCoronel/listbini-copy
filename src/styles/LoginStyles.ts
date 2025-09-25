import { StyleSheet } from 'react-native';

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerSection: {
    backgroundColor: '#f8f9fa',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    // Grid pattern background would be implemented with a custom component or SVG
    // For now, using a subtle background color
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 0,
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 32,
    marginBottom: 32,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 4,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  userTypeButtonActive: {
    backgroundColor: '#ffffff',
  },
  userTypeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  userTypeTextActive: {
    color: '#333333',
  },
  formContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  eyeIcon: {
    fontSize: 20,
    color: '#666666',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpLink: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  signUpLinkHighlight: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default LoginStyles;