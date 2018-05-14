import { EcsModule } from './ecs.module';

describe('EscModule', () => {
  let escModule: EcsModule;

  beforeEach(() => {
    escModule = new EcsModule();
  });

  it('should create an instance', () => {
    expect(escModule).toBeTruthy();
  });
});
