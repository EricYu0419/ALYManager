import { EssModule } from './ess.module';

describe('EssModule', () => {
  let essModule: EssModule;

  beforeEach(() => {
    essModule = new EssModule();
  });

  it('should create an instance', () => {
    expect(essModule).toBeTruthy();
  });
});
