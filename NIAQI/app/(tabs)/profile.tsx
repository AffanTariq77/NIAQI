import GradientBackground from '@/components/GradientBackground';
import { useAuth } from '@/lib/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  const settingsItems = [
    {
      id: 'notifications',
      title: 'Notification',
      subtitle: 'Ringtone, message, notification',
      icon: 'notifications-outline',
      color: '#4299E1',
    },
    {
      id: 'language',
      title: 'Language',
      subtitle: 'English',
      icon: 'language-outline',
      color: '#4299E1',
    },
    {
      id: 'help',
      title: 'Help',
      subtitle: 'Contact us',
      icon: 'help-circle-outline',
      color: '#4299E1',
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'About the application',
      icon: 'information-circle-outline',
      color: '#4299E1',
    },
    {
      id: 'logout',
      title: 'Log Out',
      subtitle: 'Log out the account',
      icon: 'log-out-outline',
      color: '#FF3B30',
      action: handleLogout,
    },
  ];

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerButton} />
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.headerButton} />
          </View>

          {/* User Info */}
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            </View>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Settings List */}
          <View style={styles.settingsList}>
            {settingsItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.settingsItem}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <View style={styles.settingsItemLeft}>
                  <View style={[styles.settingsIcon, { backgroundColor: `${item.color}20` }]}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>
                  <View style={styles.settingsItemContent}>
                    <Text style={styles.settingsItemTitle}>{item.title}</Text>
                    <Text style={styles.settingsItemSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999999" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E4ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4299E1',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4299E1',
  },
  settingsList: {
    paddingHorizontal: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  settingsItemSubtitle: {
    fontSize: 12,
    color: '#999999',
  },
});

export default ProfileScreen;
