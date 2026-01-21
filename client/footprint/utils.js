export function uuidv4() {
    return crypto.randomUUID();
}

export function now() {
    return new Date().toISOString();
}