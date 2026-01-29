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
        
    let { session_id, agent_id, timestamp, type, details, page } = body;

    if (!session_id || !agent_id || !timestamp || !type) {
        return {
            statusCode: 400,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: "POST body must have session_id, agent_id, type and timestamp"
        };
    };
    
    timestamp = new Date(timestamp).toISOString();
    
    let values = {
        agent_id: quote(agent_id),
        session_id: quote(session_id),
        type: quote(type),
        timestamp: quote(timestamp),
            ...(details && { details: quote(details) }),
            ...(page && { page: quote(page) })
    }
    
    const query = `INSERT into events (${Object.keys(values).join(", ")}) VALUES (${Object.values(values).join(", ")})`;
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