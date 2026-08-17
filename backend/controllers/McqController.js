const Mcq = require('../schemas/McqSchema');

const createMcq = async (req, res) => {
    try {
        const { questionText, options, correctOptionIndex } = req.body;

        if (!questionText || !options || options.length !== 4 || correctOptionIndex === undefined) {
            return res.status(400).json({ message: 'Invalid MCQ data' });
        }

        const newMcq = new Mcq({
            questionText,
            options,
            correctOptionIndex
        });

        await newMcq.save();
        return res.status(201).json({ message: 'MCQ created successfully', data: newMcq });
    } catch (error) {
        console.error('Error creating MCQ:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getAllMcqs = async (req, res) => {
    try {
        const mcqs = await Mcq.find().sort({ createdAt: -1 });
        return res.status(200).json({ data: mcqs });
    } catch (error) {
        console.error('Error getting all MCQs:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateMcq = async (req, res) => {
    try {
        const { id } = req.params;
        const { questionText, options, correctOptionIndex } = req.body;

        if (!questionText || !options || options.length !== 4 || correctOptionIndex === undefined) {
            return res.status(400).json({ message: 'Invalid MCQ data' });
        }

        const updatedMcq = await Mcq.findByIdAndUpdate(
            id,
            { questionText, options, correctOptionIndex },
            { new: true, runValidators: true }
        );

        if (!updatedMcq) {
            return res.status(404).json({ message: 'MCQ not found' });
        }

        return res.status(200).json({ message: 'MCQ updated successfully', data: updatedMcq });
    } catch (error) {
        console.error('Error updating MCQ:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteMcq = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMcq = await Mcq.findByIdAndDelete(id);

        if (!deletedMcq) {
            return res.status(404).json({ message: 'MCQ not found' });
        }

        return res.status(200).json({ message: 'MCQ deleted successfully' });
    } catch (error) {
        console.error('Error deleting MCQ:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getRandomMcqs = async (req, res) => {
    try {
        // We need 10 random MCQs
        const mcqs = await Mcq.aggregate([
            { $sample: { size: 10 } }
        ]);
        return res.status(200).json({ data: mcqs });
    } catch (error) {
        console.error('Error getting random MCQs:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    createMcq,
    getAllMcqs,
    updateMcq,
    deleteMcq,
    getRandomMcqs
};
