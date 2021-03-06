const Joi = require('joi');
const {validate} = require('../../../helpers/Validation');
const {gameSchema} = require('../gameModel');
const {findUserById} = require('../../user/interactors/index');

const gameDtoSchema = gameSchema.append({
    whiteName: Joi.string(),
    blackName: Joi.string(),
    whiteHasPicture: Joi.boolean(),
    blackHasPicture: Joi.boolean(),
})

const makeGameDto = async game => {
    const obj = {...game}
    if (!obj.whiteId) {
        obj.whiteName = "Robot"
        obj.whiteHasPicture = true
    }

    if (!obj.blackId) {
        obj.blackName = "Robot"
        obj.blackHasPicture = true
    }

    if (!obj.whiteName && obj.whiteId) {
        const white = await findUserById(obj.whiteId)
        obj.whiteName = white.username
        obj.whiteHasPicture = white.hasPicture
    }
    if (!obj.blackName && obj.blackId) {
        const black = await findUserById(obj.blackId)
        obj.blackName = black.username
        obj.blackHasPicture = black.hasPicture
    }
    return validate(gameDtoSchema, obj)
}

module.exports = {makeGameDto}