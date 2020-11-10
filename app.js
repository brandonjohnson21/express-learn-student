const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let students=[];
function queryError(msg) {
    return {status:'error',message:msg};
}
function getStudent(filter) {
    let name=students.find(filter);
    return (name || queryError('no Student found'));
}
app.get('/students',(req,res)=>{
    if (req.query.search) {
        res.send(getStudent(student=>student.name.includes(req.query.search)));
    }else{
        res.send(students);
    }
})
app.get('/students/:studentId',(req,res)=>{
    res.send(getStudent(student=>student.id==req.params.studentId))
})
app.get('/grades/:studentId',(req,res)=>{
    let student = getStudent(student=>student.id==req.params.studentId);
    if (student.status!=='error') {
        res.send(student.grades)
    }else{
        res.send(student);
    }
})
app.post('/grades',(req,res)=>{
    let student = getStudent(student=>student.id==req.body.studentId);
    if (student.status!=='error' && req.body.grades) {
        res.send({status:'success',message:'added grade to user'})
    }else{
        res.send(queryError('Failed to post grade'));
    }
})
app.post('/register',(req,res)=>{
    if (req.body.name && req.body.email)
    students.push(
        {
            name: req.body.name,
            grades: [],
            email:req.body.email

        }
    )
    res.send("student registered");
})


const port = 3000
app.listen(port, () => console.log(`Listening at http://localhost:${port}`))