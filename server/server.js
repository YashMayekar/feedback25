const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');

const app = express();
const port = 3000;

// Middleware for parsing JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to handle form submission
app.post('/submit', async (req, res) => {
    try {
        const feedbackData = req.body;

        // Open the Excel file (or create if it doesn't exist)
        const workbook = new ExcelJS.Workbook();
        try {
            await workbook.xlsx.readFile('./server/feedback.xlsx');
        } catch {
            const sheet = workbook.addWorksheet('Feedback');
            sheet.addRow(['Name', 'Email', 'Phone', 'Question 1', 'Detailed Answer']);
        }

        const worksheet = workbook.getWorksheet(1);
        const row = [
            feedbackData.name,
            feedbackData.email,
            feedbackData.phone,
            feedbackData.question1,
            feedbackData.detailedAnswer,
        ];
        worksheet.addRow(row);

        // Save the data to feedback.xlsx
        await workbook.xlsx.writeFile('./server/feedback.xlsx');

        res.send("Feedback submitted successfully!");
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).send("An error occurred while submitting feedback.");
    }
});

// Catch-all to serve React's index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
