import bcrypt from "bcrypt";
import { signJwtUser, verifyJwtUser } from "../authorization.js";
import { User } from "../models/userModel.js";

/*
    FOR EVERY REQUEST THAT IS MADE ON A PROTECTED ROUTE 
    USER DATA IS DECIPHERED FROM BEARER TOKEN
    AND CAN BE ACCESSED WITH:
    req.app.locals.user
*/

const userProjection = {
    _id: 0,
    name: 1,
    surname: 1,
    email: 1,
    //tasks: 1
}

function checkForBearer(req, res, next) {
    let header = req.header("Authorization");
    if (header !== null && header !== undefined) {
        if (header.startsWith("Bearer ")) {
            let token = header.substring(7);
            if (token !== null && token !== undefined) {
                verifyJwtUser(token).then((payload) => {
                    req.app.locals.user = payload.user;
                    next();
                }).catch(err => res.sendStatus(403));
            } else res.sendStatus(403)
        } else res.sendStatus(403)
    } else res.sendStatus(403)
}

function register(req, res) {
    var body = req.body;
    User.findOne({ email: body.email }).then((user) => {
        if (user !== null && user !== undefined) res.sendStatus(403)
        else {
            const user = new User({
                name: body.name,
                surname: body.surname,
                email: body.email,
                password: body.password
            });
            user.save().then(newUser => { //probably better to just manualy create json response instead of agreggate
                User.aggregate([
                    { $match: { _id: newUser._id } },
                    { $project: userProjection }
                ]).then(user => res.status(200).json(user))
                    .catch(err => res.sendStatus(500));;
            }).catch(err => res.sendStatus(500));
        }
    }).catch(err => res.sendStatus(500));
}

function login(req, res) {
    var body = req.body;
    User.findOne({ email: body.email })
        .then(user => {
            if (user !== null && user !== undefined) {
                bcrypt.compare(body.password, user.password)
                    .then(result => {
                        if (result) {
                            signJwtUser(user)
                                .then(token => {
                                    User.aggregate([
                                        { $match: { _id: user._id } },
                                        { $project: userProjection }
                                    ]).then(userData => res.status(200).json({ user: userData, token: token }))
                                        .catch(err => res.sendStatus(500));
                                }).catch(err => res.sendStatus(500));
                        } else res.sendStatus(401);
                    }).catch(err => res.sendStatus(500));
            } else res.sendStatus(404)
        }).catch(err => res.sendStatus(500));
}

export { register, login, checkForBearer }