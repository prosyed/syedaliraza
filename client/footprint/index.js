import initAgent from './agent.js';
import initSession from './session.js';

const functionBase = '/.netlify/functions/';

const agentFunction = functionBase + 'footprintAgent';
const sessionFunction = functionBase + 'footprintSession';

const agentKey = 'THEFOOTPRINT';
const sessionKey = 'FOOTPRINTSESSION';
const sessionTimestampKey = 'FOOTPRINTSESSIONTIMESTAMP';

const sessionTimeout = 30000;

(async function bootstrap() {
    const agentId = await initAgent(agentKey, agentFunction);
    //const sessionId = initSession(agentId, sessionKey, sessionTimestampKey, sessionTimeout, sessionFunction);
})();