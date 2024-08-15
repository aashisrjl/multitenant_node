const express = require('express')
const { createOrganization, renderCreateOrganization, createPayment } = require('../../controller/organization/organizationController')
const { isAuthenticated } = require('../../middleware/isAuthenticated')
const router = express.Router()

router.route('/createOrganization').post(isAuthenticated,createOrganization)
router.route('/createPayment').post(isAuthenticated,createPayment)


module.exports = router