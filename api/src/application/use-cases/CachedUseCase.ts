import { ICacheService } from "../services/ICacheService";
import { UseCase } from "./UseCase";

export class CachedUseCase<Input, Output>
  implements UseCase<Input, Output>
{
  constructor(
    private useCase: UseCase<Input, Output>,
    private cache: ICacheService,
    private options: {
      key: (input: Input) => string;
      ttl?: number;
    }
  ) {}

  async execute(input: Input): Promise<Output> {
    const cacheKey = this.options.key(input);

    const cached = await this.cache.get<Output>(cacheKey);
    if (cached) return cached;

    const result = await this.useCase.execute(input);

    await this.cache.set(cacheKey, result, this.options.ttl);

    return result;
  }
}