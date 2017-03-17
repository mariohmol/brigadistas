declare var Zone: any;
import { Observable } from 'rxjs/Rx';


export function setTimeoutPromise(ms: number, forNextTurn: boolean = false): Promise<any> {
  return new Promise(resolve => {
    setTimeout(() => {
      if (forNextTurn) {
        console.log('***** setTimeout for forwarding Zone\'s turn: ' + ms + ' ms *****');
      } else {
        console.log('***** setTimeout: ' + ms + ' ms *****');
      }
      resolve();
    }, ms);
  });
}


export function elementText(element: HTMLElement, selectors: string, index: number = 0): string {
  return element.querySelectorAll(selectors)[index].textContent;
}


export function elements(element: HTMLElement, selectors: string): NodeListOf<Element> {
  return element.querySelectorAll(selectors);
}


export function observableValue<T>(obs: Observable<T>): T {
  let _value: any;
  obs.subscribe(value => _value = value).unsubscribe(); // unsubscribeしないとsubscriptionが生き続けて処理の邪魔をする。
  return _value;
}


export function withPower(functionMayHaveError: () => void): void {
  Zone.current
    .fork({
      'name': 'withPower test',
      'onHandleError': function (parentZoneDelegate, currentZone, targetZone, error) {
        const whichZone = `Error in "${Zone.current.name} zone": `;
        const message = (error.message ? `\n${whichZone}\n${error.message}` : `\n${whichZone}\n${error}`);
        throw new Error(message);
      }
    })
    .runGuarded(() => {
      functionMayHaveError.call(null);
    });
}


export function asyncPower(asyncAwaitFunction: () => Promise<void>): (done: any) => void {
  return function (done) {
    Zone.current
      .fork({
        'name': 'asyncPower test',
        'onHandleError': function (parentZoneDelegate, currentZone, targetZone, error) {
          const whichZone = `Error in "${Zone.current.name} zone": `;
          const message = (error.message ? `\n${whichZone}\n${error.message}` : `\n${whichZone}\n${error}`);
          try {
            done.fail(message); // jasmine
          } catch (e) {
            done(message); // mocha
          }
        }
      })
      .runGuarded(() => {
        asyncAwaitFunction.call(null).then(done);
      });
  }
}


export function fakeAsyncPower(functionWithTicks: () => void): (done: any) => void {
  return function (done) {
    let FakeAsyncTestZoneSpec = Zone['FakeAsyncTestZoneSpec'];
    let testZoneSpec = new FakeAsyncTestZoneSpec();
    Zone.current
      .fork(testZoneSpec)
      .fork({
        'name': 'fakeAsyncPower test',
        'onHandleError': function (parentZoneDelegate, currentZone, targetZone, error) {
          const whichZone = `Error in "${Zone.current.name} zone": `;
          const message = (error.message ? `\n${whichZone}\n${error.message}` : `\n${whichZone}\n${error}`);
          try {
            done.fail(message); // jasmine
          } catch (e) {
            done(message); // mocha
          }
        }
      })
      .runGuarded(() => {
        functionWithTicks.call(null);
        done();
      });
  }
}


export function tick(ms: number = 0): void {
  Zone.current.get('FakeAsyncTestZoneSpec').tick(ms);
}
