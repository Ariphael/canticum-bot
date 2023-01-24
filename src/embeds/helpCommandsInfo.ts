export const commandData = [{
  commandName: 'help', 
  commandDescription: 'Displays list of commands or information about command', 
  commandOptions: 'help (command)', 
}, {
  commandName: 'connect', 
  commandDescription: 'Conncects to a voice channel. If no specific voice channel target is configured, then it joins a voice channel named "Canticum Music"',
  commandOptions: 'connect', 
}, {
  commandName: 'disconnect', 
  commandDescription: 'Clears the queue and disconnects from target voice channel. Music must not be playing and user calling command must have control over queue for this command to work.',
  commandOptions: 'disconnect',
}, {
  commandName: 'addqueue', 
  commandDescription: 'Adds a song to a queue.', 
  commandOptions: 'addqueue <link>',
}, {
  commandName: 'rmqueue', 
  commandDescription: 'Removes specific song from queue. The position of a song in the queue is determined by a unique id. Use /queue to display information about the queue.',
  commandOptions: 'rmqueue <id>',
}, {
  commandName: 'queue', 
  commandDescription: 'Displays information about queue.',
  commandOptions: 'queue',
}, {
  commandName: 'toggleplay',
  commandDescription: 'Play/pause music. Bot must be connected to a voice channel and queue must not be empty.', 
  commandOptions: 'toggleplay',
}]