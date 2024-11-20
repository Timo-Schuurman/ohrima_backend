const checkApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === process.env.API_KEY) {
        next(); 
    } else {
        res.status(403).json({ error: 'Forbidden: Invalid API Key' });
    }
};

module.exports = checkApiKey;