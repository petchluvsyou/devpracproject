const express = require("express");
const {
  getProviders,
  getProvider,
  createProvider,
  updateProvider,
  deleteProvider,
} = require("../controllers/providers");

// Include other resource routers
const BookingRouter = require("./Bookings");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers
router.use("/:ProviderId/Bookings/", BookingRouter);

router
  .route("/")
  .get(getProviders)
  .post(protect, authorize("admin"), createProvider);
router
  .route("/:id")
  .get(getProvider)
  .put(protect, authorize("admin"), updateProvider)
  .delete(protect, authorize("admin"), deleteProvider);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Provider:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the Provider
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         ลําดบั:
 *           type: string
 *           description: Ordinal number
 *         name:
 *           type: string
 *           description: Provider name
 *         address:
 *           type: string
 *           description: House No., Street, Road
 *         district:
 *           type: string
 *           description: District
 *         province:
 *           type: string
 *           description: province
 *         postalcode:
 *           type: string
 *           description: 5-digit postal code
 *         tel:
 *           type: string
 *           description: telephone number
 *         region:
 *           type: string
 *           description: region
 *       example:
 *         id: 609bda561452242d88d36e37
 *         ลําดบั: )*)
 *         name: Happy Provider
 *         address: 121 ถ.สขุมุวิท
 *         district: บางนา
 *         province: กรุงเทพมหานคร
 *         postalcode: 10110
 *         tel: 02-2187000
 *         region: กรุงเทพมหานคร (Bangkok)
 */

/**
 * @swagger
 * tags:
 *   name: Providers
 *   description: The Providers managing API
 */

/**
 * @swagger
 * /Providers:
 *   get:
 *     summary: Returns the list of all the Providers
 *     tags: [Providers]
 *     responses:
 *       200:
 *         description: The list of the Providers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Provider'
 */

/**
 * @swagger
 * /Providers/{id}:
 *   get:
 *     summary: Get the Provider by id
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Provider id
 *     responses:
 *       200:
 *         description: The Provider description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Provider'
 *       404:
 *         description: The Provider was not found
 */

/**
 * @swagger
 * /Providers:
 *   post:
 *     summary: Create a new Provider
 *     tags: [Providers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Provider'
 *     responses:
 *       201:
 *         description: The Provider was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Provider'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /Providers/{id}:
 *  put:
 *    summary: Update the Provider by the id
 *    tags: [Providers]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Provider id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Provider'
 *    responses:
 *      200:
 *        description: The Provider was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Provider'
 *      404:
 *        description: The Provider was not found
 *      500:
 *        description: Some error happened
 */

/**
 * @swagger
 * /Providers/{id}:
 *   delete:
 *     summary: Remove the Provider by id
 *     tags: [Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Provider id
 *     responses:
 *       200:
 *         description: The Provider was deleted
 *       404:
 *         description: The Provider was not found
 */
