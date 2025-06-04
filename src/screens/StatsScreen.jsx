// src/screens/StatsScreen.js
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');

const StatsScreen = () => {
  const { games, getGamesByStatus } = useGame();
  const statusCounts = getGamesByStatus();

  const totalGames = games.length;
  const completedPercentage = totalGames > 0 ? ((statusCounts.completed / totalGames) * 100).toFixed(1) : 0;

  const totalEstimatedHours = games.reduce((sum, game) => {
    return sum + (game.estimatedHours || 0);
  }, 0);

  const genreStats = games.reduce((acc, game) => {
    if (game.genre) {
      acc[game.genre] = (acc[game.genre] || 0) + 1;
    }
    return acc;
  }, {});

  const platformStats = games.reduce((acc, game) => {
    if (game.platform) {
      acc[game.platform] = (acc[game.platform] || 0) + 1;
    }
    return acc;
  }, {});

  const averagePriority = games.length > 0 
    ? (games.reduce((sum, game) => sum + game.priority, 0) / games.length).toFixed(1)
    : 0;

  const topGenres = Object.entries(genreStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topPlatforms = Object.entries(platformStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardHeader}>
        <Icon name={icon} size={24} color={color} />
        <Text style={styles.statCardTitle}>{title}</Text>
      </View>
      <Text style={styles.statCardValue}>{value}</Text>
      {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
    </View>
  );

  const TopItemsList = ({ title, items, icon, color }) => (
    <View style={styles.topItemsContainer}>
      <View style={styles.topItemsHeader}>
        <Icon name={icon} size={20} color={color} />
        <Text style={styles.topItemsTitle}>{title}</Text>
      </View>
      {items.length > 0 ? (
        items.map(([name, count]) => (
          <View key={name} style={styles.topItem}>
            <Text style={styles.topItemName}>{name}</Text>
            <Text style={styles.topItemCount}>{count}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>Nenhum dado disponível</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estatísticas</Text>
        <Text style={styles.subtitle}>Acompanhe seu progresso nos jogos</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total de Jogos"
          value={totalGames}
          icon="games"
          color="#6c5ce7"
        />
        <StatCard
          title="Taxa de Conclusão"
          value={`${completedPercentage}%`}
          icon="check-circle"
          color="#00b894"
          subtitle={`${statusCounts.completed} de ${totalGames} jogos`}
        />
        <StatCard
          title="Tempo Total Estimado"
          value={`${totalEstimatedHours}h`}
          icon="schedule"
          color="#fdcb6e"
          subtitle="Para completar todos os jogos"
        />
        <StatCard
          title="Prioridade Média"
          value={averagePriority}
          icon="star"
          color="#e17055"
          subtitle="De 1 a 5"
        />
      </View>

      <View style={styles.statusBreakdown}>
        <Text style={styles.sectionTitle}>Distribuição por Status</Text>
        <View style={styles.statusCards}>
          <View style={[styles.statusCard, { backgroundColor: '#e17055' }]}>
            <Text style={styles.statusCount}>{statusCounts.backlog}</Text>
            <Text style={styles.statusLabel}>Para Jogar</Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: '#00b894' }]}>
            <Text style={styles.statusCount}>{statusCounts.playing}</Text>
            <Text style={styles.statusLabel}>Jogando</Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: '#6c5ce7' }]}>
            <Text style={styles.statusCount}>{statusCounts.completed}</Text>
            <Text style={styles.statusLabel}>Finalizados</Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: '#636e72' }]}>
            <Text style={styles.statusCount}>{statusCounts.abandoned}</Text>
            <Text style={styles.statusLabel}>Abandonados</Text>
          </View>
        </View>
      </View>

      <View style={styles.topLists}>
        <TopItemsList
          title="Top Gêneros"
          items={topGenres}
          icon="category"
          color="#74b9ff"
        />
        <TopItemsList
          title="Top Plataformas"
          items={topPlatforms}
          icon="videogame-asset"
          color="#fd79a8"
        />
      </View>

      {games.length === 0 && (
        <View style={styles.emptyState}>
          <Icon name="trending-up" size={48} color="#636e72" />
          <Text style={styles.emptyStateText}>Nenhuma estatística ainda</Text>
          <Text style={styles.emptyStateSubtext}>
            Adicione alguns jogos para ver suas estatísticas!
          </Text>
        </View>
      )}
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
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6c5ce7',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#b2bec3',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  statsGrid: {
    padding: 20,
  },
  statCard: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statCardTitle: {
    color: '#b2bec3',
    fontSize: 14,
    marginLeft: 8,
  },
  statCardValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statCardSubtitle: {
    color: '#636e72',
    fontSize: 12,
  },
  statusBreakdown: {
    padding: 20,
    paddingTop: 0,
  },
  statusCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusCard: {
    width: (width - 50) / 2,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  statusCount: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  topLists: {
    padding: 20,
    paddingTop: 0,
  },
  topItemsContainer: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  topItemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  topItemsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  topItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3748',
  },
  topItemName: {
    color: '#b2bec3',
    fontSize: 14,
  },
  topItemCount: {
    color: '#6c5ce7',
    fontSize: 14,
    fontWeight: '600',
  },
  noDataText: {
    color: '#636e72',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    color: '#b2bec3',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default StatsScreen;