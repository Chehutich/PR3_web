// Middleware для перевірки авторизації (наявності активної сесії)
export const checkAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'Немає доступу. Необхідна авторизація.' });
    }
    next();
};

// Advanced: Middleware для перевірки ролей (чи роль користувача є в масиві дозволених)
export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Необхідна авторизація.' });
        }
        
        if (!allowedRoles.includes(req.session.user.role)) {
            return res.status(403).json({ message: 'Недостатньо прав для виконання цієї дії.' });
        }
        
        next();
    };
};
