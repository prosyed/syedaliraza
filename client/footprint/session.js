export default async function initSession(agentId, sessionKey, sessionTimestampKey, sessionTimeout, sessionFunction) {
    let sessionId = sessionStorage.getItem(sessionKey);
    let lastTimestamp = parseInt(sessionStorage.getItem(sessionTimestampKey) || "0", 10);

    if (!sessionId || Date.now() - lastTimestamp > sessionTimeout) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem(sessionKey, sessionId);
        sessionStorage.setItem(sessionTimestampKey, Date.now());
        navigator.sendBeacon(sessionFunction, JSON.stringify({
            session_id: sessionId,
            agent_id: agentId,
            timestamp: Date.now(),
            url: location.href,
            referrer: document.referrer
        }));
    }
    window.addEventListener("pagehide", () => {
        navigator.sendBeacon(sessionFunction, JSON.stringify({
            session_id: sessionId,
            agent_id: agentId,
            timestamp: Date.now(),
            url: location.href,
            init: false
        }));
    });
    return sessionId;
}