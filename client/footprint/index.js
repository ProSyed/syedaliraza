import initAgent from './agent.js';
import initSession from './session.js';
import initEvent from './event.js';

const functionBase = '/.netlify/functions/';

const agentFunction = functionBase + 'footprintAgent';
const sessionFunction = functionBase + 'footprintSession';
const eventFunction = functionBase + 'footprintEvent';

const agentKey = 'FOOTPRINTAGENT';
const sessionKey = 'FOOTPRINTSESSION';

(async function bootstrap() {
    const agentId = await initAgent(agentKey, agentFunction);
    const sessionId = await initSession(agentId, sessionKey, sessionFunction);
    initEvent(agentId, sessionId, eventFunction);
})();