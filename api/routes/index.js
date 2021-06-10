import express from 'express';
import { ListAll } from '../actions/ListAll';
import { PickRandom } from '../actions/PickRandom';
import { StartOver } from '../actions/ResetDb';
import { SaveSupport } from '../actions/SaveSupport';
import { UpdateShifts } from '../actions/UpdateShifts';

const router = express.Router();

const myMid = (req, res, next) => {
    // Validate some http auth or jwt or smth - in the real world
    // We will just validate everyting by default
    if (1 == 1) {
        next();
    } else {
        return res.status(404).json({ msg: 'nok', statusCode: 404 });
    }
}

const customThrowHandler = (error) => {
    return {
        context: 'api',
        status: 0,
        msg: error.message,
    };
}

router.get('/engineers', myMid, async (req, res) => {
    try {
        let result = {};
            result.data = await ListAll();
            result.status = 1;

        res.status(200).json(result);

    } catch(e) {
        res.status(500).json(customThrowHandler(e));
    }
})

router.post('/random', myMid, async (req, res) => {
    try {
        let result = {};
            result.data = await PickRandom(req.body.supportDay || null);
            result.status = 1;

        res.status(200).json(result);

    } catch(e) {
        res.status(500).json(customThrowHandler(e));
    }
})

router.post('/save', myMid, async (req, res) => {
    try {
        let result = {};
            result.data = await SaveSupport(req.body.rows || null, req.body.supportDay || null);
            result.status = 1;

        res.status(200).json(result);

    } catch(e) {
        res.status(500).json(customThrowHandler(e));
    }
})

router.post('/update-shifts', myMid, async (req, res) => {
    try {
        let result = {};
            result.data = await UpdateShifts(req.body.supportDay || null) || null;
            result.status = 1;

        res.status(200).json(result);

    } catch(e) {
        res.status(500).json(customThrowHandler(e));
    }
})

router.post('/reset-db', myMid, async (req, res) => {
    try {
        let result = {};
            result.data = await StartOver();
            result.status = 1;

        res.status(200).json(result);

    } catch(e) {
        res.status(500).json(customThrowHandler(e));
    }
})

export default router;