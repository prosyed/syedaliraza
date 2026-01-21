import initAgent from './agent.js';

const functionBase = '.netlify/functions/';

const agentFunction = functionBase + 'footprintAgent';

const agentKey = 'THEFOOTPRINT';

(function bootstrap() {
    const agent = initAgent(agentKey, agentFunction);
})();