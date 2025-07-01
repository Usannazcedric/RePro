import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  View,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import BgProfileIcon from '../../assets/images/bgprofile.svg';
import ArrowIcon from '../../assets/images/arrow.svg';
import EditIcon from '../../assets/images/edit.svg';
import WhiteArrowIcon from '../../assets/images/arrow.svg';
import EmojieIcon from '../../assets/images/emojie.svg';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
interface PurchasedFormation {
  id: string;
  formation_id: string;
  purchased_at: string;
  formations: {
    id: string;
    title: string;
    theme: string;
    formation_data?: {
      coverImageUrl?: string;
    };
  } | null;
}

export default function ProfileScreen() {
  // @ts-ignore
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [purchasedFormations, setPurchasedFormations] = useState<PurchasedFormation[]>([]);
  
  // États pour le mode édition
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // États pour le mode formation
  const [isViewingFormation, setIsViewingFormation] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<any>(null);
  const [formationPosts, setFormationPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  
  // États pour les réactions
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postReactions, setPostReactions] = useState<{[key: string]: any[]}>({});

  useEffect(() => {
    checkUser();
  }, []);

  const fetchPurchasedFormations = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('purchased_formations')
        .select(`
          id,
          formation_id,
          purchased_at,
          formations (
            id,
            title,
            theme,
            formation_data
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('purchased_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des formations:', error);
        return;
      }

      setPurchasedFormations((data as any) || []);
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
    }
  };

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Erreur lors de la récupération du profil:", profileError);
          return;
        }

        // Si pas de profil, créer un basique
        let userProfile = profile;
        if (!profile) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                username: user.email?.split('@')[0] || 'Utilisateur',
                email: user.email
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error("Erreur lors de la création du profil:", createError);
          } else {
            userProfile = newProfile;
          }
        }

        setUser(user);
        setProfile(userProfile);
        
        // Initialiser les champs d'édition
        setEditUsername(userProfile?.username || '');
        setEditEmail(user?.email || '');
        
        // Charger les formations achetées
        if (userProfile) {
          await fetchPurchasedFormations(user.id);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async () => {
    try {
      setErrorMessage('');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Essayer de récupérer le profil, créer s'il n'existe pas
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Erreur lors de la récupération du profil:", profileError);
          setErrorMessage("Erreur lors de la récupération du profil");
          return;
        }

        // Si pas de profil trouvé, en créer un basique
        let userProfile = profile;
        if (!profile) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                username: data.user.email?.split('@')[0] || 'Utilisateur',
                email: data.user.email
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error("Erreur lors de la création du profil:", createError);
          } else {
            userProfile = newProfile;
          }
        }

        setUser(data.user);
        setProfile(userProfile);
        
        // Charger les formations achetées si on a un profil
        if (userProfile) {
          await fetchPurchasedFormations(data.user.id);
        }
      }
    } catch (error: any) {
      console.error("Erreur lors de la connexion:", error.message);
      if (error.message === "Email not confirmed") {
        setErrorMessage("Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.");
      } else if (error.message.includes("Invalid login credentials")) {
        setErrorMessage("Email ou mot de passe incorrect");
      } else {
        setErrorMessage("Une erreur est survenue lors de la connexion");
      }
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
    }
  };

  const resendConfirmationEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) throw error;

      setErrorMessage("Un nouveau mail de confirmation a été envoyé. Veuillez vérifier votre boîte de réception.");
    } catch (error) {
      console.error("Erreur lors de l'envoi du mail de confirmation:", error);
      setErrorMessage("Impossible d'envoyer le mail de confirmation. Veuillez réessayer plus tard.");
    }
  };

  const handleBackToHome = () => {
    if (isViewingFormation) {
      // Si on est en mode formation, revenir au mode profil normal
      setIsViewingFormation(false);
      setSelectedFormation(null);
      setFormationPosts([]);
    } else if (isEditing) {
      // Si on est en mode édition, revenir au mode normal
      setIsEditing(false);
      // Réinitialiser les champs
      setEditUsername(profile?.username || '');
      setEditEmail(user?.email || '');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      // Navigation normale vers l'accueil
      try {
        router.push('/(tabs)');
      } catch (error) {
        console.log("Erreur de navigation vers l'accueil:", error);
        try {
          router.back();
        } catch (backError) {
          console.log("Impossible de naviguer en arrière:", backError);
        }
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (saving) return;
    
    try {
      setSaving(true);
      
      // Validation des mots de passe
      if (newPassword && newPassword !== confirmPassword) {
        Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas");
        return;
      }
      
      if (newPassword && newPassword.length < 6) {
        Alert.alert("Erreur", "Le nouveau mot de passe doit contenir au moins 6 caractères");
        return;
      }

      // Mettre à jour le profil
      if (editUsername !== profile?.username) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ username: editUsername })
          .eq('id', user.id);

        if (profileError) throw profileError;
      }

      // Mettre à jour l'email si modifié
      if (editEmail !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: editEmail
        });

        if (emailError) throw emailError;
      }

      // Mettre à jour le mot de passe si fourni
      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (passwordError) throw passwordError;
      }

      // Recharger les données utilisateur
      await checkUser();
      
      // Revenir en mode visualisation
      setIsEditing(false);
      setNewPassword('');
      setConfirmPassword('');

      Alert.alert("Succès", "Profil mis à jour avec succès !");

    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      Alert.alert("Erreur", error.message || "Une erreur est survenue lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const pickImageFromLibrary = async () => {
    try {
      // Demander les permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de la permission d\'accéder à votre galerie pour changer votre photo de profil.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Lancer le sélecteur d'image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        const base64 = result.assets[0].base64;
        
        if (base64) {
          await uploadProfileImage(`data:image/jpeg;base64,${base64}`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image.');
    }
  };

  const uploadProfileImage = async (base64Image: string) => {
    try {
      // Mettre à jour le profil dans Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: base64Image })
        .eq('id', user.id);

      if (error) throw error;

      // Mettre à jour l'état local
      setProfile({ ...profile, avatar_url: base64Image });
      Alert.alert("Succès", "Photo de profil mise à jour avec succès !");
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      Alert.alert("Erreur", "Une erreur est survenue lors de l'upload de l'image.");
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      // Demander les permissions pour la caméra
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de la permission d\'accéder à votre caméra.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Lancer la caméra
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64 = result.assets[0].base64;
        
        if (base64) {
          await uploadProfileImage(`data:image/jpeg;base64,${base64}`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la prise de photo.');
    }
  };

  const handleProfileImagePress = () => {
    Alert.alert(
      "Photo de profil",
      "Comment voulez-vous ajouter votre photo ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Prendre une photo", onPress: takePhotoWithCamera },
        { text: "Choisir dans la galerie", onPress: pickImageFromLibrary }
      ]
    );
  };

  const fetchFormationPosts = async (formation: any) => {
    setLoadingPosts(true);
    try {
      console.log('🔍 Récupération des posts pour formation ID:', formation.id);

      // Vérifier l'authentification
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 Utilisateur authentifié:', user ? user.id : 'NON AUTHENTIFIÉ');

      // Récupérer tous les posts de cette formation
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('formation_id', formation.id);

      if (postsError) {
        console.error('❌ Erreur lors du chargement des posts:', postsError);
        setFormationPosts([]);
        return;
      }

      console.log('📊 Posts trouvés:', postsData?.length || 0);

      if (postsData && postsData.length > 0) {
        // Récupérer les profils des auteurs
        const userIds = [...new Set(postsData.map(post => post.user_id))];
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.error('Erreur lors du chargement des profils:', profilesError);
        }

        // Créer un map des profils
        const profilesMap: { [key: string]: any } = {};
        if (profiles) {
          profiles.forEach(profile => {
            profilesMap[profile.id] = profile;
          });
        }

        // Associer les profils aux posts
        const postsWithProfiles = postsData.map(post => ({
          ...post,
          profile: profilesMap[post.user_id] || null
        }));

        setFormationPosts(postsWithProfiles);
        
        // Récupérer les réactions pour ces posts
        const postIds = postsWithProfiles.map(post => post.id);
        await fetchPostReactions(postIds);
      } else {
        setFormationPosts([]);
      }

    } catch (error) {
      console.error('💥 Erreur lors du chargement des posts:', error);
      setFormationPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleFormationPress = async (formation: any) => {
    setSelectedFormation(formation);
    setIsViewingFormation(true);
    await fetchFormationPosts(formation);
  };

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `il y a ${diff} secondes`;
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} minutes`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} heures`;
    return `il y a ${Math.floor(diff / 86400)} jours`;
  };

  const fetchPostReactions = async (postIds: string[]) => {
    if (postIds.length === 0) return;
    
    try {
      const { data: reactions, error } = await supabase
        .from('reactions')
        .select('*')
        .in('post_id', postIds);

      if (!error && reactions) {
        const reactionsByPost: {[key: string]: any[]} = {};
        reactions.forEach(reaction => {
          if (!reactionsByPost[reaction.post_id]) {
            reactionsByPost[reaction.post_id] = [];
          }
          reactionsByPost[reaction.post_id].push(reaction);
        });
        setPostReactions(reactionsByPost);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réactions:', error);
    }
  };

  const handleReactionPress = (postId: string) => {
    setSelectedPostId(postId);
    setShowEmojiPicker(true);
  };

  const addReaction = async (emoji: string) => {
    if (!selectedPostId || !user) return;

    try {
      const { data, error } = await supabase
        .from('reactions')
        .upsert([
          {
            post_id: selectedPostId,
            user_id: user.id,
            emoji: emoji
          }
        ], { onConflict: 'post_id,user_id' })
        .select();

      if (!error && data) {
        // Mettre à jour les réactions localement
        const updatedReactions = { ...postReactions };
        if (!updatedReactions[selectedPostId]) {
          updatedReactions[selectedPostId] = [];
        }
        
        // Supprimer l'ancienne réaction de cet utilisateur s'il y en a une
        updatedReactions[selectedPostId] = updatedReactions[selectedPostId].filter(
          r => r.user_id !== user.id
        );
        
        // Ajouter la nouvelle réaction
        updatedReactions[selectedPostId].push(data[0]);
        setPostReactions(updatedReactions);
        
        console.log('✅ Réaction ajoutée:', emoji);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout de la réaction:', error);
    } finally {
      setShowEmojiPicker(false);
      setSelectedPostId(null);
    }
  };

  const getReactionCounts = (postId: string) => {
    const reactions = postReactions[postId] || [];
    const counts: {[emoji: string]: number} = {};
    
    reactions.forEach(reaction => {
      counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
    });
    
    return counts;
  };

  const hasUserReacted = (postId: string) => {
    const reactions = postReactions[postId] || [];
    return reactions.some(reaction => reaction.user_id === user?.id);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#7376FF" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Connexion</Text>
        {errorMessage ? (
          <Text style={styles.errorMessage}>
            {errorMessage}
            {errorMessage.includes('confirmer votre email') && (
              <TouchableOpacity onPress={resendConfirmationEmail}>
                <Text style={styles.resendButton}>
                  Renvoyer l&apos;email de confirmation
                </Text>
              </TouchableOpacity>
            )}
          </Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Adresse email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <Text style={styles.or}>Ou</Text>

        <TouchableOpacity style={[styles.button, styles.outline]}>
          <Text style={[styles.buttonText, styles.outlineText]}>Continuer avec Google</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity style={[styles.button, styles.outline]}>
            <Text style={[styles.buttonText, styles.outlineText]}>Continuer avec Apple</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

    return (
    <ScrollView 
      style={styles.globalScrollContainer}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.globalContentContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background qui s'étend sur toute la hauteur */}
      <View style={styles.fullBackgroundContainer}>
        <View style={styles.colorBackground} />
        <View style={styles.svgContainer}>
          <BgProfileIcon width={430} height={420} />
        </View>
      </View>

      {/* Navigation Header Sticky */}
      <SafeAreaView style={styles.stickyNavContainer}>
        <View style={styles.navigationHeader}>
          <TouchableOpacity style={styles.backSection} onPress={handleBackToHome}>
            <View style={styles.backButton}>
              {(isEditing || isViewingFormation) ? (
                <WhiteArrowIcon width={20} height={20} color="#333333" />
              ) : (
                <ArrowIcon width={20} height={20} color="#333333" />
              )}
            </View>
            <Text style={styles.backText}>
              {isViewingFormation ? 'Profil' : isEditing ? 'Profil' : 'Accueil'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isViewingFormation ? 'Communauté' : isEditing ? 'Vos informations' : 'Votre profil'}
          </Text>
          {!isEditing && !isViewingFormation && (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <EditIcon width={20} height={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {/* Profile Section Sticky */}
      <View style={styles.stickyProfileContainer}>
        <View style={styles.profileSection}>
          {isViewingFormation ? (
            // Mode formation
            <>
              <View style={styles.formationImageContainer}>
                {selectedFormation?.formation_data?.coverImageUrl ? (
                  <Image 
                    source={{ uri: selectedFormation.formation_data.coverImageUrl }} 
                    style={styles.formationImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.formationPlaceholder}>
                    <Text style={styles.formationPlaceholderText}>📚</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.profileName}>{selectedFormation?.title || 'Formation'}</Text>
              <View style={styles.formationTag}>
                <Text style={styles.formationTagText}>{selectedFormation?.theme || 'Programmation'}</Text>
              </View>
            </>
          ) : (
            // Mode profil normal
            <>
              <TouchableOpacity style={styles.profileImageContainer} onPress={handleProfileImagePress}>
                {profile?.avatar_url ? (
                  <Image source={{ uri: profile.avatar_url }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <Text style={styles.profilePlaceholderText}>+</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              <Text style={styles.profileName}>{profile?.username || 'Alex Park'}</Text>
              <Text style={styles.profileLevel}>Niveau 7</Text>
            </>
          )}
        </View>
      </View>

      {/* Container principal sticky */}
      <View style={styles.stickyMainContainer}>
        <View style={styles.mainContentContainer}>
          <ScrollView 
            style={styles.innerScrollContainer} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.innerContentContainer}
          >
            {isViewingFormation ? (
              /* Mode formation - affichage des posts */
              <View style={styles.postsContainer}>
                <Text style={styles.sectionTitle}>
                  Discussions de la communauté
                </Text>
                
                {loadingPosts ? (
                  <ActivityIndicator size="large" color="#7376FF" style={{ marginTop: 20 }} />
                ) : formationPosts.length > 0 ? (
                  formationPosts.map((post) => (
                    <View key={post.id} style={styles.postCard}>
                      <View style={styles.postHeader}>
                        <View style={styles.avatarContainer}>
                          {post.profile?.avatar_url ? (
                            <Image 
                              source={{ uri: post.profile.avatar_url }} 
                              style={styles.avatarImage} 
                            />
                          ) : (
                            <View style={styles.avatarPlaceholder}>
                              <Text style={styles.avatarText}>
                                {(post.profile?.username || 'U').charAt(0).toUpperCase()}
                              </Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.postHeaderContent}>
                          <Text style={styles.username}>
                            {post.profile?.username || 'Utilisateur'}
                          </Text>
                          <Text style={styles.timeText}>
                            {timeAgo(post.created_at)}
                          </Text>
                        </View>
                        <View style={styles.formationBadge}>
                          <Text style={styles.formationBadgeText}>
                            {post.formation_title}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.postContent}>{post.content}</Text>

                      {post.image_base64 && (
                        <View style={styles.postImageContainer}>
                          <Image 
                            source={{ uri: post.image_base64 }} 
                            style={styles.postImage}
                            resizeMode="cover"
                          />
                        </View>
                      )}

                      <View style={styles.postFooter}>
                        <View style={styles.reactions}>
                          {/* Affichage des émojis de réaction */}
                          {Object.entries(getReactionCounts(post.id)).map(([emoji, count]) => (
                            <View key={emoji} style={styles.reactionBubble}>
                              <Text style={styles.reactionEmoji}>{emoji}</Text>
                              <Text style={styles.reactionCount}>{count}</Text>
                            </View>
                          ))}
                          
                          {/* Bouton pour réagir */}
                          <TouchableOpacity 
                            style={[
                              styles.reactionButton,
                              hasUserReacted(post.id) && styles.reactionButtonActive
                            ]}
                            onPress={() => handleReactionPress(post.id)}
                          >
                            <EmojieIcon width={16} height={16} color={hasUserReacted(post.id) ? "#7376FF" : "#666"} />
                            <Text style={[
                              styles.reactionButtonText,
                              hasUserReacted(post.id) && styles.reactionButtonTextActive
                            ]}>
                              Réagir
                            </Text>
                          </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity style={styles.shareButton}>
                          <Text style={styles.shareText}>Partager</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.noPostsContainer}>
                    <Text style={styles.noPostsText}>
                      Aucune discussion pour cette formation pour le moment.
                    </Text>
                    <Text style={styles.noPostsSubtext}>
                      Soyez le premier à partager avec la communauté !
                    </Text>
                  </View>
                )}
              </View>
            ) : !isEditing ? (
              <>
                {/* Section Statistiques */}
                <View style={styles.statsContainer}>
                  <Text style={styles.sectionTitle}>Vos statistiques</Text>
                  
                  <View style={styles.statsContent}>
                    {/* Graphique circulaire */}
                    <View style={styles.chartContainer}>
                      <View style={styles.circularChart}>
                        <Text style={styles.chartLabel}>Cours suivis</Text>
                      </View>
                    </View>

                    {/* Légendes */}
                    <View style={styles.legendContainer}>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#FFA500' }]} />
                        <Text style={styles.legendText}>React Native</Text>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
                        <Text style={styles.legendText}>C++</Text>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#3B5BA5' }]} />
                        <Text style={styles.legendText}>Python</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Section Communauté */}
                <View style={styles.communityContainer}>
                  <Text style={styles.sectionTitle}>Communauté disponible</Text>
                  
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.formationsScrollView}
                    contentContainerStyle={styles.formationsContainer}
                  >
                    {purchasedFormations.map((item) => (
                      <TouchableOpacity 
                        key={item.id} 
                        style={styles.formationCard}
                        onPress={() => handleFormationPress(item.formations)}
                      >
                        <View style={styles.formationImageContainer}>
                          {item.formations?.formation_data?.coverImageUrl ? (
                            <Image 
                              source={{ uri: item.formations.formation_data.coverImageUrl }} 
                              style={styles.formationImage}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={styles.formationPlaceholder}>
                              <Text style={styles.formationPlaceholderText}>📚</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.formationTitle} numberOfLines={2}>
                          {item.formations?.title || 'Formation'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    
                    {/* Cartes factices si pas de formations */}
                    {purchasedFormations.length === 0 && (
                      <>
                        <TouchableOpacity style={styles.formationCard}>
                          <View style={styles.formationPlaceholder}>
                            <Text style={styles.formationPlaceholderText}>💻</Text>
                          </View>
                          <Text style={styles.formationTitle}>Python débutant</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.formationCard}>
                          <View style={styles.formationPlaceholder}>
                            <Text style={styles.formationPlaceholderText}>💻</Text>
                          </View>
                          <Text style={styles.formationTitle}>Python débutant</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.formationCard}>
                          <View style={styles.formationPlaceholder}>
                            <Text style={styles.formationPlaceholderText}>💻</Text>
                          </View>
                          <Text style={styles.formationTitle}>Python débutant</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </ScrollView>
                </View>

                {/* Bouton de déconnexion */}
                <View style={styles.logoutContainer}>
                  <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Se déconnecter</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* Formulaire d'édition */
              <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Modifier vos informations</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Modifier votre nom d&apos;utilisateur</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editUsername}
                    onChangeText={setEditUsername}
                    placeholder="Nom d'utilisateur"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Modifier votre email</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editEmail}
                    onChangeText={setEditEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Modifier votre mot de passe</Text>
                  <TextInput
                    style={styles.editInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Nouveau mot de passe (optionnel)"
                    secureTextEntry
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirmer votre nouveau mot de passe</Text>
                  <TextInput
                    style={styles.editInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirmer le nouveau mot de passe"
                    secureTextEntry
                  />
                </View>

                {/* Bouton de sauvegarde */}
                <TouchableOpacity 
                  onPress={handleSave} 
                  style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Sauvegarder</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
      
      {/* Spacer pour permettre le scroll */}
      <View style={styles.scrollSpacer}></View>
      
      {/* Modal de sélection d'émojis */}
      {showEmojiPicker && (
        <View style={styles.emojiPickerOverlay}>
          <View style={styles.emojiPickerModal}>
            <Text style={styles.emojiPickerTitle}>Choisir une réaction</Text>
            <View style={styles.emojiGrid}>
              {['❤️', '😍', '😂', '😮', '😢', '😡', '👍', '👎', '🔥', '💯', '👏', '🎉'].map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.emojiButton}
                  onPress={() => addReaction(emoji)}
                >
                  <Text style={styles.emojiButtonText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.emojiPickerClose}
              onPress={() => setShowEmojiPicker(false)}
            >
              <Text style={styles.emojiPickerCloseText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Styles de connexion existants
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#7376FF',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#7376FF',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  outline: {
    backgroundColor: '#f2f2f2',
  },
  outlineText: {
    color: '#333',
  },
  or: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#666',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    color: '#666',
  },
  errorMessage: {
    color: '#d32f2f',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: 'center',
  },
  resendButton: {
    color: '#7376FF',
    textDecorationLine: 'underline',
    marginTop: 8,
  },

  // Nouveaux styles pour la page profil
  profileContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  globalScrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  globalContentContainer: {
    minHeight: '150%',
  },
  scrollSpacer: {
    height: 5,
  },
  fullBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 420,
    zIndex: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  colorBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#7578FF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  svgContainer: {
    width: 430,
    height: 420,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyNavContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  stickyProfileContainer: {
    position: 'absolute',
    top:80,
    left: 0,
    right: 0,
    zIndex: 9,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingVertical: 70,
  },
  stickySpacerContainer: {
    height: 200,
  },
  stickyMainContainer: {
    position: 'absolute',
    top: 360,
    left: 16,
    right: 16,
    bottom: 450,
    zIndex: 8,
  },
  mainContentContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  innerScrollContainer: {
    flex: 1,
    padding: 20,
  },
  innerContentContainer: {
    paddingBottom: 20,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 220,
  },
  scrollContainer: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    height: 300,
    marginBottom: 20,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 240,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  backSection: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
  },
  backText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: '500',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
  },
  profileSection: {
    alignItems: 'center',
    zIndex: 3,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  profilePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  profilePlaceholderText: {
    fontSize: 40,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileLevel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7376FF',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContent: {
    alignItems: 'center',
  },
  chartContainer: {
    marginBottom: 20,
  },
  circularChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#7376FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9ff',
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  legendItem: {
    alignItems: 'center',
    flex: 1,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  communityContainer: {
    marginBottom: 30,
  },
  formationsScrollView: {
    marginTop: 10,
  },
  formationsContainer: {
    paddingRight: 16,
  },
  formationCard: {
    width: 140,
    marginRight: 16,
    alignItems: 'center',
  },
  formationImageContainer: {
    width: 120,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  formationImage: {
    width: '100%',
    height: '100%',
  },
  formationPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  formationPlaceholderText: {
    fontSize: 30,
    color: '#9ca3af',
  },
  formationTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 16,
  },
  logoutContainer: {
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#7376FF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Styles pour le formulaire d'édition
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#7376FF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#7376FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Styles pour le mode formation
  formationTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  formationTagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Styles pour les posts
  postsContainer: {
    flex: 1,
  },
  postCard: {
    backgroundColor: '#f8f9ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8eaff',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#7376FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postHeaderContent: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  formationBadge: {
    backgroundColor: '#7376FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  formationBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  postImageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reactions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginRight: 4,
  },
  reactionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  shareButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  shareText: {
    fontSize: 12,
    color: '#7376FF',
    fontWeight: '600',
  },
  noPostsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noPostsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  noPostsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  
  // Styles pour les réactions
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  reactionEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  reactionButtonActive: {
    backgroundColor: '#e8eaff',
    borderColor: '#7376FF',
  },
  reactionButtonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '600',
  },
  reactionButtonTextActive: {
    color: '#7376FF',
  },
  
  // Styles pour le modal d'émojis
  emojiPickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  emojiPickerModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    maxWidth: 320,
    width: '100%',
  },
  emojiPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emojiButtonText: {
    fontSize: 24,
  },
  emojiPickerClose: {
    backgroundColor: '#7376FF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  emojiPickerCloseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
