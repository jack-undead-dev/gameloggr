// src/screens/GameListScreen.js
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useGame } from '../context/GameContext';

const GameListScreen = ({ navigation, route }) => {
  const { getFilteredGames, filter, sortBy, setFilter, setSortBy, deleteGame } = useGame();
  const [showFilters, setShowFilters] = useState(false);

  // Aplicar filtro vindo da navegação
  // Substitua o useEffect atual por este:
  useEffect(() => {
    if (route.params?.filterStatus && route.params.filterStatus !== filter) {
      setFilter(route.params.filterStatus);
    }
  }, [route.params?.filterStatus]); 

  const games = getFilteredGames();

  const statusColors = {
    backlog: '#e17055',
    playing: '#00b894',
    completed: '#6c5ce7',
    abandoned: '#636e72',
  };

  const statusLabels = {
    backlog: 'Para Jogar',
    playing: 'Jogando',
    completed: 'Finalizado',
    abandoned: 'Abandonado',
  };

  const handleDeleteGame = (game) => {
    Alert.alert(
      'Excluir Jogo',
      `Tem certeza que deseja excluir "${game.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteGame(game.id) },
      ]
    );
  };

  const renderGame = ({ item }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => navigation.navigate('GameDetail', { game: item })}
    >
      <View style={styles.gameInfo}>
        <View style={styles.gameHeader}>
          <Text style={styles.gameTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
            <Text style={styles.statusText}>{statusLabels[item.status]}</Text>
          </View>
        </View>
        <Text style={styles.gameGenre}>{item.genre}</Text>
        <Text style={styles.gamePlatform}>{item.platform}</Text>
        <View style={styles.gameFooter}>
          <Text style={styles.priorityText}>Prioridade: {item.priority}</Text>
          {item.estimatedHours && (
            <Text style={styles.timeText}>{item.estimatedHours}h</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteGame(item)}
      >
        <Icon name="delete" size={20} color="#e74c3c" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon name="filter-list" size={20} color="#6c5ce7" />
          <Text style={styles.filterButtonText}>Filtros</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddGame')}
        >
          <Icon name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Status:</Text>
          <View style={styles.filterOptions}>
            {['all', 'backlog', 'playing', 'completed', 'abandoned'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterOption,
                  filter === status && styles.filterOptionActive,
                ]}
                onPress={() => setFilter(status)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    filter === status && styles.filterOptionTextActive,
                  ]}
                >
                  {status === 'all' ? 'Todos' : statusLabels[status]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterTitle}>Ordenar por:</Text>
          <View style={styles.filterOptions}>
            {[
              { key: 'priority', label: 'Prioridade' },
              { key: 'name', label: 'Nome' },
              { key: 'dateAdded', label: 'Data' },
              { key: 'estimatedTime', label: 'Tempo' },
            ].map((sort) => (
              <TouchableOpacity
                key={sort.key}
                style={[
                  styles.filterOption,
                  sortBy === sort.key && styles.filterOptionActive,
                ]}
                onPress={() => setSortBy(sort.key)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    sortBy === sort.key && styles.filterOptionTextActive,
                  ]}
                >
                  {sort.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <FlatList
        data={games}
        renderItem={renderGame}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gamesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="games" size={48} color="#636e72" />
            <Text style={styles.emptyText}>Nenhum jogo encontrado</Text>
            <Text style={styles.emptySubtext}>
              Adicione seus primeiros jogos ao backlog!
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1a1a2e',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    color: '#6c5ce7',
    marginLeft: 5,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#6c5ce7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: '#16213e',
    padding: 15,
  },
  filterTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  filterOption: {
    backgroundColor: '#2d3748',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: '#6c5ce7',
  },
  filterOptionText: {
    color: '#b2bec3',
    fontSize: 12,
  },
  filterOptionTextActive: {
    color: '#fff',
  },
  gamesList: {
    padding: 15,
  },
  gameCard: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameInfo: {
    flex: 1,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  gameTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  gameGenre: {
    color: '#b2bec3',
    fontSize: 14,
    marginBottom: 2,
  },
  gamePlatform: {
    color: '#74b9ff',
    fontSize: 12,
    marginBottom: 5,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityText: {
    color: '#6c5ce7',
    fontSize: 12,
    fontWeight: '500',
  },
  timeText: {
    color: '#00b894',
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtext: {
    color: '#b2bec3',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default GameListScreen;