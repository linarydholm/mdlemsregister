// Importera paket
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

// Express
const app = express();
const port = 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// MongoDB client, db & collection
const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('club');
const memberCollection = db.collection('members');

// Render index page
app.get('/', (req, res) => {
    res.render('index');
});

// Render members page
app.get('/members', async (req, res) => {
    const members = await memberCollection.find({}).toArray();
    res.render('members', { members });
});

// Render member page
app.get('/member/:id', async (req, res) => {
    const member = await memberCollection.findOne({ _id: new ObjectId(req.params.id) });
    res.render('member', {
        memberId: member._id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        time: member.time,
        message: member.message
    });
});

// Render form page
app.get('/create', (req, res) => {
    res.render('create');
});

// Create a member
app.post('/create', async (req, res) => {
    await memberCollection.insertOne(req.body);
    res.redirect('/members');
});

// Delete a member
app.post('/member/:id/delete', async (req, res) => {
    await memberCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.redirect('/members');
});

// Listen
app.listen(port, () => {
    console.log(`Listening on ${port}`)
});