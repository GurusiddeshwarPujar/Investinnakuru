const verifyRecaptcha = async (req, res, next) => {
    const { recaptchaToken } = req.body;
    const secretKey = process.env.RECAPTCHA_V3_SECRET_KEY;

    if (!recaptchaToken) {
        return res.status(400).json({ msg: 'reCAPTCHA token is required.' });
    }

    try {
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify`;
        
        // Use node-fetch (requires Node.js 18+)
        const response = await fetch(verificationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${secretKey}&response=${recaptchaToken}`,
        });

        const data = await response.json();

        // Check for success and a reasonable score (0.5 is a common threshold)
        if (data.success && data.score >= 0.5) {
            // Token is valid, proceed to the next middleware/controller
            next();
        } else {
            console.warn('reCAPTCHA verification failed:', data['error-codes']);
            return res.status(403).json({ msg: 'Failed reCAPTCHA verification. You might be a bot.' });
        }
    } catch (error) {
        console.error('reCAPTCHA verification error:', error.message);
        return res.status(500).send('Error verifying reCAPTCHA.');
    }
};

module.exports = verifyRecaptcha;