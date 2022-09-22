import { Command } from './command-interface';
import { Ping } from './ping';
import { Help } from './help';

export const commands: Command[] = [ Ping, Help ];