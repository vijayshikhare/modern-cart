const Joi = require('joi')

const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })

  const { error } = schema.validate(req.body)
  if (error) return res.status(400).json({ msg: error.details[0].message })
  next()
}

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

  const { error } = schema.validate(req.body)
  if (error) return res.status(400).json({ msg: error.details[0].message })
  next()
}

module.exports = { validateRegister, validateLogin }