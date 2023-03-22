const express = require('express');
const fs = require('fs');
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const { connectToMongo, getCollection } = require('./DB_CONNECTION');

const app = express();
const HTML_FILE = fs.readFileSync('./index.html', { encoding: 'utf-8' });

app.use('/static', express.static('static'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(HTML_FILE);
});

app.get('/todo', (req, res) => {
  const collection = getCollection('todo');
  collection
    .find({})
    .toArray()
    .then((todoItems) => {
      // console.log(todoItems);
      res.json({ todoItems });
    });
});

app.post('/todo', (req, res) => {
  const todoItems = req.body;
  // console.log(+todoItems['priority'],'server');
  todoItems['priority'] = +todoItems['priority'];
  // console.log(todoItems,'server');
  const collection = getCollection('todo');

  collection.insertOne(todoItems, (err, msg) => {
    if (err) throw err;
    // console.log(msg);

    collection
      .find({})
      .toArray()
      .then((todoItems) => {
        // console.log(todoItems);
        res.json({ todoItems, msg });
      });
  });
});

app.delete('/todo', (req, res) => {
  const { id } = req.body;
  console.log(typeof id);
  const collection = getCollection('todo');
  collection.deleteOne({ _id: ObjectId(id) }, (err, msg) => {
    if (err) throw err;
    console.log('msg', msg);
    collection
      .find({})
      .toArray()
      .then((todoItems) => {
        // console.log(todoItems);
        res.json({ todoItems, msg });
      });
  });
});

app.get('/authors', (req, res) =>{
  const collection = getCollection('todo');
  collection.distinct('author',(err,authors) =>{
    if (err) throw err;
    console.log(authors);
    res.json({authors});
  });
});

app.get('/locations', (req, res) =>{
  const collection = getCollection('todo');
  collection.distinct('location',(err,locations) =>{
    if (err) throw err;
    console.log(locations);
    res.json({locations});
  });
});

app.get('/priorities', (req, res) =>{
  const collection = getCollection('todo');
  collection.distinct('priority',(err,priorities) =>{
    if (err) throw err;
    console.log(priorities);
    res.json({priorities});
  });
});

app.post('/search',(req,res) =>{
    const {text,author,location,priority}=req.body;
    const collection = getCollection('todo');
    const query ={};
    if(text) query.text={$regex : text};
    if(author) query.author=author;
    if(location) query.location=location;
    if(+priority !== 0 ) query.priority = +priority;
    console.log(text,author,location,priority,query);
    collection.find(query).toArray().then((todoItems) =>{
      console.log(todoItems);
      res.json({todoItems});
    });
});

connectToMongo()
  .then(() => {
    console.log('Database Connected..');
    app.listen(3000, () => {
      console.log('Server Running....');
    });
  })
  .catch((err) => {
    console.log('Unable bring up application...', err);
  });
