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

app.post('/run-code', (req:any, res:any) => {
    let code = req.body.code;
    console.log('Code received: ', code);
    code = code.replace(/"/g, '\\"');

    exec(`./run_in_docker.sh "${code}"`, { cwd: path.resolve(__dirname) }, (error: any, stdout: any, stderr: any) => {
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
