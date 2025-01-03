import * as mysql from 'mysql2/promise';
import { QueryCallbackResultBaseType } from '../types/QueryCallbackResultBaseType';

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: process.env['MYSQL_PASSWORD']!,
  database: 'canticum',
});

export const init = async () => (await connection).connect().catch((connectError) => {
  if (connectError) {
    console.error(
      `MySQL connection error. Please ensure you start the MySQL server and connection configuration parameters are correct.`
    );
    throw connectError;
  }
});

export const query = async (sqlInput: string, args: Array<string | number> = []): Promise<mysql.RowDataPacket[]> => {
  return new Promise(async (resolve, reject) => {
    const queryResult = await (await connection).query(sqlInput, args);
    if (isRowDataPacket(queryResult[0]))
      resolve(queryResult[0] as mysql.RowDataPacket[]);
    reject();
  });
}

export const exit = async () => (await connection).end().catch((endError) => {
  if (endError)
    throw endError;
});

const isRowDataPacket = (rows: QueryCallbackResultBaseType): rows is mysql.RowDataPacket[] => {
  if (!Array.isArray(rows) || rows.length === 0)
    return false;
  return rows.some(row => !Array.isArray(row) && row.constructor.name == 'RowDataPacket');
}