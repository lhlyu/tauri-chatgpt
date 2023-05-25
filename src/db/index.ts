import Database from 'tauri-plugin-sql-api'
import Flake from '@rockerapp/flake'
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdefghijkmnprstuvwxyz', 10)

const flake = new Flake({})

export const getMessageId = (): string => {
    return flake.generate()
}

const table_session_sql: string = `
CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY, 
    ai TEXT, 
    name TEXT, 
    avatar TEXT, 
    desc TEXT, 
    ts INTEGER, 
    option TEXT
);
`

const table_message_sql = `
CREATE TABLE IF NOT EXISTS message (
    id TEXT PRIMARY KEY,
    session_id TEXT, 
    ts INTEGER,
    role TEXT, 
    content TEXT
);
`

let db: Database | null

export const initDB = async () => {
    try {
        db = await Database.load('sqlite:app.db')
    } catch (e) {
        console.error(`数据库打开失败, ${e}`)
    }
}

export const initSQL = async () => {
    try {
        await db?.execute(table_session_sql)
        await db?.execute(table_message_sql)
        console.log('数据库初始化成功')
    } catch (error) {
        console.error(`数据库初始化失败,${error}`)
    }
}

const executeSQL = async (sql: string, values?: unknown[]): Promise<boolean> => {
    try {
        const ok = await db?.execute(sql, values)
        if (ok) {
            return true
        }
    } catch (error) {
        console.error(`SQL执行失败,${error}`, sql)
    }
    return false
}

// 创建session
export const createSession = async (ai: string, name: string): Promise<SessionModel | null> => {
    const id = 's' + nanoid()
    const avatar: string = `https://api.multiavatar.com/${id}.png`
    const session: SessionModel = {
        id: id,
        ai: ai,
        avatar: avatar,
        desc: '暂无消息',
        name: name,
        option: '',
        ts: +new Date()
    }
    const sql: string = `INSERT INTO session VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
    const ok = await executeSQL(sql, [session.id, session.ai, session.name, session.avatar, session.desc, session.ts, JSON.stringify(session.option)])
    if (ok) {
        return session
    }
    return null
}

// 更新会话
// open = 1时，ai字段不能为空
// open = 1时，将其他会话的open置为0
export const updateSession = async (id: string, update: Partial<SessionModel>): Promise<boolean> => {
    if (!id.length) {
        return false
    }
    const sets: string[] = []
    if (update.name) {
        sets.push(`name = '${update.name}'`)
    }
    if (update.desc) {
        sets.push(`desc = '${update.desc}'`)
    }
    if (!sets.length) {
        return false
    }
    const sql: string = `UPDATE session SET ${sets.join(',')} WHERE id = ?;`
    return await executeSQL(sql, [id])
}

// 删除会话
export const deleteSession = async (id: string): Promise<boolean> => {
    const sql: string = `DELETE FROM session WHERE id = ?;`
    return await executeSQL(sql, [id])
}

// 获取会话列表
export const getSessionAll = async (ai: string): Promise<SessionModel[]> => {
    if (!ai.length) {
        return []
    }
    const sql: string = `SELECT * FROM session WHERE ai = ? ORDER BY ts DESC;`
    const rows = await db?.select<SessionModel[]>(sql, [ai])
    if (!rows?.length) {
        return []
    }
    return rows
}

// 查询一个会话的信息
export const getSession = async (id: string): Promise<SessionModel> => {
    const sql: string = `SELECT * FROM session WHERE id = ? LIMIT 1;`
    const rows = await db?.select<SessionModel[]>(sql, [id])
    if (rows?.length) {
        return rows[0]
    }
    return {
        id: '',
        ai: '',
        name: '',
        avatar: '',
        desc: '',
        ts: 0,
        option: ''
    }
}

// 新增消息
export const addMessage = async (msg: MessageModel): Promise<boolean> => {
    if (!msg.id.length) {
        msg.id = getMessageId()
    }
    if (!msg.ts) {
        msg.ts = +new Date()
    }
    const sql: string = `INSERT INTO message VALUES (?1, ?2, ?3, ?4, ?5)`
    return await executeSQL(sql, [msg.id, msg.session_id, msg.ts, msg.role, msg.content])
}

// 删除、清空消息
export const deleteMessages = async (session_id: string, id?: string): Promise<boolean> => {
    const sql: string = `DELETE FROM message WHERE session_id = ?` + (id?.length ? ` AND id = '${id}'` : '')
    return await executeSQL(sql, [session_id])
}

// 分页查询消息
export const getMessagePage = async (session_id: string, next: string = '', count: number = 100): Promise<MessageModel[]> => {
    const nextWhr = next.length ? ` AND id < '${next}'` : ''
    const sql: string = `SELECT * FROM message WHERE session_id = ?1 ${nextWhr} ORDER BY id DESC LIMIT ?2;`
    const rows = await db?.select<MessageModel[]>(sql, [session_id, count])
    if (rows) {
        return rows
    }
    return []
}
