const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/apex-fit', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

const JWT_SECRET = 'apex_fit_super_secret_key';

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  isVerified: { type: Boolean, default: true }, //خليناها true مؤقتاً لتسهيل التجربة
  stats: {
    age: { type: Number, default: 23 },
    gender: { type: String, default: 'male' },
    weightKg: { type: Number, default: 75 }
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'البريد الإلكتروني مسجل مسبقاً' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash, isVerified: true });
    await user.save();

    res.status(201).json({ success: true, message: 'تم إنشاء الحساب بنجاح!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'خطأ في البريد أو كلمة المرور' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'خطأ في البريد أو كلمة المرور' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, stats: user.stats } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));