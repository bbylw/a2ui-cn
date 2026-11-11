import {Component} from '@angular/core';
import {Hero} from './hero';
import {Philosophy} from './philosophy';
import {Pipeline} from './pipeline';
import {DualRenderer} from './dual-renderer';
import {ProtocolPeek} from './protocol-peek';
import {Ecosystem} from './ecosystem';

@Component({
  selector: 'app-landing',
  imports: [Hero, Philosophy, Pipeline, DualRenderer, ProtocolPeek, Ecosystem],
  template: `
    <app-hero />
    <app-philosophy />
    <app-pipeline />
    <app-dual-renderer />
    <app-protocol-peek />
    <app-ecosystem />
  `,
})
export class Landing {}