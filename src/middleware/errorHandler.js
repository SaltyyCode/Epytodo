function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    console.error(err);

    if (err.type === 'no-token') {
        res.status(401).json({ msg: "No token, authorization denied" });
    } else if (err.type === 'invalid-token') {
        res.status(401).json({ msg: "Token is not valid" });
    } else if (err.type === 'not-found') {
        res.status(404).json({ msg: "Not found" });
    } else if (err.type === 'bad-request') {
        res.status(400).json({ msg: "Bad parameter" });
    } else {
        res.status(500).json({ msg: "Internal server error" });
    }
}

module.exports = errorHandler;
