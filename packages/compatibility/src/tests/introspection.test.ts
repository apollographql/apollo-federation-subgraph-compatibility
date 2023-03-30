import { productsRequest } from '../utils/client';
import { compareSchemas } from '../utils/schemaComparison';

test('introspection', async () => {
  const serviceSDLQuery = await productsRequest({
    query: 'query { _service { sdl } }',
  });

  expect(serviceSDLQuery.data).toMatchObject({
    _service: {
      sdl: expect.stringContaining('type Query'),
    },
  });

  const basicallyTheSame = compareSchemas(serviceSDLQuery.data?._service?.sdl);
  expect(basicallyTheSame).toBe(true);
});
