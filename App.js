import "react-native-gesture-handler";
import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import MonthScreen from "./screens/MonthScreen";
import WeekScreen from "./screens/WeekScreen";
import DayScreen from "./screens/DayScreen";
import { Text } from "react-native";

const Drawer = createDrawerNavigator();

// 月間目標用スクリーン設定
const monthScreens = [
  { name: "1ヶ月目標", period: "4month" },
  { name: "2ヶ月目標", period: "8month" },
  { name: "3ヶ月目標", period: "12month" },
];

// 週間目標用スクリーン設定
const weekScreens = Array.from({ length: 12 }, (_, i) => ({
  name: `${i + 1}週間目標`,
  period: `${i + 1}`,
}));

// 日間目標用スクリーン設定
const dayScreens = Array.from({ length: 90 }, (_, i) => ({
  name: `${i + 1}日目`,
  period: `day${i + 1}`,
}));

// カスタムDrawerコンテンツ
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="３か月目標"
        onPress={() => props.navigation.navigate("３か月目標")}
        labelStyle={{ fontSize: 18, fontWeight: "bold", color: "#007AFF" }}
      />

      <Text style={{ marginLeft: 10, marginVertical: 10, fontWeight: "bold" }}>
        月間目標
      </Text>
      {monthScreens.map((screen) => (
        <DrawerItem
          key={screen.name}
          label={screen.name}
          onPress={() => props.navigation.navigate(screen.name)}
          labelStyle={{ fontSize: 16 }}
        />
      ))}

      <Text style={{ marginLeft: 10, marginVertical: 10, fontWeight: "bold" }}>
        週間目標
      </Text>
      {weekScreens.map((screen) => (
        <DrawerItem
          key={screen.name}
          label={screen.name}
          onPress={() => props.navigation.navigate(screen.name)}
          labelStyle={{ fontSize: 16 }}
        />
      ))}

      <Text style={{ marginLeft: 10, marginVertical: 10, fontWeight: "bold" }}>
        日間目標
      </Text>
      {dayScreens.map((screen) => (
        <DrawerItem
          key={screen.name}
          label={screen.name}
          onPress={() => props.navigation.navigate(screen.name)}
          labelStyle={{ fontSize: 14 }}
        />
      ))}
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="３か月目標"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#f0f0f0",
          },

          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Drawer.Screen name="３か月目標" component={HomeScreen} />

        {/* 月間目標のスクリーンを動的に生成 */}
        {monthScreens.map((screen) => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            component={MonthScreen}
            initialParams={{ period: screen.period }}
          />
        ))}

        {/* 週間目標のスクリーンを動的に生成 */}
        {weekScreens.map((screen) => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            component={WeekScreen}
            initialParams={{ period: screen.period }}
          />
        ))}

        {/* 日間目標のスクリーンを動的に生成 */}
        {dayScreens.map((screen) => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            component={DayScreen}
            initialParams={{ period: screen.period }}
          />
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
