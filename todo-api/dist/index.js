"use strict";
// src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PORT = 3002;
const app = (0, express_1.default)();
// Middleware pour parser le JSON
app.use(express_1.default.json());
// Tableau en mémoire pour stocker les To-Dos
let todos = [];
let currentId = 1;
// Route pour obtenir tous les To-Dos
app.get('/todos', (req, res) => {
    res.json(todos);
});
// Route pour obtenir un To-Do spécifique par ID
app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const todo = todos.find(t => t.id === id);
    if (todo) {
        res.json(todo);
    }
    else {
        res.status(404).json({ message: 'To-Do non trouvé' });
    }
});
// Route pour créer un nouveau To-Do
app.post('/todos', (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Le titre est requis' });
    }
    const newTodo = {
        id: currentId++,
        title,
        description: description || '',
        completed: false
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});
// Route pour mettre à jour un To-Do existant
app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { title, description, completed } = req.body;
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex !== -1) {
        const updatedTodo = Object.assign(Object.assign({}, todos[todoIndex]), { title: title !== undefined ? title : todos[todoIndex].title, description: description !== undefined ? description : todos[todoIndex].description, completed: completed !== undefined ? completed : todos[todoIndex].completed });
        todos[todoIndex] = updatedTodo;
        res.json(updatedTodo);
    }
    else {
        res.status(404).json({ message: 'To-Do non trouvé' });
    }
});
// Route pour supprimer un To-Do
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex !== -1) {
        const deletedTodo = todos.splice(todoIndex, 1)[0];
        res.json(deletedTodo);
    }
    else {
        res.status(404).json({ message: 'To-Do non trouvé' });
    }
});
// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur To-Do List en cours d'exécution sur le port ${PORT}`);
});
