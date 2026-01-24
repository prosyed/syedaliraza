export default async function initSession(agentId, sessionKey, sessionFunction) {
    let sessionId = sessionStorage.getItem(sessionKey);
    let payload = {
        session_id: sessionId,
        agent_id: agentId,
        timestamp: Date.now(),
        url: location.href,
        referrer: document.referrer
    }
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem(sessionKey, sessionId);
        payload.session_id = sessionId;
        navigator.sendBeacon(sessionFunction, JSON.stringify(payload));
    }
    window.addEventListener("pagehide", () => {
        sessionStorage.removeItem(sessionKey);
        payload.init = false;
        navigator.sendBeacon(sessionFunction, JSON.stringify(payload));
    });
    return sessionId;
}