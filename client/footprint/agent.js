export default async function initAgent(agentKey, agentFunction) {
    const now = new Date();
    
    let agentId = localStorage.getItem(agentKey);
    if (!agentId) {
        agentId = crypto.randomUUID();
        localStorage.setItem(agentKey, agentId);
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
    
    const userAgentData = await navigator.userAgentData.getHighEntropyValues(["architecture", "bitness", "formFactors", "fullVersionList", "model", "platformVersion", "uaFullVersion", "wow64"]);
    
    const payload = {
        agent_id: agentId,
        timestamp: now.toISOString(),
        user_agent: ua,
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