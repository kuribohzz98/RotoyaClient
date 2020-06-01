import AsyncStorage from '@react-native-community/async-storage';

const saveItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log('AsyncStorage Error: ' + error.message);
    }
}

const getItem = async (key) => {
    const item = await AsyncStorage.getItem(key);
    if (!item) {
        console.log(`[AsyncStorage] item with key = ${key} not found`);
        return;
    }
    return item;
}

const removeItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.log('AsyncStorage Error: ' + error.message);
    }
}

const clear = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.log('AsyncStorage Error: ' + error.message);
    }
}

export default {
    saveItem,
    getItem,
    removeItem,
    clear
}