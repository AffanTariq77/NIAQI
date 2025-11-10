import BackgroundGradient from '@/components/BackgroundGradient';
import { useAuth } from '@/lib/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    },
    {
      id: 'language',
      title: 'Language',
      subtitle: 'English',
      icon: 'globe-outline',
    },
    {
      id: 'help',
      title: 'Help',
      subtitle: 'Contact us',
      icon: 'chatbubble-outline',
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'About the application',
      icon: 'information-circle-outline',
    },
  ];

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.backgroundContainer}>
        <BackgroundGradient />
      </View>
      
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Info Card */}
          <View style={styles.userCard}>
            <View style={styles.userCardContent}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#999" />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name || 'Heather Delaporte'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'heather.ues@gmail.com'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Group */}
          <View style={styles.settingsGroup}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.settingsItem,
                  index === settingsItems.length - 1 && styles.settingsItemLast
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.settingsItemContent}>
                  <Ionicons name={item.icon} size={24} color="#333" style={styles.settingsIcon} />
                  <View style={styles.settingsTextContainer}>
                    <Text style={styles.settingsItemTitle}>{item.title}</Text>
                    <Text style={styles.settingsItemSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutItem}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.settingsItemContent}>
                <Ionicons name="log-out-outline" size={24} color="#FF3B30" style={styles.settingsIcon} />
                <View style={styles.settingsTextContainer}>
                  <Text style={styles.logoutTitle}>Log Out</Text>
                  <Text style={styles.settingsItemSubtitle}>Log out the account</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    transform: [{ rotate: '180deg' }],
  },
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 180,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  settingsItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingsItemLast: {
    borderBottomWidth: 0,
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    marginRight: 16,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  settingsItemSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
  },
  logoutContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 4,
  },
});

export default ProfileScreen;
