import express from 'express';
import Propos from '../models/Propos.js';
import Tender from '../models/Tender.js';
const router = express.Router();

// CREATE
router.post('/', async(req, res) => {
   try {
      const prop = new Propos(req.body)
      await prop.save()
      const tender = await Tender.findByIdAndUpdate(req.body.tenderId,
         { $push: { propositions: prop._id } }, {new: true})
      res.json(tender)
   } catch(err) {
      res.status(400).json(err)
   }
})

// GET
router.get('/', async (req, res) => {
   try {
      const tenders = await Propos.find(req.query)
      res.json(tenders)
   } catch(err) {
      res.status(400).json(err)
   }
})

// GET BY ID
router.get('/:id', async(req, res) => {
   try {
      const propos = await Propos.find({ tenderId: req.params.id })
      res.json(propos)
   } catch(err) {
      res.status(400).json(err)
   }
})

// UPDATE
router.put('/:id', async(req, res) => {
   try {
      const prop = await Propos.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true})
      res.json(prop)
   } catch(err) {
      res.status(400).json(err)
   }
})

// DELETE
router.delete('/:id', async(req, res) => {
   try {
      const prop = await Propos.findById(req.params.id)
      const tender = await Tender.findByIdAndUpdate(prop.tenderId,
         { $pull: { propositions: prop._id } }, {new: true})
         
      await Propos.findByIdAndDelete(req.params.id);
      res.json(tender)
   } catch(err) {
      res.status(400).json(err)
   }
})

export default router;