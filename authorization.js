import jwt from "jsonwebtoken";

function signJwtUser(user) {
    return new Promise((resolved, rejected) => {
        const private_key = process.env.RSA_PRIV;
        let payload = {
            user: {
                name: user.name,
                surname: user.surname,
                email: user.email,
                _id: user._id
            }
        };
        jwt.sign(payload, private_key, {
            algorithm: 'RS256',
            expiresIn: 60 * 60 * 24,    //1 day
            audience: 'TaskWebsiteFrontEnd',
            issuer: 'TaskWebsiteBackEndApi',
            subject: user.email     //user email
        }, (err, token) => {
            if (err) rejected(err)
            else resolved(token)
        });
    })
}

function verifyJwtUser(token) {
    return new Promise((resolved, rejected) => {
        const public_key = process.env.RSA_PUB;
        jwt.verify(token, public_key, {
            algorithms: ['RS256'],
            audience: 'TaskWebsiteFrontEnd',
            issuer: 'TaskWebsiteBackEndApi',
        }, (err, payload) => {
            if (err) rejected(err)
            else resolved(payload)
        });
    })
}

export { signJwtUser, verifyJwtUser }