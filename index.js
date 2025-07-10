const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const PORT = 4000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('form');
});


app.post('/generate-pdf', (req, res) => {
    const formData = req.body;

    ejs.renderFile(path.join(__dirname, 'views/template.ejs'), formData, (err, html) => {
        if (err) {
            return res.status(500).send('Template rendering error');
        }

        pdf.create(html).toBuffer((err, buffer) => {
            if (err) {
                return res.status(500).send('PDF generation failed');
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=sale-deed.pdf');
            res.send(buffer);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
