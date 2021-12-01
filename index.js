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

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
}

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
            response.status(404).send()
        }
    })
    .catch(error =>{
      console.log(error)
      response.status(500).end()
    })
})

app.delete('/api/persons/:id', (request, response, next)=>{
    const id = request.params.id
    Person.findByIdAndRemove(id)
    .then(result => {
        response.status(204).end()
      })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const newPerson = request.body
    if (!newPerson.name && !newPerson.number){
        response.status(400).send('Incomplete Content')
    }
    else{
        const person = new Person({
            name: newPerson.name,
            number: newPerson.number
        })
        person.save()
        .then(savedPerson => savedPerson.toJSON())
        .then(savedAndFormattedNote => {
            response.json(savedAndFormattedNote)
        }) 
        .catch(error => next(error))
    }
})

app.put('/api/persons/:id', (request, response, next) =>{
    const id = request.params.id
    const content = request.body
    const person = {
        name: content.name,
        number: content.number
    }
    Person.findByIdAndUpdate(id, person)
    .then(updatedPerson =>{
        if (updatedPerson === null) {
            return response.status(404).end();
        }
        response.json(updatedPerson);
    })
    .catch(error => next(error))
})

app.get('/info', (request, response)=>{
    const date = new Date()
    Person.find({}).then(persons =>{
        response.send(`<p>Phonebook has info for ${persons.length} people</p> ${date}`)
    })
})

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})