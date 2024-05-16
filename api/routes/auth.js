import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

//* REGISTER
router.post('/register', async (req, res, next) => {
   try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const user = new User({
         username: req.body.username,
         email: req.body.email,
         password: hash,
      });
      await user.save();

      res.status(201).json(user)
   } catch (err) {
      res.status(400).json(err)
   }
})

//* LOGIN
router.post('/login', async (req, res, next) => {
   try {
      // find user
      const user = await User.findOne({ username: req.body.username })
      if (!user) return res.status(400).json('Користувача не знайдено');
      
      // compare password
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(400).json('Неправильний пароль');

      res.status(200).json(user._doc)
   } catch (err) {
      res.status(400).json(err)
   }
})

export default router;