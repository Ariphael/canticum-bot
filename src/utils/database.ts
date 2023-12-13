import * as mysql from 'mysql';
import { RowDataPacket } from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'canticum',
});

export const init = () => connection.connect((connectError) => {
  if (connectError) {
    console.error(`MySQl connection error. Please ensure you start the MySQL server.`);
    throw connectError;
  }
});

export const query = (sqlInput: string, args: Array<string | number>): Promise<RowDataPacket[]> => {
  return new Promise<RowDataPacket[]>((success, reject) => {
    connection.query(sqlInput, args, (queryError, result) => {
      if (queryError) {
        console.error(`MYSQL error: ${queryError.message}`);
        reject(result);
      }
      else
        success(result);
    });
  });
}

export const exit = () => connection.end((endError) => {
  if (endError)
    throw endError;
})
