-- SET ISOLATION LEVELS
-- SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
-- SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- SET DEFAULT ISOLATION LEVEL TO READ COMMITTED
SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT @@transaction_ISOLATION;

-- CREATE TRIGGERS FOR LOGS

DROP TRIGGER IF EXISTS log_insert_appointments_trigger;
DROP TRIGGER IF EXISTS log_update_appointments_trigger;
DROP TRIGGER IF EXISTS log_delete_appointments_trigger;

-- TRIGGER FOR INSERT
DELIMITER //

CREATE TRIGGER log_insert_appointments_trigger AFTER INSERT ON appointments
FOR EACH ROW
BEGIN
    DECLARE error_occurred INT DEFAULT 0;
    DECLARE failed_transaction_data JSON;
    
    -- Error handling using CONTINUE HANDLER
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        SET error_occurred = 1;
    
    -- Set the transaction isolation level to SERIALIZABLE
    SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    
    -- Attempt to insert transaction log
    BEGIN
        INSERT INTO transaction_log (transaction_id, operation_type, table_name, new_data)
        VALUES (CONNECTION_ID(), 'INSERT', 'appointments', 
            (SELECT JSON_OBJECT( 
                'apptid', NEW.apptid,
                'clinicid', NEW.clinicid,
                'doctorid', NEW.doctorid,
                'pxid', NEW.pxid,
                'hospitalname', NEW.hospitalname,
                'QueueDate', NEW.QueueDate,
                'City', NEW.City,
                'Province', NEW.Province,
                'RegionName', NEW.RegionName,
                'mainspecialty', NEW.mainspecialty
            ))
        );
    END;
    
    -- Set isolation level back to READ COMMITTED
    SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;
    
    -- Log error if transaction log insertion failed
    IF error_occurred = 1 THEN
        -- Attempt to set failed transaction data
        BEGIN
            SET failed_transaction_data = (SELECT JSON_OBJECT(
                'apptid', NEW.apptid,
                'clinicid', NEW.clinicid,
                'doctorid', NEW.doctorid,
                'pxid', NEW.pxid,
                'hospitalname', NEW.hospitalname,
                'QueueDate', NEW.QueueDate,
                'City', NEW.City,
                'Province', NEW.Province,
                'RegionName', NEW.RegionName,
                'mainspecialty', NEW.mainspecialty
            ));
        END;
        
        -- Attempt to log error message and failed transaction data
        BEGIN
            INSERT INTO error_log (error_message, transaction_data, error_occured)
            VALUES ('Failed to log INSERT transaction for appointments table', failed_transaction_data, error_occured);
        END;
    END IF;
END;
//

-- TRIGGER FOR UPDATE
CREATE TRIGGER log_update_appointments_trigger AFTER UPDATE ON appointments
FOR EACH ROW
BEGIN
    DECLARE error_occurred INT DEFAULT 0;
    DECLARE failed_transaction_data JSON;
    
    -- Error handling using CONTINUE HANDLER
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        SET error_occurred = 1;
    
    -- Set the transaction isolation level to SERIALIZABLE
    SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    
    -- Attempt to insert transaction log
    BEGIN
        INSERT INTO transaction_log (transaction_id, operation_type, table_name, old_data, new_data)
        VALUES (CONNECTION_ID(), 'UPDATE', 'appointments',
            (SELECT JSON_OBJECT(  
                'apptid', OLD.apptid,
                'clinicid', OLD.clinicid,
                'doctorid', OLD.doctorid,
                'pxid', OLD.pxid,
                'hospitalname', OLD.hospitalname,
                'QueueDate', OLD.QueueDate,
                'City', OLD.City,
                'Province', OLD.Province,
                'RegionName', OLD.RegionName,
                'mainspecialty', OLD.mainspecialty
            )),
            (SELECT JSON_OBJECT(
                'apptid', NEW.apptid,
                'clinicid', NEW.clinicid,
                'doctorid', NEW.doctorid,
                'pxid', NEW.pxid,
                'hospitalname', NEW.hospitalname,
                'QueueDate', NEW.QueueDate,
                'City', NEW.City,
                'Province', NEW.Province,
                'RegionName', NEW.RegionName,
                'mainspecialty', NEW.mainspecialty
            ))
        );
    END;
    
    -- Set isolation level back to READ COMMITTED
    SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;
    
    -- Log error if transaction log insertion failed
    IF error_occurred = 1 THEN
        -- Attempt to set failed transaction data
        BEGIN
            SET failed_transaction_data = (SELECT JSON_OBJECT(
                'apptid', NEW.apptid,
                'clinicid', NEW.clinicid,
                'doctorid', NEW.doctorid,
                'pxid', NEW.pxid,
                'hospitalname', NEW.hospitalname,
                'QueueDate', NEW.QueueDate,
                'City', NEW.City,
                'Province', NEW.Province,
                'RegionName', NEW.RegionName,
                'mainspecialty', NEW.mainspecialty
            ));
        END;
        
        -- Attempt to log error message and failed transaction data
        BEGIN
            INSERT INTO error_log (error_message, transaction_data, error_occured)
            VALUES ('Failed to log UPDATE transaction for appointments table', failed_transaction_data, error_occured);
        END;
    END IF;
END;
//

-- TRIGGER FOR DELETE
CREATE TRIGGER log_delete_appointments_trigger AFTER DELETE ON appointments
FOR EACH ROW
BEGIN
    DECLARE error_occurred INT DEFAULT 0;
    DECLARE failed_transaction_data JSON;
    
    -- Error handling using CONTINUE HANDLER
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        SET error_occurred = 1;
    
    -- Set the transaction isolation level to SERIALIZABLE
    SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    
    -- Attempt to insert transaction log
    BEGIN
        INSERT INTO transaction_log (transaction_id, operation_type, table_name, old_data)
        VALUES (CONNECTION_ID(), 'DELETE', 'appointments',
            (SELECT JSON_OBJECT(
                'apptid', OLD.apptid,
                'clinicid', OLD.clinicid,
                'doctorid', OLD.doctorid,
                'pxid', OLD.pxid,
                'hospitalname', OLD.hospitalname,
                'QueueDate', OLD.QueueDate,
                'City', OLD.City,
                'Province', OLD.Province,
                'RegionName', OLD.RegionName,
                'mainspecialty', OLD.mainspecialty
            ))
        );
    END;
    
    -- Set isolation level back to READ COMMITTED
    SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;
    
    -- Log error if transaction log insertion failed
    IF error_occurred = 1 THEN
        -- Attempt to set failed transaction data
        BEGIN
            SET failed_transaction_data = (SELECT JSON_OBJECT(
                'apptid', OLD.apptid,
                'clinicid', OLD.clinicid,
                'doctorid', OLD.doctorid,
                'pxid', OLD.pxid,
                'hospitalname', OLD.hospitalname,
                'QueueDate', OLD.QueueDate,
                'City', OLD.City,
                'Province', OLD.Province,
                'RegionName', OLD.RegionName,
                'mainspecialty', OLD.mainspecialty
            ));
        END;
        
        -- Attempt to log error message and failed transaction data
        BEGIN
            INSERT INTO error_log (error_message, transaction_data, error_occured)
            VALUES ('Failed to log DELETE transaction for appointments table', failed_transaction_data, error_occured);
        END;
    END IF;
END;
//

DELIMITER ;