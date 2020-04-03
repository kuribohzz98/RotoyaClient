import { showMessage } from "react-native-flash-message";

const notify = (type, message, icon, description) => {
    showMessage({ message, description, type, icon });
}

const error = (message, description) => {
    notify('danger', message, 'danger', description);
}

const success = (message, description) => {
    notify('success', message, 'success', description);
}

const warning = (message, description) => {
    notify('warning', message, 'info', description);
}

const info = (message, description) => {
    notify('info', message, 'info', description);
}

const errorServer = (response) => {
    error(`Server Error ${response.status}`, response.statusText)
}

export default {
    notify,
    error,
    success,
    warning,
    info,
    errorServer
}