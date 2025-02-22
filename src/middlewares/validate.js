const { body, validationResult } = require("express-validator");

exports.validateTask = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),
  //date format should be in YYYY-MM-DD
  body("dueDate").isISO8601().withMessage("Invalid date format"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
