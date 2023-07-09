export const commandData = [{
  commandName: 'help', 
  commandDescription: 'Displays list of commands or information about command', 
  commandOptions: 'help (command)', 
}, {
  commandName: 'connect', 
  commandDescription: 'Connects to a target voice channel.',
  commandOptions: 'connect [target]', 
}, {
  commandName: 'disconnect', 
  commandDescription: 'Disconnects from target voice channel.',
  commandOptions: 'disconnect',
}, {
  commandName: 'queue', 
  commandDescription: 'Displays information about queue.',
  commandOptions: 'queue',
}, {
  commandName: 'play',
  commandDescription: 'Plays/adds music to the queue. Searches on youtube. Bot must be connected to a voice channel.', 
  commandOptions: 'play [query]',
}, {
  commandName: 'clear',
  commandDescription: 'clears queue', 
  commandOptions: 'clear'  
}]