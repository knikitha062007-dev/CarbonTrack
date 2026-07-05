ALTER TABLE activity_logs
    ADD COLUMN user_id BIGINT;

ALTER TABLE activity_logs
    ADD CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id)
            REFERENCES users(id);