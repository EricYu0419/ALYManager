import { EipModule } from './eip.module';

describe('EipModule', () => {
  let eipModule: EipModule;

  beforeEach(() => {
    eipModule = new EipModule();
  });

  it('should create an instance', () => {
    expect(eipModule).toBeTruthy();
  });
});
