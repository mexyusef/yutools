import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { run_fmus_at_specific_dir } from '../fmus_ketik';
import { applyReplacements, processCommandWithMap } from '../stringutils';
import { createNewTerminal } from '../terminal';
import { getBasename } from '../file_dir';

// const command_v1 = `npm init -y`;
// npm install typescript ts-node @types/node --save-dev
// npm install express
// npm install @types/express --save-dev
// npx tsc --init
// const port = 3000;

const fmus_code_wrapper = `
--% BACA.md
### 4. **Update tsconfig.json (Optional)**
Edit the tsconfig.json file to specify where to output compiled files and set other preferences:
- Add "outDir": "./dist" in the "compilerOptions" section.
- Set "strict": true for better type safety.

### 7. **Add Build and Start Scripts to package.json**
Edit package.json to include build and start scripts:

"scripts": {
	"build": "tsc",
	"start": "node dist/app.js",
	"dev": "ts-node src/app.ts"
}

### Optional: **Install Nodemon for Automatic Restarts During Development**
npm install --save-dev nodemon

Update the development script in package.json:
"dev": "nodemon --exec ts-node src/app.ts"
--#

--% app_sqlite.ts
// Import required modules
import express, { Request, Response, NextFunction, Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// SQLite Database Setup
let db: sqlite3.Database;
(async () => {
  try {
    const database = await open({
      filename: process.env.SQLITE_DB_PATH || './enterprise_app.db',
      driver: sqlite3.Database,
    });
    db = database;
    console.log('SQLite database connected');

    // Create tables if they do not exist
    await db.exec("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL);");
  } catch (err) {
    console.error('Error connecting to SQLite database:', err);
    process.exit(1);
  }
})();

// JWT Authentication Middleware
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    (req as any).user = user;
    next();
  });
};

// Multer setup for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Welcome to the Enterprise Node.js App with SQLite!');
});

// Auth Routes
app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', username, password); // Replace with hashed password check

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  });

  res.cookie('token', token, { httpOnly: true });
  res.status(200).json({ message: 'Login successful', token });
});

app.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const result = await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, password);
    res.status(201).json({ message: 'User registered successfully', userId: result.lastID });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// Protected Route
app.get('/dashboard', authenticateJWT, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the dashboard!', user: (req as any).user });
});

// File Upload Route
app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
--#

--% app_mongo.ts
// Import required modules
import express, { Request, Response, NextFunction, Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/enterprise_app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};
connectDB();

// JWT Authentication Middleware
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    (req as any).user = user;
    next();
  });
};

// Multer setup for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
});

// Example Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Welcome to the Enterprise Node.js App!');
});

// Auth Routes
app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password }); // Example: Replace with hashed password check

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  });

  res.cookie('token', token, { httpOnly: true });
  res.status(200).json({ message: 'Login successful', token });
});

app.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = new User({ username, password });

  try {
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// Protected Route
app.get('/dashboard', authenticateJWT, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the dashboard!', user: (req as any).user });
});

// File Upload Route
app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
--#

`;

const fmus_command = `.,d
	%DIR_PROYEK=__VAR1__
	DIR_PROYEK,d
		src,d
			app.ts,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\node_express.ts=app_sqlite.ts)
			app_mongo.ts,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\node_express.ts=app_mongo.ts)
		run.bat,f(n=npx ts-node src/app.ts)
		run2.bat,f(n=npm run start)
		buat.bat,f(n=npm run build)
		BACA.md,f(e=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\node_express.ts=BACA.md)
`;

export function register_dir_context_create_node_express(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.dir_context_create_node_express`, async (uri: vscode.Uri) => {
		const filePath = uri.fsPath;
		const terminal_name = getBasename(filePath);

		// const terminal = createNewTerminal(terminal_name, filePath);
		// run_fmus_at_specific_dir(fmus_command, filePath);

		const result_map = await processCommandWithMap(fmus_command);
		if (result_map === undefined) {
			vscode.window.showErrorMessage(`Process was canceled. No command to execute.`);
		} else {
			console.log('Processed Result:', result_map.result);
			console.log('Map:', result_map.map);
			const terminal = createNewTerminal(terminal_name, filePath);
			// cd ke new dir (err, new dir belum dibuat - dibuatnya oleh fmus)
			terminal.sendText(applyReplacements(`cd __VAR1__`, result_map.map));
			// install2
			terminal.sendText(`npm init -y && npm install typescript ts-node @types/node --save-dev && npm install express && npm install @types/express --save-dev`);

			terminal.sendText("npm install express dotenv mongoose jsonwebtoken multer cors helmet morgan cookie-parser body-parser");
			terminal.sendText("npm install -D typescript @types/express @types/node @types/multer @types/jsonwebtoken @types/cookie-parser @types/body-parser @types/morgan @types/cors");

			terminal.sendText("npm install express dotenv sqlite3 jwt multer cors helmet morgan cookie-parser body-parser");
			terminal.sendText("npm install -D typescript @types/express @types/node @types/multer @types/jsonwebtoken @types/cookie-parser @types/body-parser @types/morgan @types/cors");

			terminal.sendText(`tsc --init`);
			// jalankan fmus
			run_fmus_at_specific_dir(result_map.result, filePath);
			terminal.sendText(`dir *.bat && python -mrich.markdown BACA.md`);
		}
	});
	context.subscriptions.push(disposable);
}
