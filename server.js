const express = require("express")
const path = require("path")
const {open} = require("sqlite")
const sqlite3 = require("sqlite3")
const cors = require("cors")
const app = express()


const dbPath = path.join(__dirname,"todo.db")
let db = null;

app.use(express.json())
app.use(cors());

const initilizationBBandServer = async () =>{
    try{
        db = await open({
            filename:dbPath,
            driver : sqlite3.Database
        })
        app.listen(3000,() =>{
            console.log("server running on http://localhost:3000");
        })
    }catch(e){
        console.log(`DB Error: ${e.message}`)
        process.exit(1)
    }
};

initilizationBBandServer()

app.get("/", async (request,response) =>{
    const getTodo = `
    SELECT * FROM todosData;`
    const book = await db.all(getTodo);
    response.send(book);
})

app.post("/todos/", async (request,response) =>{
    const todoDetails = request.body 
    
    const {title,text,status} = todoDetails ;

    const todoQuery = `INSERT INTO todosData (title,text,status)
    VALUES ('${title}','${text}','${status}');`

    const responeDb = await db.run(todoQuery)
    const todoId  = responeDb.lastID;
    response.send({todoId:todoId})
})

app.delete("/todos/:todo_id/" , async (request,response) =>{
    const {todo_id} = request.params
    const deleteQuery = `DELETE FROM todosData 
    WHERE todo_id=${todo_id};`
     await db.run(deleteQuery);
     response.send("Deleted sucessfully");
})

app.put("/todos/:todo_id/",async (request,response) =>{
    const {title,text,status} = request.body
    const {todo_id} = request.params 

    const updateQuery = `UPDATE todosData
    SET title='${title}',
    text='${text}',
    status=${status}
    WHERE todo_id = ${todo_id};`

    await db.run(updateQuery);
    response.send("Updated Sucessfully");

})