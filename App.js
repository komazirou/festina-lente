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
import { DateProvider, useDate } from "./DateProvider"; // DateProviderとuseDateをインポート

const Drawer = createDrawerNavigator();

// 月間目標用スクリーン設定
const monthScreens = [
  { name: "1ヶ月目標", period: "1ヶ月目" },
  { name: "2ヶ月目標", period: "2ヶ月目" },
  { name: "3ヶ月目標", period: "3ヶ月目" },
];

// 週間目標用スクリーン設定
const weekScreens = Array.from({ length: 12 }, (_, i) => ({
  name: `${i + 1}週間目標`,
  period: `${i + 1}`,
}));

// 日間目標用スクリーン設定
const dayScreens = Array.from({ length: 84 }, (_, i) => ({
  name: `${i + 1}日目`,
  period: `day${i + 1}`,
}));

// カスタムDrawerコンテンツ
function CustomDrawerContent(props) {
  const { currentDay } = useDate(); // 現在の日数を取得

 // ラベルスタイルを動的に決定する関数
const getLabelStyle = (type, index) => {
  // デフォルトのスタイル（目立たない色）
  let style = { fontSize: 16, color: "#9f9f9f" };

  if (type === "month") {
    // 現在の月に該当する場合のみ色を変える
    const currentMonth = Math.ceil(currentDay / 28); // 1ヶ月を28日とする
    if (currentMonth === index + 1) {
      style.color = "#007AFF"; // 現在の月を強調
      style.fontWeight = "bold";
    }
  } else if (type === "week" && currentDay > index * 7 && currentDay <= (index + 1) * 7) {
    // 現在の週のみ色を変える
    style.color = "#007AFF";
    style.fontWeight = "bold";
  }
  return style;
};


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
      {monthScreens.map((screen, index) => (
        <DrawerItem
          key={screen.name}
          label={screen.name}
          onPress={() => props.navigation.navigate(screen.name)}
          labelStyle={getLabelStyle("month", index)}
        />
      ))}

      <Text style={{ marginLeft: 10, marginVertical: 10, fontWeight: "bold" }}>
        週間目標
      </Text>
      {weekScreens.map((screen, index) => (
        <DrawerItem
          key={screen.name}
          label={screen.name}
          onPress={() => props.navigation.navigate(screen.name)}
          labelStyle={getLabelStyle("week", index)}
        />
      ))}
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <DateProvider>
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
    </DateProvider>
  );
}