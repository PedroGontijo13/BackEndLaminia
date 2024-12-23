import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();
import Post from '../models/Post.js';

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já registrado.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: { id: savedUser._id, username: savedUser.username, email: savedUser.email },
        });
    }
    catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro ao registrar usuário.', error });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        const token = jwt.sign({ id: user._id }, 'secreta-chave', { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    }
    catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({ message: 'Erro ao realizar login.', error });
    }
});

router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'username email');
        res.status(200).json(posts);
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        res.status(500).json({ message: 'Erro ao buscar posts.', error });
    }
});

router.post('/posts', authenticate, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newPost = new Post({
            title,
            content,
            userId: req.user.id, 
        });

        const savedPost = await newPost.save();
        res.status(201).json({
            message: 'Post created successfully!',
            post: savedPost,
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post.', error });
    }
});

export default router;
