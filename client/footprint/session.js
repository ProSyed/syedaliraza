export default async function initSession(agentId, sessionKey, sessionFunction) {
    let sessionId = sessionStorage.getItem(sessionKey);
    let payload = {
        session_id: sessionId,
        agent_id: agentId,
        url: location.href,
        referrer: document.referrer
    }
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem(sessionKey, sessionId);
        payload.session_id = sessionId;
        payload.timestamp = Date.now();
        const response = await fetch(sessionFunction, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Session POST failed:', errorData);
            return null;
        }
    }
    window.addEventListener("pagehide", (event) => {
        sessionStorage.removeItem(sessionKey);
        payload.timestamp = Date.now();
        payload.init = false;
        navigator.sendBeacon(sessionFunction, JSON.stringify(payload));
    });
    return sessionId;
}