import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import * as controllers from './controllers';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/stories', controllers.createStory);
app.post('/api/stories/:storyId/entries', controllers.createEntry);

app.patch('/api/stories/:storyId/players', controllers.modifyPlayers);

app.get('*', function(req, res){
  res.send('kindly go away', 404);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});