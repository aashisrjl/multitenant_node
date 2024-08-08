const express = require('express')
const { createOrganization, renderCreateOrganization } = require('../../controller/organization/organizationController')
const { isAuthenticated } = require('../../middleware/isAuthenticated')
const router = express.Router()

router.route('/create').get().post(isAuthenticated,createOrganization)


module.exports = router