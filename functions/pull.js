exports.handler = async function (event, context) {
    const user = process.env.GITHUB_USER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;
    return {
        statusCode: 200,
        body: [user, repo, token],
    };
};