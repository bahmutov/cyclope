import { pathJoin } from '../../src/utils'

describe('pathJoin', () => {
  it('joins multiple parts', () => {
    expect(pathJoin('foo', 'bar', 'baz')).to.equal('foo/bar/baz')
  })
})
