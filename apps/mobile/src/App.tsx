import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

const stats = [
  ["Receivable", "PKR 1.82M"],
  ["Payable", "PKR 640K"],
  ["Ready Pumps", "18"],
  ["Low Stock", "12"]
] as const;

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.logo}>PumpERP</Text>
          <Text style={styles.subtle}>Cloud Khata</Text>
        </View>

        <View style={styles.grid}>
          {stats.map(([label, value]) => (
            <View key={label} style={styles.tile}>
              <Text style={styles.tileLabel}>{label}</Text>
              <Text style={styles.tileValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Today</Text>
          <Text style={styles.row}>Customer payments due: PKR 87,500</Text>
          <Text style={styles.row}>Pumps under work: 22</Text>
          <Text style={styles.row}>Inventory alerts: 12</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f6f8"
  },
  screen: {
    padding: 20,
    gap: 18
  },
  header: {
    paddingTop: 12
  },
  logo: {
    color: "#172026",
    fontSize: 28,
    fontWeight: "700"
  },
  subtle: {
    color: "#667085",
    marginTop: 4
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  tile: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderColor: "#d9dee5",
    borderWidth: 1,
    borderRadius: 8,
    padding: 14
  },
  tileLabel: {
    color: "#667085",
    fontSize: 13
  },
  tileValue: {
    color: "#172026",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8
  },
  panel: {
    backgroundColor: "#ffffff",
    borderColor: "#d9dee5",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16
  },
  panelTitle: {
    color: "#172026",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12
  },
  row: {
    color: "#344054",
    paddingVertical: 7
  }
});
