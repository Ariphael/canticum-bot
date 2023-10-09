import * as mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'playlist',
});

export const init = () => connection.connect((connectError) => {
  if (connectError)
    throw connectError;
});

export const queryNoCallback = (sqlInput: string, args: Array<string | number>) => {
  connection.query(sqlInput, args, (queryError) => {
    if (queryError) throw queryError;
  });
}

export const query = (sqlInput: string, args: Array<string | number>, resultCallback: Function) => {
  connection.query(sqlInput, args, (queryError, result) => {
    if (queryError) throw queryError;
    resultCallback(result);
  });
}

export const exit = () => connection.end((endError) => {
    if (endError)
        throw endError;
})
