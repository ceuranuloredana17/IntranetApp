import Database from 'better-sqlite3'
import path from 'path'
import { hashSync } from 'bcryptjs'

const DB_PATH = path.join(process.cwd(), 'intranet.db')

let db

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    initSchema()
  }
  return db
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin','manager','hr','financiar','angajat')),
      department_id INTEGER REFERENCES departments(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS leave_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      reason TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
      reviewed_by INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      department_id INTEGER REFERENCES departments(id),
      created_by INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      assigned_to INTEGER REFERENCES users(id),
      assigned_by INTEGER REFERENCES users(id),
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','in_progress','done')),
      due_date TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `)

  const existing = db.prepare('SELECT COUNT(*) as cnt FROM users').get()
  if (existing.cnt === 0) seedData()
}

function seedData() {
  const depts = db.prepare('INSERT INTO departments (name) VALUES (?)')
  const devId = depts.run('Dezvoltare Software').lastInsertRowid
  const hrId = depts.run('HR & Admin').lastInsertRowid
  const finId = depts.run('Financiar-Contabil').lastInsertRowid
  const salesId = depts.run('Vanzari & Marketing').lastInsertRowid
  const mgmtId = depts.run('Management').lastInsertRowid

  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, department_id)
    VALUES (?, ?, ?, ?, ?)
  `)

  const pass = (p) => hashSync(p, 10)

  insertUser.run('Admin System', 'admin@techsoft.ro', pass('Admin@123'), 'admin', mgmtId)
  insertUser.run('Maria Ionescu', 'hr@techsoft.ro', pass('Hr@12345'), 'hr', hrId)
  insertUser.run('Andrei Popa', 'financiar@techsoft.ro', pass('Fin@1234'), 'financiar', finId)
  const mgr = insertUser.run('Cristina Dumitrescu', 'manager@techsoft.ro', pass('Mgr@1234'), 'manager', devId)
  insertUser.run('Ion Vasile', 'ion.vasile@techsoft.ro', pass('Ang@1234'), 'angajat', devId)
  insertUser.run('Elena Stancu', 'elena.stancu@techsoft.ro', pass('Ang@1234'), 'angajat', devId)
  insertUser.run('Radu Mihai', 'radu.mihai@techsoft.ro', pass('Ang@1234'), 'angajat', salesId)

  const insertAnn = db.prepare(`
    INSERT INTO announcements (title, content, author_id) VALUES (?, ?, ?)
  `)
  insertAnn.run('Bun venit pe intranetul TechSoft!', 'Această platformă este spațiul vostru de lucru digital. Găsiți aici documente, cereri și noutăți.', 1)
  insertAnn.run('Program de lucru vara 2026', 'În perioada 1 iulie – 31 august programul de lucru este 8:00 – 16:00.', 1)
  insertAnn.run('Training obligatoriu securitate IT', 'Toți angajații trebuie să completeze trainingul de securitate IT până pe 30 iunie 2026.', 2)

  const insertDoc = db.prepare(`
    INSERT INTO documents (title, content, category, department_id, created_by) VALUES (?, ?, ?, ?, ?)
  `)
  insertDoc.run('Regulament Intern', 'Regulamentul intern al companiei TechSoft Solutions SRL...', 'HR', hrId, 2)
  insertDoc.run('Politica de concedii', 'Fiecare angajat beneficiază de 21 de zile de concediu anual plătit...', 'HR', hrId, 2)
  insertDoc.run('Procedura de raportare financiară', 'Rapoartele financiare se depun lunar până în ziua 5 a lunii următoare...', 'Financiar', finId, 3)
  insertDoc.run('Ghid onboarding dezvoltatori', 'Pași de urmat în prima săptămână: acces repository, setup mediu local...', 'Tehnic', devId, 4)

  const insertTask = db.prepare(`
    INSERT INTO tasks (title, description, assigned_to, assigned_by, status, due_date) VALUES (?, ?, ?, ?, ?, ?)
  `)
  insertTask.run('Implementare modul autentificare', 'Finalizare JWT și middleware de protecție rute', 5, mgr.lastInsertRowid, 'in_progress', '2026-06-01')
  insertTask.run('Review cod sprint 3', 'Code review pentru toate PR-urile din sprint', 6, mgr.lastInsertRowid, 'pending', '2026-05-30')
  insertTask.run('Raport vânzări mai 2026', 'Pregătire raport lunar vânzări', 7, mgr.lastInsertRowid, 'pending', '2026-06-05')
}
