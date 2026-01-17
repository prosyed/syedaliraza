exports.handler = async function (event, context) {
    const user = process.env.GITHUB_USER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;
    
    if (!user || !repo) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Missing GITHUB_USER or GITHUB_REPO environment variables.",
            }),
        };
    }
    
    const path = event.queryStringParameters?.path || "";
    const githubUrl = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
    
    return {
        statusCode: 200,
        body: githubUrl,
    };
};