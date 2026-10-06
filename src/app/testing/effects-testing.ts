import {Provider, Type} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {Action} from '@ngrx/store';
import {provideMockActions} from '@ngrx/effects/testing';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {EMPTY, firstValueFrom, Observable, of} from 'rxjs';
import {toArray} from 'rxjs/operators';

/**
 * Creates an effects class in a TestBed with a mocked action stream, router, toast service and translate service
 * (translate returns the key, so tests can assert on the message key).
 */
export function setupEffects<T extends object>(effectsClass: Type<T>, providers: Provider[] = []) {
  let source$: Observable<Action> = EMPTY;

  const router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
  const messageService = jasmine.createSpyObj<MessageService>('MessageService', ['add', 'clear']);

  TestBed.configureTestingModule({
    providers: [
      effectsClass,
      provideMockActions(() => source$),
      {provide: Router, useValue: router},
      {provide: MessageService, useValue: messageService},
      {provide: TranslateService, useValue: {instant: (key: string) => key}},
      ...providers
    ]
  });

  const effects = TestBed.inject(effectsClass);

  /** Feeds the given actions to the effect and resolves with every action it emits. */
  const emitted = (effect$: Observable<Action>, ...incoming: Action[]): Promise<Action[]> => {
    source$ = of(...incoming);
    return firstValueFrom(effect$.pipe(toArray()));
  };

  return {effects, router, messageService, emitted};
}
