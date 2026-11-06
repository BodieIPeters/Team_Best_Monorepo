
CREATE TABLE IF NOT EXISTS churches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zipcode TEXT NOT NULL,
    denomination TEXT NOT NULL,
    serviceTimes TEXT NOT NULL,
    worshipStyle TEXT NOT NULL,
    distanceMiles REAL NOT NULL,
    rating REAL NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS student_preferences (
    studentId TEXT PRIMARY KEY,
    denomination TEXT,
    worshipStyle TEXT,
    maxDistance REAL
);

CREATE TABLE IF NOT EXISTS favorites (
    studentId TEXT NOT NULL,
    churchId TEXT NOT NULL,
    PRIMARY KEY (studentId, churchId),
    FOREIGN KEY (churchId)
        REFERENCES churches(id)
);

CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId TEXT NOT NULL,
    churchId TEXT NOT NULL,
    rating REAL,
    comment TEXT,
    FOREIGN KEY (churchId)
        REFERENCES churches(id)
);

CREATE TABLE IF NOT EXISTS commitments (
    studentId TEXT PRIMARY KEY,
    churchId TEXT NOT NULL,
    FOREIGN KEY (churchId)
        REFERENCES churches(id)
);

CREATE TABLE IF NOT EXISTS ministries (
    id TEXT PRIMARY KEY,
    churchId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    targetAudience TEXT,        -- 'College', 'Youth', 'Families'
    meetingSchedule TEXT,       
    FOREIGN KEY (churchId)
        REFERENCES churches(id)
);

CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    churchId TEXT NOT NULL,
    dayOfWeek TEXT NOT NULL,    
    startTime TEXT NOT NULL,   
    serviceType TEXT,           
    FOREIGN KEY (churchId)
        REFERENCES churches(id)
);

CREATE TABLE IF NOT EXISTS suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId TEXT NOT NULL,
    churchId TEXT NOT NULL,
    matchScore REAL NOT NULL,  
    reason TEXT,                
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (churchId)
        REFERENCES churches(id)
);
