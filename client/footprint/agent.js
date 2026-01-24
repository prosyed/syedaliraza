export default async function initAgent(agentKey, agentFunction) {
    let agentId = localStorage.getItem(agentKey);
    if (!agentId) {
        agentId = crypto.randomUUID();
        localStorage.setItem(agentKey, agentId);
    }
    
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
    let os = "Unknown OS";
    if (/Windows NT/i.test(userAgent)) os = "Windows";
    else if (/Mac OS X/i.test(userAgent)) os = "macOS";
    else if (/Android/i.test(userAgent)) os = "Android";
    else if (/iPhone|iPad/i.test(userAgent)) os = "iOS";
    else if (/Linux/i.test(userAgent)) os = "Linux";
    let browser = "Unknown Browser";
    if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) browser = "Chrome";
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = "Safari";
    else if (/Firefox/i.test(userAgent)) browser = "Firefox";
    else if (/Edg/i.test(userAgent)) browser = "Edge";
    
    const userAgentData = await navigator.userAgentData.getHighEntropyValues(["architecture", "bitness", "formFactors", "fullVersionList", "model", "platformVersion", "uaFullVersion", "wow64"]);
    
    const payload = {
        agent_id: agentId,
        timestamp: Date.now(),
        user_agent: userAgent,
        device_type: isMobile ? "Mobile" : "Desktop",
        os,
        browser,
        user_agent_data: JSON.stringify(userAgentData),
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        device_memory: navigator.deviceMemory || null,
        cpu_cores: navigator.hardwareConcurrency || null
    };
    
    navigator.sendBeacon(agentFunction, JSON.stringify(payload));
    return agentId;
}