const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors=require('cors')

const app = express();
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
app.use(bodyParser.json());

app.post('/run-code', (req:any, res:any) => {
  const code = req.body.code;
  console.log(code);
  exec(`node -e "${code}"`, (error:any, stdout:any, stderr:any) => {
    if (error) {
      res.status(400).json({ error: stderr });
    } else {
      res.status(200).json({ output: stdout });
    }
  });
});

app.listen(3001, () => {
  console.log('Code execution server running on port 3001');
});
