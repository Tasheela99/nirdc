const express = require('express');
const router = express.Router();
const authorized = require('../middleware/AuthMiddleware');
const cacheMiddleware = require('../middleware/CacheMiddleware');

// Controllers
const IntroductionController = require('../controllers/IntroductionController');
const DirectorMessageController = require('../controllers/DirectorMessageController');
const HistoryMilestoneController = require('../controllers/HistoryMilestoneController');
const CoreValueController = require('../controllers/CoreValueController');
const ObjectiveController = require('../controllers/ObjectiveController');
const ResponsibilityController = require('../controllers/ResponsibilityController');
const FunctionServiceController = require('../controllers/FunctionServiceController');
const TeamMemberController = require('../controllers/TeamMemberController');
const OrganizationalStructureController = require('../controllers/OrganizationalStructureController');
const AboutNavConfigController = require('../controllers/AboutNavConfigController');

const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR'];
const { uploadFileToAws, getFileUrlFromAws, awsFolderNames } = require('../utils/FileUploadAwsUtil');
const logger = require('../utils/LoggerUtil');

/* -------------------------------------------------------------
 * 0. MEDIA / ICON UPLOAD ENDPOINT
 * POST /api/v1/about/upload
 * ------------------------------------------------------------- */
router.post('/upload', authorized(adminRoles), async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        status: false,
        message: 'No file was uploaded.'
      });
    }

    const file = req.files.file || req.files.image || req.files.icon || Object.values(req.files)[0];
    const folder = awsFolderNames.resource || 'about';
    const subfolder = req.body.subfolder ? `${req.body.subfolder}/` : '';
    const fileName = `${folder}/${subfolder}about_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    await uploadFileToAws(fileName, file.tempFilePath);
    const url = getFileUrlFromAws(fileName);

    return res.status(200).json({
      status: true,
      message: 'File uploaded successfully',
      url
    });
  } catch (error) {
    logger.error('Error in about media upload:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'File upload failed',
      error: error.message
    });
  }
});

/* -------------------------------------------------------------
 * 1. INTRODUCTION (Singleton: 1 active record)
 * ------------------------------------------------------------- */
router.get('/introduction', cacheMiddleware(300, 'about_intro'), IntroductionController.getIntroduction);
router.post('/introduction', authorized(adminRoles), IntroductionController.saveIntroduction);
router.put('/introduction/:id', authorized(adminRoles), IntroductionController.updateIntroduction);

/* -------------------------------------------------------------
 * 2. DIRECTOR MESSAGE (Singleton: 1 active record)
 * ------------------------------------------------------------- */
router.get('/director-message', cacheMiddleware(300, 'about_dir_msg'), DirectorMessageController.getDirectorMessage);
router.post('/director-message', authorized(adminRoles), DirectorMessageController.saveDirectorMessage);
router.put('/director-message/:id', authorized(adminRoles), DirectorMessageController.updateDirectorMessage);

/* -------------------------------------------------------------
 * 3. HISTORY MILESTONES (Multi-item collection)
 * ------------------------------------------------------------- */
router.get('/history', cacheMiddleware(300, 'about_history'), HistoryMilestoneController.getAllMilestones);
router.get('/history/all', authorized(adminRoles), HistoryMilestoneController.getAllMilestonesAdmin);
router.post('/history', authorized(adminRoles), HistoryMilestoneController.createMilestone);
router.put('/history/:id', authorized(adminRoles), HistoryMilestoneController.updateMilestone);
router.delete('/history/:id', authorized(adminRoles), HistoryMilestoneController.deleteMilestone);

/* -------------------------------------------------------------
 * 4. CORE VALUES (Multi-item collection)
 * ------------------------------------------------------------- */
router.get('/values', cacheMiddleware(300, 'about_values'), CoreValueController.getAllCoreValues);
router.get('/values/all', authorized(adminRoles), CoreValueController.getAllCoreValuesAdmin);
router.post('/values', authorized(adminRoles), CoreValueController.createCoreValue);
router.put('/values/:id', authorized(adminRoles), CoreValueController.updateCoreValue);
router.delete('/values/:id', authorized(adminRoles), CoreValueController.deleteCoreValue);

/* -------------------------------------------------------------
 * 5. OBJECTIVES (Multi-item collection)
 * ------------------------------------------------------------- */
router.get('/objectives', cacheMiddleware(300, 'about_obj'), ObjectiveController.getAllObjectives);
router.get('/objectives/all', authorized(adminRoles), ObjectiveController.getAllObjectivesAdmin);
router.post('/objectives', authorized(adminRoles), ObjectiveController.createObjective);
router.put('/objectives/:id', authorized(adminRoles), ObjectiveController.updateObjective);
router.delete('/objectives/:id', authorized(adminRoles), ObjectiveController.deleteObjective);

/* -------------------------------------------------------------
 * 6. RESPONSIBILITIES (Multi-item collection)
 * ------------------------------------------------------------- */
router.get('/responsibilities', cacheMiddleware(300, 'about_resp'), ResponsibilityController.getAllResponsibilities);
router.get('/responsibilities/all', authorized(adminRoles), ResponsibilityController.getAllResponsibilitiesAdmin);
router.post('/responsibilities', authorized(adminRoles), ResponsibilityController.createResponsibility);
router.put('/responsibilities/:id', authorized(adminRoles), ResponsibilityController.updateResponsibility);
router.delete('/responsibilities/:id', authorized(adminRoles), ResponsibilityController.deleteResponsibility);

/* -------------------------------------------------------------
 * 7. FUNCTIONS & SERVICES (Multi-item collection)
 * ------------------------------------------------------------- */
router.get('/functions-services', cacheMiddleware(300, 'about_func'), FunctionServiceController.getAllFunctionServices);
router.get('/functions-services/all', authorized(adminRoles), FunctionServiceController.getAllFunctionServicesAdmin);
router.post('/functions-services', authorized(adminRoles), FunctionServiceController.createFunctionService);
router.put('/functions-services/:id', authorized(adminRoles), FunctionServiceController.updateFunctionService);
router.delete('/functions-services/:id', authorized(adminRoles), FunctionServiceController.deleteFunctionService);

/* -------------------------------------------------------------
 * 8. TEAM MEMBERS (Multi-item collection)
 * ------------------------------------------------------------- */
router.get('/team', cacheMiddleware(300, 'about_team'), TeamMemberController.getAllTeamMembers);
router.get('/team/all', authorized(adminRoles), TeamMemberController.getAllTeamMembersAdmin);
router.post('/team', authorized(adminRoles), TeamMemberController.createTeamMember);
router.put('/team/:id', authorized(adminRoles), TeamMemberController.updateTeamMember);
router.delete('/team/:id', authorized(adminRoles), TeamMemberController.deleteTeamMember);

/* -------------------------------------------------------------
 * 9. ORGANIZATIONAL STRUCTURE (Multi-item collection)
 * ------------------------------------------------------------- */
router.get('/organizational-structure', cacheMiddleware(300, 'about_org'), OrganizationalStructureController.getAllDivisions);
router.get('/organizational-structure/all', authorized(adminRoles), OrganizationalStructureController.getAllDivisionsAdmin);
router.post('/organizational-structure', authorized(adminRoles), OrganizationalStructureController.createDivision);
router.put('/organizational-structure/:id', authorized(adminRoles), OrganizationalStructureController.updateDivision);
router.delete('/organizational-structure/:id', authorized(adminRoles), OrganizationalStructureController.deleteDivision);

/* -------------------------------------------------------------
 * 10. NAVIGATION VISIBILITY CONFIG
 * ------------------------------------------------------------- */
router.get('/nav-config', cacheMiddleware(300, 'about_nav'), AboutNavConfigController.getNavConfig);
router.put('/nav-config', authorized(adminRoles), AboutNavConfigController.updateNavConfig);

module.exports = router;

