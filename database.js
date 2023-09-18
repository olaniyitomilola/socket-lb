
const Client = require('pg').Client;

//createdb on postgres first
 const DB = new Client({
    user : 'postgres',
    host: 'localhost',
    password: "",
    port: 5400,
    
})


async function getChats(room){
    const query = `SELECT m.*, u.first_name, u.last_name
                    FROM messages m
                    JOIN users u
                    ON m.user_id = u.id
                    WHERE room_id = $1;`;

      try{
        const messages = await DB.query(query,[room])
        return messages.rows

        } catch(err){
            throw new Error(`Unable to fetch messages: ${err}`)
        }
    
}


async function getAllChats(){
    const query = `SELECT m.*, u.first_name, u.last_name
                FROM messages m
                JOIN users u
                ON m.user_id = u.id;
                    `;

      try{
        const messages = await DB.query(query)
        return messages.rows

        } catch(err){
            throw new Error(`Unable to fetch messages: ${err}`)
        }
    
}

async function insertChat(user_id,room_id,message){
     const query = `
            INSERT INTO messages(user_id,room_id,message)
            VALUES($1,$2,$3);
    `
    try{
        await DB.query(query,[user_id, room_id,message])
        return true;

    } catch(err){
        throw new Error(`Unable to Add message: ${err}`)
    }

}

module.exports = {DB, insertChat,getChats, getAllChats};