// backend/controllers/task.controller.js
const Task = require('../models/Task');

// Obtener todas las tareas del usuario (o por finca/cultivo)
const getTasks = async (req, res) => {
  try {
    const filter = { createdBy: req.user._id };
    if (req.query.farm) filter.farm = req.query.farm;
    if (req.query.cultivo) filter.cultivo = req.query.cultivo;
    const tasks = await Task.find(filter).populate('farm cultivo assignedTo');
    res.status(200).json({ status: 'success', data: tasks });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener tareas', error: error.message });
  }
};

// Crear una nueva tarea
const createTask = async (req, res) => {
  try {
    const { title, description, date, status, farm, cultivo, assignedTo } = req.body;
    if (!title || !date || !farm) {
      return res.status(400).json({ message: 'Título, fecha y finca son obligatorios.' });
    }
    const task = await Task.create({
      title, description, date, status, farm, cultivo, assignedTo, createdBy: req.user._id
    });
    res.status(201).json({ status: 'success', data: task });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al crear la tarea', error: error.message });
  }
};

// Actualizar tarea
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada o no autorizada.' });
    res.status(200).json({ status: 'success', data: task });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al actualizar la tarea', error: error.message });
  }
};

// Eliminar tarea
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada o no autorizada.' });
    res.status(200).json({ status: 'success', message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al eliminar la tarea', error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
