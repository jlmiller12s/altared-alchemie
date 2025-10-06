import fs from 'fs';
import os from 'os';
import path from 'path';

const dbPath = path.join(os.tmpdir(), 'legacy-stories.json');

function readJson(){ try{ return JSON.parse(fs.readFileSync(dbPath,'utf8')); } catch { return { stories: [] }; } }
function writeJson(d){ fs.writeFileSync(dbPath, JSON.stringify(d,null,2),'utf8'); }

export function saveStory(entry){ const db=readJson(); db.stories.push(entry); writeJson(db); }
export function loadStories(){ return readJson().stories; }
export function loadStoriesByEmail(email){ return readJson().stories.filter(s=>s.email===email); }

/* Prisma path later
// model Story { id String @id @default(cuid()) userId String email String s1 String s2 String s3 String ts DateTime @default(now()) }
*/

