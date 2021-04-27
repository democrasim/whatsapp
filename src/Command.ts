import { Message, Client } from '@open-wa/wa-automate';

export interface Command{
    run : (command : Message, client:Client) => void;
}