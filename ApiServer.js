const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const MONGODB_URI = 'mongodb://localhost/todos';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  }
});

const Todo = mongoose.model('Todo', todoSchema);

async function startServer() {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Connected to MongoDB');

  const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

  return server;
}

async function closeServer(server) {
  await mongoose.connection.close();
  await server.close();
  console.log('Server closed');
}

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const { title } = req.body;
  const todo = new Todo({
    title
  });
  await todo.save();
  res.status(201).json({ success: true });
});

module.exports = {
  app,
  startServer,
  closeServer
};
