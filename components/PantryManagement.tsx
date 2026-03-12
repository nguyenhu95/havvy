import React, { useState, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type PantryItem = {
  id: string;
  name: string;
  category: string;
  quantity: string;
  emoji: string;
  emojiBackground: string;
  daysUntilExpiry: number | null; // null = no expiry tracked
};

type Props = {
  /** Called when user taps the "+" FAB to add an item */
  onAddItem: () => void;
  /** Called when user taps a pantry item */
  onItemPress: (item: PantryItem) => void;
  /** Called when user taps the profile icon */
  onProfilePress: () => void;
  /** Called when user taps the filter icon */
  onFilterPress: () => void;
  /** Called when user taps a bottom tab */
  onTabPress: (tab: string) => void;
  /** The currently active bottom tab */
  activeTab?: string;
};

// =============================================================================
// MOCK DATA
// =============================================================================

const PANTRY_ITEMS: PantryItem[] = [
  {
    id: '1',
    name: 'Whole Milk',
    category: 'Dairy',
    quantity: '1 Gallon',
    emoji: '🥛',
    emojiBackground: '#FFF3E0',
    daysUntilExpiry: 2,
  },
  {
    id: '2',
    name: 'Fresh Spinach',
    category: 'Vegetables',
    quantity: '250g',
    emoji: '🥬',
    emojiBackground: '#E8F5E9',
    daysUntilExpiry: 8,
  },
  {
    id: '3',
    name: 'Sourdough Bread',
    category: 'Bakery',
    quantity: '1 Loaf',
    emoji: '🍞',
    emojiBackground: '#FCE4EC',
    daysUntilExpiry: -1,
  },
  {
    id: '4',
    name: 'Fusilli Pasta',
    category: 'Dry Goods',
    quantity: '500g',
    emoji: '🍝',
    emojiBackground: '#E3F2FD',
    daysUntilExpiry: 180,
  },
  {
    id: '5',
    name: 'Cheddar Cheese',
    category: 'Dairy',
    quantity: '200g',
    emoji: '🧀',
    emojiBackground: '#FFF3E0',
    daysUntilExpiry: 12,
  },
];

const CATEGORIES = ['All Items', 'Dairy', 'Vegetables', 'Dry Goods', 'Bakery'];

const TABS = [
  { key: 'Pantry', emoji: '🏪', label: 'Pantry' },
  { key: 'Recipes', emoji: '📋', label: 'Recipes' },
  { key: 'Meal Plan', emoji: '📅', label: 'Meal Plan' },
  { key: 'Shopping', emoji: '🛒', label: 'Shopping' },
  { key: 'Log', emoji: '🕐', label: 'Log' },
];

// =============================================================================
// HELPERS
// =============================================================================

function getExpiryLabel(days: number | null): string {
  if (days === null) return '';
  if (days < 0) return 'Expired';
  if (days === 0) return 'Today';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  const months = Math.round(days / 30);
  return months === 1 ? '1 month' : `${months} months`;
}

type ExpiryStyle = { bg: string; text: string };

function getExpiryStyle(days: number | null): ExpiryStyle {
  if (days === null) return { bg: COLORS.badgeGrayBg, text: COLORS.badgeGrayText };
  if (days < 0) return { bg: COLORS.badgeRedBg, text: COLORS.badgeRedText };
  if (days <= 3) return { bg: COLORS.badgeYellowBg, text: COLORS.badgeYellowText };
  if (days <= 14) return { bg: COLORS.badgeGreenBg, text: COLORS.badgeGreenText };
  return { bg: COLORS.badgeGrayBg, text: COLORS.badgeGrayText };
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function ExpiryBadge({ days }: { days: number | null }) {
  const label = getExpiryLabel(days);
  if (!label) return null;
  const { bg, text } = getExpiryStyle(days);
  return (
    <View style={[styles.expiryBadge, { backgroundColor: bg }]}>
      <Text style={[styles.expiryBadgeText, { color: text }]}>{label}</Text>
    </View>
  );
}

function PantryCard({
  item,
  onPress,
}: {
  item: PantryItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.cardIcon, { backgroundColor: item.emojiBackground }]}>
        <Text style={styles.cardEmoji}>{item.emoji}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardMeta}>
          {item.category} • {item.quantity}
        </Text>
      </View>
      <ExpiryBadge days={item.daysUntilExpiry} />
    </Pressable>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function PantryManagement({
  onAddItem,
  onItemPress,
  onProfilePress,
  onFilterPress,
  onTabPress,
  activeTab = 'Pantry',
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');

  const filteredItems = useMemo(() => {
    return PANTRY_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All Items' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pantry</Text>
          <Pressable onPress={onProfilePress} hitSlop={8}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileEmoji}>👤</Text>
            </View>
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search items in pantry"
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
          </View>
          <Pressable
            style={styles.filterButton}
            onPress={onFilterPress}
            hitSlop={4}
          >
            <Text style={styles.filterIcon}>☰</Text>
          </Pressable>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat === selectedCategory;
            return (
              <Pressable
                key={cat}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Item List */}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PantryCard item={item} onPress={() => onItemPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          }
        />

        {/* FAB */}
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            pressed && styles.fabPressed,
          ]}
          onPress={onAddItem}
        >
          <Text style={styles.fabIcon}>+</Text>
        </Pressable>

        {/* Bottom Tab Bar */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <Pressable
                key={tab.key}
                style={styles.tab}
                onPress={() => onTabPress(tab.key)}
              >
                <Text style={styles.tabEmoji}>{tab.emoji}</Text>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const COLORS = {
  teal: '#0d9488',
  tealDark: '#0f766e',
  background: '#f1f5f9',
  cardBackground: '#ffffff',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  inputBorder: '#e2e8f0',
  // Badge colors
  badgeYellowBg: '#FEF9C3',
  badgeYellowText: '#A16207',
  badgeGreenBg: '#DCFCE7',
  badgeGreenText: '#15803D',
  badgeRedBg: '#FEE2E2',
  badgeRedText: '#DC2626',
  badgeGrayBg: '#F1F5F9',
  badgeGrayText: '#64748B',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screen: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileEmoji: {
    fontSize: 20,
  },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },

  // Category Chips
  chipsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 8,
  },
  chip: {
    height: 36,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },

  // Item Cards
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  cardMeta: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  // Expiry Badge
  expiryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginLeft: 8,
  },
  expiryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textMuted,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 88,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressed: {
    backgroundColor: COLORS.tealDark,
  },
  fabIcon: {
    fontSize: 30,
    color: '#ffffff',
    lineHeight: 32,
  },

  // Bottom Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
    paddingBottom: 4,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.teal,
    fontWeight: '600',
  },
});
