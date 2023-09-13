import { CommonMapper } from '@/src/lib/mapper/CommonMapper'

class TestCommonMapper extends CommonMapper {
  public mapSourceToTarget(source, target) {
    return super.mapSourceToTarget(source, target)
  }
}

describe('CommonMapper', () => {
  let commonMapper: TestCommonMapper

  beforeEach(async () => {
    commonMapper = new TestCommonMapper()
  })

  describe('#mapSourceToTarget', () => {
    it('should project object to class instance', () => {
      const source = {
        a: 'a',
        b: 1,
      }

      class Target {
        a: string
        b: number
      }

      const target = new Target()

      commonMapper.mapSourceToTarget(source, target)

      expect(target.a).toEqual(source.a)
      expect(target.b).toEqual(source.b)
    })

    it('should project child class object properties to class instance properties', () => {
      class Parent {
        parentA: string
      }
      class Child extends Parent {}

      class Target {
        parentA: string
      }

      const source = new Child()
      source.parentA = 'a'

      const target = new Target()

      commonMapper.mapSourceToTarget(source, target)

      expect(target.parentA).toEqual(source.parentA)
    })
  })
})
