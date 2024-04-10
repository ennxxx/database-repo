-- create transaction log to replicate easier

DROP TABLE IF EXISTS transaction_log;
DROP TABLE IF EXISTS error_log;

CREATE TABLE transaction_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    operation_type ENUM('INSERT', 'UPDATE', 'DELETE'),
    table_name VARCHAR(255),
    old_data JSON,
    new_data JSON
);

-- create error log for recovery appointments
CREATE TABLE error_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    error_message TEXT,
    transaction_data JSON,
    isResolved INT
);

