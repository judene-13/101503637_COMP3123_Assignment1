
const notFound = (req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
};

const errorHandler = (err, req, res, next) => {
    console.error('Application error:', err.message);

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            message: 'Invalid JSON format'
        });
    }

    res.status(500).json({
        message: 'Internal server error'
    });
};

module.exports = {
    notFound,
    errorHandler
};
