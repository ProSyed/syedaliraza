export default function initEvent(agentId, sessionId, eventFunction) {
    document.addEventListener('click', async (e) => {
        let payload = {
            session_id: sessionId,
            agent_id: agentId,
            timestamp: Date.now(),
            type: "click",
            page: location.pathname,
            details: JSON.stringify(domPath(e.target))
        }
        const response = await fetch(eventFunction, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Event POST failed:', errorData);
            return null;
        }
    });
}

function domPath(element) {
    const path = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
        let part = element.id ? "" : element.tagName.toLowerCase();
        if (element.id) {
            part += `#${element.id}`;
        }
        if (element.classList.length) {
            part += "." + [...element.classList].join(".");
        }
        path.push(part);
        element = element.parentElement;
    } 
    return path;
}