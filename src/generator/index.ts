import { capitalize } from 'lodash';

export function format(text: string) {
    return capitalize(text.replace(/_/, ' '));
}