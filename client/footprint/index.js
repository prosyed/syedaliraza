import initAgent from './agent.js';
import initSession from './session.js';

const functionBase = '/.netlify/functions/';

const agentFunction = functionBase + 'footprintAgent';
const sessionFunction = functionBase + 'footprintSession';

const agentKey = 'FOOTPRINTAGENT';
const sessionKey = 'FOOTPRINTSESSION';

(async function bootstrap() {
    const agentId = await initAgent(agentKey, agentFunction);
    const sessionId = initSession(agentId, sessionKey, sessionFunction);
})();