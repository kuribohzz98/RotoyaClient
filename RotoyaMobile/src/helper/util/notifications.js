import { showMessage } from "react-native-flash-message";

const notify = (type, message, icon, description) => {
    showMessage({ message, description, type, icon });
}

const notifyError = (message, description) => {
    notify('error', message, 'danger', description);
}

const notifySuccess = (message, description) => {
    notify('success', message, 'success', description);
}

const notifyWarning = (message, description) => {
    notify('warning', message, 'info', description);
}

const notifyInfo = (message, description) => {
    notify('info', message, 'info', description);
}

export default {
    notify,
    notifyError,
    notifySuccess,
    notifyWarning,
    notifyInfo
}