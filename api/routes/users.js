import express from 'express';
import User from '../models/User.js';
import multer from 'multer';
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import firebaseCredentials from '../config/firebase.js';
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage()}) //? storing files in buffer
initializeApp(firebaseCredentials);
const storage = getStorage();

////////////////////////////////////////////////////////////////////////////

router.get('/:id', async (req, res, next) => {
   try {
      const user = await User.findById(req.params.id)
      res.json(user)
   } catch(err) {
      res.status(404).json(err)
   }
});

router.post('/avatar', upload.single('userImg'), async (req, res, next) => {
   try {
      const storageRef = ref(storage, `tenders/${req.file.originalname} ${new Date().toLocaleString()}`)
      const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, { contentType: req.file.mimetype })
      const URL = await getDownloadURL(snapshot.ref)

      const user = await User.findByIdAndUpdate(req.body.id, { avatar: URL }, { new: true })
      res.json(user)
   } catch(err) {
      res.status(400).json(err)
   }
})

export default router;