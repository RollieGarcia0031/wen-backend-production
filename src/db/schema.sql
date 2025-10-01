-- Users Table
CREATE TABLE public.users (
    id uuid unique references auth.users on delete cascade,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student','professor')) NOT NULL,
    email TEXT UNIQUE NOT NULL DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professors Table
CREATE TABLE professors (
    id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(100),
    year INT CHECK (year IN (1,2,3,4)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Availability Table
-- CREATE TYPE day_of_week AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    day_of_week day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Appointments Table

-- CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'canceled');

CREATE TABLE appointments (
id SERIAL PRIMARY KEY,
student_id uuid REFERENCES users(id) ON DELETE CASCADE,
professor_id uuid REFERENCES users(id) ON DELETE CASCADE,
availability_id INT REFERENCES availability(id) ON DELETE CASCADE,
status appointment_status DEFAULT 'pending',
message TEXT,
time_stamp TIMESTAMP NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
----