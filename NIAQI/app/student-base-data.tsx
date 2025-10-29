import GradientBackground from '@/components/GradientBackground';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Student {
  id: string;
  name: string;
  location: string;
  specialty: string;
  avatar: string;
}

const mockStudents: Student[] = [
  { id: '1', name: 'John Smith', location: 'New York, NY', specialty: 'Mold Assessment', avatar: 'J' },
  { id: '2', name: 'Sarah Johnson', location: 'Los Angeles, CA', specialty: 'Mold Remediation', avatar: 'S' },
  { id: '3', name: 'Michael Brown', location: 'Chicago, IL', specialty: 'Air Quality Testing', avatar: 'M' },
  { id: '4', name: 'Emily Davis', location: 'Houston, TX', specialty: 'Environmental Health', avatar: 'E' },
];

const StudentBaseDataScreen = () => {
  const [searchText, setSearchText] = useState('');

  const handleStudentPress = (student: Student) => {
    router.push('/student-info');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Base Data</Text>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="search" size={24} color="#333333" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999999"
            value={searchText}
            onChangeText={setSearchText}
          />
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
              style={styles.studentCard}
              onPress={() => handleStudentPress(student)}
              activeOpacity={0.7}
            >
              <View style={styles.studentAvatar}>
                <Text style={styles.avatarText}>{student.avatar}</Text>
              </View>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentLocation}>{student.location}</Text>
                <Text style={styles.studentSpecialty}>{student.specialty}</Text>
              </View>
              <TouchableOpacity style={styles.infoButton}>
                <Text style={styles.infoButtonText}>Info</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons name="heart-outline" size={24} color="#666666" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    color: '#333333',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  studentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E4ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4299E1',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  studentLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  studentSpecialty: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  infoButton: {
    backgroundColor: '#4299E1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  infoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 8,
  },
});

export default StudentBaseDataScreen;

