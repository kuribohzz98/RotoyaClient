import { AsyncStorage } from 'react-native';

export async function saveItem(key, value) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log('AsyncStorage Error: ' + error.message);
    }
}

export async function getItem(key) {
    const item = await AsyncStorage.getItem(key);
    if (!item) {
        console.log(`[AsyncStorage] item with key = ${key} not found`);
        return;
    }
    return item;
}

export async function removeItem(key) {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.log('AsyncStorage Error: ' + error.message);
    }
}