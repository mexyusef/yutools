import express from 'express';
import path from 'path';
import { parser } from './testTreeSitter';

const app = express();
app.use(express.static('public'));

app.get('/visualize', (req, res) => {
  const code = req.query.code as string;
  const tree = parser.parse(code);
  const rootNode = tree.rootNode;
  const astData = JSON.parse(JSON.stringify(rootNode, ['type', 'text', 'children'])); // Serialize AST
  res.send(`
    <div id="ast-data" style="display: none;">${JSON.stringify(astData)}</div>
    <script>window.location.href = '/index.html';</script>
  `);
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
