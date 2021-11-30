require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const app = express()
const PORT = process.env.PORT
const cors =  require('cors');
const Person = require("./models/person")

app.use(cors())
app.use(express.json());

morgan.token("content", (req) => {
    return JSON.stringify(req.body);
  });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons =>{
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id).then(person=>{
        if(person){
            response.json(person)
        }
        else{
            response.status(400).send("Invalid id, user doesn't exist")
        }
    })
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = parseInt(request.params.id)
    let personsList = persons.filter(per =>  per.id !== id)
    response.json(personsList)
})

app.post('/api/persons', (request, response) => {
    const newPerson = request.body
    console.log(newPerson)
    if (!newPerson.name && !newPerson.number){
        response.status(400).send('Incomplete Content')
    }
    else{
        const person = persons.filter(per => per.name === newPerson.name)
        
        if (person.length >= 1){
            response.status(400).send('Name must be unique')
        }
        else{
            const Id = Math.floor(Math.random() * 100)
            newPerson.id = Id
            persons = persons.concat(newPerson)
            response.json(persons)
        }
    }
})

app.get('/info', (request, response)=>{
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p> ${date}`)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})