exports.handler = async function (event, context) {
    const cors = {
        "Access-Control-Allow-Origin": "*", // allow all origins
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    }
    const user = process.env.GITHUB_USER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;
    
    if (!user || !repo) {
        return {
            statusCode: 500,
            headers: cors,
            body: JSON.stringify({
                error: "Missing GITHUB_USER or GITHUB_REPO environment variables.",
            }),
        };
    }
    
    const path = event.queryStringParameters?.path || "";
    const githubUrl = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;

    try {
        const response = await fetch(githubUrl, {
            headers: {
                "User-Agent": "Netlify-Function",
                Accept: "application/vnd.github.v3+json",
                ...(token && { Authorization: `token ${token}` })
            }
        });
        if (!response.ok) {
            return {
                statusCode: response.status,
                headers: cors,
                body: JSON.stringify({
                    error: `GitHub API error: ${response.statusText}`,
                })
            };
        }
        const data = await response.json();
        return {
            statusCode: 200,
            headers: cors,
            body: JSON.stringify(data)
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            headers: cors,
            body: JSON.stringify({
                error: error.message,
            })
        };
    }
};