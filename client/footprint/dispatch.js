export default function dispatch(functionUrl, payload) {
    navigator.sendBeacon(functionUrl, JSON.stringify(payload));
}