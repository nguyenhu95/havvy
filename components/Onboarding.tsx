import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Represents a single slide in the onboarding flow.
 * Each slide has an image, title, and description.
 */
type OnboardingSlide = {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
};

/**
 * Props for the OnboardingScreen component.
 */
type Props = {
  /** Called when user completes onboarding (taps "Get Started" on last slide) */
  onComplete: () => void;
  /** Called when user taps "Skip" to bypass remaining slides */
  onSkip: () => void;
};

// =============================================================================
// SLIDE DATA
// =============================================================================

/**
 * The onboarding slides content.
 * 
 * In a real app, you'd have actual images in your assets folder.
 * For now, we're using placeholder images from the web.
 * 
 * 🔮 FUTURE: Replace these with your own branded illustrations.
 * You can use services like:
 * - unDraw (undraw.co) for free illustrations
 * - Storyset (storyset.com) for animated illustrations
 * - Or commission custom illustrations for a more unique look
 */
const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    // Using a placeholder - replace with your actual image
    // In production: require('../assets/images/onboarding-1.png')
    image: { uri: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop' },
    title: 'Welcome to Havvy',
    description: 'Smart pantry, zero waste. Reduce food waste and save money effortlessly.',
  },
  {
    id: '2',
    image: { uri: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=800&h=600&fit=crop' },
    title: 'Track Your Pantry',
    description: 'Scan barcodes or use AI vision to instantly add items. Know exactly what you have.',
  },
  {
    id: '3',
    image: { uri: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=600&fit=crop' },
    title: 'Plan Meals Smartly',
    description: 'Get recipe suggestions based on what\'s in your pantry. Use what you have, waste nothing.',
  },
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/**
 * Individual slide component.
 * 
 * This is extracted as a separate component for two reasons:
 * 1. Performance: FlatList can optimise re-renders when items are pure components
 * 2. Readability: Keeps the main component cleaner
 */
type SlideProps = {
  item: OnboardingSlide;
  width: number;
};

function Slide({ item, width }: SlideProps) {
  return (
    <View style={[styles.slide, { width }]}>
      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}

/**
 * Pagination dots component.
 * 
 * Shows which slide the user is currently viewing.
 * The active dot is wider (pill shape) to indicate current position.
 */
type PaginationProps = {
  slides: OnboardingSlide[];
  currentIndex: number;
  scrollX: Animated.Value;
  width: number;
};

function Pagination({ slides, scrollX, width }: PaginationProps) {
  return (
    <View style={styles.paginationContainer}>
      {slides.map((_, index) => {
        /**
         * Animated dot width calculation.
         * 
         * This creates a smooth animation where the dot expands
         * as you scroll towards it and shrinks as you scroll away.
         * 
         * inputRange: The scroll positions where we want to define values
         * outputRange: The corresponding dot widths at those positions
         * 
         * For example, when scrollX = width * 1 (second slide):
         * - Dot 0: width 8 (inactive)
         * - Dot 1: width 24 (active, expanded)
         * - Dot 2: width 8 (inactive)
         */
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });

        const dotOpacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity: dotOpacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function OnboardingScreen({ onComplete, onSkip }: Props) {
  // ---------------------------------------------------------------------------
  // SETUP
  // ---------------------------------------------------------------------------
  
  /**
   * Get screen width for slide sizing.
   * Each slide takes up the full screen width.
   */
  const { width } = Dimensions.get('window');

  /**
   * Track which slide is currently visible.
   * Used to determine button text ("Next" vs "Get Started").
   */
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Animated value tracking horizontal scroll position.
   * Used for the pagination dot animations.
   * 
   * Why useRef? The Animated.Value persists across re-renders
   * without causing new renders itself. This is more efficient
   * than useState for animation values.
   */
  const scrollX = useRef(new Animated.Value(0)).current;

  /**
   * Reference to the FlatList for programmatic scrolling.
   * Used when the user taps "Next" to advance to the next slide.
   */
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  /**
   * Handles scroll events to update pagination.
   * 
   * We use Animated.event to bind the scroll position directly
   * to our Animated.Value. This is more performant than using
   * onScroll with setState because:
   * 1. It runs on the native thread (useNativeDriver: false is needed
   *    for width interpolation, but the event binding is still efficient)
   * 2. It doesn't cause React re-renders for every scroll frame
   */
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  /**
   * Called when a slide becomes visible.
   * 
   * FlatList's viewabilityConfig determines when this fires.
   * We use it to update currentIndex for button text changes.
   * 
   * viewableItems[0] is the item that's at least 50% visible.
   */
  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  /**
   * Viewability config for FlatList.
   * 
   * itemVisiblePercentThreshold: 50 means a slide is considered
   * "viewable" when 50% or more of it is visible on screen.
   */
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  /**
   * Handles the "Next" / "Get Started" button press.
   * 
   * If we're on the last slide, complete onboarding.
   * Otherwise, scroll to the next slide.
   */
  const handleNext = () => {
    if (currentIndex === ONBOARDING_SLIDES.length - 1) {
      // Last slide - complete onboarding
      onComplete();
    } else {
      // Scroll to next slide
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  /**
   * Determines the button text based on current slide.
   * Last slide shows "Get Started", others show "Next".
   */
  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;
  const buttonText = isLastSlide ? 'Get Started' : 'Next';

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      {/* ----------------------------------------------------------------------- */}
      {/* HEADER - Brand name and Skip button                                     */}
      {/* ----------------------------------------------------------------------- */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.brandName}>Havvy</Text>
        <Pressable onPress={onSkip} style={styles.skipButton} hitSlop={12}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* ----------------------------------------------------------------------- */}
      {/* SLIDES - Horizontal swipeable FlatList                                  */}
      {/* ----------------------------------------------------------------------- */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Slide item={item} width={width} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* ----------------------------------------------------------------------- */}
      {/* FOOTER - Pagination dots and Next button                                */}
      {/* ----------------------------------------------------------------------- */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <Pagination
          slides={ONBOARDING_SLIDES}
          currentIndex={currentIndex}
          scrollX={scrollX}
          width={width}
        />

        {/* Next / Get Started Button */}
        <Pressable
          style={({ pressed }) => [
            styles.nextButton,
            pressed && styles.nextButtonPressed,
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>{buttonText}</Text>
          {!isLastSlide && <Text style={styles.arrowIcon}>→</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

/**
 * Colour palette matching your Havvy brand.
 * Dark theme with teal accents.
 */
const COLORS = {
  // Background
  background: '#0f172a', // Slate 900 - deep navy
  
  // Primary accent
  teal: '#0d9488',
  tealDark: '#0f766e',
  
  // Text colours
  textWhite: '#ffffff',
  textMuted: '#94a3b8', // Slate 400
  
  // Pagination
  dotActive: '#0d9488',
  dotInactive: 'rgba(255, 255, 255, 0.3)',
};

const styles = StyleSheet.create({
  // ---------------------------------------------------------------------------
  // LAYOUT
  // ---------------------------------------------------------------------------
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ---------------------------------------------------------------------------
  // HEADER
  // ---------------------------------------------------------------------------
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerSpacer: {
    width: 40, // Balance the Skip button width for centering
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textWhite,
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textMuted,
  },

  // ---------------------------------------------------------------------------
  // SLIDE
  // ---------------------------------------------------------------------------
  slide: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    maxHeight: 400,
  },
  textContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textWhite,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },

  // ---------------------------------------------------------------------------
  // FOOTER
  // ---------------------------------------------------------------------------
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  // ---------------------------------------------------------------------------
  // PAGINATION
  // ---------------------------------------------------------------------------
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.teal,
  },

  // ---------------------------------------------------------------------------
  // NEXT BUTTON
  // ---------------------------------------------------------------------------
  nextButton: {
    height: 56,
    backgroundColor: COLORS.teal,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonPressed: {
    backgroundColor: COLORS.tealDark,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  arrowIcon: {
    fontSize: 18,
    color: COLORS.textWhite,
  },
});