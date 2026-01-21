export async function handler(event) {
    const user = process.env.GITHUB_USER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;
    
    if (!user || !repo) {
        return {
            statusCode: 500,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: "Missing GITHUB_USER or GITHUB_REPO environment variables"
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
                headers: {"Access-Control-Allow-Origin": "*"},
                body: `GitHub API error: ${response.statusText}`
            };
        }
        const data = await response.json();
        return {
            statusCode: 200,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: JSON.stringify(data)
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: error.message
        };
    }
};