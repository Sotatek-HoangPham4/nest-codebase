// A comprehensive permission seed file grouped by resource.
// This file returns an array of permission definitions ready to be inserted into DB.
// You can call this during bootstrap or run as a migration/seed job.

export const PERMISSIONS = [
  // Course-related actions
  {
    code: 'course.create',
    description: 'Create a new course',
    group: 'course',
  },
  { code: 'course.update', description: 'Update a course', group: 'course' },
  { code: 'course.delete', description: 'Delete a course', group: 'course' },
  { code: 'course.publish', description: 'Publish a course', group: 'course' },
  {
    code: 'course.unpublish',
    description: 'Unpublish a course',
    group: 'course',
  },
  {
    code: 'course.comment',
    description: 'Comment on a course',
    group: 'course',
  },
  { code: 'course.view', description: 'View course content', group: 'course' },

  // Trade-related actions
  {
    code: 'trade.open_position',
    description: 'Open a new trade position',
    group: 'trade',
  },
  {
    code: 'trade.close_position',
    description: 'Close an existing position',
    group: 'trade',
  },
  {
    code: 'trade.cancel_order',
    description: 'Cancel trade order',
    group: 'trade',
  },
  {
    code: 'trade.view_history',
    description: 'View trading history',
    group: 'trade',
  },

  // Strategy-related actions
  {
    code: 'strategy.upload',
    description: 'Upload a trading strategy',
    group: 'strategy',
  },
  { code: 'strategy.run', description: 'Run strategy live', group: 'strategy' },
  {
    code: 'strategy.backtest',
    description: 'Backtest a strategy',
    group: 'strategy',
  },
  {
    code: 'strategy.delete',
    description: 'Delete a strategy',
    group: 'strategy',
  },

  // User management
  { code: 'user.create', description: 'Create user account', group: 'user' },
  { code: 'user.update', description: 'Update user profile', group: 'user' },
  { code: 'user.delete', description: 'Delete user account', group: 'user' },
  { code: 'user.view', description: 'View user profile', group: 'user' },

  // Admin/system
  {
    code: 'admin.dashboard.view',
    description: 'View admin dashboard',
    group: 'admin',
  },
  {
    code: 'admin.settings.update',
    description: 'Update system settings',
    group: 'admin',
  },

  // Examples for Mentor/Content
  {
    code: 'mentor.create_live',
    description: 'Start a live session',
    group: 'mentor',
  },
  {
    code: 'mentor.create_course',
    description: 'Create course (mentor)',
    group: 'mentor',
  },

  // Guest
  { code: 'guest.view_demo', description: 'View demo content', group: 'guest' },

  // Additional fine-grained perms (examples)
  { code: 'comment.create', description: 'Create comment', group: 'comment' },
  { code: 'comment.delete', description: 'Delete comment', group: 'comment' },

  // Monitoring / logs
  { code: 'logs.view', description: 'View system logs', group: 'monitoring' },
];

// Example usage: a bootstrap seeder that injects PermissionRepository and create or ignore if exists.
