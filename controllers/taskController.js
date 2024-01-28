import { User } from "../models/userModel.js";
import { Task } from "../models/taskModel.js";

const validParams = {
    //"task": ["DailyTask", "RegularTask", "SpecialTask"],
    "status": ["0", "1", "2", "3"],
    "length": ["true", "false"],
    "sort": ["title", "status", "date"],
    "sortOrder": ["asc", "desc"],
    "date": ["YYYY-MM-DD,YYYY-MM-DDT23:59:59"],
    //"completedOn":["YYYY-MM-DD,YYYY-MM-DDT23:59:59"]
}

function checkQueryParams(req, res, next) {
    let stopped = false;
    for (let query in req.query) {
        if (validParams[query] !== undefined) {
            if (query === "date") continue; //TODO check if its right type
            else if (!validParams[query].includes(req.query[query]))
                stopped = true;
        }
        else stopped = true;
    }
    if (stopped) res.sendStatus(403);
    else next();
}

function createTask(req, res) {
    let task = req.body;
    let user = req.app.locals.user;
    let newTask = new Task({
        title: task.title,
        description: task.description,
        date: task.date
    });
    /*if (task.type == taskType.REGULAR) {
        newTask = new RegularTask({
            title: task.title,
            description: task.description,
            date: task.date
        });
    } else if (task.type == taskType.DAILY) {
        newTask = new DailyTask({
            title: task.title,
            description: task.description,
            exclude: JSON.parse(task.exclude),
            time: task.time
        });
    } else {
        newTask = new SpecialTask({
            title: task.title,
            description: task.description,
            date: task.date,
            warnDate: task.warnDate
        });
    }*/
    User.findOne({ _id: user._id }).then((user) => {
        if (user !== null && user !== undefined) {
            user.tasks.push(newTask._id);
            user.save().then(user => {
                newTask.save().then(task => {
                    res.status(200).json(task)
                }).catch(err => res.sendStatus(500));
            }).catch(err => res.sendStatus(500));
        } else res.sendStatus(404)
    }).catch(err => res.sendStatus(500));
}

//TASK GETTERS
function getTasks(req, res) {
    let user = req.app.locals.user;
    let date = req.query.date ? req.query.date.split(',') : '';
    //TODO date requires to be paired with Special or Regular task!
    let query = {
        //...(req.query.task ? { task: req.query.task } : {}),
        ...(req.query.status ? { status: req.query.status } : {}),
        ...(req.query.date ? {
            date: {
                $gte: date[0],
                $lte: (date[1])
            }
        } : {}),
    }
    console.log(query);
    let sortQuery = {
        ...(req.query.sort ? { [req.query.sort]: req.query.sortOrder ? req.query.sortOrder : "asc" } : {})
    }
    User.findOne({ _id: user._id }).then(user => {
        Task.find({ _id: { $in: user.tasks }, ...query })
            .sort(sortQuery)
            .catch(err => { console.log(err); res.sendStatus(500) })
            .then((tasks) => {
                if (tasks !== null && user !== undefined) {
                    if (req.query.length === "true") {
                        res.status(200).json({ num: tasks.length });
                    } else {
                        res.status(200).json(tasks);
                    }
                }
                else res.sendStatus(404)
            }).catch(err => { console.log(err); res.sendStatus(500) })
    }).catch(err => { console.log(err); res.sendStatus(500) });
}


export { createTask, getTasks, checkQueryParams }