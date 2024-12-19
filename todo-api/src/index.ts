// src/index.ts

import express, { Request, Response } from 'express';
import { Todo } from './interfaces/Todo';

const PORT: number = 3002;

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Tableau en mémoire pour stocker les To-Dos
let todos: Todo[] = [];
let currentId: number = 1;

// Route pour obtenir tous les To-Dos
app.get('/todos', (req: Request, res: Response) => {
  res.json(todos);
});

// Route pour obtenir un To-Do spécifique par ID
app.get('/todos/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const todo = todos.find(t => t.id === id);
  
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ message: 'To-Do non trouvé' });
  }
});

// Route pour créer un nouveau To-Do
app.post('/todos', (req: Request, res: Response) => {
  const { title, description }: Partial<Todo> = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Le titre est requis' });
  }

  const newTodo: Todo = {
    id: currentId++,
    title,
    description: description || '',
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Route pour mettre à jour un To-Do existant
app.put('/todos/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const { title, description, completed }: Partial<Todo> = req.body;

  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex !== -1) {
    const updatedTodo: Todo = {
      ...todos[todoIndex],
      title: title !== undefined ? title : todos[todoIndex].title,
      description: description !== undefined ? description : todos[todoIndex].description,
      completed: completed !== undefined ? completed : todos[todoIndex].completed
    };

    todos[todoIndex] = updatedTodo;
    res.json(updatedTodo);
  } else {
    res.status(404).json({ message: 'To-Do non trouvé' });
  }
});

// Route pour supprimer un To-Do
app.delete('/todos/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex !== -1) {
    const deletedTodo = todos.splice(todoIndex, 1)[0];
    res.json(deletedTodo);
  } else {
    res.status(404).json({ message: 'To-Do non trouvé' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur To-Do List en cours d'exécution sur le port ${PORT}`);
});
