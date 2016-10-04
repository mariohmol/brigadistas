//https://developers.livechatinc.com/blog/testing-angular-2-apps-dependency-injection-and-components/
//http://www.codeitall.com/?p=144
import {App} from './app';

describe('App', () => {

  beforeEach(function() {
    this.app = new App();
  });

  it('should have hello property', function() {
    expect(this.app.hello).toBe('Hello');
  });

});
