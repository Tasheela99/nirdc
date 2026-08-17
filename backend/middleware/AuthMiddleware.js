const jwt = require('jsonwebtoken');

function authorized(allowedRoles = []) {
    return (req, res, next) => {

        const authorizedHeader = req.headers.authorization;

        if (!authorizedHeader) {
            return res.status(401).json({ status: false, label: 'NO_TOKEN', message: 'No token provided. Please sign in.' });
        }

        if (!authorizedHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: false, label: 'INVALID_TOKEN', message: 'Invalid token format.' });
        }

        const token = authorizedHeader.slice(7);
        if (!token) {
            return res.status(401).json({ status: false, label: 'INVALID_TOKEN', message: 'Invalid token.' });
        }

        try {
            const decodedData = jwt.verify(token, process.env.SECRET_KEY);

            // Check if user role is in the allowed roles
            if (allowedRoles.length && !allowedRoles.includes(decodedData.role)) {
                return res.status(403).json({ status: false, label: 'FORBIDDEN', message: 'You do not have permission to access this resource.' });
            }

            // Attach user data to the request object
            req.user = decodedData;
            next();
        } catch (error) {
            return res.status(401).json({ status: false, label: 'INVALID_TOKEN', message: 'Session expired. Please sign in again.' });
        }
    };
}

module.exports = authorized;
