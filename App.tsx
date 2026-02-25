
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AppState, HaircutStyle, NavTab, UserProfile, SavedImage, AuthRedirectIntent } from './types';
import OnboardingModal from './components/OnboardingModal';
import ImageUploader from './components/ImageUploader';
import StyleGallery from './components/StyleGallery';
import PreviewScreen from './components/PreviewScreen';
import BarberCard from './components/BarberCard';
import BottomNavBar from './components/BottomNavBar';
import PlaceholderPage from './components/PlaceholderPage';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import SavedLibrary from './components/SavedLibrary';
import SavedLookDetail from './components/SavedLookDetail';
import { generateHaircut } from './services/geminiService';
import { saveGeneratedImageRecord, fetchSavedImages } from './services/userContentService';
import { getFirebaseConfigStatus } from './services/firebase';
import { HAIRCUT_STYLES } from './constants';
import { LayoutGrid, Bell } from 'lucide-react';

const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [isLibraryLoading, setIsLibraryLoading] = useState<boolean>(false);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [pendingIntent, setPendingIntent] = useState<AuthRedirectIntent>(null);
  const [selectedSavedImage, setSelectedSavedImage] = useState<SavedImage | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HaircutStyle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSavingToLibrary, setIsSavingToLibrary] = useState<boolean>(false);

  const firebaseStatus = useMemo(() => getFirebaseConfigStatus(), []);
  const redirectMessageMap: Record<Exclude<AuthRedirectIntent, null>, string> = {
    'save-image': 'Please sign in so we can store this look in your library.',
    'view-library': 'Sign in to access every look you have saved.',
  };
  const authRedirectMessage = pendingIntent ? redirectMessageMap[pendingIntent] : undefined;

  const handleConsent = () => {
    setShowOnboarding(false);
  };

  const handleImageUpload = (imageBase64: string) => {
    setOriginalImage(imageBase64);
    setAppState(AppState.GALLERY);
  };

  const handleGenerate = useCallback(async (style: HaircutStyle, modifications: string) => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }
    
    let finalPrompt = style.prompt;
    if (modifications.trim()) {
      finalPrompt += ` with the following modifications: ${modifications.trim()}`;
    }

    setSelectedStyle(style);
    setAppState(AppState.PREVIEW);
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultImage = await generateHaircut(originalImage, finalPrompt);
      setGeneratedImage(resultImage);
    } catch (err) {
      setError("Sorry, we couldn't generate the haircut. The model might be busy or your photo could not be processed. Please try again with a different photo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  const handleShowBarberCard = () => {
    if (selectedStyle && generatedImage) {
      setAppState(AppState.BARBER_CARD);
    }
  };

  const handleRestart = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setSelectedStyle(null);
    setIsLoading(false);
    setError(null);
    setAppState(AppState.UPLOAD);
  };

  const handleBackToGallery = () => {
    setGeneratedImage(null);
    setSelectedStyle(null);
    setError(null);
    setAppState(AppState.GALLERY);
  }

  const handleBackToPreview = () => {
    setAppState(AppState.PREVIEW);
  }

  const handleChangePhoto = () => {
    setOriginalImage(null);
    setAppState(AppState.UPLOAD);
  };
  
  const routeThroughAuth = (intent: Exclude<AuthRedirectIntent, null>) => {
    setPendingIntent(intent);
    setActiveTab('profile');
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'library' && !currentUser) {
      routeThroughAuth('view-library');
      return;
    }
    if (tab !== 'library' && selectedSavedImage) {
      setSelectedSavedImage(null);
    }
    setActiveTab(tab);
  };
  
  const loadSavedImages = useCallback(async (userId: string) => {
    setIsLibraryLoading(true);
    setLibraryError(null);
    try {
      const records = await fetchSavedImages(userId);
      setSavedImages(records);
    } catch (err) {
      console.error('Failed to load saved looks', err);
      setLibraryError('Could not load your saved looks.');
    } finally {
      setIsLibraryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setSavedImages([]);
      setSelectedSavedImage(null);
      return;
    }
    loadSavedImages(currentUser.id);
  }, [currentUser, loadSavedImages]);

  const persistGeneratedLook = useCallback(
    async (targetUser?: UserProfile | null) => {
      const user = targetUser ?? currentUser;
      if (!user) {
        routeThroughAuth('save-image');
        return;
      }
      if (!generatedImage || !selectedStyle) {
        return;
      }
      setIsSavingToLibrary(true);
      try {
        const savedRecord = await saveGeneratedImageRecord(user.id, {
          styleName: selectedStyle.name,
          generatedImageUrl: generatedImage,
          promptSummary: selectedStyle.prompt,
        });
        setSavedImages((prev) => {
          const filtered = prev.filter((image) => image.id !== savedRecord.id);
          return [savedRecord, ...filtered];
        });
        setActiveTab('library');
      } catch (err) {
        console.error('Failed to save generated look', err);
        alert('We could not save this look yet. Please try again.');
      } finally {
        setIsSavingToLibrary(false);
      }
    },
    [currentUser, generatedImage, selectedStyle, routeThroughAuth],
  );

  const handleSaveToLibrary = () => {
    if (!currentUser) {
      routeThroughAuth('save-image');
      return;
    }
    void persistGeneratedLook();
  };

  const handleLogin = (profile: UserProfile) => {
    setCurrentUser(profile);
    const intent = pendingIntent;
    setPendingIntent(null);
    if (intent === 'view-library') {
      setActiveTab('library');
    } else if (intent === 'save-image') {
      setActiveTab('generate');
      setTimeout(() => {
        void persistGeneratedLook(profile);
      }, 0);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    setPendingIntent(null);
    setSelectedSavedImage(null);
  };

  const renderGenerateFlow = () => {
    switch (appState) {
      case AppState.UPLOAD:
        return <ImageUploader onImageUpload={handleImageUpload} />;
      case AppState.GALLERY:
        return originalImage && <StyleGallery userImage={originalImage} styles={HAIRCUT_STYLES} onGenerate={handleGenerate} onChangePhoto={handleChangePhoto} />;
      case AppState.PREVIEW:
        return (
          <PreviewScreen
            originalImage={originalImage!}
            generatedImage={generatedImage}
            style={selectedStyle!}
            isLoading={isLoading}
            error={error}
            onBack={handleBackToGallery}
            onShowBarberCard={handleShowBarberCard}
            onTryAgain={() => selectedStyle && handleGenerate(selectedStyle, '')}
            onSaveToLibrary={handleSaveToLibrary}
            isSavingToLibrary={isSavingToLibrary}
          />
        );
       case AppState.BARBER_CARD:
        return <BarberCard image={generatedImage!} style={selectedStyle!} onStartOver={handleRestart} onBack={handleBackToPreview} />;
      default:
        return <ImageUploader onImageUpload={handleImageUpload} />;
    }
  };
  
  const renderPageContent = () => {
    if (showOnboarding) {
      return <OnboardingModal onConsent={handleConsent} />;
    }

    switch(activeTab) {
      case 'home':
        return <HomePage onStart={() => {
          handleRestart();
          setActiveTab('generate');
        }} />;
      case 'generate':
        return renderGenerateFlow();
      case 'library':
        if (!currentUser) {
          return <AuthPage onLoginSuccess={handleLogin} redirectMessage={redirectMessageMap['view-library']} />;
        }
        if (isLibraryLoading) {
          return <PlaceholderPage icon={LayoutGrid} title="Loading Library" message="Fetching your saved looks..." />;
        }
        if (libraryError) {
          return <PlaceholderPage icon={LayoutGrid} title="Library Unavailable" message={libraryError} />;
        }
        if (selectedSavedImage) {
          return (
            <SavedLookDetail
              savedImage={selectedSavedImage}
              onBack={() => setSelectedSavedImage(null)}
            />
          );
        }
        return (
          <SavedLibrary
            savedImages={savedImages}
            onBackToGenerate={() => setActiveTab('generate')}
            onSelectSavedImage={setSelectedSavedImage}
          />
        );
      case 'notifications':
        return <PlaceholderPage icon={Bell} title="Notifications" message="You have no new notifications." />;
      case 'profile':
        return currentUser ? (
          <ProfilePage
            user={currentUser}
            savedImageCount={savedImages.length}
            onLogout={handleLogout}
            onGoToLibrary={() => setActiveTab('library')}
            isFirestoreReady={firebaseStatus.isReady}
          />
        ) : (
          <AuthPage onLoginSuccess={handleLogin} redirectMessage={authRedirectMessage} />
        );
      default:
        return <HomePage onStart={() => setActiveTab('generate')} />;
    }
  }

  return (
    <div className="min-h-screen w-full font-sans bg-brand-dark">
      <main className="container mx-auto max-w-lg p-4 pb-28">
        {renderPageContent()}
      </main>
      {!showOnboarding && (
        <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
};

export default App;
