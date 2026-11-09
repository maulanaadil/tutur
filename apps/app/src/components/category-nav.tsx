import { symbols } from "@tutur/symbols";
import { categories, type Category, type CategoryId } from "@tutur/vocab";
import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text } from "react-native";
import { color, space, type } from "@/theme/tokens";
import { ChunkyPressable } from "./chunky-pressable";

type CategoryNavProps = {
  selected: CategoryId;
  onSelect: (category: Category) => void;
  direction: "column" | "row";
};

export function CategoryNav({ selected, onSelect, direction }: CategoryNavProps) {
  const vertical = direction === "column";
  return (
    <ScrollView
      horizontal={!vertical}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.list, vertical ? styles.column : styles.row]}
      accessibilityRole="tablist"
    >
      {categories.map((category) => {
        const active = category.id === selected;
        return (
          <ChunkyPressable
            key={category.id}
            face={active ? color.sunSoft : color.surface}
            lip={active ? color.sun : color.surfaceLip}
            selected={active}
            accessibilityRole="tab"
            accessibilityLabel={category.label}
            onPress={() => onSelect(category)}
            style={vertical ? styles.itemColumn : styles.itemRow}
            faceStyle={styles.face}
          >
            <Image source={symbols[category.symbol]} style={styles.symbol} contentFit="contain" accessible={false} />
            <Text style={styles.label} numberOfLines={1}>
              {category.label}
            </Text>
          </ChunkyPressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.sm, padding: space.xs },
  column: { flexDirection: "column" },
  row: { flexDirection: "row" },
  itemColumn: { width: 132, height: 64 },
  itemRow: { height: 60 },
  face: { flexDirection: "row", gap: space.sm, paddingHorizontal: space.md, justifyContent: "flex-start" },
  symbol: { width: 32, height: 32 },
  label: { ...type.label, color: color.ink, flexShrink: 1 },
});
