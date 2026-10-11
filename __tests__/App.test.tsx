import { img } from '../src/api';

test('img builds TMDB image urls', () => {
  expect(img('/abc.jpg', 'w185')).toBe('https://image.tmdb.org/t/p/w185/abc.jpg');
  expect(img(null)).toBeNull();
});
