const Content = require('../models/Content');

exports.createContent = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newContent = new Content({
      title,
      description,
      createdBy: req.user.id,
    });
    await newContent.save();
    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getContentList = async (req, res) => {
  try {
    let contents;
    if (req.user.role === 'admin') {
      contents = await Content.find().populate('createdBy', 'email');
    } else {
      contents = await Content.find({ createdBy: req.user.id });
    }
    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.contentstats = async(req,res)=>{
    try {
    const total = await Content.countDocuments();
    const approved = await Content.countDocuments({ status: 'approved' });
    const pending = await Content.countDocuments({ status: 'pending' });
    const rejected = await Content.countDocuments({ status: 'rejected' });
    res.json({ total, approved, pending, rejected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.search = async(req,res)=>{
    try {
    const { status, keyword } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    const results = await Content.find(filter).populate('createdBy', 'email');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.recent = async(req,res)=>{
    try {
    const recent = await Content.find({
      status: { $in: ['approved', 'rejected'] }
    })
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate('createdBy', 'email');

    res.json(recent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};