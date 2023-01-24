import { Command } from './command-interface';
import { Ping } from './ping';
import { Help } from './help';
import { Connect } from './connect';
import { Disconnect } from './disconnect';

export const commands: Command[] = [ Ping, Help, Connect, Disconnect ];