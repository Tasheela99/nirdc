const TeamMember = require('../schemas/TeamMemberSchema');
const cacheService = require('../services/CacheService');
const logger = require('../utils/LoggerUtil');
const { uploadFileToAws, getFileUrlFromAws, awsFolderNames } = require('../utils/FileUploadAwsUtil');

const parseJsonIfNeeded = (val) => {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch (_) { return val; }
  }
  return val;
};

// GET /api/v1/about/team
const getAllTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      message: 'Team members fetched successfully',
      count: members.length,
      data: members
    });
  } catch (error) {
    logger.error('Error fetching team members:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch team members',
      error: error.message
    });
  }
};

// GET /api/v1/about/team/admin/all
const getAllTeamMembersAdmin = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      status: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    logger.error('Error fetching admin team members:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch team members',
      error: error.message
    });
  }
};

// POST /api/v1/about/team
const createTeamMember = async (req, res) => {
  try {
    let {
      name,
      role,
      division,
      bio,
      initials,
      color,
      image,
      phone,
      email,
      linkedin,
      badge,
      order,
      isActive
    } = req.body;

    name = parseJsonIfNeeded(name);
    role = parseJsonIfNeeded(role);
    division = parseJsonIfNeeded(division);
    bio = parseJsonIfNeeded(bio);
    badge = parseJsonIfNeeded(badge);

    // Process photo upload if provided
    if (req.files && (req.files.image || req.files.file || req.files.avatar)) {
      const file = req.files.image || req.files.file || req.files.avatar;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/team_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      image = getFileUrlFromAws(fileName);
    }

    if (!name || !role || !bio) {
      return res.status(400).json({
        status: false,
        message: 'Name, role, and bio are required.'
      });
    }

    if (order === undefined) {
      const count = await TeamMember.countDocuments();
      order = count;
    }

    // Auto-generate initials if missing
    let initialsVal = initials;
    if (!initialsVal && name && name.en) {
      const parts = name.en.trim().split(' ').filter(p => !p.startsWith('Dr.') && !p.startsWith('Prof.') && !p.startsWith('Mr.') && !p.startsWith('Ms.') && !p.startsWith('Eng.') && !p.startsWith('Attorney'));
      initialsVal = parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
    }

    const member = new TeamMember({
      name,
      role,
      division,
      bio,
      initials: initialsVal || 'TM',
      color: color || 'from-purple-600 to-pink-600',
      image: image || null,
      phone: phone || '',
      email: email || '',
      linkedin: linkedin || '',
      badge,
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    await member.save();
    await cacheService.clearPattern('about_*');

    return res.status(201).json({
      status: true,
      message: 'Team member created successfully',
      data: member
    });
  } catch (error) {
    logger.error('Error creating team member:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to create team member',
      error: error.message
    });
  }
};

// PUT /api/v1/about/team/:id
const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      name,
      role,
      division,
      bio,
      initials,
      color,
      image,
      phone,
      email,
      linkedin,
      badge,
      order,
      isActive
    } = req.body;

    const member = await TeamMember.findById(id);
    if (!member) {
      return res.status(404).json({
        status: false,
        message: 'Team member not found'
      });
    }

    if (name !== undefined) member.name = parseJsonIfNeeded(name);
    if (role !== undefined) member.role = parseJsonIfNeeded(role);
    if (division !== undefined) member.division = parseJsonIfNeeded(division);
    if (bio !== undefined) member.bio = parseJsonIfNeeded(bio);
    if (initials !== undefined) member.initials = initials;
    if (color !== undefined) member.color = color;
    if (req.files && (req.files.image || req.files.file || req.files.avatar)) {
      const file = req.files.image || req.files.file || req.files.avatar;
      const folder = awsFolderNames.resource || 'about';
      const fileName = `${folder}/team_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await uploadFileToAws(fileName, file.tempFilePath);
      member.image = getFileUrlFromAws(fileName);
    } else if (image !== undefined) {
      member.image = image;
    }
    if (phone !== undefined) member.phone = phone;
    if (email !== undefined) member.email = email;
    if (linkedin !== undefined) member.linkedin = linkedin;
    if (badge !== undefined) member.badge = parseJsonIfNeeded(badge);
    if (order !== undefined) member.order = Number(order);
    if (isActive !== undefined) member.isActive = isActive;

    await member.save();
    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Team member updated successfully',
      data: member
    });
  } catch (error) {
    logger.error('Error updating team member:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to update team member',
      error: error.message
    });
  }
};

// DELETE /api/v1/about/team/:id
const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TeamMember.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Team member not found'
      });
    }

    await cacheService.clearPattern('about_*');

    return res.status(200).json({
      status: true,
      message: 'Team member deleted successfully',
      data: deleted
    });
  } catch (error) {
    logger.error('Error deleting team member:', { error: error.message });
    return res.status(500).json({
      status: false,
      message: 'Failed to delete team member',
      error: error.message
    });
  }
};

module.exports = {
  getAllTeamMembers,
  getAllTeamMembersAdmin,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
};
