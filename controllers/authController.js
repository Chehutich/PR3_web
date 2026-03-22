import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

export const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        const candidate = await User.findOne({ email });
        if (candidate) {
            return res.status(400).json({ message: 'Користувач з таким email вже існує' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            email,
            password: hashedPassword,
            role: role || 'User'
        });
        
        await user.save();
        res.status(201).json({ message: 'Користувача створено успішно' });
        
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Помилка при реєстрації' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Користувача не знайдено' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Невірний пароль' });
        }
        
        req.session.user = { id: user._id, email: user.email, role: user.role };
        res.json({ message: 'Вхід виконано успішно', user: req.session.user });
        
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Помилка при вході' });
    }
};
