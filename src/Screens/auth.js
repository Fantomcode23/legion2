import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { uri } from '../../globalvariable/globalvariable';

// Function to store the access token securely
export const storeAccessToken = async (accessToken) => {
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
  } catch (error) {
    console.error('Error storing access token:', error);
  }
};

// Function to retrieve the access token
export const getAccessToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return accessToken;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
};

// Function to fetch user info using the access token
export const userInfo = async () => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error('Access token not found');
      return null;
    }

    const response = await axios.get(`${uri}/auth/user_details`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};
