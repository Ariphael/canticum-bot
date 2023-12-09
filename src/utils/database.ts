import * as mysql from 'mysql';
import { RowDataPacket } from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'canticum',
});

export const init = () => connection.connect((connectError) => {
  if (connectError)
    throw connectError;
});

export const query = (sqlInput: string, args: Array<string | number>): Promise<RowDataPacket[]> => {
  return new Promise<RowDataPacket[]>((success, reject) => {
    connection.query(sqlInput, args, (queryError, result) => {
      if (queryError)
        reject(queryError);
      else
        success(result);
    });
  });
}

export const exit = () => connection.end((endError) => {
  if (endError)
    throw endError;
})
