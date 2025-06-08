// App.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import { GameProvider } from '@/src/context/GameContext';
import AddGameScreen from '@/src/screens/AddGameScreen';
import GameDetailScreen from '@/src/screens/GameDetailScreen';
import GameListScreen from '@/src/screens/GameListScreen';
import HomeScreen from '@/src/screens/HomeScreen';
import StatsScreen from '@/src/screens/StatsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const GameListStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="GameList" 
      component={GameListScreen}
      options={{ headerShown: false, title: 'Meus Jogos' }}
    />
    <Stack.Screen 
      name="AddGame" 
      component={AddGameScreen}
      options={{ headerShown: false, title: 'Adicionar Jogo' }}
    />
    <Stack.Screen 
      name="GameDetail" 
      component={GameDetailScreen}
      options={{ headerShown: false, title: 'Detalhes do Jogo' }}
    />
  </Stack.Navigator>
);

const index = () => {

  return (
    <GameProvider>
      <StatusBar barStyle="light-content" backgroundColor=" #1a1a2e" translucent={true} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Games':
                iconName = 'games';
                break;
              case 'Stats':
                iconName = 'bar-chart';
                break;
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6c5ce7',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#16213e',
            borderTopColor: '#6c5ce7',
          },
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false, title: 'Home' }} />
        <Tab.Screen name="Games" component={GameListStack} options={{ headerShown: false, title: 'Jogos' }} />
        <Tab.Screen name="Stats" component={StatsScreen} options={{ headerShown: false, title: 'Estatísticas' }} />
      </Tab.Navigator>
    </GameProvider>
  );
};

export default index;