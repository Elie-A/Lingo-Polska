import express from 'express'
const router = express.Router()
import Exercise from '../models/Exercise.js'

// GET all
router.get('/', async (req, res) => {
  try {
    const ex = await Exercise.find().sort({createdAt: -1})
    res.json(ex)
  } catch (e) {
    res.status(500).json({error: e.message})
  }
})

// GET one
router.get('/:id', async (req, res) => {
  try {
    const ex = await Exercise.findById(req.params.id)
    if (!ex) return res.status(404).json({error: 'Not found'})
    res.json(ex)
  } catch (e) {
    res.status(500).json({error: e.message})
  }
})

// POST (for future admin)
router.post('/', async (req, res) => {
  try {
    const newEx = new Exercise(req.body)
    const saved = await newEx.save()
    res.status(201).json(saved)
  } catch (e) {
    res.status(400).json({error: e.message})
  }
})

// PUT
router.put('/:id', async (req, res) => {
  try {
    const updated = await Exercise.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.json(updated)
  } catch (e) {
    res.status(400).json({error: e.message})
  }
})

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Exercise.findByIdAndDelete(req.params.id)
    res.json({success: true})
  } catch (e) {
    res.status(500).json({error: e.message})
  }
})

export default router
