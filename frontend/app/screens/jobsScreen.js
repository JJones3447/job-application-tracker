import { View, Text, Button } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export default function JobsScreen() {
  const { logout } = useContext(AuthContext);

  return (
    <View>
      <Text>Jobs Screen (Logged In)</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}