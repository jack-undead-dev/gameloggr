// src/screens/HomeScreen.js
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { games, getGamesByStatus, getRecommendedGame } = useGame();
  const statusCounts = getGamesByStatus();
  const recommendedGame = getRecommendedGame();

  const statusCards = [
    { key: 'backlog', title: 'Para Jogar', count: statusCounts.backlog, color: '#e17055', icon: 'playlist-add' },
    { key: 'playing', title: 'Jogando', count: statusCounts.playing, color: '#00b894', icon: 'play-arrow' },
    { key: 'completed', title: 'Finalizados', count: statusCounts.completed, color: '#6c5ce7', icon: 'check-circle' },
    { key: 'abandoned', title: 'Abandonados', count: statusCounts.abandoned, color: '#636e72', icon: 'cancel' },
  ];

  const handleStatusCardPress = (statusKey) => {
    navigation.navigate('Games', {
      screen: 'GameList',
      params: { filterStatus: statusKey }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GameLoggr</Text>
        <Text style={styles.subtitle}>Organize seu backlog de jogos</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Resumo da Biblioteca</Text>
        <View style={styles.statsGrid}>
          {statusCards.map((stat) => (
            <TouchableOpacity
              key={stat.key}
              style={[styles.statCard, { backgroundColor: stat.color }]}
              onPress={() => handleStatusCardPress(stat.key)}
            >
              <Icon name={stat.icon} size={24} color="#fff" />
              <Text style={styles.statCount}>{stat.count}</Text>
              <Text style={styles.statLabel}>{stat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {recommendedGame && (
        <View style={styles.recommendationContainer}>
          <Text style={styles.sectionTitle}>Recomendação do Dia</Text>
          <TouchableOpacity
            style={styles.recommendationCard}
            onPress={() => navigation.navigate('Games', {
              screen: 'GameDetail',
              params: { game: recommendedGame }
            })}
          >
            <View style={styles.recommendationContent}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationTitle}>{recommendedGame.title}</Text>
                <View style={styles.priorityBadge}>
                  <Text style={styles.priorityText}>Prioridade {recommendedGame.priority}</Text>
                </View>
              </View>
              <Text style={styles.recommendationGenre}>{recommendedGame.genre}</Text>
              <Text style={styles.recommendationPlatform}>{recommendedGame.platform}</Text>
              {recommendedGame.estimatedHours && (
                <Text style={styles.recommendationTime}>
                  ~{recommendedGame.estimatedHours}h para completar
                </Text>
              )}
            </View>
            <Icon name="chevron-right" size={24} color="#6c5ce7" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Games', {
            screen: 'AddGame'
          })}
        >
          <Icon name="add-circle" size={24} color="#6c5ce7" />
          <Text style={styles.actionText}>Adicionar Novo Jogo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Games', {
            screen: 'GameList',
            params: { filterStatus: 'all' }
          })}
        >
          <Icon name="list" size={24} color="#6c5ce7" />
          <Text style={styles.actionText}>Ver Todos os Jogos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6c5ce7',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#b2bec3',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  statsContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 50) / 2,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  recommendationContainer: {
    padding: 20,
  },
  recommendationCard: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#6c5ce7',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  priorityBadge: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  recommendationGenre: {
    color: '#b2bec3',
    fontSize: 14,
    marginBottom: 2,
  },
  recommendationPlatform: {
    color: '#74b9ff',
    fontSize: 12,
    marginBottom: 2,
  },
  recommendationTime: {
    color: '#00b894',
    fontSize: 12,
  },
  quickActions: {
    padding: 20,
  },
  actionButton: {
    backgroundColor: '#16213e',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HomeScreen;