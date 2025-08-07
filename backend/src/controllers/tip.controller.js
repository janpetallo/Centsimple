const { generateTaxTip } = require('../services/ai.service');

async function generateTip(req, res) {
  const { description, categoryName } = req.body;

  try {
    const tip = await generateTaxTip(description, categoryName);
    res.status(200).json({
      tip: tip,
    });
  } catch (error) {
    console.error('Error generating tax tip:', error);
    res
      .status(500)
      .json({ message: 'Could not generate tax tip. Please try again.' });
  }
}

module.exports = {
  generateTip,
};
