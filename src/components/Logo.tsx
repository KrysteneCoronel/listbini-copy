import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

const Logo = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          <Text style={styles.biniText}>BINI</Text>
          <Text style={styles.listText}>List</Text>
        </Text>
        <View style={styles.cartIcon}>
          <Text style={styles.cartSymbol}>🛒</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  biniText: {
    color: '#007AFF',
  },
  listText: {
    color: '#007AFF',
  },
  cartIcon: {
    marginLeft: 8,
    transform: [{ translateY: -2 }],
  },
  cartSymbol: {
    fontSize: 24,
    color: '#FFD700', // Yellow color for the cart
  },
});

export default Logo;