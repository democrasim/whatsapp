import { Message, Client } from '@open-wa/wa-automate';

export interface CommandExecutor{
    run : (command : Message, client:Client) => void;
}