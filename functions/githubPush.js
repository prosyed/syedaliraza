export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: "Method Not Allowed"
        };
    }
    
    const user = process.env.GITHUB_USER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;
    const pass = process.env.CODEX_ULTIMUS;
    
    if (!user || !repo || !token) {
        return {
            statusCode: 500,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: "Missing GITHUB_USER, GITHUB_REPO or GITHUB_TOKEN environment variables."
        };
    }
    
    let body;
    try {
        body = JSON.parse(event.body);
    } catch {
        return { 
            statusCode: 400, 
            headers: {"Access-Control-Allow-Origin": "*"},
            body: "Invalid JSON body" 
        };
    }
    
    let { path, content, sha, message, password } = body;
    message = "Update from within" + (message ? ": " + message : "");
    
    if (!path || content === undefined) {
        return {
            statusCode: 400,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: "POST body must include path and content"
        };
    }
    
    if (password !== pass) {
        return {
            statusCode: 400,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: "Password missing or incorrect",
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
            headers: {"Access-Control-Allow-Origin": "*"},
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