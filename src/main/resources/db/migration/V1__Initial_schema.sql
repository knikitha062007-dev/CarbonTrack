CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       full_name VARCHAR(100) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       preferred_unit VARCHAR(20),
                       goal_visibility BOOLEAN DEFAULT FALSE,
                       created_at TIMESTAMP NOT NULL
);

CREATE TABLE activity_logs (
                               id BIGSERIAL PRIMARY KEY,
                               category VARCHAR(50) NOT NULL,
                               activity_type VARCHAR(100) NOT NULL,
                               quantity DOUBLE PRECISION NOT NULL,
                               unit VARCHAR(20) NOT NULL,
                               co2_emission DOUBLE PRECISION NOT NULL,
                               log_date DATE NOT NULL
);

CREATE TABLE emission_factors (
                                  id BIGSERIAL PRIMARY KEY,
                                  category VARCHAR(50) NOT NULL,
                                  activity_type VARCHAR(100) NOT NULL,
                                  unit VARCHAR(20) NOT NULL,
                                  emission_factor DOUBLE PRECISION NOT NULL
);

CREATE TABLE goals (
                       id BIGSERIAL PRIMARY KEY,
                       target_reduction DOUBLE PRECISION NOT NULL,
                       start_date DATE NOT NULL,
                       end_date DATE NOT NULL,
                       achieved BOOLEAN DEFAULT FALSE
);

CREATE TABLE badges (
                        id BIGSERIAL PRIMARY KEY,
                        badge_name VARCHAR(100) NOT NULL,
                        description VARCHAR(255) NOT NULL,
                        badge_level VARCHAR(50)
);