import { Test, TestingModule } from '@nestjs/testing';
import { AuthGService } from './auth-g.service';

describe('AuthGService', () => {
  let service: AuthGService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGService],
    }).compile();

    service = module.get<AuthGService>(AuthGService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
