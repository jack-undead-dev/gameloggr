// src/screens/AddGameScreen.js
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useGame } from '../context/GameContext';

const AddGameScreen = ({ navigation, route }) => {
  const { addGame, updateGame } = useGame();
  const editingGame = route.params?.game;

  const [formData, setFormData] = useState({
    title: editingGame?.title || '',
    genre: editingGame?.genre || '',
    platform: editingGame?.platform || '',
    status: editingGame?.status || 'backlog',
    priority: editingGame?.priority || 3,
    estimatedHours: editingGame?.estimatedHours?.toString() || '',
    notes: editingGame?.notes || '',
  });

  const genres = [
    'Ação', 'Aventura', 'RPG', 'Estratégia', 'Simulação', 'Esportes',
    'Corrida', 'Puzzle', 'Plataforma', 'Tiro', 'Luta', 'Terror',
    'Arcade', 'Indie', 'MMO', 'Outro'
  ];

  const platforms = [
    'PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One',
    'Nintendo Switch', 'Mobile', '3DS', 'Wii', 'WiiU', 'Outro'
  ];

  const handleSave = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Erro', 'O título do jogo é obrigatório');
      return;
    }

    const gameData = {
      ...formData,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null,
      priority: parseInt(formData.priority),
    };

    try {
      if (editingGame) {
        await updateGame({ ...editingGame, ...gameData });
        Alert.alert('Sucesso', 'Jogo atualizado com sucesso!');
      } else {
        await addGame(gameData);
        Alert.alert('Sucesso', 'Jogo adicionado com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o jogo');
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título do Jogo *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(value) => updateFormData('title', value)}
            placeholder="Ex: The Witcher 3"
            placeholderTextColor="#636e72"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gênero</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.genre}
              onValueChange={(value) => updateFormData('genre', value)}
              style={styles.picker}
              dropdownIconColor="#6c5ce7"
            >
              <Picker.Item label="Selecione um gênero" value="" />
              {genres.map((genre) => (
                <Picker.Item key={genre} label={genre} value={genre} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Plataforma</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.platform}
              onValueChange={(value) => updateFormData('platform', value)}
              style={styles.picker}
              dropdownIconColor="#6c5ce7"
            >
              <Picker.Item label="Selecione uma plataforma" value="" />
              {platforms.map((platform) => (
                <Picker.Item key={platform} label={platform} value={platform} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.status}
              onValueChange={(value) => updateFormData('status', value)}
              style={styles.picker}
              dropdownIconColor="#6c5ce7"
            >
              <Picker.Item label="Para Jogar" value="backlog" />
              <Picker.Item label="Jogando" value="playing" />
              <Picker.Item label="Finalizado" value="completed" />
              <Picker.Item label="Abandonado" value="abandoned" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prioridade (1-5)</Text>
          <View style={styles.priorityContainer}>
            {[1, 2, 3, 4, 5].map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityButton,
                  formData.priority === priority && styles.priorityButtonActive,
                ]}
                onPress={() => updateFormData('priority', priority)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    formData.priority === priority && styles.priorityTextActive,
                  ]}
                >
                  {priority}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tempo Estimado (horas)</Text>
          <TextInput
            style={styles.input}
            value={formData.estimatedHours}
            onChangeText={(value) => updateFormData('estimatedHours', value)}
            placeholder="Ex: 50"
            placeholderTextColor="#636e72"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notas</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(value) => updateFormData('notes', value)}
            placeholder="Adicione suas observações sobre o jogo..."
            placeholderTextColor="#636e72"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {editingGame ? 'Atualizar Jogo' : 'Adicionar Jogo'}
          </Text>
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#16213e',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2d3748',
  },
  picker: {
    color: '#fff',
    backgroundColor: 'transparent',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    backgroundColor: '#16213e',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2d3748',
  },
  priorityButtonActive: {
    backgroundColor: '#6c5ce7',
    borderColor: '#6c5ce7',
  },
  priorityText: {
    color: '#b2bec3',
    fontSize: 18,
    fontWeight: '600',
  },
  priorityTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#6c5ce7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddGameScreen;