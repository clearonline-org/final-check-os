import { ApiMonitoringPage } from './app.po';

describe('api-monitoring App', () => {
  let page: ApiMonitoringPage;

  beforeEach(() => {
    page = new ApiMonitoringPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
