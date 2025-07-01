import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { supabase } from '../lib/supabase';
import { getFontFamily } from '../constants/Fonts';
import ArrowIcon from '../assets/images/arrow.svg';
import BottomNavbar from '../components/BottomNavbar';

interface Course {
  id: string;
  title: string;
  content: string;
  duration: string;
}

interface Chapter {
  id: string;
  title: string;
  courses?: Course[];
  quizzes?: any[];
}

interface Formation {
  id: string;
  title: string;
  theme: string;
  formation_data?: {
    chapters?: Chapter[];
    iaResult?: {
      chapters?: Chapter[];
    };
  };
}

export default function CourseContentScreen() {
  const router = useRouter();
  const { formationId, chapterId, courseId } = useLocalSearchParams();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [chapterTitle, setChapterTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFormationAndCourse();
  }, []);

  const saveCourseProgress = async () => {
    setSaving(true);
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setSaving(false);
        return;
      }

      // Sauvegarder la progression du cours
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert([
          {
            user_id: user.id,
            formation_id: formationId,
            chapter_id: chapterId,
            course_id: courseId,
            type: 'course',
            completed: true,
          }
        ], {
          onConflict: 'user_id,formation_id,chapter_id,course_id,quiz_id,type'
        });

      if (progressError) {
        console.error('Erreur lors de la sauvegarde:', progressError);
        setSaving(false);
        return;
      }
      
      // Retourner à la page formation-content
      router.back();
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la progression:', error);
    } finally {
      setSaving(false);
    }
  };

  const fetchFormationAndCourse = async () => {
    try {
      // Récupérer la formation
      const { data: formationData, error: formationError } = await supabase
        .from('formations')
        .select('*')
        .eq('id', formationId)
        .single();

      if (formationError) throw formationError;
      
      setFormation(formationData);

      // Trouver le cours et le chapitre
      const chapters = formationData?.formation_data?.iaResult?.chapters || getDefaultChapters();
      
      let foundCourse: Course | null = null;
      let foundChapterTitle = '';

      // Rechercher dans tous les chapitres
      for (const chapter of chapters) {
        // Convertir les deux en string pour la comparaison
        if (String(chapter.id) === String(chapterId)) {
          foundChapterTitle = chapter.title;
          
          // Rechercher le cours
          foundCourse = chapter.courses?.find((c: any) => String(c.id) === String(courseId)) || null;
          
          // Si le chapitre est trouvé mais pas de cours, créer un cours générique avec le contenu du chapitre
          if (!foundCourse && chapter.courses && chapter.courses.length === 0) {
            foundCourse = {
              id: String(courseId),
              title: chapter.title,
              content: `Contenu du ${chapter.title}\n\nCe chapitre fait partie de la formation sur ${formationData.title}.\n\nLe contenu détaillé sera bientôt disponible.`,
              duration: '5:00'
            };
          }
          
          break;
        }
      }

      // Si pas trouvé, utiliser les données par défaut
      if (!foundCourse) {
        const defaultChapters = getDefaultChapters();
        for (const chapter of defaultChapters) {
          if (String(chapter.id) === String(chapterId)) {
            foundChapterTitle = chapter.title;
            foundCourse = chapter.courses?.find(c => String(c.id) === String(courseId)) || null;
            break;
          }
        }
      }

      setCourse(foundCourse);
      setChapterTitle(foundChapterTitle);

    } catch (error) {
      console.error('❌ Erreur lors du chargement du cours:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultChapters = (): Chapter[] => {
    return [
      {
        id: '1',
        title: 'Chapitre 1',
        courses: [
          { id: '1', title: 'Introduction à Python', content: 'Python est un langage de programmation interprété, de haut niveau, conçu pour être simple à lire et à écrire. Il a été créé à la fin des années 1980 par Guido van Rossum, un programmeur néerlandais.\n\n📅 Date de création : décembre 1989\n📍 Lieu : CWI (Centrum Wiskunde & Informatica) à Amsterdam\n🎯 Objectif : créer un langage aussi simple que ABC, mais plus puissant, extensible, et adapté aux besoins réels des développeurs.\n\nGuido voulait un langage élégant, facile à comprendre, mais aussi suffisamment robuste pour gérer des tâches complexes. Il souhaitait également qu\'il soit librement accessible, ce qui a contribué à sa large adoption.', duration: '3:25' },
          { id: '2', title: 'Son histoire', content: 'Le nom Python ne vient pas du reptile 🐍, mais de l\'émission comique britannique "Monty Python\'s Flying Circus".\n\nCette référence humoristique reflète l\'esprit ludique et accessible que Guido van Rossum voulait donner à son langage. Il était un grand fan de cette émission de comédie britannique des années 1970, connue pour son humour absurde et créatif.\n\nCette origine du nom illustre parfaitement la philosophie de Python : un langage puissant mais qui ne se prend pas trop au sérieux, accessible à tous et conçu pour être agréable à utiliser.', duration: '4:25' },
          { id: '3', title: 'Pourquoi utiliser Python ?', content: 'Python est devenu l\'un des langages les plus populaires au monde grâce à sa simplicité et sa polyvalence.\n\n🔹 **Simplicité** : Syntaxe claire et lisible\n🔹 **Polyvalence** : Web, IA, analyse de données, automatisation\n🔹 **Communauté** : Large écosystème de bibliothèques\n🔹 **Opportunités** : Forte demande sur le marché du travail\n\nQue vous soyez débutant ou expert, Python offre les outils pour réaliser vos projets efficacement.', duration: '4:25' },
        ],
        quizzes: [
          { id: '1', title: 'Test - Chapitre 1', question: 'What is Python?', options: { a: 'A snake', b: 'A programming language', c: 'A fruit' }, correctAnswer: 'b' }
        ]
      },
      {
        id: '2',
        title: 'Chapitre 2',
        courses: [
          { id: '4', title: 'Comment utiliser Python', content: 'Apprendre à utiliser Python efficacement pour vos projets.\n\n🛠️ **Installation** : Téléchargez Python depuis python.org\n💻 **IDE recommandés** : PyCharm, VS Code, Jupyter\n📦 **Gestionnaire de paquets** : pip pour installer des bibliothèques\n🐍 **Premier programme** : print("Hello, World!")\n\nPython est conçu pour être facile à apprendre et à utiliser, même pour les débutants.', duration: '7:25' },
          { id: '5', title: 'Les astuces', content: 'Découvrez les meilleures pratiques et astuces Python.\n\n✨ **List comprehensions** : Code plus concis\n🔧 **Fonctions built-in** : len(), max(), min(), sum()\n📚 **PEP 8** : Guide de style officiel\n🚀 **Virtual environments** : Isoler vos projets\n🐛 **Debugging** : Utilisez pdb ou votre IDE\n\nCes astuces vous aideront à écrire du code Python plus efficace et professionnel.', duration: '5:00' },
          { id: '6', title: "Comment s'améliorer", content: 'Conseils pour progresser en Python et devenir un expert.\n\n📖 **Lecture** : Documentation officielle et livres spécialisés\n🏗️ **Projets** : Créez des applications concrètes\n👥 **Communauté** : Participez à des forums et événements\n🎯 **Spécialisation** : Web, IA, data science, automatisation\n🔄 **Pratique** : Codez régulièrement, même 15 min/jour\n\nLa progression en programmation demande de la patience et de la pratique constante.', duration: '4:25' },
        ],
        quizzes: [
          { id: '2', title: 'Test - Chapitre 2', question: 'What is the correct syntax for a comment in Python?', options: { a: '//', b: '/*', c: '#' }, correctAnswer: 'c' }
        ]
      }
    ];
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7376FF" />
            <Text style={styles.loadingText}>Chargement du cours...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (!formation || !course) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Cours non trouvé</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
              <Text style={styles.errorButtonText}>Retour</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowIcon width={20} height={20} color="#7376FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Précédent</Text>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.formationTitle}>{formation.title}</Text>
          <Text style={styles.chapterTitle}>{chapterTitle}</Text>
          
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseContent}>{course.content}</Text>
        </ScrollView>
        
        {/* Bouton Suivant */}
        <View style={styles.nextButtonSection}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              saving && styles.nextButtonDisabled
            ]}
            onPress={saveCourseProgress}
            disabled={saving}
          >
            <Text style={[
              styles.nextButtonText,
              saving && styles.nextButtonTextDisabled
            ]}>
              {saving ? 'Sauvegarde...' : 'Suivant'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Navbar globale */}
        <BottomNavbar />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#374151',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: '#7376FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#f8f9fb',
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: getFontFamily('semiBold'),
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 200,
  },
  formationTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7376FF',
    marginBottom: 8,
    fontFamily: getFontFamily('bold'),
  },
  chapterTitle: {
    fontSize: 20,
    color: '#7376FF',
    marginBottom: 24,
    fontFamily: getFontFamily('regular'),
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    fontFamily: getFontFamily('bold'),
  },
  courseContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    fontFamily: getFontFamily('regular'),
  },
  nextButtonSection: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    backgroundColor: 'transparent',
  },
  nextButton: {
    backgroundColor: '#7376FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonDisabled: {
    backgroundColor: '#d3d5db',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextDisabled: {
    color: '#9ca3af',
  },
}); 