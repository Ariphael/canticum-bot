import { Button } from './button-interface';
import { pingOk } from './pingOk';
import { helpButtons } from './help.buttons';

export const buttons: Button[] = [ pingOk, helpButtons ];

export const prevButtonId = 'helpPrev';
export const nextButtonId = 'helpNext';
export const helpButtonId = 'helpButtons';