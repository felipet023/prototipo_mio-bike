const AppError = require('../utils/AppError');

function errorHandler(error, req, res, next) {
    if (error instanceof AppError) {
        return res.status(error.status).json({
            ok: false,
            message: error.message
        });
    }

    if (error && /CORS|not allowed/i.test(error.message || '')) {
        return res.status(403).json({
            ok: false,
            message: 'Origen no permitido por CORS'
        });
    }

    if (process.env.NODE_ENV !== 'production') {
        console.error(error);
    }

    res.status(500).json({
        ok: false,
        message: 'Error interno del servidor'
    });
}

module.exports = errorHandler;
