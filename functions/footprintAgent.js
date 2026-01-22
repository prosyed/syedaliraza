import { neon } from '@neondatabase/serverless';

const quote = (value) => { return `'${value.replace(/'/g, "''")}'` }

export async function handler(event) {
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
        
    const { agent_id, timestamp } = body;

    if (!agent_id || !timestamp) {
        return {
            statusCode: 400,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: "POST body must agent_id and timestamp"
        };
    };
    
    const fields = ["user_agent", "device_type", "os", "browser", "user_agent_data", "language","timezone", "screen_width", "screen_height", "device_memory", "cpu_cores"];
    
    let values = Object.fromEntries(fields.map(field => [field, typeof body[field] === 'string' ? quote(body[field]) : body[field]]));
    values = Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined));
    values = { ...{
        id: quote(agent_id),
        first_seen: quote(timestamp),
        last_seen: quote(timestamp)
    }, ...values };
    
    const query = `INSERT into agents (${Object.keys(values).join(", ")}) VALUES (${Object.values(values).join(", ")}) ON CONFLICT (id) DO UPDATE SET last_seen = EXCLUDED.last_seen`;
    const sql = neon(process.env.DATABASE_URL);
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