import dispatch from './dispatch.js';
import { uuidv4, now } from './utils.js';

export default async function initAgent(key, funct) {
    let agentId = localStorage.getItem(key);
    if (!agentId) {
        agentId = uuidv4();
        localStorage.setItem(key, agentId);
    }
    
    const ua = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone/i.test(ua);
    let os = "Unknown OS";
    if (/Windows NT/i.test(ua)) os = "Windows";
    else if (/Mac OS X/i.test(ua)) os = "macOS";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/iPhone|iPad/i.test(ua)) os = "iOS";
    else if (/Linux/i.test(ua)) os = "Linux";
    let browser = "Unknown Browser";
    if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = "Chrome";
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
    else if (/Firefox/i.test(ua)) browser = "Firefox";
    else if (/Edg/i.test(ua)) browser = "Edge";
    
    const user_agent_data = await navigator.userAgentData.getHighEntropyValues(["architecture", "bitness", "formFactors", "fullVersionList", "model", "platformVersion", "uaFullVersion", "wow64"]);
    
    const payload = {
        agent_id: agentId,
        timestamp: now(),
        user_agent: ua,
        device_type: isMobile ? "Mobile" : "Desktop",
        os,
        browser,
        user_agent_data: JSON.stringify(user_agent_data),
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        device_memory: navigator.deviceMemory || null,
        cpu_cores: navigator.hardwareConcurrency || null
    };
    
    dispatch(funct, payload);
}

//["user_agent", "device_type", "os", "browser", "language", "timezone", "screen_width", "screen_height", "device_memory", "cpu_cores"]