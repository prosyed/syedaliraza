exports.handler = async function (event, context) {
    const cors = {
        "Access-Control-Allow-Origin": "*", // allow all origins
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    }
    
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: cors,
            body: "Method Not Allowed"
        };
    }
    
    const user = process.env.GITHUB_USER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;
    
    
    if (!user || !repo || !token) {
        return {
            statusCode: 500,
            headers: cors,
            body: JSON.stringify({
                error: "Missing GITHUB_USER, GITHUB_REPO or GITHUB_TOKEN environment variables.",
            }),
        };
    }
    
    let body;
    try {
        body = JSON.parse(event.body);
    } catch {
        return { 
            statusCode: 400, 
            headers: cors,
            body: "Invalid JSON body" 
        };
    }
    
    let { path, content, sha, message } = body;
    message = "Update from within" + (message ? ": " + message : "");
    if (!path || content === undefined) {
        return {
            statusCode: 400,
            headers: cors,
            body: "POST body must include path and content",
        };
    }
    
    const githubUrl = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
    
    const response = await fetch(githubUrl, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
            message,
            content: Buffer.from(content).toString("base64"),
            ...(sha && { sha }),
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        return {
            statusCode: response.status,
            headers: cors,
            body: JSON.stringify(data),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            path,
            commit: data.commit?.sha,
            sha: data.content?.sha,
        }),
    };
};