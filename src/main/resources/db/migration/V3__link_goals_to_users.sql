ALTER TABLE goals
    ADD COLUMN user_id BIGINT;

ALTER TABLE goals
    ADD CONSTRAINT fk_goal_user
        FOREIGN KEY (user_id)
            REFERENCES users(id);