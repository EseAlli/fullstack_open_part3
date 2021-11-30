const express = require('express');
const morgan = require('morgan');
const app = express()
const PORT = process.env.PORT || 3001
const cors =  require('cors')

app.use(cors())
app.use(express.json());

morgan.token("content", (req) => {
    return JSON.stringify(req.body);
  });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

let persons = [
        { 
          "id": 1,
          "name": "Arto Hellas", 
          "number": "040-123456"
        },
        { 
          "id": 2,
          "name": "Ada Lovelace", 
          "number": "39-44-5323523"
        },
        { 
          "id": 3,
          "name": "Dan Abramov", 
          "number": "12-43-234345"
        },
        { 
          "id": 4,
          "name": "Mary Poppendieck", 
          "number": "39-23-6423122"
        }
    
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = parseInt(request.params.id)
    let person = persons.filter(per=> per.id === id)
    if (person.length > 0){
        response.json(person)
    } else{
        response.status(400).send("Invalid id, user doesn't exist")
    }
    
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