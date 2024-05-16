import express from 'express';
import Tender from '../models/Tender.js';
import multer from 'multer';
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import firebaseCredentials from '../config/firebase.js';
const router = express.Router();

// handle image upload with multer and firebase
const upload = multer({ storage: multer.memoryStorage()}) //? storing files in buffer
initializeApp(firebaseCredentials);
const storage = getStorage();

////////////////////////////////////////////////////////////////////////////
// CREATE
router.post('/', upload.single('tenderImg'), async(req, res) => {
   try {
      if (req.file) {
         const storageRef = ref(storage, `tenders/${req.file.originalname} ${new Date().toLocaleString()}`)
         const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, { contentType: req.file.mimetype })
         const URL = await getDownloadURL(snapshot.ref)
   
         const tender = new Tender({
            ...req.body,
            dateEnd: new Date(req.body.dateEnd),
            logo: URL,
         })
         await tender.save()
         res.json(tender)
      } else {
         const tender = new Tender({ ...req.body, dateEnd: new Date(req.body.dateEnd) })
         await tender.save()
         res.json(tender)
      }
   } catch(err) {
      res.status(400).json(err)
   }
})

// UPDATE
router.put('/id/:id', upload.single('logoImg'), async(req, res) => {
   try {
      if (req.file) {
         const storageRef = ref(storage, `tenders/${req.file.originalname} ${new Date().toLocaleString()}`)
         const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, { contentType: req.file.mimetype })
         const URL = await getDownloadURL(snapshot.ref)
         const tender = await Tender.findByIdAndUpdate(req.params.id, { $set: {
            ...req.body,
            logo: URL
         } }, {new: true})
         res.json(tender)
      } else {
         const tender = await Tender.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true})
         res.json(tender)
      }
   } catch(err) {
      res.status(400).json(err)
   }
})

// GET
router.get('/', async (req, res) => {
   const { owner, ...others } = req.query
   try {
      const tenders = await Tender.find(owner ? { owner } : null)
      res.json(tenders)
   } catch(err) {
      res.status(400).json(err)
   }
})

// SEARCH BY WORD
router.get('/:word', async (req, res) => {
   try {
      const tenders = await Tender.find({ $text: { $search: req.params.word }})
      res.json(tenders)
   } catch (err) {
      res.status(400).json(err)
   }
})

// GET BY ID
router.get('/id/:id', async(req, res) => {
   try {
      const tender = await Tender.findById(req.params.id)
      res.json(tender)
   } catch(err) {
      res.status(400).json(err)
   }
})

// DELETE
router.delete('/id/:id', async(req, res) => {
   try {
      await Tender.findByIdAndDelete(req.params.id)
      res.json('Deleted')
   } catch(err) {
      res.status(400).json(err)
   }
})

export default router;