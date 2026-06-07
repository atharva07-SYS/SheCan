const Message = require('../models/Message');
const ActivityLog = require('../models/ActivityLog');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/analytics/stats
 * @access  Private (Admin)
 */
const getStats = async (req, res, next) => {
  try {
    // Get counts in parallel for performance
    const [
      totalMessages,
      newMessages,
      volunteerRequests,
      partnershipRequests,
      donationRequests,
      generalInquiries,
      resolvedMessages,
      statusBreakdown,
      categoryBreakdown,
    ] = await Promise.all([
      Message.countDocuments(),
      Message.countDocuments({ status: 'New' }),
      Message.countDocuments({ category: 'Volunteer' }),
      Message.countDocuments({ category: 'Partnership' }),
      Message.countDocuments({ category: 'Donation' }),
      Message.countDocuments({ category: 'General Inquiry' }),
      Message.countDocuments({ status: 'Resolved' }),
      Message.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
      ]),
      Message.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMessages,
        newMessages,
        volunteerRequests,
        partnershipRequests,
        donationRequests,
        generalInquiries,
        resolvedMessages,
        statusBreakdown,
        categoryBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get chart data (messages by month for last 12 months + category distribution)
 * @route   GET /api/analytics/chart
 * @access  Private (Admin)
 */
const getChartData = async (req, res, next) => {
  try {
    // Calculate date 12 months ago
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    // Aggregate messages by month for the last 12 months (area chart data)
    const monthlyData = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Format monthly data with readable month names
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    // Build a complete 12-month array (fill missing months with 0)
    const chartData = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 1-indexed

      const found = monthlyData.find(
        (d) => d._id.year === year && d._id.month === month
      );

      chartData.push({
        month: `${monthNames[month - 1]} ${year}`,
        count: found ? found.count : 0,
      });
    }

    // Category distribution for pie chart
    const categoryDistribution = await Message.aggregate([
      {
        $group: {
          _id: '$category',
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          name: '$_id',
          value: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthlyMessages: chartData,
        categoryDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recent activity logs
 * @route   GET /api/analytics/logs
 * @access  Private (Admin)
 */
const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find()
      .populate('performedBy', 'name email')
      .sort('-createdAt')
      .limit(50);

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getChartData, getActivityLogs };
