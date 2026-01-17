exports.handler = async function (event, context) {
    console.log(process.env);
    const user = process.env.GITHUB_USER;
    return {
        statusCode: 200,
        body: user,
    };
};