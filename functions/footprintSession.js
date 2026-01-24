import { neon } from '@neondatabase/serverless';

const quote = (value) => { 
    return `'${value.replace(/'/g, "''")}'` 
}

export async function handler(event) {    
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(event.headers['x-forwarded-for']));
    console.log(JSON.stringify(event.socket));
    console.log(JSON.stringify(event.ip));
    
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: "Method Not Allowed"
        };
    }
    
    const database = process.env.DATABASE_URL;
    if (!database) {
        return {
            statusCode: 500,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: "Missing DATABASE_URL environment variable"
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
        
    let { session_id, agent_id, timestamp, url, referrer, init = true } = body;

    if (!session_id || !agent_id || !timestamp) {
        return {
            statusCode: 400,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: "POST body must have session_id, agent_id and timestamp"
        };
    };
    
    timestamp = new Date(timestamp).toISOString();

    let query;
    if (init){
        let values = {
            id: quote(session_id),
            agent_id: quote(agent_id),
            started_at: quote(timestamp),
                ...(url && { entry_url: quote(url) }),
                ...(referrer && { referrer: quote(referrer) })
        }
        values = Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined));
        query = `INSERT into sessions (${Object.keys(values).join(", ")}) VALUES (${Object.values(values).join(", ")}) ON CONFLICT DO NOTHING`;
    }
    else query = `UPDATE sessions SET ended_at = ${quote(timestamp)}${url ? `, exit_url = ${quote(url)}` : ""} WHERE id = ${quote(session_id)}`
        
    const sql = neon(database);
    try {
        await sql.query(query);
        return { 
            statusCode: 200, 
            headers: {"Access-Control-Allow-Origin": "*"}
        };
    } catch (error) {
        return { 
            statusCode: 500, 
            headers: {"Access-Control-Allow-Origin": "*"},
            body: JSON.stringify({
                message: error.message,
                code: error.code
            })
        };
    }
}