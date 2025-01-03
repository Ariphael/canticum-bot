import * as mysql from 'mysql2';

// Might need to remove OkPacket in a future major release of mysql2
export type QueryCallbackResultBaseType = 
  mysql.OkPacket | mysql.RowDataPacket[] | mysql.ResultSetHeader[] | mysql.RowDataPacket[][] | mysql.OkPacket[] | mysql.ProcedureCallPacket;