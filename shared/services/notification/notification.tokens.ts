import { InjectionToken } from '@angular/core';
import { ConcreteErrorProcessor, ErrorProcessor } from './error-processor';

export const ERROR_PROCESSOR: InjectionToken<ConcreteErrorProcessor>
  = new InjectionToken('ERROR_PROCESSOR');

export const FALLBACK_ERROR_PROCESSOR: InjectionToken<ErrorProcessor>
  = new InjectionToken('FALLBACK_ERROR_PROCESSOR')
