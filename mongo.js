const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const generateId = ()=>{
    let id = Math.floor(Math.random() * 10000)
    return id
}

const url =
  `mongodb+srv://admin:${password}@cluster0.ajg1r.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3){
    Person.find({}).then(result =>{
        result.forEach(person =>{
            console.log(person)
        })
        mongoose.connection.close()
    })
}
else{
    const person = new Person({
        name,
        number,
        id: generateId()
      })
      
      person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
      })
}
