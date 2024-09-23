const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(bodyParser.json());

app.post('/run-code', (req: any, res: any) => {
    let code = req.body.code;
    const lang = req.body.selectedLanguage;
    console.log('Selected Language: ', lang);
    console.log('Code received: ', code);
    code = code.replace(/"/g, '\\"');

    let command = "";

    switch (lang) {
        case "cpp":
            command = `echo "${code}" > code.cpp && g++ code.cpp -o code.out && ./code.out`;
            break;
        case "py":
            command = `echo "${code}" > code.py && python3 code.py`;
            break;
        case "js":
            command = `echo "${code}" > code.js && node code.js`;
            break;
        case "java":
            command = `echo "${code}" > Main.java && javac Main.java && java Main`;
            break;
        case "ts":
            command = `echo "${code}" > npx tsc -b && code.ts && node code.js`;
        default:
            return res.status(400).json({ error: "Unsupported language" });
    }

    exec(command, { cwd: path.resolve(__dirname) }, (error: any, stdout: any, stderr: any) => {
        if (error) {
            console.error('Error executing code:', stderr);
            return res.status(400).json({ error: stderr });
        }

        console.log('Code executed successfully, output:', stdout);
        return res.status(200).json({ output: stdout });
    });
});


app.listen(3001, () => {
    console.log('Code execution server running on port 3001');
});
