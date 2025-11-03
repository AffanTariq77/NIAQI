import BackgroundGradient from '@/components/BackgroundGradient';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Student {
  id: string;
  name: string;
  location: string;
  specialty: string;
  avatar?: any;
  isFavorite?: boolean;
}

const mockStudents: Student[] = [
  { 
    id: '1', 
    name: 'Student Name', 
    location: 'Location', 
    specialty: 'Speciality / Remarks',
    avatar: require('../assets/student1.png'),
    isFavorite: false,
  },
  { 
    id: '2', 
    name: 'Student Name', 
    location: 'Location', 
    specialty: 'Speciality / Remarks',
    avatar: require('../assets/student2.png'),
    isFavorite: false,
  },
  { 
    id: '3', 
    name: 'Student Name', 
    location: 'Location', 
    specialty: 'Speciality / Remarks',
    avatar: require('../assets/student3.png'),
    isFavorite: false,
  },
  { 
    id: '4', 
    name: 'Student Name', 
    location: 'Location', 
    specialty: 'Speciality / Remarks',
    avatar: require('../assets/student4.png'),
    isFavorite: false,
  },
];

const StudentBaseDataScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleStudentPress = (student: Student) => {
    router.push('/student-info');
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.backgroundContainer}>
        <BackgroundGradient />
      </View>

      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Base Data</Text>
          <TouchableOpacity style={styles.searchIconButton}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <LinearGradient
            colors={['#E8EEFF', '#F3E9FF', '#FDE7F4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.searchContainer}
          >
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#666"
              value={searchText}
              onChangeText={setSearchText}
            />
          </LinearGradient>
        </View>

        {/* Student List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {mockStudents.map((student) => (
            <TouchableOpacity
              key={student.id}
              onPress={() => handleStudentPress(student)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(248, 245, 255, 0.95)', 'rgba(253, 245, 250, 0.95)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.studentCard}
              >
                {/* Profile Image */}
                <View style={styles.profileImageContainer}>
                  {student.avatar ? (
                    <Image source={student.avatar} style={styles.profileImage} resizeMode="cover" />
                  ) : (
                    <View style={styles.profilePlaceholder}>
                      <Ionicons name="person" size={50} color="#999" />
                    </View>
                  )}
                </View>

                {/* Student Info */}
                <View style={styles.studentInfo}>
                  <View style={styles.textSection}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentLocation}>{student.location}</Text>
                    <Text style={styles.studentSpecialty}>{student.specialty}</Text>
                  </View>

                  {/* Bottom Row: Info Button and Heart */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.infoButton}
                      onPress={() => handleStudentPress(student)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.infoButtonText}>Info</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.heartIconButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleFavorite(student.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={favorites.includes(student.id) ? 'heart' : 'heart-outline'}
                        size={24}
                        color={favorites.includes(student.id) ? '#FF3B30' : '#666'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
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
  searchIconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(206, 198, 198, 0.8)',
    shadowColor: '#E4E4E4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  studentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#E0E0E0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8EA',
  },
  studentInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textSection: {
    marginBottom: 8,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  studentLocation: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  studentSpecialty: {
    fontSize: 13,
    color: '#8E8E93',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 10,
  },
  infoButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  heartIconButton: {
    padding: 4,
  },
});

export default StudentBaseDataScreen;

