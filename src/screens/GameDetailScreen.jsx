// src/screens/GameDetailScreen.js
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useGame } from '../context/GameContext';

const GameDetailScreen = ({ navigation, route }) => {
  const { game } = route.params;
  const { updateGame, deleteGame } = useGame();

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

  const handleStatusChange = (newStatus) => {
    Alert.alert(
      'Alterar Status',
      `Deseja alterar o status para "${statusLabels[newStatus]}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => updateGame({ ...game, status: newStatus }),
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Jogo',
      `Tem certeza que deseja excluir "${game.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteGame(game.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('AddGame', { game });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPriorityColor = (priority) => {
    const colors = {
      1: '#636e72',
      2: '#74b9ff',
      3: '#fdcb6e',
      4: '#e17055',
      5: '#e84393',
    };
    return colors[priority] || '#636e72';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{game.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[game.status] }]}>
            <Text style={styles.statusText}>{statusLabels[game.status]}</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Icon name="edit" size={20} color="#6c5ce7" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Icon name="delete" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Icon name="category" size={20} color="#74b9ff" />
          <Text style={styles.detailLabel}>Gênero:</Text>
          <Text style={styles.detailValue}>{game.genre || 'Não informado'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="videogame-asset" size={20} color="#74b9ff" />
          <Text style={styles.detailLabel}>Plataforma:</Text>
          <Text style={styles.detailValue}>{game.platform || 'Não informado'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="star" size={20} color={getPriorityColor(game.priority)} />
          <Text style={styles.detailLabel}>Prioridade:</Text>
          <Text style={[styles.detailValue, { color: getPriorityColor(game.priority) }]}>
            {game.priority}/5
          </Text>
        </View>

        {game.estimatedHours && (
          <View style={styles.detailRow}>
            <Icon name="schedule" size={20} color="#00b894" />
            <Text style={styles.detailLabel}>Tempo Estimado:</Text>
            <Text style={styles.detailValue}>{game.estimatedHours} horas</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Icon name="add-circle" size={20} color="#b2bec3" />
          <Text style={styles.detailLabel}>Adicionado em:</Text>
          <Text style={styles.detailValue}>{formatDate(game.createdAt)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="update" size={20} color="#b2bec3" />
          <Text style={styles.detailLabel}>Última atualização:</Text>
          <Text style={styles.detailValue}>{formatDate(game.updatedAt)}</Text>
        </View>
      </View>

      {game.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Notas:</Text>
          <Text style={styles.notesText}>{game.notes}</Text>
        </View>
      )}

      <View style={styles.statusActions}>
        <Text style={styles.statusActionsTitle}>Alterar Status:</Text>
        <View style={styles.statusButtons}>
          {Object.entries(statusLabels).map(([status, label]) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                { backgroundColor: statusColors[status] },
                game.status === status && styles.statusButtonActive,
              ]}
              onPress={() => handleStatusChange(status)}
              disabled={game.status === status}
            >
              <Text style={styles.statusButtonText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    backgroundColor: '#1a1a2e',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#16213e',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  detailsContainer: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
  },
  detailLabel: {
    color: '#b2bec3',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  notesContainer: {
    margin: 20,
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
  },
  notesTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  notesText: {
    color: '#b2bec3',
    fontSize: 14,
    lineHeight: 20,
  },
  statusActions: {
    padding: 20,
  },
  statusActionsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  statusButtonActive: {
    opacity: 0.5,
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default GameDetailScreen;